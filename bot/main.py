"""
OdinTx Telegram Bot
- /start, /help, /signals, /subscribe, /unsubscribe
- SQLite subscriber store
- Scheduled signal broadcasts every 4 hours via APScheduler
- Pushes STRONG signals only to subscribers (weak/moderate on demand)
"""
import os
import json
import sqlite3
import threading
from contextlib import contextmanager
from datetime import datetime

import httpx
import telebot
from apscheduler.schedulers.background import BackgroundScheduler
from telebot.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    MenuButtonWebApp,
    WebAppInfo,
)
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

TOKEN      = os.getenv("TELEGRAM_BOT_TOKEN", "")
WEBAPP_URL = os.getenv("TELEGRAM_WEBAPP_URL", "https://odintx.vercel.app/app/dashboard")
API_URL    = os.getenv("ODINTX_API_URL",      "http://localhost:8000/api")
DB_PATH    = os.getenv("SUBSCRIBERS_DB",      "subscribers.db")

bot = telebot.TeleBot(TOKEN, parse_mode="HTML")

# ── SQLite subscriber store ────────────────────────────────────────────────────

def _init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS subscribers (
                chat_id   INTEGER PRIMARY KEY,
                username  TEXT,
                joined_at TEXT NOT NULL
            )
        """)
        conn.commit()

@contextmanager
def _db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()

def subscribe(chat_id: int, username: str | None) -> bool:
    """Returns True if newly subscribed, False if already subscribed."""
    with _db() as conn:
        existing = conn.execute("SELECT 1 FROM subscribers WHERE chat_id = ?", (chat_id,)).fetchone()
        if existing:
            return False
        conn.execute(
            "INSERT INTO subscribers (chat_id, username, joined_at) VALUES (?, ?, ?)",
            (chat_id, username or "", datetime.utcnow().isoformat()),
        )
        return True

def unsubscribe(chat_id: int) -> bool:
    with _db() as conn:
        rows = conn.execute("DELETE FROM subscribers WHERE chat_id = ?", (chat_id,)).rowcount
        return rows > 0

def all_subscribers() -> list[int]:
    with _db() as conn:
        return [r["chat_id"] for r in conn.execute("SELECT chat_id FROM subscribers").fetchall()]

def subscriber_count() -> int:
    with _db() as conn:
        return conn.execute("SELECT COUNT(*) FROM subscribers").fetchone()[0]

# ── Helpers ────────────────────────────────────────────────────────────────────

ACTION_EMOJI = {"BUY": "🟢", "SELL": "🔴", "HOLD": "🟡"}
STRENGTH_STAR = {"STRONG": "⭐⭐⭐", "MODERATE": "⭐⭐", "WEAK": "⭐"}

def _app_keyboard(label: str = "Open OdinTx") -> InlineKeyboardMarkup:
    kb = InlineKeyboardMarkup()
    kb.add(InlineKeyboardButton(label, web_app=WebAppInfo(url=WEBAPP_URL)))
    return kb

def _fetch_signals() -> list[dict]:
    with httpx.Client(timeout=20) as client:
        resp = client.get(f"{API_URL}/signals")
        resp.raise_for_status()
        return resp.json()

def _format_signal(s: dict) -> str:
    emoji  = ACTION_EMOJI.get(s["action"], "⚪")
    stars  = STRENGTH_STAR.get(s["strength"], "")
    reasons = ", ".join(s.get("reasons", [])[:2])
    return (
        f"{emoji} <b>{s['symbol']}</b> — {s['action']} {stars}\n"
        f"   Entry:  <code>${s['price']:,.2f}</code>\n"
        f"   Target: <code>${s['target']:,.2f}</code>\n"
        f"   Stop:   <code>${s['stopLoss']:,.2f}</code>\n"
        f"   Conf:   <b>{s['confidence']}%</b>  ·  {reasons}"
    )

# ── Commands ───────────────────────────────────────────────────────────────────

@bot.message_handler(commands=["start"])
def cmd_start(msg):
    name = msg.from_user.first_name or "Trader"
    text = (
        f"⚡ <b>Welcome to OdinTx, {name}!</b>\n\n"
        "Your AI-powered crypto trading assistant on TON.\n\n"
        "<b>Commands:</b>\n"
        "• /signals — latest AI trading signals\n"
        "• /subscribe — get automatic signal alerts\n"
        "• /unsubscribe — stop alerts\n"
        "• /help — full command list\n\n"
        "Tap <b>Open App</b> below for the full dashboard 👇"
    )
    bot.send_message(msg.chat.id, text, reply_markup=_app_keyboard())

@bot.message_handler(commands=["help"])
def cmd_help(msg):
    text = (
        "⚡ <b>OdinTx Commands</b>\n\n"
        "/start — welcome & open app\n"
        "/signals — latest AI trading signals\n"
        "/subscribe — turn on automatic signal alerts\n"
        "/unsubscribe — turn off alerts\n"
        "/help — this message\n\n"
        "<i>Signals are generated using RSI, MACD & momentum analysis on live market data.</i>"
    )
    bot.send_message(msg.chat.id, text, reply_markup=_app_keyboard())

@bot.message_handler(commands=["signals"])
def cmd_signals(msg):
    bot.send_chat_action(msg.chat.id, "typing")
    try:
        signals = _fetch_signals()
    except Exception as exc:
        logger.error(f"Signal fetch failed: {exc}")
        bot.send_message(msg.chat.id, "⚠️ Could not fetch signals. Try again shortly.")
        return

    if not signals:
        bot.send_message(msg.chat.id, "No signals available right now. Try again in a moment.")
        return

    lines = ["<b>⚡ Latest AI Signals</b>\n"]
    for s in signals[:5]:
        lines.append(_format_signal(s))
        lines.append("")

    bot.send_message(msg.chat.id, "\n".join(lines).strip(), reply_markup=_app_keyboard("Open Full Dashboard"))

@bot.message_handler(commands=["subscribe"])
def cmd_subscribe(msg):
    username = msg.from_user.username
    if subscribe(msg.chat.id, username):
        bot.send_message(
            msg.chat.id,
            "✅ <b>Subscribed!</b>\n\n"
            "You'll receive <b>STRONG</b> signal alerts automatically.\n"
            "Use /unsubscribe to stop at any time.",
            reply_markup=_app_keyboard(),
        )
        logger.info(f"New subscriber: {msg.chat.id} (@{username})")
    else:
        bot.send_message(msg.chat.id, "You're already subscribed. Use /unsubscribe to stop alerts.")

@bot.message_handler(commands=["unsubscribe"])
def cmd_unsubscribe(msg):
    if unsubscribe(msg.chat.id):
        bot.send_message(msg.chat.id, "👋 Unsubscribed. Use /subscribe to re-enable alerts anytime.")
    else:
        bot.send_message(msg.chat.id, "You're not currently subscribed.")

# ── Scheduled broadcast ────────────────────────────────────────────────────────

def _broadcast_strong_signals():
    """Called by scheduler — push STRONG signals to all subscribers."""
    logger.info("Scheduled broadcast: checking for strong signals...")
    try:
        signals = _fetch_signals()
    except Exception as exc:
        logger.error(f"Broadcast fetch failed: {exc}")
        return

    strong = [s for s in signals if s.get("strength") == "STRONG"]
    if not strong:
        logger.info("No STRONG signals to broadcast.")
        return

    subscribers = all_subscribers()
    if not subscribers:
        return

    header = f"🚨 <b>OdinTx Signal Alert</b>  ·  {len(strong)} strong signal{'s' if len(strong) > 1 else ''}\n\n"
    body = "\n\n".join(_format_signal(s) for s in strong)
    text = header + body

    sent = failed = 0
    for chat_id in subscribers:
        try:
            bot.send_message(chat_id, text, reply_markup=_app_keyboard())
            sent += 1
        except telebot.apihelper.ApiTelegramException as e:
            if "blocked" in str(e).lower() or "deactivated" in str(e).lower():
                unsubscribe(chat_id)
                logger.info(f"Auto-unsubscribed blocked user {chat_id}")
            else:
                failed += 1
        except Exception:
            failed += 1

    logger.info(f"Broadcast done — sent: {sent}, failed: {failed}, subscribers: {len(subscribers)}")

# ── Bot setup & run ────────────────────────────────────────────────────────────

def _set_menu_button():
    try:
        bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(text="Open App", web_app=WebAppInfo(url=WEBAPP_URL))
        )
        logger.info("Menu button set")
    except Exception as exc:
        logger.warning(f"Menu button failed: {exc}")

def _set_commands():
    from telebot.types import BotCommand
    try:
        bot.set_my_commands([
            BotCommand("start",       "Welcome & open app"),
            BotCommand("signals",     "Latest AI trading signals"),
            BotCommand("subscribe",   "Enable automatic signal alerts"),
            BotCommand("unsubscribe", "Disable signal alerts"),
            BotCommand("help",        "Show all commands"),
        ])
        logger.info("Bot commands set")
    except Exception as exc:
        logger.warning(f"Commands set failed: {exc}")

if __name__ == "__main__":
    if not TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is not set")

    logger.info("OdinTx bot starting...")
    _init_db()
    _set_menu_button()
    _set_commands()

    # Scheduler: broadcast STRONG signals every 4 hours
    scheduler = BackgroundScheduler(timezone="UTC")
    scheduler.add_job(_broadcast_strong_signals, "interval", hours=4, id="broadcast")
    scheduler.start()
    logger.info("Scheduler started — broadcasting every 4 hours")

    try:
        bot.infinity_polling(skip_pending=True, timeout=30, long_polling_timeout=20)
    finally:
        scheduler.shutdown()

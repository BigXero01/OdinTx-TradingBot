"""
OdinTx Telegram Bot
- Persistent reply keyboard (prompt list) for quick access
- /start, /menu, /help, /signals, /buy, /sell, /strong
- Per-coin commands: /btc /eth /ton /sol /bnb
- SQLite subscriber store + 6 scheduled auto-trading prompt types
"""
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime

import prompts as P

import httpx
import telebot
from apscheduler.schedulers.background import BackgroundScheduler
from telebot.types import (
    BotCommand,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    KeyboardButton,
    MenuButtonWebApp,
    ReplyKeyboardMarkup,
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

# ── Prompt list (persistent reply keyboard) ────────────────────────────────────

PROMPTS = [
    ["⚡ All Signals",    "🟢 BUY Signals"],
    ["🔴 SELL Signals",  "🌟 Strong Only"],
    ["₿ BTC",  "Ξ ETH",  "◎ TON"],
    ["◎ SOL",  "⬡ BNB"],
    ["🔔 Subscribe",     "📊 Open App"],
]

def _prompt_keyboard() -> ReplyKeyboardMarkup:
    kb = ReplyKeyboardMarkup(resize_keyboard=True, one_time_keyboard=False)
    for row in PROMPTS:
        kb.row(*[KeyboardButton(label) for label in row])
    return kb

def _app_inline(label: str = "Open OdinTx ↗") -> InlineKeyboardMarkup:
    kb = InlineKeyboardMarkup()
    kb.add(InlineKeyboardButton(label, web_app=WebAppInfo(url=WEBAPP_URL)))
    return kb

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
    with _db() as conn:
        if conn.execute("SELECT 1 FROM subscribers WHERE chat_id = ?", (chat_id,)).fetchone():
            return False
        conn.execute(
            "INSERT INTO subscribers (chat_id, username, joined_at) VALUES (?, ?, ?)",
            (chat_id, username or "", datetime.utcnow().isoformat()),
        )
        return True

def unsubscribe(chat_id: int) -> bool:
    with _db() as conn:
        return conn.execute("DELETE FROM subscribers WHERE chat_id = ?", (chat_id,)).rowcount > 0

def all_subscribers() -> list[int]:
    with _db() as conn:
        return [r["chat_id"] for r in conn.execute("SELECT chat_id FROM subscribers").fetchall()]

# ── Signal helpers ─────────────────────────────────────────────────────────────

ACTION_EMOJI  = {"BUY": "🟢", "SELL": "🔴", "HOLD": "🟡"}
STRENGTH_STAR = {"STRONG": "⭐⭐⭐", "MODERATE": "⭐⭐", "WEAK": "⭐"}

def _fetch_signals() -> list[dict]:
    with httpx.Client(timeout=20) as client:
        resp = client.get(f"{API_URL}/signals")
        resp.raise_for_status()
        return resp.json()

def _fmt(s: dict) -> str:
    reasons = ", ".join(s.get("reasons", [])[:2])
    return (
        f"{ACTION_EMOJI.get(s['action'], '⚪')} <b>{s['symbol']}</b> — "
        f"{s['action']} {STRENGTH_STAR.get(s['strength'], '')}\n"
        f"   Entry  <code>${s['price']:,.2f}</code>  "
        f"Target <code>${s['target']:,.2f}</code>  "
        f"Stop <code>${s['stopLoss']:,.2f}</code>\n"
        f"   Conf <b>{s['confidence']}%</b>  ·  {reasons}"
    )

def _send_signals(chat_id: int, signals: list[dict], title: str):
    if not signals:
        bot.send_message(chat_id, f"No {title.lower()} right now. Try again shortly.",
                         reply_markup=_prompt_keyboard())
        return
    lines = [f"<b>{title}</b>\n"]
    for s in signals:
        lines.append(_fmt(s))
        lines.append("")
    bot.send_message(chat_id, "\n".join(lines).strip(),
                     reply_markup=_app_inline("Open Full Dashboard ↗"))

def _signals_for(chat_id: int, *, action: str | None = None,
                 strength: str | None = None, symbol: str | None = None, title: str):
    bot.send_chat_action(chat_id, "typing")
    try:
        all_sigs = _fetch_signals()
    except Exception as exc:
        logger.error(f"Fetch error: {exc}")
        bot.send_message(chat_id, "⚠️ Could not fetch signals. Try again shortly.",
                         reply_markup=_prompt_keyboard())
        return
    filtered = all_sigs
    if action:   filtered = [s for s in filtered if s["action"] == action]
    if strength: filtered = [s for s in filtered if s["strength"] == strength]
    if symbol:   filtered = [s for s in filtered if s["symbol"].upper() == symbol.upper()]
    _send_signals(chat_id, filtered[:5], title)

# ── Command handlers ───────────────────────────────────────────────────────────

@bot.message_handler(commands=["start"])
def cmd_start(msg):
    name = msg.from_user.first_name or "Trader"
    text = (
        f"⚡ <b>Welcome to OdinTx, {name}!</b>\n\n"
        "Your AI-powered crypto trading assistant on TON.\n\n"
        "<b>Quick actions available below ↓</b>\n"
        "Tap any button or type a command to get started."
    )
    bot.send_message(msg.chat.id, text, reply_markup=_prompt_keyboard())
    bot.send_message(msg.chat.id, "Tap <b>Open App</b> for the full dashboard 👇",
                     reply_markup=_app_inline())

@bot.message_handler(commands=["menu"])
def cmd_menu(msg):
    bot.send_message(
        msg.chat.id,
        "⚡ <b>OdinTx Menu</b>\n\nChoose an action:",
        reply_markup=_prompt_keyboard(),
    )

@bot.message_handler(commands=["help"])
def cmd_help(msg):
    text = (
        "⚡ <b>OdinTx Commands</b>\n\n"
        "<b>Signals</b>\n"
        "/signals — all latest signals\n"
        "/buy — BUY signals only\n"
        "/sell — SELL signals only\n"
        "/strong — STRONG signals only\n\n"
        "<b>By coin</b>\n"
        "/btc  /eth  /ton  /sol  /bnb\n\n"
        "<b>Alerts</b>\n"
        "/subscribe — auto alerts every 4 h\n"
        "/unsubscribe — stop alerts\n\n"
        "<b>App</b>\n"
        "/start — show prompt menu\n"
        "/help — this message"
    )
    bot.send_message(msg.chat.id, text,
                     reply_markup=_app_inline("Open Full Dashboard ↗"))

@bot.message_handler(commands=["signals"])
def cmd_signals(msg):
    _signals_for(msg.chat.id, title="⚡ Latest AI Signals")

@bot.message_handler(commands=["buy"])
def cmd_buy(msg):
    _signals_for(msg.chat.id, action="BUY", title="🟢 BUY Signals")

@bot.message_handler(commands=["sell"])
def cmd_sell(msg):
    _signals_for(msg.chat.id, action="SELL", title="🔴 SELL Signals")

@bot.message_handler(commands=["strong"])
def cmd_strong(msg):
    _signals_for(msg.chat.id, strength="STRONG", title="🌟 Strong Signals")

@bot.message_handler(commands=["btc"])
def cmd_btc(msg):
    _signals_for(msg.chat.id, symbol="BTC", title="₿ Bitcoin Signal")

@bot.message_handler(commands=["eth"])
def cmd_eth(msg):
    _signals_for(msg.chat.id, symbol="ETH", title="Ξ Ethereum Signal")

@bot.message_handler(commands=["ton"])
def cmd_ton(msg):
    _signals_for(msg.chat.id, symbol="TON", title="◎ Toncoin Signal")

@bot.message_handler(commands=["sol"])
def cmd_sol(msg):
    _signals_for(msg.chat.id, symbol="SOL", title="◎ Solana Signal")

@bot.message_handler(commands=["bnb"])
def cmd_bnb(msg):
    _signals_for(msg.chat.id, symbol="BNB", title="⬡ BNB Signal")

@bot.message_handler(commands=["subscribe"])
def cmd_subscribe(msg):
    if subscribe(msg.chat.id, msg.from_user.username):
        bot.send_message(
            msg.chat.id,
            "✅ <b>Subscribed!</b>\n\n"
            "You'll receive <b>STRONG</b> signal alerts every 4 hours.\n"
            "Use /unsubscribe to stop at any time.",
            reply_markup=_prompt_keyboard(),
        )
        logger.info(f"New subscriber: {msg.chat.id} (@{msg.from_user.username})")
    else:
        bot.send_message(msg.chat.id,
                         "You're already subscribed. Use /unsubscribe to stop alerts.",
                         reply_markup=_prompt_keyboard())

@bot.message_handler(commands=["unsubscribe"])
def cmd_unsubscribe(msg):
    if unsubscribe(msg.chat.id):
        bot.send_message(msg.chat.id,
                         "👋 Unsubscribed. Use /subscribe to re-enable alerts anytime.",
                         reply_markup=_prompt_keyboard())
    else:
        bot.send_message(msg.chat.id,
                         "You're not currently subscribed.",
                         reply_markup=_prompt_keyboard())

# ── Prompt button text handler ─────────────────────────────────────────────────

PROMPT_DISPATCH = {
    "⚡ All Signals":  lambda cid: _signals_for(cid, title="⚡ Latest AI Signals"),
    "🟢 BUY Signals":  lambda cid: _signals_for(cid, action="BUY",    title="🟢 BUY Signals"),
    "🔴 SELL Signals": lambda cid: _signals_for(cid, action="SELL",   title="🔴 SELL Signals"),
    "🌟 Strong Only":  lambda cid: _signals_for(cid, strength="STRONG", title="🌟 Strong Signals"),
    "₿ BTC":           lambda cid: _signals_for(cid, symbol="BTC",    title="₿ Bitcoin Signal"),
    "Ξ ETH":           lambda cid: _signals_for(cid, symbol="ETH",    title="Ξ Ethereum Signal"),
    "◎ TON":           lambda cid: _signals_for(cid, symbol="TON",    title="◎ Toncoin Signal"),
    "◎ SOL":           lambda cid: _signals_for(cid, symbol="SOL",    title="◎ Solana Signal"),
    "⬡ BNB":           lambda cid: _signals_for(cid, symbol="BNB",    title="⬡ BNB Signal"),
    "🔔 Subscribe":    lambda cid: bot.send_message(
                           cid,
                           "Use /subscribe to enable automatic STRONG signal alerts every 4 hours.",
                           reply_markup=_prompt_keyboard(),
                       ),
    "📊 Open App":     lambda cid: bot.send_message(
                           cid,
                           "Tap below to open the full OdinTx dashboard 👇",
                           reply_markup=_app_inline(),
                       ),
}

@bot.message_handler(func=lambda m: m.text in PROMPT_DISPATCH)
def handle_prompt(msg):
    PROMPT_DISPATCH[msg.text](msg.chat.id)

# ── Broadcast engine ───────────────────────────────────────────────────────────

def _push(text: str, label: str = "View Signals"):
    """Send text to all subscribers. Auto-removes blocked users."""
    subscribers = all_subscribers()
    if not subscribers:
        return
    sent = failed = 0
    for chat_id in subscribers:
        try:
            bot.send_message(chat_id, text, reply_markup=_app_inline(label))
            sent += 1
        except telebot.apihelper.ApiTelegramException as e:
            if "blocked" in str(e).lower() or "deactivated" in str(e).lower():
                unsubscribe(chat_id)
                logger.info(f"Auto-unsubscribed {chat_id}")
            else:
                failed += 1
        except Exception:
            failed += 1
    logger.info(f"Push '{label}' — sent:{sent} failed:{failed} total:{len(subscribers)}")

def _get_signals_safe() -> list[dict]:
    try:
        return _fetch_signals()
    except Exception as exc:
        logger.error(f"Signal fetch error: {exc}")
        return []

# ── Auto trading prompt jobs ───────────────────────────────────────────────────

def job_morning_briefing():
    logger.info("Auto-prompt: morning briefing")
    sigs = _get_signals_safe()
    text = P.morning_briefing(sigs)
    if text:
        _push(text, "Open Dashboard ↗")

def job_evening_summary():
    logger.info("Auto-prompt: evening summary")
    sigs = _get_signals_safe()
    text = P.evening_summary(sigs)
    if text:
        _push(text, "Open Dashboard ↗")

def job_strong_signals():
    logger.info("Auto-prompt: strong signals broadcast")
    sigs = _get_signals_safe()
    strong = [s for s in sigs if s.get("strength") == "STRONG"]
    if not strong:
        logger.info("No STRONG signals — skip.")
        return
    header = (
        f"🚨 <b>OdinTx Signal Alert</b>  ·  "
        f"{len(strong)} strong signal{'s' if len(strong) > 1 else ''}\n\n"
    )
    text = header + "\n\n".join(_fmt(s) for s in strong)
    _push(text, "View Signals ↗")

def job_opportunity_alert():
    logger.info("Auto-prompt: opportunity scan")
    sigs = _get_signals_safe()
    text = P.opportunity_alert(sigs)
    if text:
        _push(text, "Trade Now ↗")

def job_bear_alert():
    logger.info("Auto-prompt: bear scan")
    sigs = _get_signals_safe()
    text = P.bear_alert(sigs)
    if text:
        _push(text, "View Risk ↗")

def job_high_confidence():
    logger.info("Auto-prompt: high confidence pulse")
    sigs = _get_signals_safe()
    text = P.high_confidence_pulse(sigs)
    if text:
        _push(text, "View Signal ↗")

def job_ton_pulse():
    logger.info("Auto-prompt: TON pulse")
    sigs = _get_signals_safe()
    text = P.ton_pulse(sigs)
    if text:
        _push(text, "Open TON Portfolio ↗")

def job_risk_check():
    logger.info("Auto-prompt: risk check")
    sigs = _get_signals_safe()
    text = P.risk_check(sigs)
    if text:
        _push(text, "View Market ↗")

# ── Setup & run ────────────────────────────────────────────────────────────────

def _set_menu_button():
    try:
        bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(text="Open App", web_app=WebAppInfo(url=WEBAPP_URL))
        )
        logger.info("Menu button set")
    except Exception as exc:
        logger.warning(f"Menu button: {exc}")

def _set_commands():
    try:
        bot.set_my_commands([
            BotCommand("start",       "Welcome & prompt menu"),
            BotCommand("signals",     "All latest signals"),
            BotCommand("buy",         "BUY signals only"),
            BotCommand("sell",        "SELL signals only"),
            BotCommand("strong",      "STRONG signals only"),
            BotCommand("btc",         "Bitcoin signal"),
            BotCommand("eth",         "Ethereum signal"),
            BotCommand("ton",         "Toncoin signal"),
            BotCommand("sol",         "Solana signal"),
            BotCommand("bnb",         "BNB signal"),
            BotCommand("subscribe",   "Enable auto alerts"),
            BotCommand("unsubscribe", "Disable alerts"),
            BotCommand("help",        "All commands"),
        ])
        logger.info("Bot commands registered")
    except Exception as exc:
        logger.warning(f"Commands: {exc}")

if __name__ == "__main__":
    if not TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is not set")

    logger.info("OdinTx bot starting...")
    _init_db()
    _set_menu_button()
    _set_commands()

    scheduler = BackgroundScheduler(timezone="UTC")

    # ── Daily fixed-time prompts ──────────────────────────────────────
    scheduler.add_job(job_morning_briefing, "cron", hour=8,  minute=0,  id="morning")
    scheduler.add_job(job_evening_summary,  "cron", hour=18, minute=0,  id="evening")
    scheduler.add_job(job_ton_pulse,        "cron", hour=12, minute=0,  id="ton_pulse")

    # ── Interval prompts ──────────────────────────────────────────────
    scheduler.add_job(job_strong_signals,   "interval", hours=4,  id="strong_broadcast")
    scheduler.add_job(job_high_confidence,  "interval", hours=1,  id="high_conf")
    scheduler.add_job(job_opportunity_alert,"interval", hours=2,  id="opportunity")
    scheduler.add_job(job_bear_alert,       "interval", hours=2,  id="bear_alert")
    scheduler.add_job(job_risk_check,       "interval", hours=6,  id="risk_check")

    scheduler.start()
    logger.info("Scheduler started — 8 auto-prompt jobs active")

    try:
        bot.infinity_polling(skip_pending=True, timeout=30, long_polling_timeout=20)
    finally:
        scheduler.shutdown()

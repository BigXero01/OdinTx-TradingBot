"""
OdinTx Telegram Bot — sends signals and opens the Mini App.
"""
import asyncio
import os
import httpx
import telebot
from telebot.types import (
    InlineKeyboardMarkup, InlineKeyboardButton,
    WebAppInfo, MenuButtonWebApp,
)
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
WEBAPP_URL = os.getenv("TELEGRAM_WEBAPP_URL", "https://odintx.app")
API_URL = os.getenv("ODINTX_API_URL", "http://localhost:8000/api")

bot = telebot.TeleBot(TOKEN, parse_mode="HTML")


def _open_app_keyboard() -> InlineKeyboardMarkup:
    kb = InlineKeyboardMarkup()
    kb.add(InlineKeyboardButton("Open OdinTx", web_app=WebAppInfo(url=WEBAPP_URL)))
    return kb


@bot.message_handler(commands=["start"])
def cmd_start(msg):
    name = msg.from_user.first_name or "Trader"
    text = (
        f"<b>Welcome to OdinTx, {name}!</b>\n\n"
        "I'm your AI-powered crypto trading assistant for the TON ecosystem.\n\n"
        "<b>What I do:</b>\n"
        "• Analyze BTC, ETH, TON, SOL & BNB markets\n"
        "• Generate BUY/SELL/HOLD signals using RSI, MACD & momentum\n"
        "• Track your TON wallet portfolio\n\n"
        "Use the button below to open the full dashboard or type /signals for the latest signals."
    )
    bot.send_message(msg.chat.id, text, reply_markup=_open_app_keyboard())


@bot.message_handler(commands=["signals"])
def cmd_signals(msg):
    bot.send_message(msg.chat.id, "⏳ Fetching latest signals...")
    try:
        with httpx.Client(timeout=15) as client:
            resp = client.get(f"{API_URL}/signals")
            resp.raise_for_status()
            signals = resp.json()
    except Exception as exc:
        logger.error(f"Signal fetch failed: {exc}")
        bot.send_message(msg.chat.id, "Could not fetch signals. Try again shortly.")
        return

    if not signals:
        bot.send_message(msg.chat.id, "No signals available right now.")
        return

    action_emoji = {"BUY": "🟢", "SELL": "🔴", "HOLD": "🟡"}
    lines = ["<b>Latest AI Trading Signals</b>\n"]
    for s in signals[:5]:
        emoji = action_emoji.get(s["action"], "⚪")
        lines.append(
            f"{emoji} <b>{s['symbol']}</b> — {s['action']} ({s['strength']})\n"
            f"   Entry: <code>${s['price']:.2f}</code>  Target: <code>${s['target']:.2f}</code>\n"
            f"   Confidence: {s['confidence']}%  |  {', '.join(s['reasons'][:2])}\n"
        )

    bot.send_message(msg.chat.id, "\n".join(lines), reply_markup=_open_app_keyboard())


@bot.message_handler(commands=["help"])
def cmd_help(msg):
    text = (
        "<b>OdinTx Commands</b>\n\n"
        "/start — Welcome message & open app\n"
        "/signals — Latest AI trading signals\n"
        "/help — This message\n\n"
        "Open the Mini App for full charts, portfolio tracking, and real-time alerts."
    )
    bot.send_message(msg.chat.id, text, reply_markup=_open_app_keyboard())


def set_menu_button():
    try:
        bot.set_chat_menu_button(
            menu_button=MenuButtonWebApp(text="Open App", web_app=WebAppInfo(url=WEBAPP_URL))
        )
        logger.info("Menu button set")
    except Exception as exc:
        logger.warning(f"Could not set menu button: {exc}")


if __name__ == "__main__":
    logger.info("OdinTx bot starting...")
    set_menu_button()
    bot.infinity_polling(skip_pending=True)

"""
Auto trading prompt templates.
Each function takes the signals list and returns a formatted HTML string,
or None if the condition isn't met (so the caller can skip sending).
"""
from datetime import datetime, timezone

ACTION_EMOJI  = {"BUY": "🟢", "SELL": "🔴", "HOLD": "🟡"}
STRENGTH_STAR = {"STRONG": "⭐⭐⭐", "MODERATE": "⭐⭐", "WEAK": "⭐"}


def _fmt(s: dict) -> str:
    reasons = ", ".join(s.get("reasons", [])[:2])
    return (
        f"{ACTION_EMOJI.get(s['action'], '⚪')} <b>{s['symbol']}</b> — "
        f"{s['action']} {STRENGTH_STAR.get(s['strength'], '')}\n"
        f"  Entry <code>${s['price']:,.2f}</code>  "
        f"Target <code>${s['target']:,.2f}</code>  "
        f"Stop <code>${s['stopLoss']:,.2f}</code>\n"
        f"  Conf <b>{s['confidence']}%</b>  ·  {reasons}"
    )


def _pct(entry: float, target: float) -> str:
    return f"{((target - entry) / entry) * 100:+.1f}%"


# ── Morning Briefing ──────────────────────────────────────────────────────────

def morning_briefing(signals: list[dict]) -> str | None:
    if not signals:
        return None

    buys  = [s for s in signals if s["action"] == "BUY"]
    sells = [s for s in signals if s["action"] == "SELL"]
    holds = [s for s in signals if s["action"] == "HOLD"]

    # Market bias
    if len(buys) >= 3:
        bias, bias_icon = "Bullish", "🚀"
    elif len(sells) >= 3:
        bias, bias_icon = "Bearish", "🐻"
    else:
        bias, bias_icon = "Neutral", "⚖️"

    avg_conf = sum(s["confidence"] for s in signals) / len(signals)
    strong   = [s for s in signals if s["strength"] == "STRONG"]

    lines = [
        f"☀️ <b>OdinTx Morning Briefing</b>",
        f"<i>{datetime.now(timezone.utc).strftime('%A, %d %b %Y  UTC')}</i>\n",
        f"{bias_icon} <b>Market Bias: {bias}</b>",
        f"📊 {len(buys)} BUY  ·  {len(sells)} SELL  ·  {len(holds)} HOLD",
        f"🎯 Avg Confidence: <b>{avg_conf:.0f}%</b>",
        f"⭐ Strong Signals: <b>{len(strong)}</b>\n",
    ]

    if strong:
        lines.append("<b>Top Opportunities:</b>")
        for s in strong[:3]:
            upside = _pct(s["price"], s["target"])
            lines.append(
                f"  {ACTION_EMOJI[s['action']]} <b>{s['symbol']}</b> {s['action']} "
                f"@ <code>${s['price']:,.2f}</code> → <b>{upside}</b> potential"
            )
    else:
        lines.append("<b>No strong signals this morning.</b> Market is consolidating.")

    lines += ["", "Use the menu below for full signal details 👇"]
    return "\n".join(lines)


# ── Evening Summary ───────────────────────────────────────────────────────────

def evening_summary(signals: list[dict]) -> str | None:
    if not signals:
        return None

    top = sorted(signals, key=lambda s: s["confidence"], reverse=True)[:3]
    lines = [
        "🌙 <b>OdinTx Evening Summary</b>\n",
        "<b>Top signals heading into tonight:</b>\n",
    ]
    for s in top:
        lines.append(_fmt(s))
        lines.append("")

    lines += [
        "<i>Markets don't sleep — stay alert for overnight moves.</i>",
        "Set up alerts with /subscribe ↗",
    ]
    return "\n".join(lines).strip()


# ── Opportunity Alert ─────────────────────────────────────────────────────────

def opportunity_alert(signals: list[dict]) -> str | None:
    """Fires when 2+ STRONG BUY signals appear simultaneously."""
    strong_buys = [s for s in signals if s["action"] == "BUY" and s["strength"] == "STRONG"]
    if len(strong_buys) < 2:
        return None

    lines = [
        "🔥 <b>Multi-Coin Opportunity Detected!</b>\n",
        f"<b>{len(strong_buys)} STRONG BUY signals are aligned right now.</b>\n",
    ]
    for s in strong_buys:
        upside = _pct(s["price"], s["target"])
        lines.append(
            f"🟢 <b>{s['symbol']}</b>  Entry <code>${s['price']:,.2f}</code>  "
            f"→  Target <code>${s['target']:,.2f}</code>  (<b>{upside}</b>)\n"
            f"   Conf <b>{s['confidence']}%</b>  ·  {', '.join(s.get('reasons', [])[:2])}\n"
        )
    lines.append("<b>⚠️ Always manage your risk. Use stop-losses.</b>")
    return "\n".join(lines)


# ── Bear Alert ────────────────────────────────────────────────────────────────

def bear_alert(signals: list[dict]) -> str | None:
    """Fires when 2+ STRONG SELL signals appear simultaneously."""
    strong_sells = [s for s in signals if s["action"] == "SELL" and s["strength"] == "STRONG"]
    if len(strong_sells) < 2:
        return None

    lines = [
        "🐻 <b>Bear Alert — Multiple SELL Signals</b>\n",
        f"<b>{len(strong_sells)} STRONG SELL signals detected.</b>\n",
        "Consider reducing exposure or setting tight stop-losses.\n",
    ]
    for s in strong_sells:
        lines.append(
            f"🔴 <b>{s['symbol']}</b>  Entry <code>${s['price']:,.2f}</code>  "
            f"Stop <code>${s['stopLoss']:,.2f}</code>  "
            f"Conf <b>{s['confidence']}%</b>\n"
            f"   {', '.join(s.get('reasons', [])[:2])}\n"
        )
    lines.append("<b>⚠️ Not financial advice. DYOR.</b>")
    return "\n".join(lines)


# ── High Confidence Pulse ─────────────────────────────────────────────────────

def high_confidence_pulse(signals: list[dict]) -> str | None:
    """Single coin with 90%+ confidence — hourly check."""
    top = [s for s in signals if s["confidence"] >= 90]
    if not top:
        return None

    s = max(top, key=lambda x: x["confidence"])
    upside = _pct(s["price"], s["target"])
    return (
        f"⚡ <b>High-Confidence Signal</b>\n\n"
        f"{_fmt(s)}\n\n"
        f"📈 Upside potential: <b>{upside}</b>\n"
        f"This signal scores in the top 10% of our model.\n\n"
        f"<b>Entry:</b> <code>${s['price']:,.2f}</code>\n"
        f"<b>Target:</b> <code>${s['target']:,.2f}</code>\n"
        f"<b>Stop-Loss:</b> <code>${s['stopLoss']:,.2f}</code>"
    )


# ── TON Ecosystem Pulse ───────────────────────────────────────────────────────

def ton_pulse(signals: list[dict]) -> str | None:
    """TON-specific signal briefing."""
    ton = next((s for s in signals if s["symbol"] == "TON"), None)
    if not ton:
        return None

    action_text = {
        "BUY":  "💎 Accumulation opportunity on Toncoin.",
        "SELL": "📤 Consider taking profits on TON.",
        "HOLD": "⏳ TON is consolidating — patience.",
    }.get(ton["action"], "")

    return (
        f"💎 <b>TON Ecosystem Update</b>\n\n"
        f"{_fmt(ton)}\n\n"
        f"{action_text}\n\n"
        f"Connect your TON wallet in the app to track your portfolio 👇"
    )


# ── Risk Check ────────────────────────────────────────────────────────────────

def risk_check(signals: list[dict]) -> str | None:
    """Alerts when market is mixed — advises caution."""
    buys  = len([s for s in signals if s["action"] == "BUY"])
    sells = len([s for s in signals if s["action"] == "SELL"])
    total = len(signals)
    if total == 0:
        return None

    # Only fire when market is almost evenly split
    if abs(buys - sells) > 1 or total < 4:
        return None

    return (
        "⚖️ <b>Mixed Market Warning</b>\n\n"
        f"Signals are split: <b>{buys} BUY</b> vs <b>{sells} SELL</b> across {total} pairs.\n\n"
        "📋 <b>Risk Management Reminders:</b>\n"
        "• Size positions smaller in uncertain markets\n"
        "• Keep stop-losses tight\n"
        "• Avoid FOMO entries — wait for confirmation\n"
        "• Diversify across uncorrelated assets\n\n"
        "<i>Capital preservation is always the first priority.</i>"
    )

from datetime import date, datetime
from decimal import Decimal
from typing import Optional


def format_currency(amount: Decimal, currency: str = "CLP") -> str:
    return f"{currency} {amount:,.2f}"


def parse_decimal(value: str) -> Decimal:
    return Decimal(value)


def format_date(date_obj: date) -> str:
    return date_obj.isoformat()


def parse_date(date_str: str) -> date:
    return datetime.fromisoformat(date_str).date()


def mask_sensitive_data(data: str, visible_chars: int = 4) -> str:
    if len(data) <= visible_chars:
        return "*" * len(data)
    return data[:visible_chars] + "*" * (len(data) - visible_chars)

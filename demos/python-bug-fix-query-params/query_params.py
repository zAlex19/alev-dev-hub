from urllib.parse import urlencode

def build_query(params: dict[str, object]) -> str:
    """Build an HTTP query string, omitting only missing values."""
    cleaned = {key: value for key, value in params.items() if value is not None}
    return urlencode(cleaned)

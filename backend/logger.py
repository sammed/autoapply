import functools
import logging
from typing import Callable, Any

# Configure the logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# File handler
file_handler = logging.FileHandler("app_results.log")
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(
    logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(
    logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
)

# Add handlers to the logger
# logger.addHandler(file_handler)
logger.addHandler(console_handler)


def log_result(func: Callable) -> Callable:
    """
    A decorator that logs the return value of the function it wraps.
    """

    @functools.wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        result = func(*args, **kwargs)
        logger.info(
            f"Function '{func.__name__}' called with args: {args}, kwargs: {kwargs}"
        )
        logger.info(f"Function '{func.__name__}' returned: {result}")
        return result

    return wrapper

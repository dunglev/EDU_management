import logging

# Thiết lập logging
def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[logging.StreamHandler(), logging.FileHandler('app.log', encoding='utf-8')]
    )
logger = logging.getLogger(__name__)
import os

class Config:
    http_port = int(os.getenv("HTTP_PORT", "8080"))
    http_address = os.getenv("HTTP_ADDRESS", "0.0.0.0")
    
    static_uri = os.getenv("STATIC_URI", "/static")
    static_dir = os.getenv("STATIC_DIR", "../frontend/static")
    
    scripts_uri = os.getenv("SCRIPTS_URI", "/scripts")
    scripts_dir = os.getenv("SCRIPTS_DIR", "../frontend/dist")
    
    default_page = os.getenv("DEFAULT_PAGE", "/static/index.html")
    
    suggestions_dir = os.getenv("SUGGESTIONS_DIR", "../suggestions")
    datasets_dir = os.getenv("DATASETS_DIR", "../datasets")
    
    config_json = os.getenv("CONFIG_JSON", "../config.json")
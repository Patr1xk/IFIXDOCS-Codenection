from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load .env file explicitly from root directory
import pathlib
root_dir = pathlib.Path(__file__).resolve().parent.parent.parent
env_file = root_dir / ".env"
# Load with override to handle BOM and ensure it takes precedence
load_dotenv(env_file, override=True)

class Settings(BaseSettings):
    # API Configuration
    api_v1_str: str = "/api/v1"
    project_name: str = "IFastDocs"
    
    # OpenAI Configuration
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4"
    openai_max_tokens: int = 2000
    
    # Database Configuration (for future use)
    database_url: Optional[str] = None
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # File Storage
    upload_dir: str = "uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    
    # GitHub Integration
    github_token: Optional[str] = None
    github_webhook_secret: Optional[str] = None
    
    # MCP Configuration
    mcp_server_url: Optional[str] = None
    mcp_api_key: Optional[str] = None
    
    # Hugging Face Configuration (Free AI API)
    huggingface_api_key: Optional[str] = None
    
    class Config:
        env_file = str(env_file)  # Use the root .env file
        case_sensitive = False  # Make it case insensitive
        extra = "allow"  # Allow extra fields from .env file
        env_prefix = ""  # No prefix for environment variables

# Create settings instance
settings = Settings()

# Manually set environment variables if they exist
if os.getenv('HUGGINGFACE_API_KEY'):
    settings.huggingface_api_key = os.getenv('HUGGINGFACE_API_KEY')
if os.getenv('GITHUB_TOKEN'):
    settings.github_token = os.getenv('GITHUB_TOKEN')
if os.getenv('MCP_API_KEY'):
    settings.mcp_api_key = os.getenv('MCP_API_KEY')
if os.getenv('MCP_SERVER_URL'):
    settings.mcp_server_url = os.getenv('MCP_SERVER_URL')
if os.getenv('SECRET_KEY'):
    settings.secret_key = os.getenv('SECRET_KEY')

# Ensure upload directory exists
os.makedirs(settings.upload_dir, exist_ok=True)

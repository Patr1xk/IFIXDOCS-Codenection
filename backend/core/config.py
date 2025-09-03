from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load .env file explicitly
load_dotenv()

class Settings(BaseSettings):
    # API Configuration
    api_v1_str: str = "/api/v1"
    project_name: str = "SmartDocs"
    
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
        env_file = ".env"
        case_sensitive = False  # Make it case insensitive
        extra = "allow"  # Allow extra fields from .env file

# Create settings instance
settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.upload_dir, exist_ok=True)

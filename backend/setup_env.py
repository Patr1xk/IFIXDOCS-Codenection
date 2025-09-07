#!/usr/bin/env python3
"""
Environment Setup Script for IFastDocs
Creates .env file with MCP configuration
"""

import os
from pathlib import Path

def create_env_file():
    """Create .env file with MCP configuration"""
    
    env_content = """# IFastDocs Configuration
# MCP Configuration
MCP_SERVER_URL=http://localhost:8001
MCP_API_KEY=IFastDocs_mcp_key_2024

# Hugging Face Configuration (FREE AI API)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# GitHub Integration (Optional)
GITHUB_TOKEN=your_github_token_here
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here

# Security
SECRET_KEY=IFastDocs_secret_key_2024_hackathon
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Storage
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Database (for future use)
DATABASE_URL=sqlite:///./IFastDocs.db
"""
    
    # Create .env file in backend directory
    backend_dir = Path(__file__).parent
    env_file = backend_dir / ".env"
    
    try:
        with open(env_file, 'w') as f:
            f.write(env_content)
        
        print("✅ .env file created successfully!")
        print(f"📍 Location: {env_file}")
        print("\n🔧 Next steps:")
        print("1. Add your Hugging Face API key to the .env file")
        print("2. Run: python start_servers.py")
        print("3. Your MCP integration will be active!")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        print("\n📝 Manual setup:")
        print("Create a .env file in the backend directory with:")
        print("MCP_SERVER_URL=http://localhost:8001")
        print("MCP_API_KEY=IFastDocs_mcp_key_2024")
        return False

def main():
    """Main setup function"""
    print("🎯 IFastDocs - Environment Setup")
    print("=" * 40)
    
    if create_env_file():
        print("\n🚀 Ready to start IFastDocs with MCP integration!")
    else:
        print("\n⚠️  Please create .env file manually")

if __name__ == "__main__":
    main()

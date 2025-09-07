#!/usr/bin/env python3
"""
IFastDocs Server Startup Script
Starts both the main FastAPI server and MCP server
"""

import subprocess
import sys
import time
import threading
import os
from pathlib import Path

def start_mcp_server():
    """Start the MCP server in a separate process"""
    print("🚀 Starting MCP Server on port 8001...")
    try:
        # Start MCP server
        mcp_process = subprocess.Popen([
            sys.executable, "mcp_server.py"
        ], cwd=Path(__file__).parent)
        
        print("✅ MCP Server started successfully!")
        print("📍 MCP Server available at: http://localhost:8001")
        print("📚 MCP API docs: http://localhost:8001/docs")
        
        return mcp_process
    except Exception as e:
        print(f"❌ Failed to start MCP server: {e}")
        return None

def start_main_server():
    """Start the main FastAPI server"""
    print("🚀 Starting Main IFastDocs Server on port 8000...")
    try:
        # Start main server
        main_process = subprocess.Popen([
            sys.executable, "-m", "uvicorn", "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ], cwd=Path(__file__).parent)
        
        print("✅ Main Server started successfully!")
        print("📍 Main Server available at: http://localhost:8000")
        print("📚 Main API docs: http://localhost:8000/api/docs")
        
        return main_process
    except Exception as e:
        print(f"❌ Failed to start main server: {e}")
        return None

def main():
    """Main startup function"""
    print("🎯 IFastDocs - Starting Integrated Server Setup")
    print("=" * 50)
    
    # Start MCP server first
    mcp_process = start_mcp_server()
    if mcp_process:
        # Wait a moment for MCP server to start
        time.sleep(2)
    
    # Start main server
    main_process = start_main_server()
    
    if not main_process:
        print("❌ Failed to start main server. Exiting...")
        if mcp_process:
            mcp_process.terminate()
        sys.exit(1)
    
    print("\n🎉 Both servers are running!")
    print("=" * 50)
    print("📋 Server Status:")
    print("   • Main Server: http://localhost:8000")
    print("   • MCP Server: http://localhost:8001")
    print("   • Frontend: http://localhost:5173 (if running)")
    print("\n💡 MCP Integration Features:")
    print("   • Enhanced Q&A with document context")
    print("   • Better summarization with MCP context")
    print("   • Improved visualizations with code analysis")
    print("   • Document-aware multilingual features")
    print("\n🛑 Press Ctrl+C to stop both servers")
    
    try:
        # Wait for both processes
        if mcp_process:
            mcp_process.wait()
        main_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        if mcp_process:
            mcp_process.terminate()
        main_process.terminate()
        print("✅ Servers stopped successfully!")

if __name__ == "__main__":
    main()

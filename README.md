# 🚀 **SmartDocs - Intelligent Documentation Assistant**

> **AI-powered documentation tool that simplifies writing, speeds up reading, and makes maintenance easy**

## 🎯 **Project Overview**

SmartDocs is a comprehensive documentation platform that addresses real-world documentation challenges:

- ✅ **Simplify Writing** - Auto-generate docs from GitHub repositories with AI
- ✅ **Speed Up Reading** - AI-powered summarization and Q&A
- ✅ **Make Maintenance Easy** - Detect stale docs and suggest updates
- ✅ **Onboarding** - Interactive tutorials and guides
- ✅ **Multilingual** - Support for multiple languages

## 🛠 **Tech Stack**

- **Backend**: FastAPI (Python)
- **Frontend**: React + Vite + Tailwind CSS
- **AI**: Hugging Face API (Free)
- **APIs**: GitHub API, Google Translate API
- **Enhancement**: MCP (Model Context Protocol)

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Python 3.11+
- Node.js 16+
- Git

### **Step 1: Clone and Setup**
```bash
git clone <your-repo-url>
cd "Cursor Backend"
```

### **Step 2: Backend Setup**
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv311

# Activate virtual environment
# Windows:
venv311\Scripts\activate
# Mac/Linux:
source venv311/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (already done)
# Your .env file should contain:
HUGGINGFACE_API_KEY=your_token_here
GITHUB_TOKEN=your_token_here
SECRET_KEY=your_token_here
MCP_API_KEY=your_token_here
MCP_SERVER_URL=your_token_here
```

### **Step 3: Frontend Setup**
```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install
```

## 🎮 **Running the Application**

### **Option 1: Full Setup (Recommended for Demo)**

**Terminal 1 - Backend Server:**
```bash
cd backend
python main.py
```
✅ Backend will be available at: http://localhost:8000

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```
✅ Frontend will be available at: http://localhost:5173

**Terminal 3 - MCP Server (Optional):**
```bash
cd backend
python mcp_server.py
```
✅ MCP Server will be available at: http://localhost:8001

### **Option 2: Basic Setup (Backend + Frontend Only)**

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 **Access Your Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **MCP Server**: http://localhost:8001 (if running)

## 🎯 **Demo Flow**

### **1. GitHub Integration**
1. Go to "Write Documentation" section
2. Paste a GitHub repository URL
3. Select project type and options
4. Click "Generate from GitHub"
5. View AI-generated documentation

### **2. AI Features**
1. Go to "AI Features" section
2. Try summarization with long text
3. Ask questions in Q&A section
4. Generate documentation from code

### **3. Document Management**
1. Create and save documents
2. View saved documents
3. Edit and update content

## 🔧 **API Endpoints**

### **Core Endpoints**
- `GET /api/health` - Health check
- `GET /` - Root endpoint

### **Documentation**
- `POST /api/docs/` - Create document
- `GET /api/docs/` - List documents
- `GET /api/docs/{id}` - Get document
- `PUT /api/docs/{id}` - Update document
- `DELETE /api/docs/{id}` - Delete document

### **AI Services**
- `POST /api/ai/generate-from-github` - Generate docs from GitHub
- `POST /api/ai/summarize` - Summarize content
- `POST /api/ai/qa` - Q&A service

### **Maintenance**
- `POST /api/maintenance/drift` - Detect documentation drift
- `POST /api/maintenance/webhook/github` - GitHub webhook

## 🧠 **MCP (Model Context Protocol)**

Your project includes MCP integration for enhanced AI responses:

- **Context-aware responses** - Better understanding of queries
- **Enhanced documentation** - More relevant content generation
- **Improved Q&A** - Better answers with context
- **Code analysis** - Better structure understanding

**MCP is optional** - your app works perfectly without it!

## 🎨 **Features**

### **✅ Simplify Writing**
- Auto-generate starter docs from GitHub repositories
- AI-powered content suggestions
- Templates and markdown validators

### **✅ Speed Up Reading**
- TL;DR summarization for long documents
- Q&A search (like ChatGPT for docs)
- Visualizations and flow diagrams

### **✅ Make Maintenance Easy**
- Detect stale documentation
- Notify on component changes
- Auto-suggest updates from diffs

### **✅ Onboarding**
- Interactive tutorials
- Step-by-step guides
- Contextual help

### **✅ Multilingual**
- Support for multiple languages
- Translation capabilities
- Localized content

## 🔑 **API Keys Setup**

### **Required (Free)**
- **Hugging Face**: Get free API key at https://huggingface.co/settings/tokens
- **GitHub**: Create personal access token at https://github.com/settings/tokens

### **Optional**
- **Google Translate**: For multilingual features
- **MCP Server**: For enhanced AI responses

## 🐛 **Troubleshooting**

### **Backend Issues**
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Check dependencies
pip install -r requirements.txt

# Check .env file
cat .env
```

### **Frontend Issues**
```bash
# Check if frontend is running
curl http://localhost:5173

# Reinstall dependencies
npm install

# Clear cache
npm run build
```

### **MCP Issues**
```bash
# Check MCP server
curl http://localhost:8001/health

# Start MCP server
python mcp_server.py
```

## 🏆 **Hackathon Ready**

This project is **production-ready** for hackathons with:

- ✅ **Real AI integration** (Hugging Face)
- ✅ **GitHub repository analysis**
- ✅ **Professional APIs** (all free)
- ✅ **Complete feature set**
- ✅ **MCP enhancement**
- ✅ **Modern UI/UX**

## 📚 **Documentation**

- **API Docs**: http://localhost:8000/api/docs
- **Setup Guide**: `HACKATHON_SETUP.md`
- **API Setup**: `FREE_API_SETUP.md`
- **MCP Guide**: `MCP_SETUP.md`
- **Demo Guide**: `DEMO_GUIDE.md`
- **Quick Reference**: `DEMO_QUICK_REFERENCE.md`

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**🚀 Ready to revolutionize documentation? Start your servers and begin building!**

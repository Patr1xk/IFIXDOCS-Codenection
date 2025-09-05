# 🚀 **SmartDocs - Intelligent Documentation Assistant**

> **AI-powered documentation platform that simplifies writing, speeds up reading, and makes maintenance easy**

## 🎯 **Project Overview**

SmartDocs is a comprehensive documentation platform that addresses real-world documentation challenges:

- ✅ **Simplify Writing** - Auto-generate docs from GitHub repositories with AI
- ✅ **Speed Up Reading** - AI-powered summarization, Q&A, and visualizations
- ✅ **Make Maintenance Easy** - Detect stale docs, notify on changes, auto-suggest updates
- ✅ **Onboarding** - Interactive tutorials with auto-start functionality
- ✅ **Multilingual** - Translation, language detection, and localization with MCP integration

## 🛠 **Tech Stack**

- **Backend**: FastAPI (Python) with comprehensive API routes
- **Frontend**: React + Vite + Tailwind CSS with modern UI components
- **AI**: Hugging Face API (Free) with intelligent fallback systems
- **APIs**: GitHub API, LibreTranslate, MyMemory (all free)
- **Enhancement**: MCP (Model Context Protocol) for document-aware responses
- **Visualization**: Mermaid.js for flow diagrams, API graphs, and changelogs

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

# Create .env file
# Your .env file should contain:
HUGGINGFACE_API_KEY=your_token_here
GITHUB_TOKEN=your_token_here
SECRET_KEY=your_secret_key_here
MCP_API_KEY=your_mcp_key_here
MCP_SERVER_URL=http://localhost:8001
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
uvicorn mcp_server:app --reload
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
uvicorn mcp_server:app --reload
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
2. Paste a GitHub repository URL (e.g., https://github.com/pallets/flask)
3. Select project type and options
4. Click "Generate from GitHub"
5. View AI-generated documentation with real repository analysis

### **2. AI Features**
1. Go to "AI Features" section
2. Try summarization with long text (handles 500+ characters)
3. Ask questions in Q&A section (MCP-enhanced responses)
4. Generate documentation from code snippets

### **3. Visualizations**
1. Go to "Visualizations" section
2. Select generated documents from dropdown
3. Generate flow diagrams, API call graphs, and changelogs
4. View interactive Mermaid diagrams

### **4. Maintenance Features**
1. Go to "Make Maintenance Easy" section
2. Detect stale documentation (doc drift vs. code)
3. View dependency change notifications
4. Auto-suggest doc updates from diffs

### **5. Multilingual Support**
1. Go to "Multilingual" section
2. Select documents from dropdown (MCP integration)
3. Translate content (handles 450+ characters with smart truncation)
4. Detect languages and localize content

### **6. Onboarding**
1. Click "Get Started" from landing page
2. Tutorial auto-starts for seamless experience
3. Interactive step-by-step guides
4. Contextual help throughout

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
- `GET /api/docs/templates` - Get document templates

### **AI Services**
- `POST /api/ai/generate-from-github` - Generate docs from GitHub
- `POST /api/ai/summarize` - Summarize content
- `POST /api/ai/qa` - Q&A service with MCP integration
- `POST /api/ai/enhance` - Enhance content with AI

### **Visualizations**
- `POST /api/visualizations/flow-diagram` - Generate flow diagrams
- `POST /api/visualizations/api-graph` - Generate API call graphs
- `POST /api/visualizations/changelog` - Generate changelog visualizations
- `POST /api/visualizations/generate-all` - Generate all visualizations

### **Maintenance**
- `POST /api/maintenance/drift` - Detect documentation drift
- `POST /api/maintenance/webhook/github` - GitHub webhook
- `POST /api/maintenance/dependency-changes` - Check dependency changes

### **Multilingual**
- `POST /api/multilingual/translate` - Translate content (450+ char support)
- `POST /api/multilingual/detect` - Detect language
- `POST /api/multilingual/localize` - Localize content
- `GET /api/multilingual/languages` - Get supported languages

## 🧠 **MCP (Model Context Protocol)**

Your project includes advanced MCP integration for enhanced AI responses:

- **Document-aware responses** - AI understands your saved documents
- **Enhanced Q&A** - Better answers based on document context
- **Improved visualizations** - Context-aware diagram generation
- **Multilingual intelligence** - Document-aware translation and localization
- **Smart fallbacks** - Graceful degradation when MCP is unavailable

**MCP Features:**
- Document selection integration across all features
- Context-aware AI responses
- Enhanced error handling and fallbacks
- Real-time document synchronization

## 🎨 **Features**

### **✅ Simplify Writing**
- Auto-generate starter docs from GitHub repositories
- AI-powered content suggestions with Hugging Face
- Templates and real-time markdown validation
- GitHub repository analysis with file structure understanding

### **✅ Speed Up Reading**
- TL;DR summarization for long documents (500+ characters)
- Q&A search with MCP-enhanced responses
- Visualizations: flow diagrams, API call graphs, changelogs
- Interactive Mermaid.js diagrams

### **✅ Make Maintenance Easy**
- Detect stale documentation (doc drift vs. code)
- Notify users when dependent components change
- Auto-suggest doc updates from diffs or pull requests
- Custom toast notifications with success actions

### **✅ Onboarding**
- Interactive tutorials with auto-start functionality
- Step-by-step guides with contextual help
- Seamless navigation from landing page
- Progress tracking and completion indicators

### **✅ Multilingual**
- Translation with smart content truncation (450+ characters)
- Language detection with confidence scores
- Content localization for different regions
- MCP integration for document-aware translation
- Multiple translation services (Hugging Face, LibreTranslate, MyMemory)

## 🔑 **API Keys Setup**

### **Required (Free)**
- **Hugging Face**: Get free API key at https://huggingface.co/settings/tokens
- **GitHub**: Create personal access token at https://github.com/settings/tokens

### **Optional**
- **Google Translate**: For enhanced multilingual features
- **MCP Server**: For enhanced AI responses (included in project)

## 🐛 **Troubleshooting**

### **Backend Issues**
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Check dependencies
pip install -r requirements.txt

# Check .env file
cat .env

# Test multilingual endpoints
curl -X POST http://localhost:8000/api/multilingual/translate \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello world","source_language":"en","target_language":"es"}'
```

### **Frontend Issues**
```bash
# Check if frontend is running
curl http://localhost:5173

# Reinstall dependencies
npm install

# Clear cache
npm run build

# Check for syntax errors
npm run dev
```

### **MCP Issues**
```bash
# Check MCP server
curl http://localhost:8001/health

# Start MCP server
python mcp_server.py

# Test MCP integration
curl -X POST http://localhost:8001/context \
  -H "Content-Type: application/json" \
  -d '{"query":"test","context_type":"qa"}'
```

### **Translation Issues**
```bash
# Test translation with long content
curl -X POST http://localhost:8000/api/multilingual/translate \
  -H "Content-Type: application/json" \
  -d '{"content":"Your long content here...","source_language":"en","target_language":"es"}'

# Check Hugging Face API key
echo $HUGGINGFACE_API_KEY
```

## 🏆 **Hackathon Ready**

This project is **production-ready** for hackathons with:

- ✅ **Real AI integration** (Hugging Face with smart fallbacks)
- ✅ **GitHub repository analysis** (complete file structure understanding)
- ✅ **Professional APIs** (all free with generous limits)
- ✅ **Complete feature set** (all 5 core requirements implemented)
- ✅ **MCP enhancement** (document-aware AI responses)
- ✅ **Modern UI/UX** (responsive design with Tailwind CSS)
- ✅ **Error handling** (graceful degradation and user feedback)
- ✅ **Content limits** (smart truncation for long content)

## 📚 **Documentation**

- **API Docs**: http://localhost:8000/api/docs
- **Setup Guide**: `README.md` (this file)
- **API Setup**: `FREE_API_SETUP.md`
- **MCP Guide**: `MCP_SETUP.md`
- **Demo Guide**: See Demo Flow section above

## 🚀 **Latest Updates**

### **Recent Improvements:**
- ✅ **Smart Content Truncation**: Handles 450+ character translations
- ✅ **MCP Document Integration**: All features now use saved documents
- ✅ **Enhanced Error Handling**: Better fallbacks and user feedback
- ✅ **Auto-start Tutorial**: Seamless onboarding experience
- ✅ **Custom Toast Notifications**: Professional user feedback
- ✅ **Comprehensive Visualizations**: Flow diagrams, API graphs, changelogs
- ✅ **Maintenance Features**: Stale doc detection, dependency notifications
- ✅ **Multilingual Enhancement**: Document-aware translation with MCP

### **Technical Highlights:**
- **Translation Limits**: Smart handling of 500-character API limits
- **Fallback Systems**: Multiple translation services for reliability
- **Document Awareness**: MCP integration across all features
- **Real-time Updates**: Live document synchronization
- **Error Recovery**: Graceful handling of API failures

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially translation limits)
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**🚀 Ready to revolutionize documentation? Start your servers and begin building!**

**Your SmartDocs platform is now fully equipped with AI, MCP, visualizations, maintenance features, and multilingual support!**
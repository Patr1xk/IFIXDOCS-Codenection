# 🚀 **IFastDocs - Intelligent Documentation Assistant**

> **AI-powered documentation platform that simplifies writing, speeds up reading, and makes maintenance easy**

## 🏆 **Hackathon Information**

### **Track**: Software Track
### **Problem Statement**: Industry Collaboration - Fix the Docs: Smarter, Faster, Maintainable Documentation for the Real World by iFAST

**Challenge Addressed**: IFastDocs tackles the real-world documentation challenges faced by development teams, providing intelligent solutions for creating, maintaining, and accessing documentation efficiently.

## 🎯 **Project Overview**

IFastDocs is a comprehensive documentation platform that addresses real-world documentation challenges:

- ✅ **Simplify Writing** - Auto-generate docs from GitHub repositories with AI
- ✅ **Speed Up Reading** - AI-powered summarization, Q&A, and visualizations
- ✅ **Make Maintenance Easy** - Detect stale docs, notify on changes, auto-suggest updates
- ✅ **Onboarding** - Interactive tutorials with auto-start functionality
- ✅ **Multilingual** - Translation, language detection, and localization with MCP integration

## 🛠 **Tech Stack**

- **Backend**: FastAPI (Python) with comprehensive API routes
- **Frontend**: React + Vite + Tailwind CSS with modern UI components
- **AI**: Hugging Face API with intelligent fallback systems
- **APIs**: GitHub API, LibreTranslate, MyMemory
- **Enhancement**: MCP (Model Context Protocol) for document-aware responses
- **Visualization**: Mermaid.js for flow diagrams, API graphs, and changelogs
- **Code Analysis**: AST parsing for Python, regex for other languages
- **Documentation**: Swagger/OpenAPI parser with JSON/YAML support

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

### **6. Code Parsing & Analysis**
1. Go to "Code Parsing" section
2. Try "Parse Code" with Python/JavaScript snippets
3. Use "Repository Analysis" with GitHub URLs
4. Test "Swagger/OpenAPI Parser" with API specs

### **7. Onboarding**
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
- `POST /api/ai/generate` - Generate content with AI

### **Code Parsing**
- `POST /api/parsing/parse-code` - Parse and analyze code snippets
- `POST /api/parsing/code-analysis` - Analyze GitHub repositories
- `POST /api/parsing/parse-swagger` - Parse OpenAPI/Swagger specs
- `GET /api/parsing/supported-languages` - Get supported programming languages
- `POST /api/parsing/upload-file` - Upload files for analysis

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

This project includes advanced MCP integration for enhanced AI responses:

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
- Code parsing and analysis for multiple programming languages
- Swagger/OpenAPI specification parsing and documentation generation

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


## 🏆 **Production Ready**

This project is **production-ready** for hackathons with:

- ✅ **Real AI integration** 
- ✅ **GitHub repository analysis** 
- ✅ **Professional APIs** 
- ✅ **Complete feature set** 
- ✅ **MCP enhancement** 
- ✅ **Modern UI/UX** 
- ✅ **Error handling** 
- ✅ **Content limits** 

## 📚 **Documentation**

- **API Docs**: http://localhost:8000/api/docs
- **Setup Guide**: `README.md` (this file)

### **Technical Highlights:**
- **Translation Limits**: Smart handling of 500-character API limits
- **Fallback Systems**: Multiple translation services for reliability
- **Document Awareness**: MCP integration across all features
- **Real-time Updates**: Live document synchronization
- **Error Recovery**: Graceful handling of API failures

## 📄 **License**

This project is licensed under the MIT License.

---

**🚀 Ready to revolutionize documentation? Start your servers and begin building!**


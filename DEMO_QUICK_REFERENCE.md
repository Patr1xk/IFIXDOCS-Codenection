# ⚡ **SmartDocs Quick Reference**

## 🚀 **Start Commands**

### **Backend:**
```bash
cd backend
uvicorn mcp_server:app --reload
```

### **Frontend:**
```bash
cd frontend
npm run dev
```

### **MCP Server (Optional):**
```bash
cd backend
python mcp_server.py
```

---

## 🌐 **Access Points**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs
- **MCP Server**: http://localhost:8001

---

## 🎯 **Demo URLs**

### **Test GitHub Repos:**
- `https://github.com/pallets/flask`
- `https://github.com/fastapi/fastapi`
- `https://github.com/facebook/react`

### **Test Content (500+ chars):**
```
Flask is a lightweight WSGI web application framework. It is designed to make getting started quick and easy, with the ability to scale up to complex applications. It began as a simple wrapper around Werkzeug and Jinja and has become one of the most popular Python web application frameworks. Flask offers suggestions, but doesn't enforce any dependencies or project layout. It is up to the developer to choose the tools and libraries they want to use. There are many extensions provided by the community that make adding new functionality easy.
```

---

## 🔧 **API Endpoints**

### **Core:**
- `GET /api/health` - Health check
- `GET /api/docs/` - List documents

### **AI:**
- `POST /api/ai/generate-from-github` - Generate from GitHub
- `POST /api/ai/summarize` - Summarize content
- `POST /api/ai/qa` - Q&A with MCP

### **Visualizations:**
- `POST /api/visualizations/flow-diagram` - Flow diagrams
- `POST /api/visualizations/api-graph` - API graphs
- `POST /api/visualizations/changelog` - Changelogs

### **Multilingual:**
- `POST /api/multilingual/translate` - Translate (450+ chars)
- `POST /api/multilingual/detect` - Detect language
- `POST /api/multilingual/localize` - Localize content

### **Maintenance:**
- `POST /api/maintenance/drift` - Detect stale docs
- `POST /api/maintenance/dependency-changes` - Check dependencies

---

## 🎭 **Demo Flow**

### **1. GitHub Integration (2 min)**
1. Go to "Write Documentation"
2. Paste: `https://github.com/pallets/flask`
3. Select "Web Framework"
4. Click "Generate from GitHub"
5. Show AI-generated docs

### **2. AI Features (2 min)**
1. Go to "AI Features"
2. Summarize long text (500+ chars)
3. Ask Q&A: "How does Flask handle routing?"
4. Show MCP-enhanced responses

### **3. Visualizations (2 min)**
1. Go to "Visualizations"
2. Select Flask docs from dropdown
3. Generate Flow Diagram
4. Generate API Call Graph
5. Show interactive Mermaid diagrams

### **4. Maintenance (2 min)**
1. Go to "Make Maintenance Easy"
2. Click "Detect Stale Documentation"
3. Show detected stale docs
4. Click success button (✓)
5. Show dependency notifications

### **5. Multilingual (1.5 min)**
1. Go to "Multilingual"
2. Select Flask docs from dropdown
3. Translate to Spanish (450+ chars)
4. Show smart truncation
5. Demonstrate language detection

### **6. Onboarding (30 sec)**
1. Go to landing page (/)
2. Click "Get Started"
3. Show auto-start tutorial

---

## 🔑 **Key Features**

### **✅ Simplify Writing**
- GitHub repository analysis
- AI-powered documentation generation
- Real-time markdown validation
- Professional templates

### **✅ Speed Up Reading**
- TL;DR summarization (500+ chars)
- MCP-enhanced Q&A
- Interactive visualizations
- Document-aware responses

### **✅ Make Maintenance Easy**
- Stale documentation detection
- Dependency change notifications
- Auto-suggest updates
- Custom toast notifications

### **✅ Onboarding**
- Auto-start tutorials
- Interactive guides
- Seamless navigation
- Progress tracking

### **✅ Multilingual**
- Smart translation (450+ chars)
- Language detection
- Content localization
- MCP document integration

---

## 🛠 **Tech Stack**

- **Backend**: FastAPI (Python)
- **Frontend**: React + Vite + Tailwind CSS
- **AI**: Hugging Face API (Free)
- **APIs**: GitHub, LibreTranslate, MyMemory
- **Enhancement**: MCP (Model Context Protocol)
- **Visualization**: Mermaid.js

---

## 🚨 **Troubleshooting**

### **Backend Issues:**
```bash
# Check health
curl http://localhost:8000/api/health

# Check dependencies
pip install -r requirements.txt

# Check .env
cat .env
```

### **Frontend Issues:**
```bash
# Reinstall dependencies
npm install

# Clear cache
npm run build
```

### **Translation Issues:**
```bash
# Test translation
curl -X POST http://localhost:8000/api/multilingual/translate \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello world","source_language":"en","target_language":"es"}'
```

---

## 🏆 **Success Metrics**

- ✅ **5/5 Core Requirements**: All implemented
- ✅ **100% Free APIs**: No costs
- ✅ **Real AI Integration**: Hugging Face + MCP
- ✅ **Production Ready**: Enterprise reliability
- ✅ **Modern Tech Stack**: FastAPI + React

---

## 🎯 **Demo Script**

### **Opening:**
"Welcome to SmartDocs - an AI-powered documentation platform that solves real-world documentation challenges with production-ready features."

### **Closing:**
"This is SmartDocs - a production-ready documentation platform using real AI, real GitHub integration, and real APIs. Every feature works with actual data, every API call is real, and every response is generated by AI."

---

## 🚀 **You're Ready!**

**Your SmartDocs platform is:**
- ✅ **Fully functional** (all features working)
- ✅ **Production ready** (enterprise-grade)
- ✅ **Hackathon winning** (comprehensive solution)
- ✅ **Technically impressive** (real AI integration)
- ✅ **Business valuable** (solves real problems)

**Go win that hackathon! 🏆**
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Github, Download, Save, Loader2, CheckCircle, AlertCircle, Sparkles, Eye, EyeOff, Wand2, BrainCircuit, CheckSquare, AlertTriangle, Lightbulb, Check, X } from 'lucide-react';

const WriteDocs = () => {
  const [activeTab, setActiveTab] = useState('write');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // GitHub generation form
  const [githubForm, setGithubForm] = useState({
    githubUrl: '',
    projectType: 'api',
    includeExamples: true,
    language: 'en'
  });

  // Document editor state
  const [documentContent, setDocumentContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('readme');
  const [showPreview, setShowPreview] = useState(false);

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState('api');

  // New AI Assistant Features
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [markdownErrors, setMarkdownErrors] = useState([]);
  const [grammarErrors, setGrammarErrors] = useState([]);
  const [aiWritingMode, setAiWritingMode] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Spell check states
  const [spellCheckErrors, setSpellCheckErrors] = useState([]);
  const [hoveredError, setHoveredError] = useState(null);
  const [showSpellCheckSuggestions, setShowSpellCheckSuggestions] = useState(false);
  
  // Word prediction states
  const [wordPredictions, setWordPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [predictionIndex, setPredictionIndex] = useState(0);
  
  // Refs for editor functionality
  const textareaRef = useRef(null);
  const aiSuggestionsRef = useRef(null);

  const handleGenerateFromGithub = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert camelCase to snake_case for backend compatibility
      const backendData = {
        github_url: githubForm.githubUrl,
        project_type: githubForm.projectType,
        include_examples: githubForm.includeExamples,
        language: githubForm.language
      };
      
      console.log('Sending request to backend:', backendData);
      
      const response = await fetch('http://localhost:8000/api/ai/generate-from-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Failed to generate documentation: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Combine all generated content into one document
      let combinedContent = '';
      
      if (data.readme) {
        combinedContent += `# README.md\n\n${data.readme}\n\n`;
      }
      
      if (data.api_docs) {
        combinedContent += `# API Documentation\n\n${data.api_docs}\n\n`;
      }
      
      if (data.setup_guide) {
        combinedContent += `# Setup Guide\n\n${data.setup_guide}\n\n`;
      }

      // Set the generated content in the editor
      setDocumentContent(combinedContent);
      setDocumentTitle(`${githubForm.githubUrl.split('/').pop()} Documentation`);
      setSuccess('Documentation generated successfully from GitHub!');
      
      // Switch to write tab to show the editor
      setActiveTab('write');
      
    } catch (err) {
      console.error('Error details:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Cannot connect to backend server. Please make sure the backend is running on http://localhost:8000');
      } else {
      setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!documentTitle.trim() || !documentContent.trim()) {
      setError('Please provide both title and content');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/docs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: documentTitle,
          content: documentContent,
          content_type: documentType,
          tags: ['generated', 'github']
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      setSuccess('Document saved successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownloadDocument = () => {
    const element = document.createElement('a');
    const file = new Blob([documentContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${documentTitle || 'documentation'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // AI Writing Assistant Functions
  const generateAiSuggestions = async (content, context = '') => {
    try {
      const response = await fetch('http://localhost:8000/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content + '\n\nContext: ' + context,
          target_length: 'short'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const suggestions = [
          "Consider adding code examples here",
          "This section could benefit from a table of contents",
          "Add installation instructions for better clarity",
          "Consider including troubleshooting section",
          "Add links to related documentation"
        ];
        setAiSuggestions(suggestions);
      }
    } catch (err) {
      console.error('AI suggestions error:', err);
    }
  };

  const validateMarkdown = (content) => {
    const errors = [];
    const lines = content.split('\n');
    let inCodeBlock = false;
    
    lines.forEach((line, index) => {
      // Check for unmatched brackets
      const openBrackets = (line.match(/\[/g) || []).length;
      const closeBrackets = (line.match(/\]/g) || []).length;
      if (openBrackets !== closeBrackets) {
        errors.push({
          line: index + 1,
          type: 'warning',
          message: 'Unmatched brackets in markdown link'
        });
      }
      
      // Check for code blocks
      if (line.trim().startsWith('```')) {
        const codeBlockMatch = line.trim().match(/^```(\w*)$/);
        
        if (codeBlockMatch) {
          if (codeBlockMatch[1] === '') {
            // This is a closing code block (just ```)
            if (inCodeBlock) {
              inCodeBlock = false;
            } else {
              // Unexpected closing block
              errors.push({
                line: index + 1,
                type: 'error',
                message: 'Unexpected closing code block'
              });
            }
          } else {
            // This is an opening code block with language
            if (inCodeBlock) {
              errors.push({
                line: index + 1,
                type: 'error',
                message: 'Nested code blocks are not allowed'
              });
            } else {
              inCodeBlock = true;
            }
          }
        } else {
          // This is an opening code block without language (like ``` with extra spaces or content)
          if (!inCodeBlock) {
            errors.push({
              line: index + 1,
              type: 'error',
              message: 'Code block missing language specification'
            });
          }
        }
      }
      
      // Check for missing alt text in images
      if (line.includes('![](') || line.match(/!\[\]\(/)) {
        errors.push({
          line: index + 1,
          type: 'warning',
          message: 'Image missing alt text for accessibility'
        });
      }
    });
    
    setMarkdownErrors(errors);
  };

  const insertTemplateAtCursor = (template) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = documentContent;
    
    const templates = {
      'code-block': '```javascript\n// Your code here\n```\n',
      'table': '| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data 1   | Data 2   | Data 3   |\n',
      'warning': '> ⚠️ **Warning**: Important information here\n',
      'info': '> ℹ️ **Info**: Additional information here\n',
      'api-endpoint': '### `GET /api/endpoint`\n\n**Description**: Brief description\n\n**Parameters**:\n- `param1` (string): Description\n\n**Response**:\n```json\n{\n  "data": "example"\n}\n```\n',
      'installation': '## Installation\n\n```bash\nnpm install package-name\n```\n\n```bash\nyarn add package-name\n```\n'
    };
    
    const templateContent = templates[template] || template;
    const newContent = currentContent.substring(0, start) + templateContent + currentContent.substring(end);
    
    setDocumentContent(newContent);
    
    // Move cursor to end of inserted template
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + templateContent.length, start + templateContent.length);
    }, 0);
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setDocumentContent(newContent);
    setCursorPosition(e.target.selectionStart);
    
    // Real-time validation
    validateMarkdown(newContent);
    
    // Real-time grammar checking
    checkGrammar(newContent);
    
    // Real-time spell checking
    checkSpelling(newContent);
    
    // Real-time word prediction
    checkWordPrediction(newContent);
    
    // Generate AI suggestions periodically
    if (newContent.length > 50 && newContent.length % 100 === 0) {
      generateAiSuggestions(newContent, documentTitle);
    }
  };

  const handleKeyDown = (e) => {
    // Handle Tab key for word prediction
    if (e.key === 'Tab' && showPredictions && wordPredictions.length > 0) {
      e.preventDefault();
      applyPrediction(wordPredictions[predictionIndex]);
    }
    
    // Handle arrow keys for prediction navigation
    if (showPredictions && wordPredictions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPredictionIndex((prev) => (prev + 1) % wordPredictions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setPredictionIndex((prev) => (prev - 1 + wordPredictions.length) % wordPredictions.length);
      }
    }
  };

  const enhanceWithAI = async () => {
    if (!documentContent.trim()) {
      setError('Please add some content first');
      return;
    }
    
    setAiWritingMode(true);
    setError(null);
    try {
      // Create enhanced prompt for better content generation
      const enhancementPrompt = `Please enhance this documentation content to make it more comprehensive, professional, and useful. Add sections, examples, and improve structure while keeping the original intent:

${documentContent}

Please provide an enhanced version with:
- Better structure and headings
- More detailed explanations
- Code examples where appropriate
- Installation/usage instructions
- Professional formatting`;

      const response = await fetch('http://localhost:8000/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: documentContent,
          target_length: 'long'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const enhancedContent = data.summary || documentContent;
        
        // Actually update the document content
        setDocumentContent(enhancedContent);
        setSuccess('Content enhanced with AI!');
        setCurrentSuggestion('Content has been enhanced successfully');
      } else {
        throw new Error('AI service returned an error');
      }
    } catch (err) {
      console.error('AI Enhancement Error:', err);
      setError('AI enhancement failed. Please try again.');
    } finally {
      setAiWritingMode(false);
    }
  };

  // Real-time markdown validation
  useEffect(() => {
    validateMarkdown(documentContent);
  }, [documentContent]);

  // Grammar checking function
  const checkGrammar = (content) => {
    const grammarErrors = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Skip code blocks and headers
      if (line.trim().startsWith('```') || line.trim().startsWith('#')) {
        return;
      }
      
      // Check for common grammar issues
      const issues = [];
      
      // Check for double spaces
      if (line.includes('  ')) {
        issues.push('Double spaces detected');
      }
      
      // Check for missing periods at end of sentences
      if (line.trim() && !line.trim().endsWith('.') && !line.trim().endsWith('!') && !line.trim().endsWith('?') && !line.trim().endsWith(':') && !line.trim().startsWith('-') && !line.trim().startsWith('*')) {
        issues.push('Missing punctuation at end of sentence');
      }
      
      // Check for capitalization after periods
      const sentences = line.split('. ');
      for (let i = 1; i < sentences.length; i++) {
        if (sentences[i] && sentences[i][0] && sentences[i][0] === sentences[i][0].toLowerCase()) {
          issues.push('Sentence should start with capital letter');
          break;
        }
      }
      
      // Check for common typos
      const commonTypos = {
        'teh': 'the',
        'recieve': 'receive',
        'seperate': 'separate',
        'occured': 'occurred',
        'begining': 'beginning',
        'enviroment': 'environment',
        'definately': 'definitely',
        'accomodate': 'accommodate',
        'calender': 'calendar',
        'collegue': 'colleague'
      };
      
      Object.entries(commonTypos).forEach(([typo, correct]) => {
        if (line.toLowerCase().includes(typo)) {
          issues.push(`Typo: "${typo}" should be "${correct}"`);
        }
      });
      
      if (issues.length > 0) {
        grammarErrors.push({
          line: index + 1,
          issues: issues,
          type: 'grammar'
        });
      }
    });
    
    setGrammarErrors(grammarErrors);
  };

  // Spell checking function using Language Tool API
  const checkSpelling = async (content) => {
    if (!content.trim()) {
      setSpellCheckErrors([]);
      return;
    }

    try {
      // Using Language Tool API (free and open source)
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: content,
          language: 'en-US',
          enabledOnly: 'false'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const errors = data.matches.map(match => ({
          message: match.message,
          shortMessage: match.shortMessage,
          replacements: match.replacements,
          offset: match.offset,
          length: match.errorLength,
          context: match.context,
          line: content.substring(0, match.offset).split('\n').length,
          type: 'spell'
        }));
        setSpellCheckErrors(errors);
      } else {
        // Fallback to basic spell check if API fails
        basicSpellCheck(content);
      }
    } catch (error) {
      console.log('Language Tool API not available, using basic spell check');
      basicSpellCheck(content);
    }
  };

  // Basic spell check fallback
  const basicSpellCheck = (content) => {
    const commonWords = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
      'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
      'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
      'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
      'give', 'day', 'most', 'us', 'hello', 'world', 'test', 'example', 'documentation', 'api', 'function', 'method', 'class', 'object', 'string',
      'number', 'boolean', 'array', 'object', 'null', 'undefined', 'true', 'false', 'if', 'else', 'for', 'while', 'return', 'const', 'let', 'var',
      'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'extends', 'implements', 'interface',
      'type', 'enum', 'namespace', 'module', 'package', 'public', 'private', 'protected', 'static', 'abstract', 'final', 'virtual', 'override',
      'constructor', 'destructor', 'getter', 'setter', 'property', 'attribute', 'parameter', 'argument', 'variable', 'constant', 'function',
      'procedure', 'routine', 'subroutine', 'method', 'algorithm', 'logic', 'data', 'structure', 'database', 'table', 'record', 'field',
      'column', 'row', 'index', 'key', 'value', 'pair', 'tuple', 'list', 'stack', 'queue', 'tree', 'graph', 'node', 'edge', 'vertex', 'path',
      'route', 'endpoint', 'url', 'uri', 'http', 'https', 'get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'request', 'response',
      'header', 'body', 'status', 'code', 'error', 'success', 'redirect', 'cache', 'session', 'cookie', 'token', 'auth', 'authentication',
      'authorization', 'permission', 'role', 'user', 'admin', 'guest', 'anonymous', 'public', 'private', 'secure', 'encrypt', 'decrypt',
      'hash', 'salt', 'password', 'username', 'email', 'phone', 'address', 'name', 'title', 'description', 'content', 'text', 'html',
      'css', 'javascript', 'typescript', 'python', 'java', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r', 'matlab',
      'sql', 'nosql', 'mongodb', 'redis', 'mysql', 'postgresql', 'sqlite', 'oracle', 'microsoft', 'google', 'amazon', 'facebook', 'apple',
      'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'heroku', 'netlify', 'vercel', 'firebase', 'supabase'
    ];

    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const errors = [];
    
    words.forEach((word, index) => {
      if (word.length > 2 && !commonWords.includes(word.toLowerCase())) {
        // Simple suggestion: try common misspellings
        const suggestions = [];
        if (word.includes('ie') && !word.includes('ei')) {
          suggestions.push(word.replace('ie', 'ei'));
        }
        if (word.includes('ei') && !word.includes('ie')) {
          suggestions.push(word.replace('ei', 'ie'));
        }
        if (word.endsWith('ing')) {
          suggestions.push(word.slice(0, -3));
          suggestions.push(word.slice(0, -3) + 'e');
        }
        
        errors.push({
          message: `"${word}" might be misspelled`,
          shortMessage: 'Spelling',
          replacements: suggestions.map(s => ({ value: s })),
          offset: content.toLowerCase().indexOf(word),
          length: word.length,
          context: { text: content, offset: content.toLowerCase().indexOf(word) },
          line: content.substring(0, content.toLowerCase().indexOf(word)).split('\n').length,
          type: 'spell'
        });
      }
    });
    
    setSpellCheckErrors(errors);
  };

  // Apply spell check correction
  const applyCorrection = (error, replacement) => {
    const before = documentContent.substring(0, error.offset);
    const after = documentContent.substring(error.offset + error.length);
    const newContent = before + replacement + after;
    setDocumentContent(newContent);
    setSpellCheckErrors(spellCheckErrors.filter(e => e !== error));
  };

  // Ignore spell check error
  const ignoreError = (error) => {
    setSpellCheckErrors(spellCheckErrors.filter(e => e !== error));
  };

  // Word prediction function
  const checkWordPrediction = (content) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const beforeCursor = content.substring(0, cursorPos);
    const words = beforeCursor.split(/\s+/);
    const currentWord = words[words.length - 1] || '';
    
    // Only predict if current word is 2+ characters and not at end of line
    if (currentWord.length >= 2 && !currentWord.endsWith('\n')) {
      const predictions = getWordPredictions(currentWord);
      if (predictions.length > 0) {
        setWordPredictions(predictions);
        setCurrentWord(currentWord);
        setShowPredictions(true);
        setPredictionIndex(0);
        return;
      }
    }
    
    setShowPredictions(false);
    setWordPredictions([]);
  };

  // Get word predictions based on current input
  const getWordPredictions = (input) => {
    const commonWords = [
      'hello', 'world', 'test', 'example', 'function', 'method', 'class', 'object', 'string', 'number',
      'boolean', 'array', 'null', 'undefined', 'true', 'false', 'if', 'else', 'for', 'while', 'return',
      'const', 'let', 'var', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'finally',
      'throw', 'new', 'this', 'super', 'extends', 'implements', 'interface', 'type', 'enum', 'namespace',
      'module', 'package', 'public', 'private', 'protected', 'static', 'abstract', 'final', 'virtual',
      'override', 'constructor', 'destructor', 'getter', 'setter', 'property', 'attribute', 'parameter',
      'argument', 'variable', 'constant', 'procedure', 'routine', 'subroutine', 'algorithm', 'logic',
      'data', 'structure', 'database', 'table', 'record', 'field', 'column', 'row', 'index', 'key',
      'value', 'pair', 'tuple', 'list', 'stack', 'queue', 'tree', 'graph', 'node', 'edge', 'vertex',
      'path', 'route', 'endpoint', 'url', 'uri', 'http', 'https', 'get', 'post', 'put', 'delete',
      'patch', 'head', 'options', 'request', 'response', 'header', 'body', 'status', 'code',
      'error', 'success', 'redirect', 'cache', 'session', 'cookie', 'token', 'auth', 'authentication',
      'authorization', 'permission', 'role', 'user', 'admin', 'guest', 'anonymous', 'secure', 'encrypt',
      'decrypt', 'hash', 'salt', 'password', 'username', 'email', 'phone', 'address', 'name', 'title',
      'description', 'content', 'text', 'html', 'css', 'javascript', 'typescript', 'python', 'java',
      'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'nosql',
      'mongodb', 'redis', 'mysql', 'postgresql', 'sqlite', 'oracle', 'microsoft', 'google', 'amazon',
      'facebook', 'apple', 'github', 'gitlab', 'bitbucket', 'docker', 'kubernetes', 'aws', 'azure',
      'gcp', 'heroku', 'netlify', 'vercel', 'firebase', 'supabase', 'documentation', 'api', 'readme',
      'installation', 'setup', 'configuration', 'environment', 'development', 'production', 'testing',
      'deployment', 'version', 'release', 'update', 'upgrade', 'downgrade', 'rollback', 'backup',
      'restore', 'migration', 'schema', 'model', 'view', 'controller', 'service', 'repository',
      'factory', 'singleton', 'observer', 'decorator', 'adapter', 'facade', 'proxy', 'command',
      'strategy', 'template', 'state', 'memento', 'visitor', 'iterator', 'mediator', 'chain',
      'bridge', 'composite', 'flyweight', 'interpreter', 'prototype', 'builder', 'abstract',
      'concrete', 'implementation', 'interface', 'inheritance', 'polymorphism', 'encapsulation',
      'abstraction', 'overloading', 'overriding', 'virtual', 'abstract', 'sealed', 'static',
      'dynamic', 'strong', 'weak', 'type', 'typed', 'untyped', 'strict', 'loose', 'lazy',
      'eager', 'synchronous', 'asynchronous', 'parallel', 'concurrent', 'sequential', 'recursive',
      'iterative', 'functional', 'procedural', 'object', 'oriented', 'declarative', 'imperative',
      'reactive', 'event', 'driven', 'message', 'queue', 'stream', 'batch', 'real', 'time',
      'offline', 'online', 'local', 'remote', 'client', 'server', 'peer', 'distributed',
      'centralized', 'decentralized', 'microservice', 'monolith', 'serverless', 'container',
      'virtualization', 'cloud', 'edge', 'fog', 'mesh', 'grid', 'cluster', 'load', 'balancer',
      'proxy', 'gateway', 'firewall', 'vpn', 'ssl', 'tls', 'https', 'http', 'ftp', 'sftp',
      'ssh', 'telnet', 'dns', 'dhcp', 'tcp', 'udp', 'ip', 'mac', 'ethernet', 'wifi', 'bluetooth',
      'cellular', 'satellite', 'fiber', 'copper', 'wireless', 'wired', 'analog', 'digital',
      'binary', 'hexadecimal', 'octal', 'decimal', 'floating', 'point', 'integer', 'string',
      'character', 'boolean', 'array', 'object', 'null', 'undefined', 'symbol', 'bigint',
      'date', 'time', 'datetime', 'timestamp', 'duration', 'interval', 'period', 'frequency',
      'rate', 'speed', 'velocity', 'acceleration', 'distance', 'length', 'width', 'height',
      'depth', 'area', 'volume', 'mass', 'weight', 'density', 'pressure', 'temperature',
      'humidity', 'brightness', 'contrast', 'saturation', 'hue', 'color', 'pixel', 'resolution',
      'bitmap', 'vector', 'raster', 'compression', 'encoding', 'decoding', 'encryption',
      'decryption', 'hashing', 'salting', 'signing', 'verification', 'validation', 'sanitization',
      'escaping', 'encoding', 'decoding', 'serialization', 'deserialization', 'marshalling',
      'unmarshalling', 'parsing', 'tokenizing', 'lexing', 'parsing', 'compiling', 'interpreting',
      'executing', 'running', 'debugging', 'profiling', 'monitoring', 'logging', 'tracing',
      'auditing', 'analytics', 'metrics', 'statistics', 'reporting', 'dashboard', 'visualization',
      'chart', 'graph', 'table', 'form', 'input', 'output', 'display', 'render', 'paint',
      'draw', 'animate', 'transition', 'transform', 'scale', 'rotate', 'translate', 'skew',
      'perspective', 'projection', 'mapping', 'filtering', 'sorting', 'searching', 'indexing',
      'caching', 'buffering', 'queuing', 'stacking', 'pushing', 'popping', 'enqueueing',
      'dequeueing', 'inserting', 'deleting', 'updating', 'merging', 'splitting', 'joining',
      'concatenating', 'appending', 'prepending', 'replacing', 'substituting', 'swapping',
      'exchanging', 'transferring', 'copying', 'cloning', 'duplicating', 'replicating',
      'mirroring', 'backing', 'up', 'restoring', 'recovering', 'resetting', 'clearing',
      'flushing', 'draining', 'emptying', 'filling', 'loading', 'unloading', 'mounting',
      'unmounting', 'attaching', 'detaching', 'connecting', 'disconnecting', 'binding',
      'unbinding', 'registering', 'unregistering', 'subscribing', 'unsubscribing', 'publishing',
      'consuming', 'producing', 'generating', 'creating', 'destroying', 'constructing',
      'destructing', 'initializing', 'finalizing', 'starting', 'stopping', 'pausing',
      'resuming', 'suspending', 'resuming', 'canceling', 'aborting', 'terminating',
      'killing', 'restarting', 'reloading', 'refreshing', 'updating', 'upgrading',
      'downgrading', 'rolling', 'back', 'forward', 'backward', 'left', 'right', 'up',
      'down', 'north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast',
      'southwest', 'center', 'middle', 'top', 'bottom', 'front', 'back', 'side',
      'corner', 'edge', 'border', 'margin', 'padding', 'spacing', 'gap', 'distance',
      'proximity', 'adjacent', 'neighboring', 'surrounding', 'enclosing', 'containing',
      'including', 'excluding', 'adding', 'removing', 'inserting', 'deleting',
      'appending', 'prepending', 'replacing', 'substituting', 'swapping', 'exchanging'
    ];

    return commonWords.filter(word => 
      word.toLowerCase().startsWith(input.toLowerCase()) && 
      word.toLowerCase() !== input.toLowerCase()
    ).slice(0, 5);
  };

  // Apply word prediction
  const applyPrediction = (prediction) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const beforeCursor = documentContent.substring(0, cursorPos);
    const afterCursor = documentContent.substring(cursorPos);
    
    // Find the last word before cursor
    const words = beforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1] || '';
    const beforeLastWord = beforeCursor.substring(0, beforeCursor.length - lastWord.length);
    
    const newContent = beforeLastWord + prediction + ' ' + afterCursor;
    setDocumentContent(newContent);
    
    // Set cursor position after the predicted word
    const newCursorPos = beforeLastWord.length + prediction.length + 1;
    setTimeout(() => {
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
    
    setShowPredictions(false);
    setWordPredictions([]);
  };

  const templates = [
    { id: 'api', name: 'API Documentation', icon: '🔌' },
    { id: 'readme', name: 'README', icon: '📖' },
    { id: 'tutorial', name: 'Tutorial', icon: '🎓' },
    { id: 'user-guide', name: 'User Guide', icon: '📚' },
    { id: 'changelog', name: 'Changelog', icon: '📝' }
  ];

  const tabs = [
    { id: 'github', label: 'Generate from GitHub', icon: Github },
    { id: 'write', label: 'Write & Edit', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Sparkles }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
            <FileText className="w-6 h-6 text-white" />
        </div>
          <h1 className="text-3xl font-bold text-secondary-900">Write Documentation</h1>
        </div>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Generate starter docs from GitHub repositories or write documentation from scratch with AI assistance
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-2 shadow-sm border border-secondary-200">
          {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
        </div>
        </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'github' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Generate from GitHub</h2>
              <p className="text-secondary-600">Paste a GitHub repository URL to automatically generate starter documentation</p>
            </div>

            <form onSubmit={handleGenerateFromGithub} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                GitHub Repository URL
              </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="url"
                    value={githubForm.githubUrl}
                    onChange={(e) => setGithubForm({...githubForm, githubUrl: e.target.value})}
                  placeholder="https://github.com/username/repository"
                    className="w-full pl-10 pr-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    required
                  />
              </div>
                <p className="text-sm text-secondary-500 mt-1">
                  Paste a GitHub repository URL to generate starter documentation
                </p>
            </div>
            
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={githubForm.projectType}
                    onChange={(e) => setGithubForm({...githubForm, projectType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="api">API/Backend</option>
                    <option value="frontend">Frontend</option>
                    <option value="fullstack">Full Stack</option>
                    <option value="library">Library/Package</option>
                    <option value="cli">CLI Tool</option>
                  </select>
                      </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Language
                  </label>
                  <select
                    value={githubForm.language}
                    onChange={(e) => setGithubForm({...githubForm, language: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="ms">Bahasa Melayu</option>
                    <option value="ta">தமிழ்</option>
                  </select>
          </div>

                <div className="flex items-center">
              <input
                    type="checkbox"
                    id="includeExamples"
                    checked={githubForm.includeExamples}
                    onChange={(e) => setGithubForm({...githubForm, includeExamples: e.target.checked})}
                    className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="includeExamples" className="ml-2 text-sm text-secondary-700">
                    Include Examples
              </label>
                </div>
            </div>
            
                      <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating Documentation...
                    </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Github className="w-5 h-5 mr-2" />
                    Generate from GitHub
              </div>
            )}
              </button>
            </form>

            {/* Success/Error Messages */}
            {success && (
              <div className="mt-6 p-4 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                  <span className="text-success-800">{success}</span>
            </div>
          </div>
        )}

            {error && (
              <div className="mt-6 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
            </div>
          </div>
        )}
      </div>
        )}

        {activeTab === 'write' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Editor */}
            <div className="xl:col-span-3 bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">Document Editor</h2>
              <div className="flex gap-3">
                  <button
                    onClick={enhanceWithAI}
                    disabled={aiWritingMode}
                    className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {aiWritingMode ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                    AI Enhance
                  </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg transition-colors"
                >
                  {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                <button
                  onClick={handleSaveDocument}
                  className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
              </button>
              <button 
                  onClick={handleDownloadDocument}
                  className="flex items-center px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors"
              >
                  <Download className="w-4 h-4 mr-2" />
                  Download
              </button>
            </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="readme">README</option>
                  <option value="api">API Documentation</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="user-guide">User Guide</option>
                  <option value="changelog">Changelog</option>
                </select>
              </div>
            </div>

            {showPreview ? (
              <div className="bg-gray-50 p-6 rounded-xl border border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Preview</h3>
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: documentContent.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Document Content (Markdown)
              </label>
                <div className="relative">
              <textarea
                    ref={textareaRef}
                value={documentContent}
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                  placeholder="Write your documentation here... Use Markdown syntax for formatting."
                    className="w-full h-96 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 font-mono text-sm resize-none relative z-10"
                    style={{ background: 'transparent' }}
                  />
                  
                  {/* Spell check overlay with red squiggly lines */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      padding: '16px 12px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word'
                    }}
                  >
                    {spellCheckErrors.map((error, index) => {
                      const beforeText = documentContent.substring(0, error.offset);
                      const errorText = documentContent.substring(error.offset, error.offset + error.length);
                      const afterText = documentContent.substring(error.offset + error.length);
                      
                      const beforeLines = beforeText.split('\n');
                      const errorLines = errorText.split('\n');
                      
                      return (
                        <div key={index} className="relative">
                          {beforeLines.map((line, lineIndex) => (
                            <div key={`before-${lineIndex}`} className="text-transparent">
                              {line}
                              {lineIndex < beforeLines.length - 1 && '\n'}
                            </div>
                          ))}
                          <div 
                            className="relative inline-block"
                            onMouseEnter={() => setHoveredError(error)}
                            onMouseLeave={() => setHoveredError(null)}
                          >
                            <span 
                              className="text-red-600"
                              style={{
                                textDecoration: 'underline wavy red',
                                textDecorationSkipInk: 'none'
                              }}
                            >
                              {errorText}
                            </span>
                            
                            {/* Hover tooltip with suggestions */}
                            {hoveredError === error && (
                              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50 min-w-48 pointer-events-auto">
                                <div className="text-xs text-gray-600 mb-2">{error.message}</div>
                                <div className="space-y-1">
                                  {error.replacements.slice(0, 3).map((replacement, repIndex) => (
                                    <button
                                      key={repIndex}
                                      onClick={() => applyCorrection(error, replacement.value)}
                                      className="w-full text-left px-2 py-1 text-sm hover:bg-blue-50 rounded flex items-center justify-between"
                                    >
                                      <span>{replacement.value}</span>
                                      <Check className="w-3 h-3 text-green-600" />
                                    </button>
                                  ))}
                                  <button
                                    onClick={() => ignoreError(error)}
                                    className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded flex items-center justify-between text-gray-500"
                                  >
                                    <span>Ignore</span>
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          {afterText && (
                            <span className="text-transparent">{afterText}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {currentSuggestion && (
                    <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-xs max-w-xs z-30">
                      💡 AI: {currentSuggestion}
                    </div>
                  )}
                  
                  {/* Word Prediction Dropdown */}
                  {showPredictions && wordPredictions.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-48">
                      <div className="text-xs text-gray-600 px-3 py-2 border-b">
                        Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Tab</kbd> to accept
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {wordPredictions.map((prediction, index) => (
                          <button
                            key={index}
                            onClick={() => applyPrediction(prediction)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between ${
                              index === predictionIndex ? 'bg-blue-50' : ''
                            }`}
                          >
                            <span className="flex items-center">
                              <span className="text-gray-400 mr-2">{currentWord}</span>
                              <span className="text-blue-600">{prediction.substring(currentWord.length)}</span>
                            </span>
                            {index === predictionIndex && (
                              <span className="text-xs text-gray-500">Tab</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Markdown Validation */}
                {markdownErrors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {markdownErrors.slice(0, 3).map((error, index) => (
                      <div key={index} className={`flex items-center text-xs ${error.type === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {error.type === 'error' ? <AlertTriangle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                        Line {error.line}: {error.message}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-secondary-500">
                  Supports Markdown syntax: **bold**, *italic*, `code`, [links](url), etc.
                </p>
                  <div className="flex items-center text-xs text-secondary-400">
                    <CheckSquare className="w-3 h-3 mr-1" />
                    {markdownErrors.length === 0 ? 'Valid Markdown' : `${markdownErrors.length} issues`}
                  </div>
                </div>
            </div>
            )}

            {/* Success/Error Messages */}
            {success && (
              <div className="mt-6 p-4 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                  <span className="text-success-800">{success}</span>
          </div>
        </div>
      )}

            {error && (
              <div className="mt-6 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
                </div>
              </div>
            )}
            </div>

            {/* AI Assistant Panel */}
            <div className="xl:col-span-1 space-y-4">
              {/* Quick Templates */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
                <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Quick Templates
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'code-block', name: 'Code Block', icon: '💻' },
                    { id: 'table', name: 'Table', icon: '📊' },
                    { id: 'warning', name: 'Warning Box', icon: '⚠️' },
                    { id: 'info', name: 'Info Box', icon: 'ℹ️' },
                    { id: 'api-endpoint', name: 'API Endpoint', icon: '🔌' },
                    { id: 'installation', name: 'Installation', icon: '📦' }
                  ].map((template) => (
                    <button
                      key={template.id}
                      onClick={() => insertTemplateAtCursor(template.id)}
                      className="w-full text-left px-3 py-2 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors text-sm flex items-center"
                    >
                      <span className="mr-2">{template.icon}</span>
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Suggestions */}
              {showAiPanel && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-secondary-900 flex items-center">
                      <BrainCircuit className="w-4 h-4 mr-2" />
                      AI Suggestions
                    </h3>
                    <button
                      onClick={() => setShowAiPanel(false)}
                      className="text-secondary-400 hover:text-secondary-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {aiSuggestions.length > 0 ? (
                      aiSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-sm"
                        >
                          <div className="flex items-start">
                            <Lightbulb className="w-4 h-4 text-purple-600 mr-2 mt-0.5" />
                            <span className="text-purple-800">{suggestion}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-secondary-500 text-sm py-4">
                        <BrainCircuit className="w-8 h-8 mx-auto mb-2 text-secondary-300" />
                        Start writing to get AI suggestions
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Markdown Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
                <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Markdown Status
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Validation</span>
                    <span className={`px-2 py-1 rounded text-xs ${markdownErrors.length === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {markdownErrors.length === 0 ? 'Valid' : `${markdownErrors.length} errors`}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Word Count</span>
                    <span className="text-secondary-600">{documentContent.split(' ').filter(word => word.length > 0).length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Characters</span>
                    <span className="text-secondary-600">{documentContent.length}</span>
                  </div>
                </div>
              </div>

              {/* Grammar Checker */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
                <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Grammar Checker
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Grammar</span>
                    <span className={`px-2 py-1 rounded text-xs ${grammarErrors.length === 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {grammarErrors.length === 0 ? 'No issues' : `${grammarErrors.length} issues`}
                    </span>
                  </div>
                  
                  {grammarErrors.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {grammarErrors.slice(0, 3).map((error, index) => (
                        <div key={index} className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                          ⚠️ Line {error.line}: {error.issues.join(', ')}
                        </div>
                      ))}
                      {grammarErrors.length > 3 && (
                        <div className="text-xs text-secondary-500">
                          +{grammarErrors.length - 3} more issues
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Spell Checker */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200">
                <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Spell Checker
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Spelling</span>
                    <span className={`px-2 py-1 rounded text-xs ${spellCheckErrors.length === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {spellCheckErrors.length === 0 ? 'No errors' : `${spellCheckErrors.length} errors`}
                    </span>
                  </div>
                  
                  {spellCheckErrors.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {spellCheckErrors.slice(0, 3).map((error, index) => (
                        <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          🔍 "{error.context?.text?.substring(error.offset, error.offset + error.length) || 'word'}" - {error.message}
                        </div>
                      ))}
                      {spellCheckErrors.length > 3 && (
                        <div className="text-xs text-secondary-500">
                          +{spellCheckErrors.length - 3} more errors
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Documentation Templates</h2>
              <p className="text-secondary-600">Choose from pre-built templates to get started quickly</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setDocumentType(template.id);
                    setActiveTab('write');
                  }}
                  className="p-6 border-2 border-secondary-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-secondary-600">
                    {template.id === 'api' && 'Complete API documentation template with endpoints, models, and examples'}
                    {template.id === 'readme' && 'Professional README template with project overview, installation, and usage'}
                    {template.id === 'tutorial' && 'Step-by-step tutorial template with prerequisites and examples'}
                    {template.id === 'user-guide' && 'Comprehensive user guide template with navigation and troubleshooting'}
                    {template.id === 'changelog' && 'Structured changelog template with version history and release notes'}
                  </p>
                  <div className="mt-4 text-primary-600 font-medium group-hover:text-primary-700">
                    Use Template →
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteDocs; 
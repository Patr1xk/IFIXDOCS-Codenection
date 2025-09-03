import React, { useState, useEffect } from 'react';
import { Globe, Languages, MessageSquare, FileText, Loader2, CheckCircle, AlertCircle, Download, Settings } from 'lucide-react';

const Multilingual = () => {
  const [activeTab, setActiveTab] = useState('translate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState([]);

  // Form states
  const [translateForm, setTranslateForm] = useState({
    content: '',
    sourceLanguage: 'auto',
    targetLanguage: 'en',
    context: '',
    preserveFormatting: true
  });

  const [detectForm, setDetectForm] = useState({
    content: '',
    context: ''
  });

  const [localizeForm, setLocalizeForm] = useState({
    content: '',
    targetLocale: 'en',
    contentType: 'documentation',
    preserveTechnicalTerms: true
  });

  // Load supported languages on component mount
  useEffect(() => {
    fetchSupportedLanguages();
  }, []);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/multilingual/languages');
      if (response.ok) {
        const data = await response.json();
        // Convert backend format to frontend format
        const languages = data.languages ? data.languages.map(lang => ({
          code: lang.language_code,
          name: lang.language_name,
          flag: getFlagForLanguage(lang.language_code)
        })) : [];
        
        setSupportedLanguages(languages.length > 0 ? languages : getDefaultLanguages());
      }
    } catch (err) {
      console.error('Failed to fetch supported languages:', err);
      // Fallback to default languages
      setSupportedLanguages(getDefaultLanguages());
    }
  };

  const getFlagForLanguage = (code) => {
    const flagMap = {
      'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪',
      'zh': '🇨🇳', 'ja': '🇯🇵', 'ko': '🇰🇷', 'ar': '🇸🇦',
      'hi': '🇮🇳', 'pt': '🇵🇹'
    };
    return flagMap[code] || '🌐';
  };

  const getDefaultLanguages = () => [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' }
  ];

  const handleTranslate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
             // Convert camelCase to snake_case for backend
       const backendData = {
         content: translateForm.content,
         source_language: translateForm.sourceLanguage === 'auto' ? 'auto' : translateForm.sourceLanguage,
         target_language: translateForm.targetLanguage,
         context: translateForm.context,
         preserve_formatting: translateForm.preserveFormatting
       };

      const response = await fetch('http://localhost:8000/api/multilingual/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error('Failed to translate content');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLanguage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert camelCase to snake_case for backend
      const backendData = {
        content: detectForm.content,
        context: detectForm.context
      };

      const response = await fetch('http://localhost:8000/api/multilingual/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error('Failed to detect language');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert camelCase to snake_case for backend
      const backendData = {
        content: localizeForm.content,
        target_locale: localizeForm.targetLocale,
        content_type: localizeForm.contentType,
        preserve_technical_terms: localizeForm.preserveTechnicalTerms
      };

      const response = await fetch('http://localhost:8000/api/multilingual/localize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error('Failed to localize content');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'translate', label: 'Translation', icon: MessageSquare },
    { id: 'detect', label: 'Language Detection', icon: Languages },
    { id: 'localize', label: 'Localization', icon: Globe }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900">Multilingual Support</h1>
        </div>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Break language barriers with AI-powered translation, language detection, and localization tools
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
      <div className="max-w-4xl mx-auto">
        {activeTab === 'translate' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Smart Translation</h2>
              <p className="text-secondary-600">Translate your documentation into multiple languages with AI-powered accuracy</p>
            </div>

            <form onSubmit={handleTranslate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Content to Translate
                </label>
                <textarea
                  value={translateForm.content}
                  onChange={(e) => setTranslateForm({...translateForm, content: e.target.value})}
                  placeholder="Enter the text you want to translate..."
                  className="w-full h-32 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Source Language
                  </label>
                  <select
                    value={translateForm.sourceLanguage}
                    onChange={(e) => setTranslateForm({...translateForm, sourceLanguage: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="auto">Auto-detect</option>
                    {supportedLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Target Language
                  </label>
                  <select
                    value={translateForm.targetLanguage}
                    onChange={(e) => setTranslateForm({...translateForm, targetLanguage: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Context (Optional)
                </label>
                <textarea
                  value={translateForm.context}
                  onChange={(e) => setTranslateForm({...translateForm, context: e.target.value})}
                  placeholder="Provide context about the content (e.g., technical documentation, user guide, etc.)"
                  className="w-full h-20 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preserveFormatting"
                  checked={translateForm.preserveFormatting}
                  onChange={(e) => setTranslateForm({...translateForm, preserveFormatting: e.target.checked})}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="preserveFormatting" className="ml-2 text-sm text-secondary-700">
                  Preserve formatting and structure
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Translating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Translate Content
                  </div>
                )}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-success-600 mr-2" />
                  <h3 className="text-lg font-semibold text-success-900">Translation Complete</h3>
                </div>
                
                                 <div className="space-y-4">
                   <div className="bg-white p-4 rounded-lg border border-success-200">
                     <h4 className="font-medium text-success-900 mb-2">Original Text:</h4>
                     <p className="text-secondary-800">{translateForm.content}</p>
                   </div>
                   
                   <div className="bg-white p-4 rounded-lg border border-success-200">
                     <h4 className="font-medium text-success-900 mb-2">Translated Text:</h4>
                     <p className="text-secondary-800">{result.translated_content}</p>
                   </div>
                   
                   <div className="bg-white p-4 rounded-lg border border-success-200">
                     <h4 className="font-medium text-success-900 mb-2">Language Information:</h4>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <span className="font-medium text-secondary-700">Source Language:</span>
                         <p className="text-secondary-800">{result.source_language}</p>
                       </div>
                       <div>
                         <span className="font-medium text-secondary-700">Target Language:</span>
                         <p className="text-secondary-800">{result.target_language}</p>
                       </div>
                       <div>
                         <span className="font-medium text-secondary-700">Confidence:</span>
                         <p className="text-secondary-800">{(result.confidence * 100).toFixed(1)}%</p>
                       </div>
                     </div>
                   </div>
                 </div>

                <div className="mt-6 flex gap-3">
                  <button className="bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Download Translation
                  </button>
                  <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'detect' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Language Detection</h2>
              <p className="text-secondary-600">Automatically detect the language of your content with high accuracy</p>
            </div>

            <form onSubmit={handleDetectLanguage} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Content to Analyze
                </label>
                <textarea
                  value={detectForm.content}
                  onChange={(e) => setDetectForm({...detectForm, content: e.target.value})}
                  placeholder="Enter text to detect its language..."
                  className="w-full h-32 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={detectForm.context}
                  onChange={(e) => setDetectForm({...detectForm, context: e.target.value})}
                  placeholder="Provide any additional context that might help with language detection..."
                  className="w-full h-20 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Detecting Language...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Languages className="w-5 h-5 mr-2" />
                    Detect Language
                  </div>
                )}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-primary-50 rounded-xl border border-primary-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-primary-900">Language Detected</h3>
                </div>
                
                                 <div className="space-y-4">
                   <div className="bg-white p-4 rounded-lg border border-primary-200">
                     <h4 className="font-medium text-primary-900 mb-2">Detection Results:</h4>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <span className="font-medium text-secondary-700">Detected Language:</span>
                         <p className="text-secondary-800">{result.detected_language}</p>
                       </div>
                       <div>
                         <span className="font-medium text-secondary-700">Confidence:</span>
                         <p className="text-secondary-800">{(result.confidence * 100).toFixed(1)}%</p>
                       </div>
                     </div>
                   </div>
                   
                   {result.alternative_languages && result.alternative_languages.length > 0 && (
                     <div className="bg-white p-4 rounded-lg border border-primary-200">
                       <h4 className="font-medium text-primary-900 mb-2">Alternative Languages:</h4>
                       <div className="space-y-2">
                         {result.alternative_languages.map((lang, index) => (
                           <div key={index} className="flex items-center justify-between">
                             <span className="text-secondary-800">{lang.language_code}</span>
                             <span className="text-secondary-600">{(lang.confidence * 100).toFixed(1)}%</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   <div className="bg-white p-4 rounded-lg border border-primary-200">
                     <h4 className="font-medium text-primary-900 mb-2">Analyzed Text:</h4>
                     <p className="text-secondary-800 text-sm">{detectForm.content}</p>
                   </div>
                 </div>
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'localize' && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Content Localization</h2>
              <p className="text-secondary-600">Adapt your content for specific regions and cultures with intelligent localization</p>
            </div>

            <form onSubmit={handleLocalize} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Content to Localize
                </label>
                <textarea
                  value={localizeForm.content}
                  onChange={(e) => setLocalizeForm({...localizeForm, content: e.target.value})}
                  placeholder="Enter the content you want to localize..."
                  className="w-full h-32 px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Target Locale
                  </label>
                  <select
                    value={localizeForm.targetLocale}
                    onChange={(e) => setLocalizeForm({...localizeForm, targetLocale: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="zh-CN">中文 (简体)</option>
                    <option value="zh-TW">中文 (繁體)</option>
                    <option value="ms-MY">Bahasa Melayu (Malaysia)</option>
                    <option value="ta-IN">தமிழ் (India)</option>
                    <option value="es-ES">Español (España)</option>
                    <option value="es-MX">Español (México)</option>
                    <option value="fr-FR">Français (France)</option>
                    <option value="de-DE">Deutsch (Deutschland)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={localizeForm.contentType}
                    onChange={(e) => setLocalizeForm({...localizeForm, contentType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="documentation">Technical Documentation</option>
                    <option value="user-guide">User Guide</option>
                    <option value="api-reference">API Reference</option>
                    <option value="marketing">Marketing Content</option>
                    <option value="legal">Legal/Compliance</option>
                    <option value="general">General Content</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preserveTechnicalTerms"
                  checked={localizeForm.preserveTechnicalTerms}
                  onChange={(e) => setLocalizeForm({...localizeForm, preserveTechnicalTerms: e.target.checked})}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="preserveTechnicalTerms" className="ml-2 text-sm text-secondary-700">
                  Preserve technical terms and brand names
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Localizing Content...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Localize Content
                  </div>
                )}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-8 p-6 bg-success-50 rounded-xl border border-success-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-success-600 mr-2" />
                  <h3 className="text-lg font-semibold text-success-900">Localization Complete</h3>
                </div>
                
                                 <div className="space-y-4">
                   <div className="bg-white p-4 rounded-lg border border-success-200">
                     <h4 className="font-medium text-success-900 mb-2">Original Content:</h4>
                     <p className="text-secondary-800">{localizeForm.content}</p>
                   </div>
                   
                   <div className="bg-white p-4 rounded-lg border border-success-200">
                     <h4 className="font-medium text-success-900 mb-2">Localized Content:</h4>
                     <p className="text-secondary-800">{result.localized_content}</p>
                   </div>
                   
                   {result.cultural_adaptations && (
                     <div className="bg-white p-4 rounded-lg border border-success-200">
                       <h4 className="font-medium text-success-900 mb-2">Cultural Adaptations:</h4>
                       <ul className="space-y-1 text-sm text-secondary-700">
                         {result.cultural_adaptations.map((adaptation, index) => (
                           <li key={index} className="flex items-start">
                             <span className="text-success-600 mr-2">•</span>
                             {adaptation}
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                   
                   <div className="bg-white p-4 rounded-lg border border-success-200">
                     <h4 className="font-medium text-success-900 mb-2">Localization Info:</h4>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <span className="font-medium text-secondary-700">Locale:</span>
                         <p className="text-secondary-800">{result.locale}</p>
                       </div>
                       <div>
                         <span className="font-medium text-secondary-700">Technical Terms Preserved:</span>
                         <p className="text-secondary-800">{result.technical_terms_preserved?.length || 0} terms</p>
                       </div>
                     </div>
                   </div>
                 </div>

                <div className="mt-6 flex gap-3">
                  <button className="bg-success-600 hover:bg-success-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Download Localized
                  </button>
                  <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 bg-error-50 rounded-xl border border-error-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error-600 mr-2" />
                  <span className="text-error-800">{error}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Multilingual;

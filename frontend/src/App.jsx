import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  UploadCloud, 
  Scan, 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Image as ImageIcon,
  Cpu,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loadingScan, setLoadingScan] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  const chatThreadRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll chat thread to bottom
  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [messages, loadingChat]);

  // Handle image file selection
  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
    } else if (file) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.).');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Scan image via FastAPI backend
  const handleScan = async () => {
    if (!selectedFile) return;
    setLoadingScan(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/scan-image`, formData);
      setScanResult(response.data);
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend scan API.');
    } finally {
      setLoadingScan(false);
    }
  };

  // Send message to FastAPI privacy chat backend
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);

    setLoadingChat(true);
    const isFake = scanResult ? scanResult.is_ai_generated : false;

    const formData = new URLSearchParams();
    formData.append('user_message', userMsg);
    formData.append('is_fake', isFake);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const aiReply = response.data.ai_response;
      const scrubbed = response.data.scrubbed_message_sent_to_cloud;

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiReply, scrubbed: scrubbed }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: 'ai', text: 'System error connecting to AI.' }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInputMessage(promptText);
  };

  return (
    <div className="app-viewport">
      {/* Background Animated Gradient Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Header Bar */}
      <header className="app-header">
        <div className="brand-badge">
          <span className="status-dot" />
          <span>TrustGuard AI Security Engine</span>
        </div>
        
        <h1 className="header-title">Deepfake Detector & Privacy Assistant</h1>
        
        <p className="header-subtitle">
          Advanced forensic AI image authentication coupled with local Microsoft Presidio PII data masking for zero-leak privacy protection.
        </p>

        <div className="header-features">
          <div className="feature-pill">
            <ShieldCheck size={14} color="#60a5fa" />
            <span>Forensic Image Analysis</span>
          </div>
          <div className="feature-pill">
            <Lock size={14} color="#06b6d4" />
            <span>Local PII Scrubbing</span>
          </div>
          <div className="feature-pill">
            <Cpu size={14} color="#a855f7" />
            <span>Llama 3.1 LLM Security</span>
          </div>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="main-grid">
        {/* Step 1: Image Deepfake Scanner Card */}
        <section className="glass-card scanner-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrapper">
                <Scan size={22} />
              </div>
              <h2 className="card-title">Image Forensics</h2>
            </div>
            <span className="step-badge">Step 1</span>
          </div>

          <div className="scanner-content">
            {/* Drag & Drop Box */}
            {!previewUrl ? (
              <div 
                className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <div className="dropzone-icon-container">
                  <UploadCloud size={28} />
                </div>
                <p className="dropzone-text-main">
                  {isDragActive ? 'Drop image file here...' : 'Click or Drag & Drop image file'}
                </p>
                <p className="dropzone-text-sub">Supports PNG, JPG, WEBP formats</p>
                
                <input 
                  ref={fileInputRef}
                  id="file-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="file-input-hidden" 
                />
              </div>
            ) : (
              <div className="preview-container">
                <div className="preview-media-wrapper">
                  <img src={previewUrl} alt="Scan preview" className="preview-image" />
                </div>
                
                <div className="file-meta-bar">
                  <span className="file-name-tag">
                    📸 {selectedFile ? selectedFile.name : 'Selected Image'}
                  </span>
                  <button onClick={handleClearFile} className="btn-remove-file">
                    Remove File
                  </button>
                </div>

                <button 
                  onClick={handleScan} 
                  disabled={loadingScan} 
                  className="btn-primary"
                >
                  {loadingScan ? (
                    <>
                      <span className="spinner-icon" />
                      <span>Analyzing Image Artifacts...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Scan Image for Fakes</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Scan Verdict Card */}
            {scanResult && (
              <div className={`scan-result-card ${scanResult.is_ai_generated ? 'is-fake' : 'is-real'}`}>
                <div className="result-badge-row">
                  <div className="result-verdict-badge">
                    {scanResult.is_ai_generated ? (
                      <>
                        <AlertTriangle size={18} />
                        <span>Synthetic / AI Generated</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Real Photograph</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="confidence-meter-group">
                  <div className="confidence-header">
                    <span>AI Generation Probability</span>
                    <span>{(scanResult.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="meter-track">
                    <div 
                      className="meter-fill" 
                      style={{ width: `${Math.max(scanResult.confidence * 100, 5)}%` }} 
                    />
                  </div>
                </div>

                <div className="result-footer-meta">
                  <span>Engine: {scanResult.model_used}</span>
                  {scanResult.flags && scanResult.flags.length > 0 && (
                    <span>{scanResult.flags[0]}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: AI Trust & Safety Chat Card */}
        <section className="glass-card chat-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrapper" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#06b6d4' }}>
                <Bot size={22} />
              </div>
              <h2 className="card-title">Privacy Assistant</h2>
            </div>
            <span className="step-badge" style={{ background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.25)', color: '#67e8f9' }}>Step 2</span>
          </div>

          <div className="chat-thread" ref={chatThreadRef}>
            {messages.length === 0 ? (
              <div className="chat-welcome-state">
                <div className="welcome-icon-box">
                  <Bot size={28} />
                </div>
                <h3 className="welcome-title">How can I assist your safety today?</h3>
                <p className="welcome-subtitle">
                  Ask about potential scams, suspicious messages, or deepfake concerns. Your sensitive data is masked locally before cloud evaluation.
                </p>

                <div className="quick-prompts-container">
                  <button 
                    onClick={() => handleQuickPrompt("Is this photo safe or could it be a deepfake scam?")} 
                    className="prompt-chip"
                  >
                    🛡️ Is this photo a deepfake?
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt("I received a suspicious message asking for money. What should I do?")} 
                    className="prompt-chip"
                  >
                    ⚠️ Suspicious message inquiry
                  </button>
                  <button 
                    onClick={() => handleQuickPrompt("How does local PII anonymization protect my privacy?")} 
                    className="prompt-chip"
                  >
                    🔒 How is my privacy protected?
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`chat-bubble-wrapper ${msg.sender}`}>
                  <div className="chat-sender-meta">
                    {msg.sender === 'user' ? (
                      <>
                        <User size={12} />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <Bot size={12} />
                        <span>Trust AI</span>
                      </>
                    )}
                  </div>
                  
                  <div className="chat-bubble">
                    {msg.text}
                  </div>

                  {msg.scrubbed && (
                    <div className="scrubbed-pii-tag" title="Sensitive personal data anonymized before reaching Groq LLM">
                      <Lock size={12} />
                      <span>Scrubbed PII sent to cloud: {msg.scrubbed}</span>
                    </div>
                  )}
                </div>
              ))
            )}

            {loadingChat && (
              <div className="typing-box">
                <Bot size={16} color="#3b82f6" />
                <span>AI is analyzing context</span>
                <div className="typing-dots">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="chat-form">
            <input 
              type="text" 
              value={inputMessage} 
              onChange={(e) => setInputMessage(e.target.value)} 
              placeholder="Ask about a scam or type your situation..." 
              className="chat-input-field"
            />
            <button 
              type="submit" 
              disabled={loadingChat || !inputMessage.trim()} 
              className="btn-send-chat" 
              title="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
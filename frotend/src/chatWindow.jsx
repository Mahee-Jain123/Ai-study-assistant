import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  Menu,
  Sun,
  Moon,
  HelpCircle,
  BookOpen,
  Zap,
  GraduationCap
} from 'lucide-react';

export default function ChatWindow({
  messages = [],
  isLoading,
  activeDocument,
  hasDocuments,
  onClearChat,
  onOpenMobileSidebar,
  onSelectPrompt,
  theme,
  onToggleTheme,
}) {
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [expandedCitations, setExpandedCitations] = useState({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (text, index) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner TTS
    const cleanText = text.replace(/[#*_`>\-\[\]]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const toggleCitation = (index) => {
    setExpandedCitations((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleExport = () => {
    if (messages.length === 0) return;
    const content = messages
      .map((m) => `### ${m.role === 'user' ? '👤 User' : '🤖 AI Study Assistant'}\n\n${m.content}\n\n---\n`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-session-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="chat-window">
      {/* Top Navbar */}
      <header className="chat-navbar">
        <div className="navbar-left">
          <button
            className="mobile-menu-btn"
            onClick={onOpenMobileSidebar}
            aria-label="Open sidebar menu"
          >
            <Menu size={20} />
          </button>

          <div className="active-doc-indicator">
            <GraduationCap size={18} className="nav-cap-icon" />
            <div className="nav-doc-text">
              <span className="nav-doc-title">
                {activeDocument ? activeDocument.name : 'Study Session'}
              </span>
              <span className="nav-doc-sub">
                {hasDocuments ? 'Document Ready • Gemini RAG' : 'No document uploaded'}
              </span>
            </div>
          </div>
        </div>

        <div className="navbar-right">
          {messages.length > 0 && (
            <>
              <button
                className="nav-action-btn"
                onClick={handleExport}
                title="Export conversation as Markdown"
              >
                <Download size={16} />
                <span className="btn-label">Export</span>
              </button>

              <button
                className="nav-action-btn danger"
                onClick={onClearChat}
                title="Clear current chat"
              >
                <Trash2 size={16} />
                <span className="btn-label">Clear</span>
              </button>
            </>
          )}

          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div className="welcome-hero">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Intelligent Document RAG</span>
            </div>

            <h1 className="hero-title">
              What would you like to <span className="gradient-text">learn today?</span>
            </h1>
            <p className="hero-subtitle">
              Upload your study notes, research papers, or textbooks. Ask deep questions, generate summaries, and test yourself with interactive quizzes.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon doc">
                  <FileText size={20} />
                </div>
                <h3>Grounded Answers</h3>
                <p>Every response is extracted from your uploaded PDF with page citations.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon brain">
                  <Zap size={20} />
                </div>
                <h3>Smart Summaries</h3>
                <p>Get instant executive overviews, key formulas, and core takeaways.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon quiz">
                  <HelpCircle size={20} />
                </div>
                <h3>Practice Quizzes</h3>
                <p>Reinforce your learning with auto-generated test questions and answers.</p>
              </div>
            </div>

            <div className="starter-prompts-section">
              <h4>Or try asking:</h4>
              <div className="starter-chips">
                <button
                  className="starter-chip"
                  onClick={() => onSelectPrompt('Summarize the main purpose and core findings of this document')}
                  disabled={!hasDocuments}
                >
                  <BookOpen size={14} />
                  <span>"Summarize the main purpose & findings"</span>
                </button>
                <button
                  className="starter-chip"
                  onClick={() => onSelectPrompt('What are the key terms and their definitions in this document?')}
                  disabled={!hasDocuments}
                >
                  <Sparkles size={14} />
                  <span>"List key terms & definitions"</span>
                </button>
                <button
                  className="starter-chip"
                  onClick={() => onSelectPrompt('Explain the core concept step-by-step with examples')}
                  disabled={!hasDocuments}
                >
                  <Zap size={14} />
                  <span>"Explain the core concept step-by-step"</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-thread">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              const isSpeaking = speakingIndex === index;
              const isCopied = copiedIndex === index;
              const hasCitations = msg.citations && msg.citations.length > 0;
              const isCitationOpen = expandedCitations[index];

              return (
                <div
                  key={msg.id || index}
                  className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}
                >
                  <div className="message-avatar">
                    {isUser ? (
                      <User size={18} className="user-icon" />
                    ) : (
                      <Bot size={18} className="bot-icon" />
                    )}
                  </div>

                  <div className="message-bubble-wrapper">
                    <div className="message-header-meta">
                      <span className="sender-name">
                        {isUser ? 'You' : 'AI Study Assistant'}
                      </span>
                      {msg.timestamp && (
                        <span className="message-time">{msg.timestamp}</span>
                      )}
                    </div>

                    <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
                      {isUser ? (
                        <p className="user-text-content">{msg.content}</p>
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {/* Citations & Evidence section for Assistant */}
                    {!isUser && hasCitations && (
                      <div className="citations-container">
                        <button
                          className="citations-toggle-btn"
                          onClick={() => toggleCitation(index)}
                          aria-expanded={isCitationOpen}
                        >
                          <FileText size={14} />
                          <span>
                            {msg.citations.length} Grounded Source Citation{msg.citations.length > 1 ? 's' : ''}
                          </span>
                          {isCitationOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {isCitationOpen && (
                          <div className="citations-list">
                            {msg.citations.map((cite, cIdx) => (
                              <div key={cIdx} className="citation-card">
                                <div className="citation-header">
                                  <span className="citation-page-badge">
                                    Page {cite.page}
                                  </span>
                                  {cite.filename && (
                                    <span className="citation-filename">{cite.filename}</span>
                                  )}
                                </div>
                                <p className="citation-snippet">"{cite.snippet}"</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons for assistant messages */}
                    {!isUser && (
                      <div className="message-actions">
                        <button
                          className="msg-action-btn"
                          onClick={() => handleCopy(msg.content, index)}
                          title="Copy to clipboard"
                        >
                          {isCopied ? <Check size={14} className="copied" /> : <Copy size={14} />}
                          <span>{isCopied ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          className={`msg-action-btn ${isSpeaking ? 'active-speaking' : ''}`}
                          onClick={() => handleSpeak(msg.content, index)}
                          title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                        >
                          {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                          <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading / Thinking State */}
            {isLoading && (
              <div className="message-row assistant-row loading-row">
                <div className="message-avatar">
                  <Bot size={18} className="bot-icon pulse-icon" />
                </div>
                <div className="message-bubble-wrapper">
                  <div className="message-header-meta">
                    <span className="sender-name">AI Study Assistant</span>
                  </div>
                  <div className="message-bubble bubble-assistant thinking-bubble">
                    <div className="thinking-dots">
                      <span className="dot dot-1" />
                      <span className="dot dot-2" />
                      <span className="dot dot-3" />
                    </div>
                    <span className="thinking-text">
                      Retrieving vectors & formulating study response...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </main>
  );
}

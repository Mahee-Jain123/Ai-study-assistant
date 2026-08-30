import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Sparkles,
  UploadCloud,
  FileText,
  Trash2,
  FileSpreadsheet,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Loader2,
  Database,
  RotateCcw,
  BookMarked,
  X
} from 'lucide-react';

export default function Sidebar({
  documents = [],
  onUpload,
  onClearDb,
  onStudyAction,
  onSelectPrompt,
  isUploading,
  uploadProgress,
  backendStats,
  isOpen,
  onCloseMobile,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onUpload(file);
      } else {
        alert('Please select a valid PDF file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onUpload(file);
      e.target.value = '';
    }
  };

  const quickPrompts = [
    'Explain the most difficult concept in simple terms',
    'Generate a 5-bullet summary for revision',
    'List all key formulas, terms, and definitions',
    'What are potential exam questions on this topic?',
  ];

  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      {/* Top Header */}
      <div className="sidebar-header">
        <div className="brand-wrapper">
          <div className="brand-icon">
            <BookOpen size={22} className="icon-book" />
            <Sparkles size={13} className="icon-sparkle" />
          </div>
          <div className="brand-text">
            <h2>AI Study Assistant</h2>
            <span className="badge-model">Gemini RAG</span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          className="mobile-sidebar-close"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-scrollable">
        {/* Upload Zone */}
        <div className="section-block">
          <div className="section-title">
            <span>Study Material</span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            style={{ display: 'none' }}
          />

          <div
            className={`dropzone ${isDragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            {isUploading ? (
              <div className="dropzone-content">
                <Loader2 className="spinner-icon" size={28} />
                <span className="dropzone-label">Embedding & Indexing PDF...</span>
                <span className="dropzone-sub">Generating semantic vector store</span>
              </div>
            ) : (
              <div className="dropzone-content">
                <UploadCloud className="upload-icon" size={28} />
                <span className="dropzone-label">Upload Study PDF</span>
                <span className="dropzone-sub">Drag & drop or click to browse</span>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="section-block">
          <div className="section-title-row">
            <span className="section-title">Uploaded Documents</span>
            {documents.length > 0 && (
              <span className="doc-count-tag">{documents.length}</span>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="empty-docs-box">
              <FileText size={20} className="empty-docs-icon" />
              <p>No document uploaded yet.</p>
              <span>Upload a PDF to ask questions & generate study guides</span>
            </div>
          ) : (
            <div className="docs-list">
              {documents.map((doc, idx) => (
                <div key={doc.id || idx} className="doc-card">
                  <div className="doc-card-main">
                    <FileText size={18} className="doc-icon" />
                    <div className="doc-info">
                      <span className="doc-name" title={doc.name}>
                        {doc.name}
                      </span>
                      <div className="doc-meta">
                        {doc.pageCount && <span>{doc.pageCount} pages</span>}
                        {doc.chunkCount && <span>• {doc.chunkCount} chunks</span>}
                        {doc.time && <span>• {doc.time}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="doc-card-badge">
                    <CheckCircle2 size={14} className="badge-ready-icon" />
                    <span>Indexed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Tools Suite */}
        <div className="section-block">
          <div className="section-title">
            <span>AI Study Tools</span>
          </div>
          <div className="study-tools-grid">
            <button
              className="study-tool-btn"
              onClick={() => onStudyAction('summary')}
              disabled={documents.length === 0 || isUploading}
              title="Generate complete document summary"
            >
              <div className="tool-icon-wrapper summary">
                <BookMarked size={16} />
              </div>
              <div className="tool-text">
                <span className="tool-name">Deep Summary</span>
                <span className="tool-desc">Structured chapter overview</span>
              </div>
            </button>

            <button
              className="study-tool-btn"
              onClick={() => onStudyAction('quiz')}
              disabled={documents.length === 0 || isUploading}
              title="Generate practice multiple-choice quiz"
            >
              <div className="tool-icon-wrapper quiz">
                <HelpCircle size={16} />
              </div>
              <div className="tool-text">
                <span className="tool-name">Practice Quiz</span>
                <span className="tool-desc">Self-assessment test questions</span>
              </div>
            </button>

            <button
              className="study-tool-btn"
              onClick={() => onStudyAction('concepts')}
              disabled={documents.length === 0 || isUploading}
              title="Extract key terms and definitions"
            >
              <div className="tool-icon-wrapper concepts">
                <Lightbulb size={16} />
              </div>
              <div className="tool-text">
                <span className="tool-name">Key Concepts</span>
                <span className="tool-desc">Core definitions & formulas</span>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="section-block">
          <div className="section-title">
            <span>Suggested Questions</span>
          </div>
          <div className="quick-prompts-list">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                className="quick-prompt-chip"
                onClick={() => onSelectPrompt(prompt)}
                disabled={documents.length === 0 || isUploading}
              >
                <Sparkles size={12} className="chip-sparkle" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer & DB Status */}
      <div className="sidebar-footer">
        <div className="footer-status-row">
          <div className="status-indicator">
            <span
              className={`status-dot ${backendStats?.indexed_chunks > 0 ? 'active' : 'idle'}`}
            />
            <span className="status-text">
              {backendStats?.indexed_chunks > 0
                ? `${backendStats.indexed_chunks} Vectors Indexed`
                : 'ChromaDB Ready'}
            </span>
          </div>

          {documents.length > 0 && (
            <button
              className="btn-clear-db"
              onClick={onClearDb}
              title="Clear vector database and documents"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
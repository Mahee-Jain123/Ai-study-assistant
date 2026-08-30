import React, { useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2, Sparkles, CornerDownLeft } from 'lucide-react';

export default function ChatInput({
  input,
  setInput,
  onSendMessage,
  onAttachFile,
  isLoading,
  hasDocuments,
  onSelectPrompt,
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && hasDocuments) {
        onSendMessage(input.trim());
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onAttachFile(file);
      e.target.value = '';
    }
  };

  const chips = [
    { label: 'Summarize key ideas', prompt: 'Summarize the key ideas from the uploaded document' },
    { label: 'Formulas & Definitions', prompt: 'List all formulas, definitions, and theorems' },
    { label: 'Generate 3 quiz questions', prompt: 'Generate 3 practice quiz questions with answers' },
    { label: 'Explain like I am 5', prompt: 'Explain the core topic in very simple terms with real-world examples' },
  ];

  return (
    <div className="chat-input-wrapper">
      {/* Quick Action Chips */}
      {hasDocuments && (
        <div className="input-prompt-chips">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              className="input-chip"
              onClick={() => onSelectPrompt(chip.prompt)}
              disabled={isLoading}
            >
              <Sparkles size={12} className="chip-icon" />
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hidden file input for attachment button */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        style={{ display: 'none' }}
      />

      <div className={`input-box-container ${!hasDocuments ? 'disabled-box' : ''}`}>
        <button
          type="button"
          className="attach-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Upload / Attach PDF document"
          aria-label="Upload PDF"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          className="chat-textarea"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hasDocuments
              ? 'Ask anything about the document... (Press Enter to send)'
              : 'Upload a PDF document first to begin asking questions...'
          }
          disabled={!hasDocuments || isLoading}
        />

        <button
          type="button"
          className="send-btn"
          onClick={() => {
            if (input.trim() && !isLoading && hasDocuments) {
              onSendMessage(input.trim());
            }
          }}
          disabled={!hasDocuments || !input.trim() || isLoading}
          aria-label="Send question"
        >
          {isLoading ? (
            <Loader2 className="spinner-icon" size={18} />
          ) : (
            <>
              <Send size={16} />
              <CornerDownLeft size={12} className="return-icon" />
            </>
          )}
        </button>
      </div>

      <div className="input-hint-row">
        <span>Press <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for new line</span>
      </div>
    </div>
  );
}

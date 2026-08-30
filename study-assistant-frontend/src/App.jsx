import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import ChatWindow from './chatWindow';
import ChatInput from './chatInput';
import Toast from './components/Toast';
import {
  uploadPDF,
  askQuestion,
  getDocumentSummary,
  getDocumentQuiz,
  getDocumentConcepts,
  getStats,
  clearDatabase,
} from './api/client';

export default function App() {
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_study_docs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_study_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [backendStats, setBackendStats] = useState({ indexed_chunks: 0, has_documents: false });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ai_study_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ai_study_theme', theme);
  }, [theme]);

  // Persist documents & messages
  useEffect(() => {
    localStorage.setItem('ai_study_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('ai_study_messages', JSON.stringify(messages));
  }, [messages]);

  // Poll / Check initial backend stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const stats = await getStats();
    setBackendStats(stats);
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Upload PDF Handler
  const handleUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    showToast(`Uploading and embedding "${file.name}"...`, 'info');

    try {
      const result = await uploadPDF(file);
      const newDoc = {
        id: Date.now().toString(),
        name: file.name,
        pageCount: result.page_count || 1,
        chunkCount: result.chunk_count || 1,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };

      setDocuments((prev) => {
        // Replace or prepend
        const filtered = prev.filter((d) => d.name !== file.name);
        return [newDoc, ...filtered];
      });

      await fetchStats();

      showToast(`Successfully indexed "${file.name}" (${result.page_count} pages, ${result.chunk_count} chunks)`, 'success');

      // Add a helpful assistant greeting message
      const welcomeMsg = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `### 📄 Document Indexed: **${file.name}**\n\nI have processed **${result.page_count} pages** and indexed **${result.chunk_count} semantic text chunks** into ChromaDB.\n\nYou can now:\n- 💬 Ask any questions about the content\n- 📝 Generate a **Deep Summary**\n- 🎯 Generate a **Practice Quiz**\n- 💡 Extract **Key Concepts & Definitions**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [],
      };

      setMessages((prev) => [...prev, welcomeMsg]);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to upload and index document.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Send Message / Question Handler
  const handleSendMessage = async (questionText) => {
    if (!questionText.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: questionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askQuestion(questionText.trim());
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer || "I couldn't find an answer in the uploaded document.",
        citations: response.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Error retrieving answer**: ${err.message || 'Server connection error. Please make sure the backend is running.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [],
      };
      setMessages((prev) => [...prev, errorMsg]);
      showToast(err.message || 'Failed to get answer.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Study Tools Action Handler
  const handleStudyAction = async (actionType) => {
    if (isLoading) return;

    let userPrompt = '';
    if (actionType === 'summary') userPrompt = 'Generate a comprehensive study summary of the document';
    if (actionType === 'quiz') userPrompt = 'Generate a 4-question multiple-choice practice quiz';
    if (actionType === 'concepts') userPrompt = 'Extract key terms, definitions, and formulas';

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let result;
      if (actionType === 'summary') {
        result = await getDocumentSummary();
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: result.summary,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        showToast('Study summary generated successfully', 'success');
      } else if (actionType === 'quiz') {
        result = await getDocumentQuiz();
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: result.quiz,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        showToast('Practice quiz generated successfully', 'success');
      } else if (actionType === 'concepts') {
        result = await getDocumentConcepts();
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: result.concepts,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        showToast('Key concepts extracted successfully', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || `Failed to perform ${actionType}`, 'error');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Action Failed**: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear Vector Database & Document Session
  const handleClearDb = async () => {
    if (!window.confirm('Are you sure you want to reset the vector database and clear all documents?')) {
      return;
    }

    try {
      await clearDatabase();
      setDocuments([]);
      setMessages([]);
      await fetchStats();
      showToast('Database reset and document session cleared.', 'info');
    } catch (err) {
      showToast('Failed to clear database.', 'error');
    }
  };

  // Clear Chat History Only
  const handleClearChat = () => {
    if (messages.length === 0) return;
    if (window.confirm('Clear all conversation messages in this study session?')) {
      setMessages([]);
      showToast('Conversation cleared.', 'info');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Backdrop for mobile drawer */}
      {isMobileSidebarOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        documents={documents}
        onUpload={handleUpload}
        onClearDb={handleClearDb}
        onStudyAction={handleStudyAction}
        onSelectPrompt={(prompt) => {
          setInput(prompt);
          handleSendMessage(prompt);
        }}
        isUploading={isUploading}
        backendStats={backendStats}
        isOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Study & Chat Area */}
      <div className="main-content-layout">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          activeDocument={documents[0] || null}
          hasDocuments={documents.length > 0}
          onClearChat={handleClearChat}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onSelectPrompt={(prompt) => {
            setInput(prompt);
            handleSendMessage(prompt);
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          onAttachFile={handleUpload}
          isLoading={isLoading || isUploading}
          hasDocuments={documents.length > 0}
          onSelectPrompt={(prompt) => {
            setInput(prompt);
            handleSendMessage(prompt);
          }}
        />
      </div>
    </div>
  );
}

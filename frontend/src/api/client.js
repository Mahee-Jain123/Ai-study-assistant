const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Upload a PDF file to the backend vector store
 */
export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Upload failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API upload error:', error);
    throw error;
  }
}

/**
 * Ask a question against the vector store
 */
export async function askQuestion(question) {
  try {
    const response = await fetch(`${API_BASE_URL}/ask/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Failed to get answer: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API ask error:', error);
    throw error;
  }
}

/**
 * Request a study summary of indexed documents
 */
export async function getDocumentSummary() {
  try {
    const response = await fetch(`${API_BASE_URL}/study/summary`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to generate summary');
    }

    return await response.json();
  } catch (error) {
    console.error('API summary error:', error);
    throw error;
  }
}

/**
 * Request an interactive practice quiz from indexed documents
 */
export async function getDocumentQuiz() {
  try {
    const response = await fetch(`${API_BASE_URL}/study/quiz`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to generate quiz');
    }

    return await response.json();
  } catch (error) {
    console.error('API quiz error:', error);
    throw error;
  }
}

/**
 * Request key concepts & definitions from indexed documents
 */
export async function getDocumentConcepts() {
  try {
    const response = await fetch(`${API_BASE_URL}/study/concepts`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || 'Failed to extract concepts');
    }

    return await response.json();
  } catch (error) {
    console.error('API concepts error:', error);
    throw error;
  }
}

/**
 * Check backend health and vector stats
 */
export async function getStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/stats`);
    if (!response.ok) return { indexed_chunks: 0, has_documents: false };
    return await response.json();
  } catch (error) {
    return { indexed_chunks: 0, has_documents: false, error: true };
  }
}

/**
 * Clear the vector database
 */
export async function clearDatabase() {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/clear`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to clear database');
    return await response.json();
  } catch (error) {
    console.error('API clear error:', error);
    throw error;
  }
}

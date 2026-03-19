'use client';

import { useState } from 'react';
import axios from 'axios';

const n8nWebhook = 'https://novumai.app.n8n.cloud/webhook/459d848d-72ed-490f-bc48-e5dc60242896';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(n8nWebhook, {
        message: input,
        conversation: messages
      });
      
      const botMessage = {
        role: 'assistant',
        content: response.data.response || 'No response received'
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error communicating with server' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Proxmox AI Chat</h1>
      </div>
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>Start a conversation with Proxmox AI</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={msg.role === 'user' ? styles.userMessage : styles.botMessage}>
              {msg.content}
            </div>
          ))
        )}
        {loading && <div style={styles.loadingMessage}>Thinking...</div>}
      </div>
      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Proxmox..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: '20px',
    textAlign: 'center'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '12px',
    maxWidth: '70%',
    wordWrap: 'break-word'
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    color: '#333',
    padding: '12px 16px',
    borderRadius: '12px',
    maxWidth: '70%',
    wordWrap: 'break-word',
    border: '1px solid #e0e0e0'
  },
  loadingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    color: '#999',
    padding: '12px 16px',
    borderRadius: '12px',
    fontStyle: 'italic'
  },
  emptyState: {
    color: '#999',
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px'
  },
  form: {
    display: 'flex',
    gap: '10px',
    padding: '20px',
    backgroundColor: 'white',
    borderTop: '1px solid #e0e0e0'
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px'
  },
  button: {
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  }
};

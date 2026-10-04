import { useState, useRef, useEffect } from 'react';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gemini');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Load saved chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await fetch('/api/chat/history');
        const data = await response.json();

        if (response.ok) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error('History load error:', err);
      }
    };

    loadChatHistory();
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
          model: model,
          web_search: false
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      const aiMessage = {
        role: 'assistant',
        content: data.response
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">

      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            <h3>Start a conversation</h3>
            <p>Send a message below to begin talking with the AI Assistant.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message-wrapper ${msg.role}`}
            >
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="message-wrapper assistant loading">
            <div className="message-content">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={isLoading}
        >
          <option value="gemini">Gemini</option>
          <option value="gemini_pro">Gemini 3.7 Flash</option>
        </select>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>

      </form>
    </div>
  );
}
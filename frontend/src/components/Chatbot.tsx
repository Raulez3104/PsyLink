import React, { useEffect, useRef, useState } from 'react';
import styles from '../css/Chatbot.module.css';
import { BsChatDots } from 'react-icons/bs';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const LLAMA_API_URL = 'http://localhost:4000/ollama-prompt'; // Asegúrate que coincida con tu backend

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bienvenida: Message = {
      id: Date.now(),
      text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
    };
    setMessages([bienvenida]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(LLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.text }),
      });

      const data = await response.json();
      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.response || 'No se recibió respuesta del modelo.',
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: 'Error al conectar con el asistente. Intenta nuevamente.',
          sender: 'bot',
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.floatingContainer}>
      {open && (
        <div className={styles.chatWrapper} role="dialog" aria-label="Chatbot">
          <div className={styles.chatHeader}>Asistente Virtual</div>

          <div className={styles.chatMessages}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.message} ${m.sender === 'user' ? styles.userMessage : styles.botMessage}`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <i>El bot está escribiendo...</i>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInputArea}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="Escribe tu mensaje"
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{backgroundColor:"blue"}}

            >
              Enviar
            </button>
          </div>
        </div>
      )}

      <button
        className={styles.chatToggleButton}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Cerrar chatbot' : 'Abrir chatbot'}
      >
        <BsChatDots size={24} />
      </button>
    </div>
  );
};

export default ChatBot;

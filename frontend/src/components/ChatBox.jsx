import { useState, useRef, useEffect } from "react";

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // 🔥 Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      const aiMsg = {
        role: "ai",
        text: data.reply || "No response",
      };

      setChat((prev) => [...prev, aiMsg]);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      {!isOpen && (
        <button style={styles.floatingBtn} onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}

      {/* CHAT BOX */}
      {isOpen && (
        <div style={styles.chatContainer}>
          
          {/* HEADER */}
          <div style={styles.header}>
            <span>🤖 AI Assistant</span>
            <button onClick={() => setIsOpen(false)}>
              ✖
            </button>
          </div>

          {/* CHAT AREA */}
          <div style={styles.chatArea}>
            {chat.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={
                    msg.role === "user"
                      ? styles.userBubble
                      : styles.aiBubble
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading bubble */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={styles.aiBubble}>Typing...</div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div style={styles.inputArea}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something..."
              style={styles.input}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button style={styles.sendBtn} onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  floatingBtn: {
  position: "fixed",
  bottom: "20px",
  right: "15px",
  width: "55px",
  height: "55px",
  fontSize: "22px",
  borderRadius: "50%",
  zIndex: 9999, // increase
},

  chatContainer: {
  position: "fixed",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "95%",
  maxWidth: "380px",
  height: "60vh",
  background: "#1e293b",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  zIndex: 999,
},

  header: {
    padding: "12px",
    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",
    display: "flex",
    justifyContent: "space-between",
    color: "white",
    fontWeight: "bold",
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  chatArea: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  userBubble: {
    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
    color: "white",
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "75%",
  },

  aiBubble: {
    background: "#334155",
    color: "white",
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "75%",
  },

  inputArea: {
  display: "grid",
  gridTemplateColumns: "1fr auto", // 🔥 PERFECT FIX
  gap: "8px",
  padding: "10px",
  background: "#1e293b",
},

  input: {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "16px", // 🔥 MUST (prevents mobile bug)
},

  sendBtn: {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
},
};

export default ChatBox;
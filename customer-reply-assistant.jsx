import { useState, useRef, useEffect } from "react";

const TONES = [
  { id: "friendly", label: "Friendly", emoji: "😊", desc: "Warm & approachable" },
  { id: "professional", label: "Professional", emoji: "💼", desc: "Polished & formal" },
  { id: "firm", label: "Firm", emoji: "✋", desc: "Direct & clear" },
  { id: "apologetic", label: "Apologetic", emoji: "🙏", desc: "Empathetic & sorry" },
];

const EXAMPLES = [
  "Where is my order? It's been 8 days.",
  "I want a refund. This product is terrible.",
  "Do you offer wholesale pricing?",
  "Can I change my order before it ships?",
];

function Spinner() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      color: "#8B7355", fontSize: "14px", fontFamily: "'Lora', serif",
    }}>
      <div style={{
        width: 18, height: 18,
        border: "2px solid #D4B896",
        borderTop: "2px solid #8B7355",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      Crafting your reply…
    </div>
  );
}

export default function App() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("friendly");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const outputRef = useRef(null);

  useEffect(() => {
    setCharCount(customerMessage.length);
  }, [customerMessage]);

  const buildPrompt = () => {
    const toneInstructions = {
      friendly: "Write in a warm, approachable, and upbeat tone. Use casual but polished language.",
      professional: "Write in a formal, polished, and business-appropriate tone.",
      firm: "Write in a direct, confident tone. Be clear about policies without being rude.",
      apologetic: "Write in an empathetic and genuinely apologetic tone. Acknowledge the customer's frustration.",
    };

    return `You are a customer service expert for a small business. Generate a ready-to-send reply to the following customer message.

TONE: ${toneInstructions[tone]}

${context ? `BUSINESS CONTEXT: ${context}` : ""}

CUSTOMER MESSAGE:
"${customerMessage}"

REQUIREMENTS:
- Directly answer the customer's question or concern
- Be polite, clear, and concise — avoid over-explaining
- Do NOT use hollow phrases like "I hope this message finds you well"
- Include a relevant follow-up question at the end ONLY if it would genuinely help resolve the issue
- Do not use [placeholder] brackets — write a complete, real message
- Keep it under 100 words
- Do not add a subject line or email header

Reply only with the customer message text, nothing else.`;
  };

  const generateReply = async () => {
    if (!customerMessage.trim()) return;
    setLoading(true);
    setReply("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setReply(text.trim());

      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    } catch (err) {
      setReply("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExample = (ex) => {
    setCustomerMessage(ex);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        body {
          background: #FAF6F0;
          min-height: 100vh;
          font-family: 'Lora', serif;
        }

        .page {
          min-height: 100vh;
          background: #FAF6F0;
          background-image:
            radial-gradient(ellipse at 20% 0%, #F0E8DC 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, #EDE0D0 0%, transparent 50%);
          padding: 48px 20px 80px;
        }

        .container {
          max-width: 660px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 48px;
          animation: slideIn 0.6s ease both;
        }

        .badge {
          display: inline-block;
          background: #8B7355;
          color: #FAF6F0;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 6vw, 42px);
          color: #2C1810;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .subtitle {
          color: #7A6552;
          font-size: 15px;
          font-style: italic;
          line-height: 1.6;
        }

        .card {
          background: #FFFDF9;
          border: 1px solid #E8DDD0;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 16px;
          box-shadow: 0 2px 12px rgba(44, 24, 16, 0.04);
          animation: slideIn 0.6s ease both;
        }

        .card:nth-child(2) { animation-delay: 0.1s; }
        .card:nth-child(3) { animation-delay: 0.2s; }

        label {
          display: block;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #8B7355;
          margin-bottom: 10px;
        }

        textarea {
          width: 100%;
          border: 1.5px solid #DDD0C0;
          border-radius: 10px;
          padding: 14px 16px;
          font-family: 'Lora', serif;
          font-size: 14px;
          color: #2C1810;
          background: #FFFDF9;
          resize: none;
          line-height: 1.6;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        textarea::placeholder { color: #B5A090; }

        textarea:focus {
          border-color: #8B7355;
          box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
        }

        .char-count {
          text-align: right;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #B5A090;
          margin-top: 6px;
        }

        .examples {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }

        .example-chip {
          background: transparent;
          border: 1px solid #DDD0C0;
          border-radius: 20px;
          padding: 4px 12px;
          font-family: 'Lora', serif;
          font-size: 12px;
          color: #8B7355;
          cursor: pointer;
          transition: all 0.15s;
        }

        .example-chip:hover {
          background: #F0E8DC;
          border-color: #8B7355;
        }

        .tone-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .tone-btn {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid #DDD0C0;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.15s;
          font-family: 'Lora', serif;
          text-align: left;
        }

        .tone-btn:hover {
          border-color: #8B7355;
          background: #FAF6F0;
        }

        .tone-btn.active {
          border-color: #8B7355;
          background: #F0E8DC;
        }

        .tone-emoji { font-size: 18px; }

        .tone-label {
          font-size: 13px;
          font-weight: 600;
          color: #2C1810;
          display: block;
        }

        .tone-desc {
          font-size: 11px;
          color: #8B7355;
          font-style: italic;
          display: block;
        }

        .generate-btn {
          width: 100%;
          padding: 16px;
          background: #2C1810;
          color: #FAF6F0;
          border: none;
          border-radius: 12px;
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
          position: relative;
          overflow: hidden;
        }

        .generate-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.2s;
        }

        .generate-btn:hover:not(:disabled)::after {
          background: rgba(255,255,255,0.08);
        }

        .generate-btn:active:not(:disabled) {
          transform: scale(0.99);
        }

        .generate-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .output-card {
          background: #2C1810;
          border-radius: 16px;
          padding: 28px;
          animation: fadeIn 0.4s ease both;
          position: relative;
        }

        .output-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8B7355;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .output-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(139, 115, 85, 0.3);
        }

        .reply-text {
          font-family: 'Lora', serif;
          font-size: 15px;
          line-height: 1.75;
          color: #F5EDE0;
          white-space: pre-wrap;
        }

        .output-actions {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(139, 115, 85, 0.2);
        }

        .action-btn {
          padding: 9px 18px;
          border-radius: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.15s;
          border: none;
        }

        .copy-btn {
          background: #8B7355;
          color: #FAF6F0;
          flex: 1;
        }

        .copy-btn:hover { background: #9D8467; }
        .copy-btn.copied { background: #5A7A55; }

        .regen-btn {
          background: rgba(255,255,255,0.08);
          color: #B5A090;
        }

        .regen-btn:hover {
          background: rgba(255,255,255,0.14);
          color: #D4C4B0;
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #DDD0C0, transparent);
          margin: 8px 0;
        }

        .footer {
          text-align: center;
          margin-top: 40px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #B5A090;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="page">
        <div className="container">
          <div className="header">
            <div className="badge">AI-Powered</div>
            <h1>Customer Reply<br />Assistant</h1>
            <p className="subtitle">Turn messy customer messages into polished,<br />ready-to-send replies in seconds.</p>
          </div>

          {/* Message Input */}
          <div className="card">
            <label>Customer Message</label>
            <textarea
              rows={5}
              placeholder="Paste or type the customer's message here…"
              value={customerMessage}
              onChange={e => setCustomerMessage(e.target.value)}
            />
            <div className="char-count">{charCount} chars</div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#B5A090", marginBottom: 8 }}>
                Try an example →
              </div>
              <div className="examples">
                {EXAMPLES.map(ex => (
                  <button key={ex} className="example-chip" onClick={() => handleExample(ex)}>
                    {ex.length > 38 ? ex.slice(0, 38) + "…" : ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Context */}
          <div className="card">
            <label>Business Context <span style={{ color: "#B5A090", fontStyle: "italic", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <textarea
              rows={2}
              placeholder="e.g. We sell handmade candles. Orders ship in 5–7 business days. No returns on personalized items."
              value={context}
              onChange={e => setContext(e.target.value)}
            />
          </div>

          {/* Tone */}
          <div className="card">
            <label>Tone</label>
            <div className="tone-grid">
              {TONES.map(t => (
                <button
                  key={t.id}
                  className={`tone-btn ${tone === t.id ? "active" : ""}`}
                  onClick={() => setTone(t.id)}
                >
                  <span className="tone-emoji">{t.emoji}</span>
                  <span>
                    <span className="tone-label">{t.label}</span>
                    <span className="tone-desc">{t.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            className="generate-btn"
            onClick={generateReply}
            disabled={!customerMessage.trim() || loading}
          >
            {loading ? "Generating…" : "Generate Reply →"}
          </button>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Spinner />
            </div>
          )}

          {/* Output */}
          {reply && !loading && (
            <div ref={outputRef} style={{ marginTop: 16 }}>
              <div className="output-card">
                <div className="output-label">Your Reply</div>
                <div className="reply-text">{reply}</div>
                <div className="output-actions">
                  <button
                    className={`action-btn copy-btn ${copied ? "copied" : ""}`}
                    onClick={handleCopy}
                  >
                    {copied ? "✓ Copied!" : "Copy Reply"}
                  </button>
                  <button className="action-btn regen-btn" onClick={generateReply}>
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="footer">
            Powered by Claude · Built for small businesses
          </div>
        </div>
      </div>
    </>
  );
}

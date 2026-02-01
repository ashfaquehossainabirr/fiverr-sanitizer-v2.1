import { useState, useEffect } from "react";
import { sanitizeText, containsRestrictedContent } from "./sanitizer";

export default function App() {

  // Fix Grammer Functionality
  const fixGrammar = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch(
        "https://api.languagetool.org/v2/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            text: message,
            language: "en-US",
          }),
        }
      );

      const data = await response.json();

      let correctedText = message;
      let offsetFix = 0;

      data.matches.forEach((match) => {
        if (match.replacements.length > 0) {
          const replacement = match.replacements[0].value;
          const start = match.offset + offsetFix;
          const end = start + match.length;

          correctedText =
            correctedText.slice(0, start) +
            replacement +
            correctedText.slice(end);

          offsetFix += replacement.length - match.length;
        }
      });

      setMessage(correctedText);
    } catch (error) {
      console.error("Grammar check failed", error);
      alert("Grammar check failed. Please try again.");
    }
  };


  // Message Input Functionality Handler
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const sanitizedMessage = sanitizeText(message);
  const hasRestricted = containsRestrictedContent(message);

  const saveAsTextFile = (content) => {
    if (!content) return;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "fiverr-message-preview.txt";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const handleCopy = async () => {
    if (!sanitizedMessage) return;
    await navigator.clipboard.writeText(sanitizedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const translateToBangla = () => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = "bn";
      select.dispatchEvent(new Event("change"));
    }
  };

  // Hide Google UI junk
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame,
      .goog-logo-link,
      .goog-te-gadget {
        display: none !important;
      }
      body { top: 0 !important; }
    `;
    document.head.appendChild(style);
  }, []);

  // Message Characters Limit Functionality
  const LIMIT = 2500;
  const isExceeded = sanitizedMessage.length > LIMIT;


  return (
    <div className="app-container">
      <div className="card">
        <div className="header">
          <h1>Fiverr Message Sanitizer</h1>
          <p className="subtitle">
            Sanitize restricted keywords and translate safely to Bengali for Fiverr communication.
          </p>

          {/* Credit */}
          <p className="subtitle">
            Developed By <a href="https://bd.linkedin.com/in/ashfaque-hossain-abir-91151723b">Ashfaque Hossain Abir</a>
          </p>
        </div>

        {/* Message Input */}
        <div className="grid">
          {/* LEFT COLUMN */}
          <div className="column msg">
            <div className="msg-col">
              <div className="message-label-wrapper">

                <label className="label">Your Message <span style={{ color: isExceeded ? "red" : "#000" }}>
                      ({(sanitizedMessage.replace(/\s/g, '').length >= 1) ? sanitizedMessage.length : sanitizedMessage.replace(/\s/g, "").length} Characters)</span>
                </label>

                {message && (
                  <button
                    className="clear-btn"
                    onClick={() => setMessage("")}
                    aria-label="Clear input"
                  >
                    Clear
                  </button>
                )}
              </div>

              <textarea
                className={`textarea ${hasRestricted ? "error" : ""}`}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {hasRestricted && (
              <div className="warning">
                ⚠ Restricted content detected. Use the sanitized version.
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="column">
            <div className="preview-header">
              <label className="label">Sanitized Preview</label>

              <div className="actions">
                <button
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopy}
                  disabled={!sanitizedMessage}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>

                <button
                  className="translate-btn"
                  onClick={translateToBangla}
                  disabled={!sanitizedMessage}
                >
                  🌐 Translate
                </button>

                <button className="fix-grammar-btn" onClick={fixGrammar} disabled={!sanitizedMessage}>
                  <span className="icon">✓</span>
                  <span className="text">Fix</span>
                </button>
              </div>
            </div>

            <div className="preview translate-area">
              {(sanitizedMessage.replace(/\s/g, '').length >= 1) ? sanitizedMessage : "Nothing to preview yet."}
            </div>


            <button
              className="save-btn"
              onClick={() => saveAsTextFile(sanitizedMessage)}
              disabled={!sanitizedMessage}
            >
              💾 Save as .txt
            </button>

          </div>
        </div>

      </div>
    </div>
  );

}
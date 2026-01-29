import React from 'react'

const Dashboard = () => {
  return (
    <div className="app-container">
        <div className="card">
            <div className="header">
                <h1>Fiverr Message Sanitizer</h1>
                <p className="subtitle">
                Sanitize restricted keywords and translate safely to Bengali for Fiverr communication.
                </p>
            </div>

            <div className="grid">
                {/* LEFT COLUMN */}
                <div className="column msg">
                <div className="msg-col">
                    <div className="message-label-wrapper">
                    <label className="label">Your Message</label>

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

                    <button className="fix-grammar-btn" onClick={fixGrammar}>
                        <span className="icon">✓</span>
                        <span className="text">Fix</span>
                    </button>
                    </div>
                </div>

                <div className="preview translate-area">
                    {sanitizedMessage || "Nothing to preview yet."}
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
  )
}

export default Dashboard
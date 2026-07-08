import { useState } from "react";
import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");

  const [authMessage, setAuthMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setAuthMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setToken(data.token);
      setAuthMessage(data.message || "Login successful");
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
      setAuthMessage("Invalid username or password.");
    }
  }

  async function handleRegister() {
    setAuthMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Register failed");
      }

      const data = await response.json();

      setAuthMessage(data.message || "Account created. You can log in now.");
    } catch (error) {
      console.error(error);
      setAuthMessage("Could not create account.");
    }
  }

  async function generateCode() {
    setLoading(true);
    setCode("");
    setExplanation("");

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          token: token,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend returned an error");
      }

      const data = await response.json();

      setCode(data.code || "");
      setExplanation(data.explanation || "");
    } catch (error) {
      console.error(error);
      setCode("Error: Could not connect to backend.");
      setExplanation("");
    }

    setLoading(false);
  }

  function handleLogout() {
    setLoggedIn(false);
    setToken("");
    setPassword("");
    setPrompt("");
    setCode("");
    setExplanation("");
    setAuthMessage("");
  }

  if (!loggedIn) {
    return (
      <main className="app-shell auth-shell">
        <section className="auth-hero" aria-label="PromptLang sign in">
          <div className="brand-mark">PL</div>
          <p className="eyebrow">PromptLang Studio</p>
          <h1>Build faster with prompts that ship clean code.</h1>
          <p className="hero-copy">
            A focused coding workspace with a sharp, blacked-out interface for
            turning precise requests into usable output.
          </p>
          <div className="signal-row" aria-label="Product highlights">
            <span>Private auth</span>
            <span>AI code generation</span>
            <span>Clean explanations</span>
          </div>
        </section>

        <section className="auth-panel" aria-label="Account access">
          <div className="panel-heading">
            <p className="eyebrow">Access</p>
            <h2>Sign in</h2>
          </div>

          <label className="field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tyler"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>

          <div className="action-row">
            <button className="primary-button" type="button" onClick={handleLogin}>
              Login
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>

          {authMessage && <p className="status-message">{authMessage}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell workspace-shell">
      <header className="topbar">
        <div>
          <div className="brand-line">
            <div className="brand-mark small">PL</div>
            <span>PromptLang</span>
          </div>
          <h1>Generate production-ready code.</h1>
        </div>

        <div className="account-pill">
          <span>{username}</span>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="prompt-section" aria-label="Code prompt">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Prompt</p>
            <h2>Describe what you need</h2>
          </div>
          <span className="live-chip">{loading ? "Generating" : "Ready"}</span>
        </div>

        <textarea
          className="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask for code, a component, an API route, or a refactor..."
          rows="7"
        />

        <div className="submit-row">
          <p>Be specific about language, framework, inputs, and expected output.</p>
          <button
            className="primary-button"
            type="button"
            onClick={generateCode}
            disabled={loading || !prompt.trim()}
          >
            {loading ? "Generating..." : "Generate Code"}
          </button>
        </div>
      </section>

      <section className="output-grid" aria-label="Generated response">
        <article className="output-panel code-panel">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Output</p>
              <h2>Generated Code</h2>
            </div>
          </div>
          <textarea
            value={loading ? "Generating..." : code}
            readOnly
            placeholder="Generated code will appear here..."
            rows="14"
          />
        </article>

        <article className="output-panel">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Notes</p>
              <h2>Explanation</h2>
            </div>
          </div>
          <textarea
            value={loading ? "Generating..." : explanation}
            readOnly
            placeholder="Explanation will appear here..."
            rows="14"
          />
        </article>
      </section>
    </main>
  );
}

export default App;

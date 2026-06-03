import { useState } from "react";
import "./App.css";

function App() {
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
          username: username,
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
    setPassword("");
    setPrompt("");
    setCode("");
    setExplanation("");
    setAuthMessage("");
  }

  if (!loggedIn) {
    return (
      <div>
        <h1>PromptLang Login</h1>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />

        <br />
        <br />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <br />
        <br />

        <button type="button" onClick={handleLogin}>
          Login
        </button>

        <button type="button" onClick={handleRegister}>
          Register
        </button>

        <p>{authMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>PromptLang</h1>

      <p>Logged in as: {username}</p>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>

      <br />
      <br />

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask for code..."
        rows="6"
        cols="60"
      />

      <br />

      <button type="button" onClick={generateCode} disabled={loading}>
        {loading ? "Generating..." : "Generate Code"}
      </button>

      <h2>Generated Code</h2>

      <textarea
        value={loading ? "Generating..." : code}
        readOnly
        placeholder="Generated code will appear here..."
        rows="10"
        cols="60"
      />

      <h2>Explanation</h2>

      <textarea
        value={loading ? "Generating..." : explanation}
        readOnly
        placeholder="Explanation will appear here..."
        rows="8"
        cols="60"
      />
    </div>
  );
}

export default App;
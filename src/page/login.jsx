import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) { setError("Enter username and password"); return; }
    try {
      const response = await axios.post("http://localhost:3001/login", { user_name: username, password });
      localStorage.setItem("token", response.data.token);
      navigate("/todo");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Todo App</h2>
        <input style={styles.input} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

const styles = {
  page: { display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"linear-gradient(135deg,#667eea,#764ba2)" },
  card: { background:"#fff", padding:"2rem", borderRadius:"16px", width:"320px", boxShadow:"0 8px 32px rgba(0,0,0,0.2)", display:"flex", flexDirection:"column", gap:"1rem" },
  title: { textAlign:"center", color:"#764ba2", margin:0 },
  input: { padding:"0.75rem", borderRadius:"8px", border:"1px solid #ddd", fontSize:"1rem" },
  button: { padding:"0.75rem", borderRadius:"8px", background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff", border:"none", fontSize:"1rem", cursor:"pointer" },
  error: { color:"red", margin:0, fontSize:"0.85rem" },
};

export default Login;
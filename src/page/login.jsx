import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username) {
      alert("Enter username");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/login", {
        user_name: username,
      });

      // ✅ Save JWT token
      localStorage.setItem("token", response.data.token);

      console.log("Token:", response.data.token);

      // ✅ Redirect
      navigate("/todo");

    } catch (err) {
      console.log(err);
      alert("User not found");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
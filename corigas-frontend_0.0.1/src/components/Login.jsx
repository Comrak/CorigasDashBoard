import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para la redirección

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/token",
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      const { access_token } = response.data;
      onLogin(access_token); // Llama a la función para guardar el token
      navigate("/dashboard/home"); // Redirige al Dashboard después del login exitoso
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;

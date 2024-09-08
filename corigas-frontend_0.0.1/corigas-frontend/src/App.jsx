import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { Container } from "@mui/material";
import LandingPage from "./components/LandingPage";

function App() {
  const [token, setToken] = useState(null);
  // eslint-disable-next-line
  const [section, setSection] = useState("home");
  // eslint-disable-next-line
  const [centrosComerciales, setCentrosComerciales] = useState([]);

  const handleLogout = () => {
    setToken(null);
  };

  const handleSectionChange = (section) => {
    setSection(section);
  };

  return (
    <Router>
      {token ? (
        <>
          <Navbar onLogout={handleLogout} />
          <Sidebar onSelectSection={handleSectionChange} />
          <Container sx={{ marginLeft: "240px", padding: "2rem" }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login onLogin={setToken} />} />
              <Route
                path="/dashboard"
                element={
                  token ? (
                    <Dashboard token={token} />
                  ) : (
                    <Login onLogin={setToken} />
                  )
                }
              />
              {/* Otras rutas pueden ir aquí */}
            </Routes>
          </Container>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={setToken} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;

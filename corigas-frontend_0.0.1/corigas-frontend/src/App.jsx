import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/admin/Sidebar";
import HomeAdmin from "./components/admin/HomeAdmin";
import CentrosComerciales from "./components/admin/centrosComerciales/CentrosComerciales";
import CentroComercialDetails from "./components/admin/centrosComerciales/CentroComercialDetails";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import { Container } from "@mui/material";
import axios from "axios";

function App() {
  const [token, setToken] = useState(null);
  const [centrosComerciales, setCentrosComerciales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/admin/centros_comerciales",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCentrosComerciales(response.data);
        } catch (error) {
          console.error("Error fetching data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  const handleSectionChange = (section) => {
    if (section === "home") {
      navigate("/dashboard/home");
    } else if (section === "centros") {
      navigate("/dashboard/centros-comerciales");
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLogin={setToken} />} />
      <Route path="/login" element={<Login onLogin={setToken} />} />
      {token && (
        <>
          <Route
            path="/dashboard/*"
            element={
              <>
                <Sidebar onSelectSection={handleSectionChange} />
                <Container sx={{ marginLeft: "240px", padding: "2rem" }}>
                  <Routes>
                    <Route path="home" element={<HomeAdmin />} />
                    <Route
                      path="centros-comerciales"
                      element={
                        <CentrosComerciales
                          centros={centrosComerciales}
                          token={token}
                        />
                      }
                    />
                    <Route
                      path="centros-comerciales/:id"
                      element={<CentroComercialDetails token={token} />}
                    />
                  </Routes>
                </Container>
              </>
            }
          />
        </>
      )}
    </Routes>
  );
}

export default App;

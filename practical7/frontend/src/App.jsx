import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Tasks from "./components/Tasks";
import Auth from "./components/Auth";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

const API_BASE = "http://localhost:3000";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Validate token with /me endpoint on app startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Token invalid or expired");
          }
          return res.json();
        })
        .then((data) => {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        })
        .catch(() => {
          // Token expired or invalid - clear client-side auth data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  const handleAuthChange = (newUser) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  const skillList = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
    "JWT Authentication",
    "bcrypt",
    "REST API Middleware",
  ];

  return (
    <div className="container">
      <Header name="Meet Thacker" />
      <NavBar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home skillList={skillList} />} />
        <Route path="/tasks" element={<Tasks onUnauthorized={handleLogout} />} />
        <Route path="/projects" element={<Tasks onUnauthorized={handleLogout} />} />
        <Route
          path="/auth"
          element={<Auth onAuthChange={handleAuthChange} onLogout={handleLogout} />}
        />
        <Route
          path="/login"
          element={<Auth onAuthChange={handleAuthChange} onLogout={handleLogout} />}
        />
        <Route
          path="/register"
          element={<Auth onAuthChange={handleAuthChange} onLogout={handleLogout} />}
        />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;

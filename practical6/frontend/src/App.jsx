import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Tasks from "./components/Tasks";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const skillList = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
    "REST API",
  ];

  return (
    <div className="container">
      <Header name="Meet Thacker" />
      <NavBar />

      <Routes>
        <Route path="/" element={<Home skillList={skillList} />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/projects" element={<Tasks />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;

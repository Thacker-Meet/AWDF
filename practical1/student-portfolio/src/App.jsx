import Header from "./components/header";
import About from "./components/about";
import Skills from "./components/skills";
import Footer from "./components/footer";
import "./App.css";
function App() {
  const skillList = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
  ];

  return (
    <div className="container">
      <Header name="Meet Thacker" />

      <About />

      <Skills skillList={skillList} />

      <Footer />
    </div>
  );
}

export default App;
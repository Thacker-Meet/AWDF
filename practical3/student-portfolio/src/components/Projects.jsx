import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const projectList = [
    {
      id: 1,
      title: "Student Portfolio Web App",
      description: "A multi-page portfolio application built using React and React Router.",
      tech: "React, Vite, CSS",
      repoUrl: "https://github.com/Thacker-Meet/AWDF"
    },
    {
      id: 2,
      title: "E-Commerce Mini Store",
      description: "A full e-commerce website featuring product catalogs and live online deployment.",
      tech: "React, Node.js, Express, MongoDB",
      repoUrl: "https://github.com/Thacker-Meet/ecommerce-mini-store"
    }
  ];

  useEffect(() => {
    fetch("https://api.github.com/users/octocat/repos")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch repositories (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setRepos(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="section">
        <h2>My Projects</h2>
        <Spinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <h2>My Projects</h2>
        <ErrorMessage message={error} />
      </section>
    );
  }

  return (
    <section className="section">
      <h2>My Projects</h2>
      <div className="projects-grid">
        {projectList.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-card-header">
              <h3>{project.title}</h3>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-repo"
              >
                Repo Link
              </a>
            </div>
            <p>{project.description}</p>
            <span className="project-tech">Tech Stack: {project.tech}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;

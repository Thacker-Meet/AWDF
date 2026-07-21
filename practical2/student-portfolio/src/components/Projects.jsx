function Projects() {
  const projectList = [
    {
      id: 1,
      title: "Student Portfolio Web App",
      description: "A multi-page portfolio application built using React and React Router.",
      tech: "React, Vite, CSS"
    },
    {
      id: 2,
      title: "E-Commerce Mini Store",
      description: "A full e-commerce website featuring product catalogs and live online deployment.",
      tech: "React, Node.js, Express, MongoDB"
    }
  ];

  return (
    <section className="section">
      <h2>My Projects</h2>
      <div className="projects-grid">
        {projectList.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <span className="project-tech">Tech Stack: {project.tech}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;

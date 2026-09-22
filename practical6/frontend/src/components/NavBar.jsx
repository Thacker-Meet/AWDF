import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Tasks Management</NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;

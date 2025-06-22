import { NavLink } from "react-router-dom"
import "./AdminSidebar.css"

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin" end>
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/movies">
              <i className="fas fa-film"></i>
              <span>Movies</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/theaters">
              <i className="fas fa-building"></i>
              <span>Theaters</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/shows">
              <i className="fas fa-calendar-alt"></i>
              <span>Shows</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/bookings">
              <i className="fas fa-ticket-alt"></i>
              <span>Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <i className="fas fa-users"></i>
              <span>Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default AdminSidebar
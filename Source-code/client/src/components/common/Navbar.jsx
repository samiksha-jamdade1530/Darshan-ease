import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!userInfo) return null;
    if (userInfo.role === 'ADMIN') return '/admin/dashboard';
    if (userInfo.role === 'ORGANIZER') return '/organizer/dashboard';
    return '/user/dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          DarshanEase
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/temples">Temples</Link>
            </li>
            {userInfo && (
              <li className="nav-item">
                <Link className="nav-link" to="/user/bookings">My Bookings</Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {userInfo ? (
              <>
                <Link to={getDashboardLink()} className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-tachometer-alt me-1"></i>
                  Dashboard
                </Link>
                <span className="badge bg-secondary">{userInfo.role}</span>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                  <i className="fas fa-sign-out-alt me-1"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

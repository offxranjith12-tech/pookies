import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav, Dropdown } from 'react-bootstrap';
import { 
  FiHome, FiCalendar, FiClock, FiCheckCircle, 
  FiUser, FiFileText, FiSettings, FiLogOut, FiMenu, FiStar 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const ArtistLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not artist, redirect
  if (!user || user.role !== 'artist') {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/artist', icon: <FiHome /> },
    { name: 'My Bookings', path: '/artist/bookings', icon: <FiCalendar /> },
    { name: 'Availability', path: '/artist/availability', icon: <FiCheckCircle /> },
    { name: 'My Profile', path: '/artist/profile', icon: <FiUser /> },
    { name: 'Reviews', path: '/artist/reviews', icon: <FiStar /> },
    { name: 'Reports', path: '/artist/reports', icon: <FiFileText /> },
    { name: 'Settings', path: '/artist/settings', icon: <FiSettings /> },
  ];

  return (
    <div className="admin-layout bg-light min-vh-100">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-pink shadow-sm px-4 py-3 sticky-top z-3">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-link d-lg-none text-dark me-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu size={24} />
          </button>
          <Link className="navbar-brand fw-bold fs-4 text-primary" to="/artist" style={{ fontFamily: 'var(--font-heading)' }}>
            BelleAura <span className="text-secondary fw-normal fs-6 ms-2">Artist Portal</span>
          </Link>
        </div>

        <div className="ms-auto d-flex align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-custom-components" className="border-0 bg-transparent d-flex align-items-center p-0">
              <div className="bg-soft-pink rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px' }}>
                <FiUser className="text-primary" />
              </div>
              <span className="d-none d-md-block fw-medium text-dark">{user.name}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow border-0 mt-2 rounded-3">
              <Dropdown.Item as={Link} to="/artist/profile"><FiUser className="me-2" /> Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to="/artist/settings"><FiSettings className="me-2" /> Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger"><FiLogOut className="me-2" /> Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>

      <Container fluid className="p-0">
        <Row className="g-0 flex-nowrap">
          {/* Sidebar */}
          <Col 
            className={`admin-sidebar bg-pink border-end pt-4 transition-all ${sidebarOpen ? 'd-block position-absolute z-3 h-100 shadow' : 'd-none d-lg-block'}`}
            style={{ flex: '0 0 230px', width: '230px', maxWidth: '230px', minHeight: 'calc(100vh - 72px)' }}
          >
            <Nav className="flex-column px-2">
              <p className="text-muted small fw-bold text-uppercase mb-3 px-2">Main Menu</p>
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path || 
                               (item.path !== '/artist' && location.pathname.startsWith(item.path));
                
                return (
                  <Nav.Link 
                    key={index}
                    as={Link} 
                    to={item.path} 
                    className={`d-flex align-items-center py-2 px-2 mb-1 rounded-3 transition-all ${
                      isActive 
                        ? 'bg-soft-pink text-primary fw-bold' 
                        : 'text-dark hover-bg-light hover-primary'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`me-2 ${isActive ? 'text-primary' : 'text-muted'}`}>{item.icon}</span>
                    {item.name}
                  </Nav.Link>
                );
              })}
              
              <Nav.Link 
                onClick={handleLogout}
                className="d-flex align-items-center py-2 px-2 mt-4 text-danger hover-bg-light rounded-3 transition-all cursor-pointer"
              >
                <FiLogOut className="me-2" />
                Logout
              </Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col className="p-4 p-md-5 overflow-auto" style={{ maxHeight: 'calc(100vh - 72px)' }}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ArtistLayout;

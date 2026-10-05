import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav, Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { FiHome, FiShoppingBag, FiUsers, FiCalendar, FiLogOut, FiMenu, FiUser, FiStar, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: <FiHome className="me-2" /> },
    { path: '/admin/products', name: 'Products', icon: <FiShoppingBag className="me-2" /> },
    { path: '/admin/orders', name: 'Orders', icon: <FiShoppingBag className="me-2" /> },
    { path: '/admin/artists', name: 'Artists', icon: <FiUsers className="me-2" /> },
    { path: '/admin/bookings', name: 'Bookings', icon: <FiCalendar className="me-2" /> },
    { path: '/admin/users', name: 'Users', icon: <FiUsers className="me-2" /> },
    { path: '/admin/reviews', name: 'Reviews', icon: <FiStar className="me-2" /> },
    { path: '/admin/reports', name: 'Reports', icon: <FiBarChart2 className="me-2" /> },
    { path: '/profile', name: 'My Profile', icon: <FiUser className="me-2" /> },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-layout min-vh-100 bg-light d-flex flex-column">
      {/* Top Navbar */}
      <BootstrapNavbar bg="white" className="border-bottom shadow-sm sticky-top px-3">
        <Button 
          variant="link" 
          className="d-md-none text-dark p-0 me-3"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <FiMenu size={24} />
        </Button>
        <BootstrapNavbar.Brand as={Link} to="/admin" className="fw-bold" style={{ color: '#d81b60' }}>
          Pookie's Admin
        </BootstrapNavbar.Brand>
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3 d-none d-sm-inline">Welcome, {user.name}</span>
          <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center">
            <FiLogOut className="me-1" /> Logout
          </Button>
        </div>
      </BootstrapNavbar>

      <Container fluid className="flex-grow-1 d-flex p-0">
        <Row className="g-0 flex-grow-1 w-100">
          {/* Sidebar */}
          <Col 
            md={3} 
            lg={2} 
            className={`bg-pink border-end ${showSidebar ? 'd-block' : 'd-none'} d-md-block`}
            style={{ position: 'sticky', top: '56px', height: 'calc(100vh - 56px)', zIndex: 1000 }}
          >
            <Nav className="flex-column p-3">
              <div className="text-muted small fw-bold mb-3 text-uppercase px-2">Menu</div>
              {menuItems.map((item) => (
                <Nav.Link 
                  key={item.path}
                  as={Link} 
                  to={item.path}
                  className={`mb-2 px-3 py-2 rounded-3 d-flex align-items-center text-dark ${location.pathname === item.path ? 'bg-soft-pink text-accent fw-bold' : ''}`}
                  onClick={() => setShowSidebar(false)}
                  style={{
                    backgroundColor: location.pathname === item.path ? '#fce4ec' : 'transparent',
                    color: location.pathname === item.path ? '#d81b60' : '#2c3e50',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.icon}
                  {item.name}
                </Nav.Link>
              ))}
              
              <div className="mt-auto pt-4 border-top">
                <Nav.Link as={Link} to="/" className="text-muted px-3 d-flex align-items-center">
                  Back to Store
                </Nav.Link>
              </div>
            </Nav>
          </Col>
          
          {/* Main Content */}
          <Col md={9} lg={10} className="p-4 overflow-auto">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLayout;

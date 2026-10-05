import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar as BootstrapNavbar, Dropdown, Badge } from 'react-bootstrap';
import { FiShoppingCart, FiUser, FiLogOut, FiSettings, FiHeart, FiStar, FiSliders, FiHelpCircle, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const LogoImage = () => (
  <img 
    src="/logo.png" 
    alt="Pookie's Logo" 
    height="120" 
    className="me-2" 
    style={{ 
      objectFit: 'contain', 
      mixBlendMode: 'multiply',
      margin: '-25px 0'
    }} 
  />
);

const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar expand="lg" className="sticky-top navbar-premium shadow-sm py-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease' }}>
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center me-4">
          <LogoImage />
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none px-0" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          {(!user || user.role !== 'admin') && (
            <Nav className="mx-auto align-items-center gap-2">
              <Nav.Link as={Link} to="/" className={`nav-link-premium mx-2 ${isActive('/') ? 'active' : ''}`}>Home</Nav.Link>
              <Nav.Link as={Link} to="/about" className={`nav-link-premium mx-2 ${isActive('/about') ? 'active' : ''}`}>About</Nav.Link>
              <Nav.Link as={Link} to="/products" className={`nav-link-premium mx-2 ${isActive('/products') ? 'active' : ''}`}>Cosmetics</Nav.Link>
              <Nav.Link as={Link} to="/artists" className={`nav-link-premium mx-2 ${isActive('/artists') ? 'active' : ''}`}>Makeup Artists</Nav.Link>
              <Nav.Link as={Link} to="/contact" className={`nav-link-premium mx-2 ${isActive('/contact') ? 'active' : ''}`}>Contact</Nav.Link>
            </Nav>
          )}

          <Nav className="align-items-center gap-3 ms-auto">
            {(!user || user.role !== 'admin') && (
              <>
                <Nav.Link as={Link} to="/wishlist" className="position-relative nav-icon-link">
                  <FiHeart size={22} className="text-dark" />
                  {wishlist.length > 0 && (
                    <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle border border-white border-2" style={{ fontSize: '0.6rem', transform: 'translate(-30%, -30%)' }}>
                      {wishlist.length}
                    </Badge>
                  )}
                </Nav.Link>

                <Nav.Link as={Link} to="/cart" className="position-relative nav-icon-link me-3">
                  <FiShoppingCart size={22} className="text-dark" />
                  {cartItemCount > 0 && (
                    <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle border border-white border-2" style={{ fontSize: '0.6rem', transform: 'translate(-30%, -30%)' }}>
                      {cartItemCount}
                    </Badge>
                  )}
                </Nav.Link>
              </>
            )}

            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="primary" id="dropdown-user" className="rounded-pill px-4 d-flex align-items-center gap-2 border-0 btn-primary">
                  <FiUser size={16} /> Account
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border-0 rounded-4 mt-2 py-2 dropdown-menu-premium" style={{ minWidth: '240px' }}>
                  <div className="px-3 py-2 border-bottom mb-2 d-flex align-items-center cursor-pointer hover-primary" style={{ cursor: 'pointer' }}>
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                      <FiUser size={20} className="text-secondary" />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-bold text-dark fs-6 text-truncate" style={{ maxWidth: '130px' }}>{user.name}</p>
                      <p className="mb-0 text-muted small text-capitalize">{user.role === 'admin' ? 'Admin' : 'Free'}</p>
                    </div>
                    <FiChevronRight className="text-muted" />
                  </div>
                  
                  {user.role === 'admin' ? (
                    <Dropdown.Item as={Link} to="/admin" className="rounded-0 py-2 d-flex align-items-center text-dark hover-primary fs-6">
                      <FiSettings className="me-3 text-dark" size={18} /> Admin Dashboard
                    </Dropdown.Item>
                  ) : (
                    <>
                      <Dropdown.Item as={Link} to="/profile" className="rounded-0 py-2 d-flex align-items-center text-dark hover-primary fs-6">
                        <FiUser className="me-3 text-dark" size={18} /> Profile
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to="/wishlist" className="rounded-0 py-2 d-flex align-items-center text-dark hover-primary fs-6">
                        <FiHeart className="me-3 text-dark" size={18} /> Wishlist
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to="/orders" className="rounded-0 py-2 d-flex align-items-center text-dark hover-primary fs-6">
                        <FiShoppingCart className="me-3 text-dark" size={18} /> My Orders
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to="/bookings" className="rounded-0 py-2 d-flex align-items-center text-dark hover-primary fs-6">
                        <FiCalendar className="me-3 text-dark" size={18} /> My Bookings
                      </Dropdown.Item>

                      <Dropdown.Item as={Link} to="/settings" className="rounded-0 py-2 d-flex align-items-center text-dark hover-primary fs-6">
                        <FiSettings className="me-3 text-dark" size={18} /> Settings
                      </Dropdown.Item>
                    </>
                  )}
                  
                  <Dropdown.Divider className="my-2" />
                  
                  <Dropdown.Item as={Link} to="/help" className="d-none rounded-0 py-2 d-flex align-items-center justify-content-between text-dark hover-primary fs-6">
                    <div className="d-flex align-items-center">
                      <FiHelpCircle className="me-3 text-dark" size={18} /> Help
                    </div>
                    <FiChevronRight className="text-muted" />
                  </Dropdown.Item>
                  
                  <Dropdown.Item onClick={handleLogout} className="rounded-0 py-2 d-flex align-items-center text-dark hover-primary fs-6">
                    <FiLogOut className="me-3 text-dark" size={18} /> Log out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link to="/login" className="btn btn-primary rounded-pill px-4 ms-2 fw-medium d-flex align-items-center gap-2">
                <FiUser size={16} /> Account
              </Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
      <style>{`
        .nav-link-premium {
          font-weight: 500;
          color: var(--text-dark) !important;
          position: relative;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem !important;
        }
        .nav-link-premium:hover, .nav-link-premium.active {
          color: var(--primary-color) !important;
        }
        .nav-link-premium::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: var(--primary-color);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }
        .nav-link-premium:hover::after, .nav-link-premium.active::after {
          width: 100%;
        }
        .nav-icon-link {
          transition: all 0.3s ease;
        }
        .nav-icon-link:hover {
          transform: translateY(-2px);
          color: var(--primary-color) !important;
        }
        .nav-icon-link:hover svg {
          color: var(--primary-color) !important;
        }
        .search-bar-premium .form-control:focus {
          border-color: var(--primary-color);
          box-shadow: none;
        }
        .search-bar-premium {
          transition: all 0.3s ease;
        }
        .search-bar-premium:focus-within {
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          border-radius: 50rem;
        }
        .dropdown-menu-premium .dropdown-item {
          transition: all 0.2s;
        }
        .dropdown-menu-premium .hover-primary:hover {
          background-color: var(--light-pink);
          color: var(--primary-color) !important;
        }
        .dropdown-menu-premium .hover-primary:hover svg {
          color: var(--primary-color) !important;
        }
        .dropdown-menu-premium .hover-danger:hover {
          background-color: #fff5f5;
        }
        .user-dropdown-premium {
          transition: all 0.2s;
        }
        .user-dropdown-premium:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.08) !important;
          transform: translateY(-1px);
        }
        .user-dropdown-premium::after {
          display: none;
        }
      `}</style>
    </BootstrapNavbar>
  );
};

export default Navbar;

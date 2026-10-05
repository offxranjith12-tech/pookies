import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LogoSVG = () => (
  <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2 mb-1">
    <rect width="100" height="100" rx="25" fill="white"/>
    <path d="M35 30H55C63.2843 30 70 36.7157 70 45C70 53.2843 63.2843 60 55 60H45V75H35V30ZM45 50H55C57.7614 50 60 47.7614 60 45C60 42.2386 57.7614 40 55 40H45V50Z" fill="#1a1a1a"/>
  </svg>
);

const Footer = () => {
  return (
    <footer style={{ padding: '4rem 0 2rem' }}>
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h4 className="fw-bold mb-3 d-flex align-items-center" style={{ letterSpacing: '1px' }}>
              <LogoSVG /> Pookie's
            </h4>
            <p className="text-muted" style={{ maxWidth: '300px' }}>
              Your premium destination for luxury cosmetics and professional makeup artist bookings. Beautifully yours.
            </p>
          </Col>
          <Col md={3}>
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none footer-link">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none footer-link">About</Link></li>
              <li className="mb-2"><Link to="/products" className="text-muted text-decoration-none footer-link">Cosmetics</Link></li>
              <li className="mb-2"><Link to="/artists" className="text-muted text-decoration-none footer-link">Makeup Artists</Link></li>
            </ul>
          </Col>
          <Col md={2}>
            <h5 className="mb-3">Customer</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/cart" className="text-muted text-decoration-none footer-link">Cart</Link></li>
              <li className="mb-2"><Link to="/login" className="text-muted text-decoration-none footer-link">Login</Link></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5 className="mb-3">Contact Us</h5>
            <p className="text-muted mb-1">Email: hello@pookies.com</p>
            <p className="text-muted mb-1">Phone: +91 98765 43210</p>
          </Col>
        </Row>
        <div className="text-center mt-5 pt-4 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>&copy; 2026 Pookie's. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  // If already logged in, redirect away from login page
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await login(email, password);
      if (data.user && data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding bg-light-pink" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
          <Row className="g-0">
            {/* Image Side */}
            <Col md={6} className="d-none d-md-block" style={{ 
              backgroundImage: `url('/images/login_banner.jpg')`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              minHeight: '600px'
            }}>
            </Col>
            
            {/* Form Side */}
            <Col md={6} className="d-flex align-items-center">
              <Card.Body className="p-4 p-md-5 w-100">
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-1 text-dark" style={{ fontFamily: 'var(--font-heading)' }}>Welcome Back</h3>
                  <p className="text-muted small">Sign in to your Pookie's account</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-medium text-muted">Email Address</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="py-2"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-medium text-muted mb-1">Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="py-2"
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 rounded-pill py-2 mb-4 fw-bold shadow-sm hover-lift"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  
                  <div className="text-center">
                    <span className="text-muted small">Don't have an account? </span>
                    <Link to={`/register?redirect=${redirect}`} className="text-accent fw-bold text-decoration-none small">
                      Create one here
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Login;

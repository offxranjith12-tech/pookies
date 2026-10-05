import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    specialization: '',
    experience: '',
    location: '',
    bio: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await register(formData);
      if (formData.role === 'admin') {
        navigate('/admin');
      } else if (formData.role === 'artist') {
        navigate('/artist');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding bg-light-pink" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
          <Row className="g-0">
            {/* Form Side */}
            <Col md={7} lg={6} className="d-flex align-items-center">
              <Card.Body className="p-4 p-md-5 w-100">
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-1 text-dark" style={{ fontFamily: 'var(--font-heading)' }}>Create Account</h3>
                  <p className="text-muted small">Join Pookie's for a premium experience</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-medium text-muted">Full Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      className="py-2"
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-medium text-muted">Email Address</Form.Label>
                        <Form.Control 
                          type="email" 
                          name="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required 
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-medium text-muted">Phone Number</Form.Label>
                        <Form.Control 
                          type="tel" 
                          name="phone"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required 
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-medium text-muted">Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required 
                          minLength="6"
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-medium text-muted">Confirm Password</Form.Label>
                        <Form.Control 
                          type="password" 
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required 
                          minLength="6"
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-medium text-muted">Account Type</Form.Label>
                    <Form.Select 
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="py-2"
                    >
                      <option value="customer">Customer</option>
                      <option value="artist">Makeup Artist</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Artist specific fields */}
                  {formData.role === 'artist' && (
                    <div className="bg-light p-4 rounded-3 mb-4">
                      <h6 className="fw-bold mb-3 text-primary">Artist Profile Details</h6>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="small fw-medium text-muted">Specialization</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="specialization"
                              placeholder="e.g. Bridal Makeup"
                              value={formData.specialization}
                              onChange={handleChange}
                              required={formData.role === 'artist'}
                              className="py-2"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="small fw-medium text-muted">Experience</Form.Label>
                            <Form.Control 
                              type="text" 
                              name="experience"
                              placeholder="e.g. 5+ years"
                              value={formData.experience}
                              onChange={handleChange}
                              required={formData.role === 'artist'}
                              className="py-2"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-medium text-muted">Location</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="location"
                          placeholder="City, State"
                          value={formData.location}
                          onChange={handleChange}
                          required={formData.role === 'artist'}
                          className="py-2"
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-medium text-muted">Bio (Optional)</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={2}
                          name="bio"
                          placeholder="Tell us about your makeup style..."
                          value={formData.bio}
                          onChange={handleChange}
                          className="py-2"
                        />
                      </Form.Group>
                    </div>
                  )}
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 rounded-pill py-2 mb-4 fw-bold shadow-sm hover-lift"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <div className="text-center">
                    <span className="text-muted small">Already have an account? </span>
                    <Link to={`/login?redirect=${redirect}`} className="text-accent fw-bold text-decoration-none small">
                      Sign In
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Col>
            
            {/* Image Side */}
            <Col md={5} lg={6} className="d-none d-md-block" style={{ 
              backgroundImage: `url('/images/register_banner.jpg')`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
            }}>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Register;

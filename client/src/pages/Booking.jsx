import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

const Booking = () => {
  const { artistId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    eventType: 'Bridal Makeup',
    eventDate: '',
    eventTime: '',
    location: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [bookingPlaced, setBookingPlaced] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/book/${artistId}`);
      return;
    }

    const fetchArtist = async () => {
      try {
        const res = await axios.get(`/api/artists/${artistId}`);
        setArtist(res.data.data);
        
        setFormData(prev => ({
          ...prev,
          customerName: user.name || '',
          phone: user.phone || '',
          email: user.email || ''
        }));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artist', error);
        setError('Artist not found');
        setLoading(false);
      }
    };
    
    fetchArtist();
  }, [artistId, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await axios.post('/api/bookings', {
        ...formData,
        artistId
      });
      
      setBookingPlaced(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error && !artist) {
    return (
      <Container className="py-5 text-center">
        <h2>{error}</h2>
        <Button as={Link} to="/artists" variant="primary" className="mt-3">Browse Artists</Button>
      </Container>
    );
  }

  if (bookingPlaced) {
    return (
      <Container className="py-5 text-center my-5">
        <FiCheckCircle size={80} className="text-success mb-4" />
        <h2 className="mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Booking Request Submitted!</h2>
        <p className="lead text-muted mb-4">
          Your request has been sent to {artist?.name}. They will review it and confirm your booking soon.
        </p>
        <Card className="d-inline-block text-start p-4 shadow-sm border-0 bg-light-pink rounded-4 mb-4">
          <p className="mb-2"><strong>Booking ID:</strong> #{bookingPlaced.id.toString().padStart(4, '0')}</p>
          <p className="mb-2"><strong>Event Date:</strong> {new Date(bookingPlaced.eventDate).toLocaleDateString()}</p>
          <p className="mb-0"><strong>Status:</strong> {bookingPlaced.status}</p>
        </Card>
        <div className="mt-3">
          <Button as={Link} to="/bookings" variant="outline-primary" className="rounded-pill px-4 me-3">
            View My Bookings
          </Button>
          <Button as={Link} to="/" variant="primary" className="rounded-pill px-4">
            Go Home
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="section-padding bg-light-pink">
      <Container>
        <Button 
          variant="link" 
          className="text-muted text-decoration-none p-0 mb-4 d-flex align-items-center"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="me-2" /> Back to Profile
        </Button>
        
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4">
              <div className="bg-soft-pink p-4 p-md-5 text-center border-bottom">
                <h3 className="fw-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Book an Appointment</h3>
                <p className="text-muted mb-0">with <strong className="text-dark">{artist?.name}</strong></p>
              </div>
              
              <Card.Body className="p-4 p-md-5">
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Your Details</h5>
                  <Row className="mb-4">
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-medium text-muted">Full Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-medium text-muted">Email Address</Form.Label>
                        <Form.Control 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-medium text-muted">Phone Number</Form.Label>
                        <Form.Control 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="fw-bold mb-3 border-bottom pb-2">Event Details</h5>
                  <Row className="mb-4">
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-medium text-muted">Event Type</Form.Label>
                        <Form.Select 
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleChange}
                          required
                        >
                          <option value="Bridal Makeup">Bridal Makeup</option>
                          <option value="Engagement">Engagement</option>
                          <option value="Reception">Reception</option>
                          <option value="Party Makeup">Party Makeup</option>
                          <option value="Photoshoot">Photoshoot</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-medium text-muted">Date</Form.Label>
                        <Form.Control 
                          type="date" 
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-medium text-muted">Time (Approx)</Form.Label>
                        <Form.Control 
                          type="time" 
                          name="eventTime"
                          value={formData.eventTime}
                          onChange={handleChange}
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-medium text-muted">Venue / Location</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="location"
                          placeholder="Full address of the event venue"
                          value={formData.location}
                          onChange={handleChange}
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-medium text-muted">Additional Notes (Optional)</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          name="notes"
                          placeholder="Any specific requirements or preferences?"
                          value={formData.notes}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="alert alert-info border-0 bg-soft-pink text-dark rounded-3 d-flex align-items-center p-3 mb-4">
                    <FiCheckCircle className="text-accent me-2 fs-4" />
                    <div>
                      <strong>Note:</strong> This is a booking request. The artist will contact you to confirm availability and discuss payment details.
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="w-100 rounded-pill fw-bold"
                    disabled={submitting}
                  >
                    {submitting ? <Spinner size="sm" animation="border" /> : 'Submit Booking Request'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Booking;

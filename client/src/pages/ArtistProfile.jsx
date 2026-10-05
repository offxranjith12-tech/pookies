import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiMapPin, FiClock, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import ReviewSection from '../components/ReviewSection';

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await axios.get(`/api/artists/${id}`);
        setArtist(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artist', error);
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!artist) {
    return (
      <Container className="py-5 text-center">
        <h2>Artist not found</h2>
        <Button as={Link} to="/artists" variant="primary" className="mt-3">Back to Artists</Button>
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
          <FiArrowLeft className="me-2" /> Back
        </Button>
        
        <Row>
          <Col lg={4} className="mb-4 mb-lg-0">
            <Card className="border-0 shadow-sm rounded-4 text-center overflow-hidden">
              <div className="bg-soft-pink py-5">
                <img 
                  src={artist.image && artist.image !== 'no-photo.jpg' ? (artist.image.startsWith('http') ? artist.image : `http://localhost:5000${artist.image}`) : "/images/artist_profile_sample.jpg"} 
                  alt={artist.name} 
                  className="rounded-circle border border-4 border-white shadow"
                  style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                />
              </div>
              <Card.Body className="p-4 pt-5 position-relative">
                <div className="position-absolute top-0 start-50 translate-middle">
                  <Badge bg={artist.available ? "success" : "danger"} className="px-3 py-2 rounded-pill fw-normal">
                    {artist.available ? 'Available for Booking' : 'Currently Unavailable'}
                  </Badge>
                </div>
                
                <h3 className="fw-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{artist.name}</h3>
                <p className="text-accent mb-3">{artist.specialization}</p>
                
                <div className="d-flex justify-content-center align-items-center mb-4 gap-4">
                  <div className="text-center">
                    <div className="d-flex align-items-center justify-content-center text-warning mb-1">
                      <FiStar fill="currentColor" />
                      <span className="fw-bold ms-1 text-dark">{artist.rating.toFixed(1)}</span>
                    </div>
                    <small className="text-muted">Rating</small>
                  </div>
                  <div className="text-center border-start border-end px-4">
                    <div className="d-flex align-items-center justify-content-center text-dark fw-bold mb-1">
                      <FiClock className="me-1 text-muted" /> {artist.experience}
                    </div>
                    <small className="text-muted">Experience</small>
                  </div>
                  <div className="text-center">
                    <div className="d-flex align-items-center justify-content-center text-dark fw-bold mb-1">
                      <FiMapPin className="me-1 text-muted" /> {artist.location}
                    </div>
                    <small className="text-muted">Location</small>
                  </div>
                </div>
                
                <div className="bg-light rounded-3 p-3 mb-4 text-start">
                  <small className="text-muted d-block mb-1">Starting Price</small>
                  <span className="fs-4 fw-bold">₹{artist.startingPrice}</span>
                </div>
                
                <Button 
                  as={Link} 
                  to={`/book/${artist.id}`} 
                  variant="primary" 
                  size="lg" 
                  className="w-100 rounded-pill"
                  disabled={!artist.available}
                >
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4 p-md-5">
                <h4 className="fw-bold mb-4">About the Artist</h4>
                <p className="text-muted lh-lg mb-5" style={{ fontSize: '1.1rem' }}>
                  {artist.description}
                </p>
                
                <h4 className="fw-bold mb-4">Services Offered</h4>
                <Row className="gy-3">
                  {artist.services.map((service, idx) => (
                    <Col md={6} key={idx}>
                      <div className="d-flex align-items-center p-3 border rounded-3 bg-light-pink">
                        <div className="bg-pink rounded-circle p-2 me-3 shadow-sm text-accent">
                          <FiCheck />
                        </div>
                        <span className="fw-medium">{service}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="mt-5">
          <Col md={12} lg={10} className="mx-auto">
            <ReviewSection targetType="artist" targetId={artist.id} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ArtistProfile;

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FiStar, FiMapPin } from 'react-icons/fi';
import axios from 'axios';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('All');
  
  const location = useLocation();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await axios.get('/api/artists');
        setArtists(res.data.data);
        
        const searchParams = new URLSearchParams(location.search);
        const specParam = searchParams.get('specialization');
        if (specParam) {
          setSpecialization(specParam);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artists', error);
        setLoading(false);
      }
    };
    fetchArtists();
  }, [location]);

  const specializations = ['All', 'Bridal Makeup', 'Party Makeup', 'Engagement & Reception', 'HD Bridal Makeup'];

  const filteredArtists = specialization === 'All' 
    ? artists 
    : artists.filter(a => a.specialization.includes(specialization) || a.services.includes(specialization));

  return (
    <div className="section-padding bg-light-pink">
      {/* Banner Section */}
      <div className="position-relative d-flex align-items-center justify-content-center mb-5" style={{ 
        minHeight: '40vh', 
        backgroundImage: `url('/images/artists_banner.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        margin: '-3rem -0.75rem 3rem -0.75rem'
      }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
        <div className="position-relative text-center z-index-1 p-4 rounded-4 shadow-sm mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.90)', backdropFilter: 'blur(10px)' }}>
          <h2 className="section-title mb-2 fw-bold" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>Professional Makeup Artists</h2>
          <p className="text-dark fs-6 fw-medium mb-0" style={{ letterSpacing: '1px' }}>Find the perfect artist for your special day.</p>
        </div>
      </div>

      <Container>

        <Row>
          <Col md={12}>
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : filteredArtists.length === 0 ? (
              <div className="text-center py-5">
                <h4>No artists found for this specialization.</h4>
              </div>
            ) : (
              <Row className="gy-4">
                {filteredArtists.map((artist) => (
                  <Col md={6} lg={4} key={artist.id}>
                    <Card className="premium-card text-center h-100">
                      <div className="pt-4">
                        <img 
                          src={artist.image && artist.image !== 'no-photo.jpg' ? (artist.image.startsWith('http') ? artist.image : `http://localhost:5000${artist.image}`) : "/images/artist_profile_sample.jpg"} 
                          alt={artist.name} 
                          className="rounded-circle border border-3 border-light shadow-sm"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fs-5 mb-1">{artist.name}</Card.Title>
                        <p className="text-accent small fw-medium mb-2">{artist.specialization}</p>
                        
                        <div className="d-flex justify-content-center align-items-center mb-2">
                          <FiStar className="text-warning fill-warning me-1" fill="currentColor" />
                          <span className="fw-bold">{artist.rating.toFixed(1)}</span>
                        </div>
                        
                        <p className="text-muted small mb-3">
                          <FiMapPin className="me-1" /> {artist.location}
                        </p>
                        
                        <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                          <div>
                            <span className="small text-muted d-block lh-1">Starting from</span>
                            <span className="fw-bold fs-6">₹{artist.startingPrice}</span>
                          </div>
                          <Button as={Link} to={`/artists/${artist.id}`} variant="outline-primary" size="sm" className="rounded-pill px-3">
                            Profile
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Artists;

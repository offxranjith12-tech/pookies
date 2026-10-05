import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, artistsRes] = await Promise.all([
          axios.get('/api/products?limit=4'),
          axios.get('/api/artists?limit=3')
        ]);
        setProducts(productsRes.data.data.slice(0, 4));
        setArtists(artistsRes.data.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const toggleWishlist = (product) => {
    const pId = product.id || product._id;
    if (isInWishlist(pId)) {
      removeFromWishlist(pId);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <Carousel 
          fade 
          controls={true} 
          indicators={true} 
          pause="hover"
          interval={4000}
          className="position-absolute w-100 h-100 hero-carousel" 
          style={{ top: 0, left: 0, zIndex: 0 }}
        >
          {[
            "/images/bridal-beauty.jpg",
            "/images/glam-makeup.jpg",
            "/images/natural-beauty.jpg",
            "/images/red-carpet-glam.jpg",
            "/images/bridal-artist.jpg",
            "/images/luxury-beauty.jpg"
          ].map((src, index) => (
            <Carousel.Item key={index} className="h-100">
              <div 
                className="w-100 h-100" 
                style={{ 
                  backgroundImage: `url(${src})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center'
                }} 
              />
            </Carousel.Item>
          ))}
        </Carousel>
        
        {/* Dark Luxury Overlay to make images visible but text readable */}
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', top: 0, left: 0, zIndex: 0 }}></div>

        <Container className="position-relative w-100" style={{ zIndex: 1 }}>
          <Row className="align-items-center justify-content-center">
            {/* Center Content */}
            <Col lg={9} className="py-5 text-center">
              <div className="d-flex align-items-center justify-content-center mb-4 fade-in">
                <div style={{ height: '2px', width: '50px', backgroundColor: '#E9A8BD' }}></div>
                <span className="fw-bold tracking-wider small mx-4" style={{ letterSpacing: '4px', color: '#E9A8BD', textTransform: 'uppercase' }}>Welcome to Pookie's</span>
                <div style={{ height: '2px', width: '50px', backgroundColor: '#E9A8BD' }}></div>
              </div>
              
              <h1 className="hero-title fw-bold mb-4 fade-in" style={{ color: '#FFFFFF', fontSize: '5rem', animationDelay: '0.2s', textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                Discover Your True <br/>
                <span style={{ color: '#E9A8BD', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500 }}>Radiance</span>
              </h1>
              
              <p className="hero-subtitle fw-medium mb-5 mx-auto fade-in" style={{ maxWidth: '750px', fontSize: '1.2rem', color: '#F0DDE4', animationDelay: '0.4s', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Experience the ultimate luxury in beauty. We bring together the finest premium cosmetics and professional makeup artistry to celebrate your unique elegance.
              </p>
              
              <div className="d-flex align-items-center justify-content-center gap-4 fade-in" style={{ animationDelay: '0.6s' }}>
                <Button as={Link} to="/products" variant="primary" className="px-5 py-3 rounded-pill hover-lift shadow-lg fw-bold border-0" style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}>
                  Shop Premium Collection
                </Button>
                <Button as={Link} to="/artists" className="btn btn-outline-light px-5 py-3 rounded-pill hover-lift shadow-sm fw-bold">
                  Book an Artist
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {loading ? (
        <div className="text-center py-5 my-5"><Spinner animation="border" style={{ color: 'var(--primary-color)' }} /></div>
      ) : (
        <>
          {/* Featured Products */}
          <section className="section-padding">
            <Container>
              <h2 className="section-title fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>Featured Products</h2>
              <Row className="gy-4">
                {products.length > 0 ? products.map((product) => (
                  <Col md={6} lg={3} key={product.id || product._id}>
                    <Card className="premium-card h-100 border-0 rounded-4 shadow-sm hover-lift">
                      <div className="position-relative overflow-hidden rounded-top-4">
                        <Link to={`/products/${product.id || product._id}`}>
                          <Card.Img
                            variant="top"
                            src={product.image && product.image !== 'no-photo.jpg' ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=100&q=80"}
                            style={{ height: '240px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            className="product-img-zoom"
                          />
                        </Link>
                        <Button
                          variant="light"
                          className="position-absolute top-0 end-0 m-3 rounded-circle p-2 shadow-sm bg-pink"
                          style={{ width: '38px', height: '38px', zIndex: 2 }}
                          onClick={() => toggleWishlist(product)}
                        >
                          <FiHeart size={18} className={isInWishlist(product.id || product._id) ? "text-danger" : "text-muted"} fill={isInWishlist(product.id || product._id) ? "currentColor" : "none"} />
                        </Button>
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <p className="text-muted mb-1 small text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>{product.brand}</p>
                        <Card.Title className="fw-bold fs-6 mb-2">{product.name}</Card.Title>
                        <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                          <span className="price fw-bold" style={{ color: 'var(--primary-color)' }}>₹{product.price}</span>
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-pill px-3 shadow-sm hover-lift"
                            onClick={() => addToCart(product, 1)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )) : (
                  <Col><p className="text-center text-muted">No products available.</p></Col>
                )}
              </Row>
              <div className="text-center mt-5">
                <Button as={Link} to="/products" variant="outline-primary" className="rounded-pill px-4 py-2 hover-lift bg-pink">View All Products</Button>
              </div>
            </Container>
          </section>

          {/* Bridal Section */}
          <section className="section-padding bg-soft-pink">
            <Container>
              <Row className="align-items-center flex-row-reverse">
                <Col lg={6} className="mb-5 mb-lg-0">
                  <h2 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>Complete Your Bridal Look</h2>
                  <p className="lead text-muted mb-4">
                    Make your special day perfect with our curated selection of premium bridal cosmetics and top-tier makeup artists.
                  </p>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-3 d-flex align-items-center">
                      <span className="bg-pink p-2 rounded-circle me-3 shadow-sm text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>✓</span>
                      <span className="fw-medium text-dark">Long-lasting premium makeup products</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <span className="bg-pink p-2 rounded-circle me-3 shadow-sm text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>✓</span>
                      <span className="fw-medium text-dark">Certified professional bridal artists</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <span className="bg-pink p-2 rounded-circle me-3 shadow-sm text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>✓</span>
                      <span className="fw-medium text-dark">Tailored looks for your special day</span>
                    </li>
                  </ul>
                  <Button as={Link} to="/artists" variant="primary" size="lg" className="rounded-pill px-4 shadow-sm hover-lift mt-2">
                    Plan Your Bridal Look
                  </Button>
                </Col>
                <Col lg={6}>
                  <div className="position-relative pe-lg-5">
                    <img
                      src="/bridal-makeup.jpg"
                      alt="Bridal Makeup"
                      className="img-fluid rounded-4 shadow-lg hover-lift"
                      style={{ transition: 'transform 0.5s ease' }}
                    />
                    <div className="position-absolute bottom-0 end-0 bg-pink p-4 rounded-4 shadow-lg m-4 m-lg-0 translate-middle-y d-none d-md-block" style={{ maxWidth: '250px', zIndex: 10 }}>
                      <div className="d-flex text-warning mb-2 gap-1">
                        <FiStar fill="currentColor" />
                        <FiStar fill="currentColor" />
                        <FiStar fill="currentColor" />
                        <FiStar fill="currentColor" />
                        <FiStar fill="currentColor" />
                      </div>
                      <p className="mb-0 fw-medium small lh-sm text-dark">"The best bridal makeup experience I could have asked for!"</p>
                      <p className="text-muted small mt-2 mb-0 fw-bold">- Priya S.</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          {/* Real Brides Reviews */}
          <section className="section-padding bg-light-pink">
            <Container>
              <div className="text-center mb-5">
                <h2 className="section-title fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>Real Brides, Real Reviews</h2>
                <p className="text-muted">See the magic our artists create on their special day.</p>
              </div>
              <Row className="gy-4 justify-content-center">
                {[
                  { img: '/reviews/bridal_1.jpg', name: 'Priya Sharma', review: "The makeup was absolutely flawless and lasted all day! I felt like a queen." },
                  { img: '/reviews/bridal_2.jpg', name: 'Neha Reddy', review: "Loved the elegant floral bun, it matched my outfit perfectly and stayed intact." },
                  { img: '/reviews/bridal_3.jpg', name: 'Sneha Patel', review: "My reception look was a dream come true, thank you Pookie's for the magic!" },
                  { img: '/reviews/bridal_4.jpg', name: 'Anjali Verma', review: "Highly recommend the artists here. So professional, talented, and patient!" },
                  { img: '/reviews/bridal_5.jpg', name: 'Ritika Gupta', review: "From skincare prep to final touches, everything was top-notch and premium." },
                ].map((review, idx) => (
                  <Col md={6} lg={4} key={idx}>
                    <Card className="premium-card h-100 border-0 rounded-4 shadow-sm hover-lift bg-pink p-3">
                      <div className="position-relative overflow-hidden rounded-4 mb-3">
                        <Card.Img
                          variant="top"
                          src={review.img}
                          style={{ height: '200px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          className="product-img-zoom"
                        />
                      </div>
                      <Card.Body className="p-0 text-center d-flex flex-column">
                        <div className="d-flex text-warning mb-3 justify-content-center gap-1">
                          {[...Array(5)].map((_, i) => <FiStar key={i} fill="currentColor" size={14} />)}
                        </div>
                        <p className="fst-italic text-muted mb-3 flex-grow-1 lh-base" style={{ fontSize: '0.95rem' }}>"{review.review}"</p>
                        <p className="fw-bold mb-0 text-dark" style={{ letterSpacing: '0.5px' }}>- {review.name}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>

          {/* Featured Artists */}
          <section className="section-padding">
            <Container>
              <h2 className="section-title fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>Top Rated Artists</h2>
              <Row className="gy-4">
                {artists.length > 0 ? artists.map((artist) => (
                  <Col md={4} key={artist.id}>
                    <Card className="premium-card text-center h-100 border-0 rounded-4 shadow-sm hover-lift">
                      <div className="pt-4 pb-2 position-relative">
                        <div className="position-absolute w-100 h-50 top-0 start-0 bg-soft-pink rounded-top-4" style={{ zIndex: 0 }}></div>
                        <img
                          src={artist.image && artist.image !== 'no-photo.jpg' ? (artist.image.startsWith('http') ? artist.image : `http://localhost:5000${artist.image}`) : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}
                          alt={artist.name}
                          className="rounded-circle border border-4 border-white shadow-sm position-relative"
                          style={{ width: '130px', height: '130px', objectFit: 'cover', zIndex: 1 }}
                        />
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="fw-bold fs-5 mb-1">{artist.name}</Card.Title>
                        <p className="text-primary mb-2 fw-medium small">{artist.specialization}</p>
                        <div className="d-flex justify-content-center align-items-center mb-3">
                          <FiStar className="text-warning fill-warning me-1" fill="currentColor" />
                          <span className="fw-bold me-1">{artist.rating?.toFixed(1) || '5.0'}</span>
                          <span className="text-muted small">({artist.reviews || 0} reviews)</span>
                        </div>
                        <p className="text-muted small mb-4">{artist.location} • Starting from <span className="fw-bold text-dark">₹{artist.startingPrice}</span></p>
                        <Button as={Link} to={`/artists/${artist.id}`} variant="outline-primary" className="w-100 mt-auto rounded-pill hover-lift bg-pink">
                          View Profile
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                )) : (
                  <Col><p className="text-center text-muted">No artists available.</p></Col>
                )}
              </Row>
            </Container>
          </section>
        </>
      )}
    </>
  );
};

export default Home;

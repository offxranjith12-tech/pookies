import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiHeart, FiStar, FiShoppingBag, FiSmile } from 'react-icons/fi';

const About = () => {
  return (
    <div className="bg-light-pink fade-in">
      {/* Hero Section */}
      <div className="position-relative d-flex align-items-center justify-content-center" style={{ 
        minHeight: '60vh', 
        backgroundImage: `url('/images/about_banner.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}>
        {/* Subtle overlay */}
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
        
        <Container className="position-relative text-center z-index-1">
          <div className="p-4 p-md-5 rounded-4 shadow-sm mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', maxWidth: '700px' }}>
            <h1 className="fw-bold mb-3" style={{ fontSize: '4rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>About Pookie's</h1>
            <p className="fs-4 text-dark fw-medium" style={{ letterSpacing: '1px', fontFamily: 'var(--font-cursive)', color: 'var(--accent-pink)' }}>Beauty that feels uniquely yours.</p>
            <p className="text-muted mt-4 mx-auto" style={{ maxWidth: '600px' }}>
              Pookie's is a modern beauty and cosmetics destination, designed to elevate your everyday routine into a luxurious experience.
            </p>
          </div>
        </Container>
      </div>

      <Container className="section-padding">
        {/* About the Brand */}
        <Row className="justify-content-center mb-5 text-center">
          <Col md={10} lg={8}>
            <h2 className="section-title mb-4">About the Brand</h2>
            <p className="text-muted lh-lg fs-5">
              Pookie's brings together carefully selected cosmetics, skincare, beauty essentials and makeup products in one elegant shopping experience. We believe that everyone deserves to feel beautiful, which is why we curate only the finest products that blend quality, luxury, and affordability.
            </p>
          </Col>
        </Row>

        {/* Our Story */}
        <Row className="align-items-center my-5 py-5">
          <Col lg={6} className="mb-4 mb-lg-0 pe-lg-5">
            <h2 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Our Story</h2>
            <p className="text-muted lh-lg mb-4">
              What started as a small passion project for sharing beauty tips quickly blossomed into Pookie's. We noticed a gap in the market for a platform that not only offered premium products but also connected users with professional makeup artists. 
            </p>
            <p className="text-muted lh-lg">
              Today, Pookie's stands as a vibrant community. Whether you are prepping for your wedding day or just looking for the perfect daily moisturizer, our curated collections and expert artist bookings are here to serve your every beauty need.
            </p>
          </Col>
          <Col lg={6}>
            <div className="position-relative">
              <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop" alt="Beauty concept" className="img-fluid rounded-4 shadow-lg hover-lift" />
            </div>
          </Col>
        </Row>

        {/* Why Choose Pookie's */}
        <div className="my-5 py-5">
          <h2 className="section-title text-center mb-5">Why Choose Pookie's?</h2>
          <Row className="gy-4">
            {[
              { icon: <FiStar size={24} />, title: "Quality Beauty Products", desc: "Sourced from the best manufacturers ensuring top-tier formulations." },
              { icon: <FiHeart size={24} />, title: "Affordable Luxury", desc: "Experience premium beauty without the overwhelming price tags." },
              { icon: <FiCheckCircle size={24} />, title: "Carefully Selected Collection", desc: "Every product is hand-picked and tested for exceptional performance." },
              { icon: <FiShoppingBag size={24} />, title: "Simple Shopping Experience", desc: "A clean, modern interface designed to make finding what you need effortless." },
              { icon: <FiSmile size={24} />, title: "Customer-Focused Service", desc: "Your satisfaction and beauty journey are our ultimate priorities." }
            ].map((feature, idx) => (
              <Col md={6} lg={4} key={idx}>
                <Card className="h-100 border-0 shadow-sm rounded-4 hover-lift" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <Card.Body className="p-4 text-center">
                    <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--primary-color)' }}>
                      {feature.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{feature.title}</h5>
                    <p className="text-muted mb-0">{feature.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* CTA */}
        <div className="text-center py-5 my-4 rounded-4" style={{ backgroundColor: 'var(--primary-color)' }}>
          <h2 className="fw-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Discover Your Beauty</h2>
          <Button as={Link} to="/products" variant="light" size="lg" className="rounded-pill px-5 py-3 fw-bold shadow-sm hover-lift" style={{ color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Shop Now
          </Button>
        </div>

      </Container>
    </div>
  );
};

export default About;

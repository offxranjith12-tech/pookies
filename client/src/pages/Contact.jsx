import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting Pookie's! We will get back to you soon.");
  };

  return (
    <div className="fade-in">
      {/* Banner Section */}
      <div className="position-relative d-flex align-items-center justify-content-end" style={{ 
        minHeight: '50vh', 
        backgroundImage: `url('/images/contact_banner.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        paddingRight: '10%'
      }}>
        {/* Subtle gradient overlay to make right side text pop if needed */}
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: '50%', background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.95) 100%)' }}></div>
        
        <div className="position-relative z-index-1 p-5 rounded-4 shadow-sm text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', maxWidth: '500px' }}>
          <h1 className="fw-bold mb-3" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>Get in Touch <br/>with Pookie's</h1>
          <p className="text-muted lead mx-auto mb-0">
            Have questions about our products, bookings, or your recent order? We'd love to hear from you.
          </p>
        </div>
      </div>

      <Container className="my-5 py-4">
        <Row className="g-5">
          <Col lg={4}>
            <div className="pe-lg-4">
              <h3 className="fw-bold mb-4">Get in Touch</h3>
              <p className="text-muted mb-5">
                Our beauty experts are here to help you find the perfect products and artists for your needs.
              </p>

              <div className="d-flex mb-4 align-items-center">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3 flex-shrink-0">
                  <FiMapPin size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Our Location</h6>
                  <p className="text-muted mb-0">123 Beauty Boulevard, Fashion District, FD 10001</p>
                </div>
              </div>

              <div className="d-flex mb-4 align-items-center">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3 flex-shrink-0">
                  <FiPhone size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Call Us</h6>
                  <p className="text-muted mb-0">+1 (800) POOKIES</p>
                </div>
              </div>

              <div className="d-flex mb-4 align-items-center">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3 flex-shrink-0">
                  <FiMail size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Email Us</h6>
                  <p className="text-muted mb-0">support@pookies.com</p>
                </div>
              </div>
            </div>
          </Col>

          <Col lg={8}>
            <Card className="border-0 shadow-lg rounded-4 p-4 p-md-5">
              <h4 className="fw-bold mb-4">Send us a Message</h4>
              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">Full Name</Form.Label>
                      <Form.Control type="text" placeholder="Jane Doe" required className="py-2 px-3" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">Email Address</Form.Label>
                      <Form.Control type="email" placeholder="jane@example.com" required className="py-2 px-3" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">Subject</Form.Label>
                      <Form.Control type="text" placeholder="How can we help?" required className="py-2 px-3" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">Message</Form.Label>
                      <Form.Control as="textarea" rows={5} placeholder="Write your message here..." required className="py-2 px-3" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Button variant="primary" type="submit" className="rounded-pill px-5 py-2 hover-lift d-flex align-items-center justify-content-center">
                      <FiSend className="me-2" /> Send Message
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;

import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center my-5 fade-in">
        <div className="mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '100px', height: '100px' }}>
          <FiShoppingBag size={40} style={{ color: 'var(--primary-color)' }} />
        </div>
        <h2 className="mb-3 fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>Your Cart is Empty</h2>
        <p className="text-muted mb-4 fs-5">Looks like you haven't added any beauty essentials yet.</p>
        <Button as={Link} to="/products" variant="primary" size="lg" className="rounded-pill px-5 hover-lift fw-medium">
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <div className="section-padding bg-light-pink fade-in" style={{ minHeight: '80vh' }}>
      {/* Banner Section */}
      <div className="position-relative d-flex align-items-center justify-content-center mb-5" style={{ 
        minHeight: '30vh', 
        backgroundImage: `url('/images/cart_banner.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
        <div className="position-relative text-center z-index-1 p-4 rounded-4 shadow-sm mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)' }}>
          <h2 className="fw-bold mb-0 px-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>Shopping Cart</h2>
        </div>
      </div>

      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0 text-dark">Your Items</h4>
          <Button variant="outline-danger" size="sm" onClick={clearCart} className="rounded-pill px-4 fw-medium hover-lift">
            Clear Cart
          </Button>
        </div>
        
        <Row className="gy-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 mb-4 hover-lift" style={{ transition: 'all 0.3s' }}>
              <Card.Body className="p-0">
                {cart.map((item, index) => (
                  <div key={item.id || item._id} className={`p-4 ${index !== cart.length - 1 ? "border-bottom" : ""}`}>
                    <Row className="align-items-center">
                      <Col xs={4} md={2}>
                        <div className="position-relative overflow-hidden rounded-3" style={{ aspectRatio: '1/1' }}>
                          <img 
                            src={item.image !== 'no-photo.jpg' ? (item.image.startsWith('http') || item.image.startsWith('/images') ? item.image : `http://localhost:5000${item.image}`) : "/images/product_detail_hero.jpg"} 
                            alt={item.name} 
                            className="img-fluid position-absolute top-0 left-0 w-100 h-100 object-fit-cover hover-scale"
                          />
                        </div>
                      </Col>
                      <Col xs={8} md={4}>
                        <Badge bg="light" text="dark" className="border rounded-pill fw-normal mb-2 d-inline-block px-2">{item.brand}</Badge>
                        <h5 className="mb-1 fw-bold text-dark">{item.name}</h5>
                        <p className="text-muted small mb-0">₹{item.price} each</p>
                      </Col>
                      <Col xs={12} md={3} className="mt-4 mt-md-0 d-flex justify-content-center">
                        <div className="border rounded-pill px-2 py-1 d-flex align-items-center bg-pink shadow-sm" style={{ borderColor: 'var(--soft-pink)' }}>
                          <Button 
                            variant="link" 
                            className="p-2 text-dark text-decoration-none rounded-circle hover-light"
                            onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus size={14} />
                          </Button>
                          <span className="mx-3 fw-bold" style={{ width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <Button 
                            variant="link" 
                            className="p-2 text-dark text-decoration-none rounded-circle hover-light"
                            onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                          >
                            <FiPlus size={14} />
                          </Button>
                        </div>
                      </Col>
                      <Col xs={6} md={2} className="mt-4 mt-md-0 text-md-end">
                        <span className="fw-bold fs-5" style={{ color: 'var(--primary-color)' }}>₹{item.price * item.quantity}</span>
                      </Col>
                      <Col xs={6} md={1} className="mt-4 mt-md-0 text-end">
                        <Button 
                          variant="light" 
                          className="text-danger p-2 rounded-circle hover-danger"
                          onClick={() => removeFromCart(item.id || item._id)}
                          title="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>
            
            <Link to="/products" className="text-decoration-none text-muted d-inline-flex align-items-center mt-2 hover-primary fw-medium transition-all">
              <FiArrowLeft className="me-2" /> Continue Shopping
            </Link>
          </Col>
          
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 bg-pink position-sticky hover-lift" style={{ top: '100px', transition: 'all 0.3s' }}>
              <Card.Body className="p-4 p-lg-5">
                <h4 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Order Summary</h4>
                
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="fw-medium text-dark">₹{getCartTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-4 pb-4 border-bottom">
                  <span className="text-muted">Shipping Estimate</span>
                  <span className="text-success fw-bold bg-success bg-opacity-10 px-2 rounded">Free</span>
                </div>
                
                <div className="d-flex justify-content-between mb-4 align-items-center">
                  <span className="fw-bold fs-5 text-dark">Total</span>
                  <span className="fw-bold fs-3" style={{ color: 'var(--primary-color)' }}>₹{getCartTotal()}</span>
                </div>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 rounded-pill shadow hover-lift fw-bold"
                  onClick={handleCheckout}
                  style={{ padding: '12px' }}
                >
                  Proceed to Checkout
                </Button>
                
                <p className="text-center text-muted small mt-4 mb-0">
                  <FiCheckCircle className="me-1 text-success" /> Secure Checkout 
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <style>{`
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: scale(1.05); }
        .hover-light:hover { background-color: var(--light-pink); color: var(--primary-color) !important; }
        .hover-danger:hover { background-color: #fff5f5; }
        .hover-primary:hover { color: var(--primary-color) !important; transform: translateX(-3px); }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
    </div>
  );
};

export default Cart;

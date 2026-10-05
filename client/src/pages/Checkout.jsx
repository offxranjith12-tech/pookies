import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiCheckCircle } from 'react-icons/fi';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      setFormData({
        customerName: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: '',
        paymentMethod: ''
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        ...formData,
        products: cart.map(item => ({
          productId: item.id || item._id,
          quantity: item.quantity
        }))
      };

      const res = await axios.post('/api/orders', orderData);
      
      setOrderPlaced(res.data.data);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <Container className="py-5 text-center my-5">
        <FiCheckCircle size={80} className="text-success mb-4" />
        <h2 className="mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Order Placed Successfully!</h2>
        <p className="lead text-muted mb-4">
          Thank you for shopping with Pookie's. Your beauty essentials will be delivered soon.
        </p>
        <Card className="d-inline-block text-start p-4 shadow-sm border-0 bg-light-pink rounded-4 mb-4">
          <p className="mb-2"><strong>Order ID:</strong> {orderPlaced.id || orderPlaced._id}</p>
          <p className="mb-2"><strong>Amount:</strong> ₹{orderPlaced.totalAmount}</p>
          <p className="mb-0"><strong>Status:</strong> {orderPlaced.status}</p>
        </Card>
        <div className="mt-3">
          <Button as={Link} to="/products" variant="primary" className="rounded-pill px-4 me-3">
            Continue Shopping
          </Button>
          <Button as={Link} to="/" variant="outline-primary" className="rounded-pill px-4">
            Go Home
          </Button>
        </div>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center my-5">
        <h2>Your Cart is Empty</h2>
        <Button as={Link} to="/products" variant="primary" className="mt-3">Start Shopping</Button>
      </Container>
    );
  }

  return (
    <div className="section-padding bg-light-pink">
      <Container>
        <h2 className="section-title text-start mb-5">Checkout</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          <Col lg={7} className="mb-4 mb-lg-0">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4 p-md-5">
                <h4 className="mb-4 fw-bold">Delivery Details</h4>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Full Name</Form.Label>
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
                        <Form.Label>Email Address</Form.Label>
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
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mb-4">
                      <Form.Group>
                        <Form.Label>Complete Delivery Address</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required 
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Col md={12} className="mb-4">
                    <Form.Group>
                      <Form.Label className="fw-bold mb-3 d-block fs-5 border-bottom pb-2">Payment Method</Form.Label>
                      <div className="d-flex flex-wrap gap-3">
                        {['Cash on Delivery', 'UPI', 'Google Pay (GPay)', 'PhonePe', 'Paytm', 'Credit / Debit Card'].map((method, idx) => (
                          <div key={idx} className="border rounded-3 p-3 flex-grow-1" style={{ flexBasis: '45%' }}>
                            <Form.Check 
                              type="radio"
                              id={`payment-${idx}`}
                              name="paymentMethod"
                              value={method}
                              label={method}
                              onChange={handleChange}
                              checked={formData.paymentMethod === method}
                              required
                              className="fw-medium text-dark"
                            />
                          </div>
                        ))}
                      </div>
                    </Form.Group>
                  </Col>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    className="w-100 rounded-pill"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" animation="border" /> : 'Place Order'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Order Summary</h4>
                
                <div className="mb-4">
                  {cart.map(item => (
                    <div key={item.id || item._id} className="d-flex justify-content-between mb-3 border-bottom pb-2">
                      <div className="d-flex">
                        <div className="me-2 text-muted">{item.quantity} x</div>
                        <div className="text-truncate" style={{ maxWidth: '200px' }}>{item.name}</div>
                      </div>
                      <div className="fw-medium">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
                
                {(() => {
                  const subtotal = getCartTotal();
                  const cgst = Math.round(subtotal * 0.09);
                  const sgst = Math.round(subtotal * 0.09);
                  const totalGst = cgst + sgst;
                  const grandTotal = subtotal + totalGst;
                  
                  return (
                    <>
                      <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>Discount</span>
                        <span>₹0</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>Taxable Amount</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>CGST (9%)</span>
                        <span>₹{cgst}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>SGST (9%)</span>
                        <span>₹{sgst}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>Total GST</span>
                        <span>₹{totalGst}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3 small text-muted">
                        <span>Delivery Charge</span>
                        <span className="text-success fw-medium">FREE</span>
                      </div>
                      <hr className="my-3 border-dark" />
                      <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold fs-5 text-dark">Grand Total</span>
                        <span className="fw-bold fs-5 text-accent">₹{grandTotal}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1 small text-muted">
                        <span>Amount Paid</span>
                        <span>₹0</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted">
                        <span>Amount Due</span>
                        <span>₹{grandTotal}</span>
                      </div>
                    </>
                  );
                })()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;

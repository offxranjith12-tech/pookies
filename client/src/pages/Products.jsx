import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiSearch, FiCheckCircle, FiHeart } from 'react-icons/fi';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (product) => {
    const pId = product.id || product._id;
    if (isInWishlist(pId)) {
      removeFromWishlist(pId);
    } else {
      addToWishlist(product);
    }
  };
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.data);
        
        // Initial search query from URL if any
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          setSearchQuery(categoryParam);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location.search]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItemName(product.name);
    setShowToast(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="section-padding fade-in" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      {/* Banner Section */}
      <div className="position-relative d-flex align-items-center justify-content-center mb-5" style={{ 
        minHeight: '40vh', 
        backgroundImage: `url('/images/products_banner.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        margin: '-3rem -0.75rem 3rem -0.75rem' // to offset container padding if any, or just make it full width if outside container
      }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}></div>
        <div className="position-relative text-center z-index-1 p-4 rounded-4 shadow-sm mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)' }}>
          <h2 className="section-title mb-2 fw-bold" style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-heading)', fontSize: '3rem' }}>Premium Cosmetics</h2>
          <p className="text-dark fs-5 fw-medium mb-0" style={{ letterSpacing: '1px' }}>Explore Our Beauty Collection</p>
        </div>
      </div>

      <Container>

        {/* Centered Search Bar */}
        <Row className="justify-content-center mb-5">
          <Col md={8} lg={6}>
            <div className="position-relative shadow-sm rounded-pill overflow-hidden">
              <span className="position-absolute top-50 translate-middle-y ms-4 text-muted">
                <FiSearch size={20} style={{ color: 'var(--primary-color)' }} />
              </span>
              <Form.Control
                type="text"
                placeholder="Search for lipstick, serum, makeup..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-pill py-3 ps-5 border-0"
                style={{ fontSize: '1.1rem', boxShadow: '0 4px 15px rgba(216, 27, 96, 0.08)' }}
              />
            </div>
          </Col>
        </Row>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" style={{ color: 'var(--primary-color)' }} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted mb-3">No products found matching "{searchQuery}"</h4>
            <Button variant="outline-primary" onClick={() => setSearchQuery('')}>Clear Search</Button>
          </div>
        ) : (
          <Row className="gy-5">
            {filteredProducts.map((product) => (
              <Col md={6} lg={4} xl={3} key={product.id || product._id}>
                <Card className="premium-card h-100 border-0 hover-lift" style={{ borderRadius: '16px' }}>
                  <div className="position-relative overflow-hidden" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                    {product.stock === 0 ? (
                      <div className="position-absolute top-0 start-0 m-3 px-2 py-1 rounded shadow-sm fw-bold" style={{ backgroundColor: '#dc3545', color: '#fff', fontSize: '0.75rem', zIndex: 3 }}>
                        OUT OF STOCK
                      </div>
                    ) : product.stock <= 5 ? (
                      <div className="position-absolute top-0 start-0 m-3 px-2 py-1 rounded shadow-sm fw-bold" style={{ backgroundColor: '#fd7e14', color: '#fff', fontSize: '0.75rem', zIndex: 3 }}>
                        ONLY {product.stock} LEFT
                      </div>
                    ) : (
                      <div className="position-absolute top-0 start-0 m-3 px-2 py-1 rounded shadow-sm fw-bold" style={{ backgroundColor: '#198754', color: '#fff', fontSize: '0.75rem', zIndex: 3 }}>
                        IN STOCK
                      </div>
                    )}
                    <Link to={`/products/${product.id || product._id}`}>
                      <Card.Img 
                        variant="top" 
                        src={product.image && product.image !== 'no-photo.jpg' ? (product.image.startsWith('http') || product.image.startsWith('/images') ? product.image : `http://localhost:5000${product.image}`) : "/images/product_detail_hero.jpg"} 
                        alt={product.name}
                        style={{ height: '280px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="product-img-zoom"
                      />
                    </Link>
                    <Button
                      variant="light"
                      className="position-absolute top-0 end-0 m-3 rounded-circle p-2 shadow-sm bg-pink hover-lift"
                      style={{ width: '38px', height: '38px', zIndex: 2 }}
                      onClick={() => toggleWishlist(product)}
                    >
                      <FiHeart size={18} className={isInWishlist(product.id || product._id) ? "text-danger" : "text-muted"} fill={isInWishlist(product.id || product._id) ? "currentColor" : "none"} />
                    </Button>
                  </div>
                  <Card.Body className="d-flex flex-column p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p className="text-muted mb-2 small text-uppercase tracking-wider" style={{ letterSpacing: '1px', color: 'var(--accent-pink)' }}>{product.brand}</p>
                    <Card.Title className="fs-5 mb-3 fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                      <Link to={`/products/${product.id || product._id}`} className="text-dark text-decoration-none">
                        {product.name}
                      </Link>
                    </Card.Title>
                    <div className="mt-auto d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid var(--soft-pink)' }}>
                      <span className="price fw-bold" style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>₹{product.price}</span>
                      <Button 
                        variant={product.stock === 0 ? "secondary" : "primary"} 
                        className="rounded-pill px-3 py-1 hover-lift fw-medium"
                        style={{ fontSize: '0.85rem' }}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      
      <ToastContainer position="bottom-end" className="p-4" style={{ position: 'fixed' }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide style={{ backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid var(--primary-color)' }}>
          <Toast.Header closeButton={false}>
            <FiCheckCircle className="me-2" style={{ color: 'var(--primary-color)' }} size={18} />
            <strong className="me-auto text-dark">Success</strong>
          </Toast.Header>
          <Toast.Body>{addedItemName} added to cart ✓</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Products;

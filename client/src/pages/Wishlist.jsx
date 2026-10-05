import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="bg-light-pink fade-in min-vh-100">
      {/* Banner Section */}
      <div className="position-relative d-flex align-items-center justify-content-center mb-5" style={{ 
        minHeight: '30vh', 
        backgroundImage: `url('/images/wishlist_banner.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
        <div className="position-relative text-center z-index-1 p-4 rounded-4 shadow-sm mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="d-flex align-items-center justify-content-center">
            <FiHeart size={28} className="me-3" style={{ color: 'var(--primary-color)' }} />
            <h2 className="fw-bold mb-0" style={{ fontFamily: 'var(--font-heading)' }}>My Wishlist</h2>
          </div>
        </div>
      </div>

      <Container className="pb-5">
        {wishlist.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4 text-center py-5">
            <Card.Body>
              <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                <FiHeart size={40} className="text-muted" />
              </div>
              <h4 className="fw-bold">Your wishlist is empty</h4>
              <p className="text-muted mb-4">Save items you love here to easily find them later.</p>
              <Link to="/products" className="btn btn-primary rounded-pill px-4">Browse Products</Link>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {wishlist.map(product => (
              <Col key={product.id || product._id} lg={3} md={4} sm={6}>
                <Card className="premium-card h-100 border-0 rounded-4">
                  <Link to={`/products/${product.id || product._id}`}>
                    <Card.Img 
                      variant="top" 
                      src={product.image && product.image !== 'no-photo.jpg' ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : "/images/product_detail_hero.jpg"} 
                    alt={product.name} 
                  />
                </Link>
                <Card.Body className="d-flex flex-column">
                  <small className="text-uppercase tracking-wider text-muted mb-1" style={{ fontSize: '0.7rem' }}>{product.brand}</small>
                  <Card.Title className="fw-bold fs-6 mb-2">{product.name}</Card.Title>
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                    <span className="price fw-bold" style={{ color: 'var(--primary-color)' }}>₹{product.price}</span>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="light" 
                        className="rounded-circle p-2 text-danger hover-danger border"
                        onClick={() => removeFromWishlist(product.id || product._id)}
                      >
                        <FiTrash2 size={16} />
                      </Button>
                      <Button 
                        variant="primary" 
                        className="rounded-circle p-2 shadow-sm hover-lift"
                        onClick={() => addToCart(product, 1)}
                      >
                        <FiShoppingCart size={16} />
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
    </div>
  );
};

export default Wishlist;

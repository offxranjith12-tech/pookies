import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import ReviewSection from '../components/ReviewSection';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2>Product not found</h2>
        <Button as={Link} to="/products" variant="primary" className="mt-3">Back to Products</Button>
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
        
        <Row className="bg-pink rounded-4 shadow-sm p-4 p-md-5">
          <Col md={6} className="mb-4 mb-md-0">
            <img 
              src={product.image && product.image !== 'no-photo.jpg' ? (product.image.startsWith('http') || product.image.startsWith('/images') ? product.image : `http://localhost:5000${product.image}`) : "/images/product_detail_hero.jpg"} 
              alt={product.name} 
              className="img-fluid rounded-4 shadow-sm w-100"
            />
          </Col>
          <Col md={6} className="ps-md-5 d-flex flex-column justify-content-center">
            <Badge bg="light" text="dark" className="align-self-start mb-3 border px-3 py-2 rounded-pill fw-normal">
              {product.category}
            </Badge>
            <h1 className="mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{product.name}</h1>
            <p className="text-accent fs-5 mb-4">{product.brand}</p>
            
            <h2 className="price fs-1 mb-4">₹{product.price}</h2>
            
            <p className="text-muted mb-4 lh-lg">
              {product.description}
            </p>
            
            <div className="mb-4">
              <span className="text-muted small d-block mb-2">Availability: 
                <span className={product.stock === 0 ? "text-danger ms-1 fw-bold" : product.stock <= 5 ? "text-warning ms-1 fw-bold" : "text-success ms-1 fw-bold"}>
                  {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Low Stock (Only ${product.stock} left)` : 'In Stock'}
                </span>
              </span>
            </div>

            {product.stock > 0 && (
              <div className="d-flex align-items-center mb-4">
                <div className="border rounded-pill px-3 py-2 d-flex align-items-center me-3 bg-light">
                  <Button 
                    variant="link" 
                    className="p-0 text-dark text-decoration-none"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    <FiMinus size={18} />
                  </Button>
                  <span className="mx-4 fw-bold">{quantity}</span>
                  <Button 
                    variant="link" 
                    className="p-0 text-dark text-decoration-none"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  >
                    <FiPlus size={18} />
                  </Button>
                </div>
                <Button 
                  variant={added ? "success" : "primary"} 
                  size="lg" 
                  className="px-5 rounded-pill flex-grow-1 d-flex justify-content-center align-items-center"
                  onClick={handleAddToCart}
                >
                  {added ? <><FiCheck className="me-2" /> Added</> : 'Add to Cart'}
                </Button>
              </div>
            )}
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={12} lg={10} className="mx-auto">
            <ReviewSection targetType="product" targetId={product.id} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetails;

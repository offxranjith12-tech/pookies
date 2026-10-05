import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FiStar } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ReviewSection = ({ targetType, targetId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/reviews/${targetType}/${targetId}`);
      setReviews(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetType && targetId) {
      fetchReviews();
    }
  }, [targetType, targetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a comment.');
      return;
    }
    
    setSubmitLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post('/api/reviews', {
        targetType,
        targetId,
        rating,
        comment
      });
      setSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchReviews(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStars = (num) => {
    return [...Array(5)].map((star, i) => (
      <FiStar 
        key={i} 
        fill={i < num ? "#ffc107" : "none"} 
        color={i < num ? "#ffc107" : "#e4e5e9"} 
        className="me-1"
      />
    ));
  };

  return (
    <div className="review-section mt-5">
      <h3 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Reviews</h3>
      
      {/* Reviews List */}
      <div className="reviews-list mb-5">
        {loading ? (
          <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
        ) : reviews.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="border-0 shadow-sm rounded-4 mb-3 bg-white">
              <Card.Body className="p-4">
                <Row>
                  <Col md={3} className="border-end-md mb-3 mb-md-0">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-soft-pink rounded-circle d-flex align-items-center justify-content-center me-2 text-accent fw-bold" style={{ width: '40px', height: '40px' }}>
                        {review.Customer?.name ? review.Customer.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="fw-bold">{review.Customer?.name || 'Unknown User'}</span>
                    </div>
                    <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                  </Col>
                  <Col md={9}>
                    <div className="d-flex mb-2">
                      {renderStars(review.rating)}
                    </div>
                    <p className="mb-0 text-dark lh-base">{review.comment}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Review Form */}
      <h4 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Leave a Review</h4>
      {!user ? (
        <Alert variant="info" className="rounded-3 border-0 bg-soft-pink text-accent">
          Please <Link to="/login" className="fw-bold text-accent text-decoration-underline">login</Link> to leave a review.
        </Alert>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 bg-light-pink">
          <Card.Body className="p-4">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Rating</Form.Label>
                <div className="d-flex fs-4 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <FiStar 
                      key={num}
                      fill={num <= rating ? "#ffc107" : "none"}
                      color={num <= rating ? "#ffc107" : "#e4e5e9"}
                      onClick={() => setRating(num)}
                      style={{ cursor: 'pointer', marginRight: '5px' }}
                    />
                  ))}
                </div>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Your Review</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="rounded-3 border-0 shadow-sm"
                  style={{ resize: 'none' }}
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                type="submit" 
                className="rounded-pill px-4 py-2"
                disabled={submitLoading}
              >
                {submitLoading ? <Spinner size="sm" /> : 'Submit Review'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ReviewSection;

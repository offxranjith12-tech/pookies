import { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner } from 'react-bootstrap';
import { FiStar } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/reviews', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(res.data.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchReviews();
  }, [token]);

  const renderStars = (num) => {
    return [...Array(5)].map((star, i) => (
      <FiStar 
        key={i} 
        fill={i < num ? "#ffc107" : "none"} 
        color={i < num ? "#ffc107" : "#e4e5e9"} 
        size={14}
        className="me-1"
      />
    ));
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div>
      <h2 className="mb-4 fw-bold" style={{ fontFamily: 'var(--font-heading)', color: '#2c3e50' }}>Customer Reviews</h2>
      
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 py-3 px-4">Customer</th>
                <th className="border-0 py-3">Target</th>
                <th className="border-0 py-3">Rating</th>
                <th className="border-0 py-3">Comment</th>
                <th className="border-0 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-4 py-3 align-middle">
                    <span className="fw-bold">{review.Customer?.name}</span>
                    <br />
                    <small className="text-muted">{review.Customer?.email}</small>
                  </td>
                  <td className="py-3 align-middle">
                    <Badge bg={review.targetType === 'product' ? 'info' : 'primary'} className="rounded-pill fw-normal text-white">
                      {review.targetType.toUpperCase()}
                    </Badge>
                    <div className="small text-muted mt-1">ID: {review.targetId}</div>
                  </td>
                  <td className="py-3 align-middle text-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="py-3 align-middle">
                    <span className="d-inline-block text-truncate" style={{ maxWidth: '250px' }} title={review.comment}>
                      {review.comment}
                    </span>
                  </td>
                  <td className="py-3 align-middle text-muted small">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No reviews found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminReviews;

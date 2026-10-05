import { useState, useEffect } from 'react';
import { Card, Table, Spinner, Badge } from 'react-bootstrap';
import { FiStar } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ArtistReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // An artist's ID is their user ID in the current schema
        const res = await axios.get(`/api/reviews/artist/${user.id}`);
        setReviews(res.data.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.id) {
      fetchReviews();
    }
  }, [user]);

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
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>My Reviews</h2>
          <p className="text-muted mb-0">What clients are saying about your services</p>
        </div>
        <div className="text-center">
          <Badge bg="soft-pink" text="accent" className="px-3 py-2 rounded-pill fs-6 border border-pink">
            <FiStar className="me-1 mb-1" fill="currentColor" />
            {reviews.length > 0 
              ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
              : '0.0'} Average
          </Badge>
        </div>
      </div>
      
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 py-3 px-4">Client</th>
                <th className="border-0 py-3">Rating</th>
                <th className="border-0 py-3">Review</th>
                <th className="border-0 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-4 py-3 align-middle">
                    <span className="fw-bold">{review.Customer?.name || 'Unknown'}</span>
                  </td>
                  <td className="py-3 align-middle text-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="py-3 align-middle">
                    {review.comment}
                  </td>
                  <td className="py-3 align-middle text-muted small">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    No reviews yet. Keep providing great service!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ArtistReviews;

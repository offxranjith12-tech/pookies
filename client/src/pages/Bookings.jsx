import { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiCalendar, FiCheckCircle } from 'react-icons/fi';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/bookings');
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/bookings/mybookings');
        setBookings(res.data.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'Confirmed': return <Badge bg="primary">Confirmed</Badge>;
      case 'Completed': return <Badge bg="success">Completed</Badge>;
      case 'Cancelled': return <Badge bg="danger">Cancelled</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) return <div className="text-center py-5 mt-5"><Spinner animation="border" style={{ color: 'var(--primary-color)' }} /></div>;

  return (
    <div className="bg-light-pink fade-in min-vh-100">
      {/* Banner Section */}
      <div className="position-relative d-flex align-items-center justify-content-center mb-5" style={{ 
        minHeight: '30vh', 
        backgroundImage: `url('/images/contact_banner.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
        <div className="position-relative text-center z-index-1 p-4 rounded-4 shadow-sm mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)' }}>
          <h2 className="fw-bold mb-0 px-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>My Bookings</h2>
        </div>
      </div>

      <Container className="pb-5">
      
      {bookings.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center py-5">
          <Card.Body>
            <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
              <FiCalendar size={40} className="text-muted" />
            </div>
            <h4 className="fw-bold">No bookings yet</h4>
            <p className="text-muted mb-4">You haven't booked any makeup artists yet.</p>
            <Link to="/artists" className="btn btn-primary rounded-pill px-4">Browse Artists</Link>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3 ps-4 text-muted font-monospace small">BOOKING ID</th>
                    <th className="border-0 py-3 text-muted font-monospace small">ARTIST</th>
                    <th className="border-0 py-3 text-muted font-monospace small">EVENT DATE</th>
                    <th className="border-0 py-3 text-muted font-monospace small">SERVICE</th>
                    <th className="border-0 py-3 pe-4 text-muted font-monospace small">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="py-3 ps-4 fw-medium text-dark">#{booking.id.toString().padStart(4, '0')}</td>
                      <td className="py-3 fw-bold">{booking.Artist?.name || 'Unknown Artist'}</td>
                      <td className="py-3 text-muted">{new Date(booking.eventDate).toLocaleDateString()} at {booking.eventTime}</td>
                      <td className="py-3">{booking.eventType}</td>
                      <td className="py-3 pe-4">{getStatusBadge(booking.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
      </Container>
    </div>
  );
};

export default Bookings;

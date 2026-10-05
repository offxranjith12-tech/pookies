import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import { FiCheck, FiX, FiCheckCircle } from 'react-icons/fi';

const ArtistBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/artist');
      setBookings(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'success';
      case 'Completed': return 'info';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0" style={{ fontFamily: 'var(--font-heading)' }}>My Bookings</h2>
        
        <Form.Select 
          style={{ width: '200px' }} 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="shadow-sm border-0"
        >
          <option value="All">All Bookings</option>
          <option value="Pending">Pending Requests</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </Form.Select>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light text-muted">
              <tr>
                <th className="border-0 py-3 ps-4">Booking ID</th>
                <th className="border-0 py-3">Customer</th>
                <th className="border-0 py-3">Service & Date</th>
                <th className="border-0 py-3">Location</th>
                <th className="border-0 py-3">Status</th>
                <th className="border-0 py-3 pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="ps-4 fw-bold">#{booking.id.toString().padStart(4, '0')}</td>
                    <td>
                      <p className="mb-0 fw-bold">{booking.customerName}</p>
                      <p className="mb-0 small text-muted">{booking.phone}</p>
                    </td>
                    <td>
                      <span className="badge bg-soft-pink text-primary border border-primary mb-1">
                        {booking.eventType}
                      </span>
                      <p className="mb-0 small text-dark fw-medium">
                        {new Date(booking.eventDate).toLocaleDateString()} at {booking.eventTime}
                      </p>
                    </td>
                    <td><span className="small">{booking.location}</span></td>
                    <td>
                      <Badge bg={getStatusBadge(booking.status)} className="px-3 py-2 rounded-pill">
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="pe-4 text-end">
                      {booking.status === 'Pending' && (
                        <div className="d-flex gap-2 justify-content-end">
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            className="rounded-circle btn-icon"
                            onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                            title="Confirm"
                          >
                            <FiCheck />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="rounded-circle btn-icon"
                            onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                            title="Reject"
                          >
                            <FiX />
                          </Button>
                        </div>
                      )}
                      
                      {booking.status === 'Confirmed' && (
                        <Button 
                          variant="info" 
                          size="sm" 
                          className="rounded-pill px-3 text-white fw-bold d-flex align-items-center ms-auto"
                          onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                        >
                          <FiCheckCircle className="me-2" /> Complete
                        </Button>
                      )}
                      
                      {(booking.status === 'Completed' || booking.status === 'Cancelled') && (
                        <span className="text-muted small fst-italic">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ArtistBookings;

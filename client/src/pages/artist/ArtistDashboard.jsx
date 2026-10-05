import { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ArtistDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get('/api/bookings/artist');
        const bookings = data.data;

        // Calculate stats
        const pending = bookings.filter(b => b.status === 'Pending').length;
        const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
        const completed = bookings.filter(b => b.status === 'Completed').length;
        const cancelled = bookings.filter(b => b.status === 'Cancelled').length;

        // Today's bookings
        const today = new Date().toISOString().split('T')[0];
        const todaysBookings = bookings.filter(b => {
          const bookingDate = new Date(b.eventDate).toISOString().split('T')[0];
          return bookingDate === today && (b.status === 'Confirmed' || b.status === 'Completed');
        });

        // Upcoming bookings
        const upcomingBookings = bookings.filter(b => {
          const bookingDate = new Date(b.eventDate).toISOString().split('T')[0];
          return bookingDate > today && b.status === 'Confirmed';
        }).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)).slice(0, 5);

        setStats({
          total: bookings.length,
          pending,
          confirmed,
          completed,
          cancelled,
          todaysBookings,
          upcomingBookings
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const statCards = [
    { title: 'Total Bookings', value: stats.total, icon: <FiCalendar size={24} />, color: 'primary', bg: 'bg-soft-pink' },
    { title: 'Pending Requests', value: stats.pending, icon: <FiClock size={24} />, color: 'warning', bg: 'bg-warning bg-opacity-10' },
    { title: 'Confirmed Bookings', value: stats.confirmed, icon: <FiCheckCircle size={24} />, color: 'success', bg: 'bg-success bg-opacity-10' },
    { title: 'Completed', value: stats.completed, icon: <FiCheckCircle size={24} />, color: 'info', bg: 'bg-info bg-opacity-10' },
    { title: 'Cancelled', value: stats.cancelled, icon: <FiXCircle size={24} />, color: 'danger', bg: 'bg-danger bg-opacity-10' },
  ];

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Artist Dashboard</h2>
      
      {/* Stats Row */}
      <Row className="g-4 mb-5">
        {statCards.map((stat, index) => (
          <Col sm={6} md={4} lg key={index} className="mb-3">
            <Card className="border-0 shadow-sm h-100 rounded-4 text-center">
              <Card.Body className="p-3 d-flex flex-column align-items-center justify-content-center">
                <div className={`${stat.bg} text-${stat.color} p-3 rounded-circle mb-3`}>
                  {stat.icon}
                </div>
                <div>
                  <h6 className="text-muted fw-bold mb-1 small text-uppercase px-2">{stat.title}</h6>
                  <h3 className="fw-bold mb-0 text-dark">{stat.value}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* Today's Bookings */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-pink border-bottom-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold m-0 d-flex justify-content-between align-items-center">
                Today's Schedule
                <span className="badge bg-primary rounded-pill">{stats.todaysBookings.length}</span>
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              {stats.todaysBookings.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FiCalendar size={40} className="mb-3 opacity-50" />
                  <p>No bookings scheduled for today.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {stats.todaysBookings.map((booking) => (
                    <div key={booking.id} className="p-3 border rounded-3 d-flex justify-content-between align-items-center border-start border-4 border-primary">
                      <div>
                        <h6 className="fw-bold mb-1">{booking.customerName}</h6>
                        <p className="text-muted small mb-0">{booking.service || booking.eventType} • {booking.location}</p>
                      </div>
                      <div className="text-end">
                        <span className="fw-bold text-dark d-block">{booking.eventTime}</span>
                        <span className={`badge ${booking.status === 'Completed' ? 'bg-info' : 'bg-success'} rounded-pill mt-1`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Bookings */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-pink border-bottom-0 pt-4 pb-0 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold m-0">Upcoming Bookings</h5>
                <Link to="/artist/bookings" className="text-primary text-decoration-none small fw-bold">View All</Link>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {stats.upcomingBookings.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FiClock size={40} className="mb-3 opacity-50" />
                  <p>No upcoming confirmed bookings.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {stats.upcomingBookings.map((booking) => (
                    <div key={booking.id} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold mb-1">{booking.customerName}</h6>
                        <p className="text-muted small mb-0">
                          {new Date(booking.eventDate).toLocaleDateString()} at {booking.eventTime}
                        </p>
                      </div>
                      <span className="badge bg-soft-pink text-primary rounded-pill border border-primary">
                        {booking.eventType}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ArtistDashboard;

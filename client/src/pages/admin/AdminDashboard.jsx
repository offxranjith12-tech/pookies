import { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FiShoppingBag, FiUsers, FiCalendar, FiBox, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    totalOrders: 0,
    pendingOrders: 0,
    newBookings: 0,
    totalProducts: 0,
    totalArtists: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const results = await Promise.allSettled([
          axios.get('/api/orders/stats/today'),
          axios.get('/api/orders'),
          axios.get('/api/bookings'),
          axios.get('/api/products'),
          axios.get('/api/artists'),
          axios.get('/api/users')
        ]);

        const safeData = (promiseResult, fallback = { data: { data: [], count: 0 } }) => {
          if (promiseResult.status === 'fulfilled') {
            return promiseResult.value;
          }
          console.error('API call failed:', promiseResult.reason);
          return fallback;
        };

        const todayOrdersRes = safeData(results[0]);
        const ordersRes = safeData(results[1]);
        const bookingsRes = safeData(results[2]);
        const productsRes = safeData(results[3]);
        const artistsRes = safeData(results[4]);
        const usersRes = safeData(results[5]);

        const orders = ordersRes.data.data || [];
        const bookings = bookingsRes.data.data || [];

        setStats({
          todayOrders: todayOrdersRes.data.count || 0,
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'Pending').length,
          newBookings: bookings.filter(b => b.status === 'Pending').length,
          totalProducts: productsRes.data.count || 0,
          totalArtists: artistsRes.data.count || 0,
          totalUsers: usersRes.data.count || 0
        });
        
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" style={{ color: 'var(--primary-color)' }} />
      </div>
    );
  }

  const statCards = [
    { title: "Today's Orders", value: stats.todayOrders, icon: <FiTrendingUp size={24} />, color: "text-primary", bg: "bg-primary" },
    { title: "Total Orders", value: stats.totalOrders, icon: <FiShoppingBag size={24} />, color: "text-success", bg: "bg-success" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: <FiBox size={24} />, color: "text-warning", bg: "bg-warning" },
    { title: "New Bookings", value: stats.newBookings, icon: <FiCalendar size={24} />, color: "text-info", bg: "bg-info" },
    { title: "Total Users", value: stats.totalUsers, icon: <FiUsers size={24} />, color: "text-danger", bg: "bg-danger" },
    { title: "Total Products", value: stats.totalProducts, icon: <FiBox size={24} />, color: "text-secondary", bg: "bg-secondary" },
    { title: "Total Artists", value: stats.totalArtists, icon: <FiUsers size={24} />, color: "text-dark", bg: "bg-dark" },
  ];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>Dashboard Overview</h2>
        <div>
          <Link to="/admin/products" className="btn btn-outline-primary btn-sm me-2 hover-lift rounded-pill px-3">Add Product</Link>
          <Link to="/admin/artists" className="btn btn-primary btn-sm hover-lift rounded-pill px-3">Add Artist</Link>
        </div>
      </div>
      
      <Row className="gy-4">
        {statCards.map((stat, idx) => (
          <Col md={6} lg={4} key={idx}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden hover-lift">
              <Card.Body className="p-4 position-relative">
                <div className={`position-absolute top-0 end-0 mt-3 me-3 ${stat.bg} text-white rounded-circle d-flex align-items-center justify-content-center opacity-75`} style={{ width: '48px', height: '48px' }}>
                  {stat.icon}
                </div>
                <h6 className="text-muted fw-bold text-uppercase mb-2" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>{stat.title}</h6>
                <h2 className={`display-5 fw-bold mb-0 ${stat.color}`}>{stat.value}</h2>
              </Card.Body>
              <div className="card-footer bg-pink border-top-0 pt-0">
                <small className="text-muted d-flex align-items-center">
                  <span className="d-inline-block bg-success rounded-circle me-1" style={{ width: '6px', height: '6px' }}></span>
                  Updated just now
                </small>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminDashboard;

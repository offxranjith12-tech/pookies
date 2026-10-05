import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { FiDownload, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ArtistReports = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/api/bookings/artist');
        setBookings(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching report data');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(222, 50, 103); // Pookie's primary pink
    doc.text("BelleAura", 14, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text("Makeup Artist Report", 14, 30);
    
    // Artist Info
    doc.setFontSize(10);
    doc.text(`Artist Name: ${user.name}`, 14, 45);
    doc.text(`Email: ${user.email}`, 14, 52);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 59);
    
    // Summary Stats
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
    const completed = bookings.filter(b => b.status === 'Completed').length;
    const cancelled = bookings.filter(b => b.status === 'Cancelled').length;
    const pending = bookings.filter(b => b.status === 'Pending').length;

    doc.setFont('helvetica', 'bold');
    doc.text("Summary:", 14, 75);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Bookings: ${total}`, 14, 82);
    doc.text(`Confirmed: ${confirmed}`, 60, 82);
    doc.text(`Completed: ${completed}`, 105, 82);
    doc.text(`Cancelled: ${cancelled}`, 150, 82);
    
    // Table
    const tableColumn = ["Booking ID", "Customer", "Service", "Date", "Time", "Location", "Status"];
    const tableRows = [];

    bookings.forEach(booking => {
      const bookingData = [
        `#${booking.id ? booking.id.toString().padStart(4, '0') : 'N/A'}`,
        booking.customerName || 'Unknown',
        booking.eventType || 'Service',
        new Date(booking.eventDate).toLocaleDateString(),
        booking.eventTime || 'TBD',
        booking.location || 'TBD',
        booking.status || 'Pending'
      ];
      tableRows.push(bookingData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 95,
      theme: 'grid',
      headStyles: { fillColor: [222, 50, 103] },
      styles: { fontSize: 8 }
    });

    doc.save(`${user.name.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
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

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
  const completed = bookings.filter(b => b.status === 'Completed').length;
  const cancelled = bookings.filter(b => b.status === 'Cancelled').length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0" style={{ fontFamily: 'var(--font-heading)' }}>Performance Reports</h2>
        
        <Button 
          variant="primary" 
          className="rounded-pill px-4 fw-bold d-flex align-items-center shadow-sm"
          onClick={generatePDF}
        >
          <FiDownload className="me-2" /> Download PDF Report
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 text-center py-3 bg-pink">
            <h3 className="fw-bold text-dark mb-0">{total}</h3>
            <p className="text-muted small fw-bold text-uppercase mb-0 mt-1">Total</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 text-center py-3 bg-pink">
            <h3 className="fw-bold text-success mb-0">{confirmed}</h3>
            <p className="text-muted small fw-bold text-uppercase mb-0 mt-1">Confirmed</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 text-center py-3 bg-pink">
            <h3 className="fw-bold text-info mb-0">{completed}</h3>
            <p className="text-muted small fw-bold text-uppercase mb-0 mt-1">Completed</p>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 text-center py-3 bg-pink">
            <h3 className="fw-bold text-danger mb-0">{cancelled}</h3>
            <p className="text-muted small fw-bold text-uppercase mb-0 mt-1">Cancelled</p>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Header className="bg-pink border-bottom-0 pt-4 pb-3 px-4">
          <h5 className="fw-bold m-0 d-flex align-items-center">
            <FiFileText className="me-2 text-primary" /> Booking History Log
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light text-muted">
              <tr>
                <th className="border-0 py-3 ps-4">Booking ID</th>
                <th className="border-0 py-3">Customer</th>
                <th className="border-0 py-3">Service</th>
                <th className="border-0 py-3">Date</th>
                <th className="border-0 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No booking data available for reporting.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="ps-4 fw-bold">#{booking.id.toString().padStart(4, '0')}</td>
                    <td className="fw-medium">{booking.customerName}</td>
                    <td>{booking.eventType}</td>
                    <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={getStatusBadge(booking.status)} className="px-3 py-2 rounded-pill">
                        {booking.status}
                      </Badge>
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

export default ArtistReports;

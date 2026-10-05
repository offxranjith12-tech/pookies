import { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Spinner, Toast, ToastContainer, InputGroup, Button } from 'react-bootstrap';
import { FiCheckCircle, FiAlertCircle, FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings', error);
      setLoading(false);
      showToast('Failed to load bookings', 'error');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings();
      showToast(`Booking marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating booking status', error);
      showToast('Failed to update status', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <Badge bg="warning" className="rounded-pill px-3 py-2 fw-medium bg-opacity-10 text-warning border border-warning">Pending</Badge>;
      case 'Confirmed': return <Badge bg="primary" className="rounded-pill px-3 py-2 fw-medium bg-opacity-10 text-primary border border-primary">Confirmed</Badge>;
      case 'Completed': return <Badge bg="success" className="rounded-pill px-3 py-2 fw-medium bg-opacity-10 text-success border border-success">Completed</Badge>;
      case 'Cancelled': return <Badge bg="danger" className="rounded-pill px-3 py-2 fw-medium bg-opacity-10 text-danger border border-danger">Cancelled</Badge>;
      default: return <Badge bg="secondary" className="rounded-pill px-3 py-2 fw-medium">{status}</Badge>;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(222, 50, 103); // Pookie pink
    doc.text("Pookie's Admin - Bookings Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    const tableColumn = ["Event Date", "Customer", "Artist", "Service", "Status"];
    const tableRows = [];

    bookings.forEach(booking => {
      const bookingData = [
        new Date(booking.eventDate).toLocaleDateString(),
        booking.customerName,
        booking.Artist?.name || 'Unknown',
        booking.eventType || 'N/A',
        booking.status
      ];
      tableRows.push(bookingData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [222, 50, 103] },
      styles: { fontSize: 10 }
    });
    
    doc.save(`pookies_bookings_report_${new Date().toISOString().split('T')[0]}.pdf`);
    showToast("PDF report generated successfully!");
  };

  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Event Date,Customer Name,Phone,Artist,Service,Status\n";
    
    bookings.forEach(booking => {
      const row = [
        new Date(booking.eventDate).toLocaleDateString(),
        `"${booking.customerName}"`,
        `"${booking.phone}"`,
        `"${booking.Artist?.name || 'Unknown'}"`,
        `"${booking.eventType || 'N/A'}"`,
        booking.status
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pookies_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          booking.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" style={{ color: 'var(--primary-color)' }} /></div>;

  return (
    <div className="fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>Bookings Management</h2>
          <p className="text-muted small mb-0">Track and manage artist reservations.</p>
        </div>
        
        <div className="d-flex gap-2">
          <Button variant="outline-success" className="d-flex align-items-center gap-2 rounded-pill hover-lift me-2" onClick={generateCSV}>
            <FiDownload /> Export Excel
          </Button>
          <Button variant="outline-primary" className="d-flex align-items-center gap-2 rounded-pill hover-lift me-2" onClick={generatePDF}>
            <FiDownload /> Export PDF
          </Button>
          <InputGroup style={{ maxWidth: '250px' }}>
            <InputGroup.Text className="bg-pink border-end-0">
              <FiSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search customer..."
              className="border-start-0 ps-0 focus-ring-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <InputGroup style={{ maxWidth: '180px' }}>
            <InputGroup.Text className="bg-pink border-end-0">
              <FiFilter className="text-muted" />
            </InputGroup.Text>
            <Form.Select 
              className="border-start-0 ps-0 focus-ring-none"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </InputGroup>
        </div>
      </div>
      
      <Card className="border-0 shadow-sm rounded-4 hover-lift" style={{ transition: 'all 0.3s' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4 text-muted font-monospace small">EVENT DATE</th>
                  <th className="border-0 py-3 text-muted font-monospace small">CUSTOMER INFO</th>
                  <th className="border-0 py-3 text-muted font-monospace small">ARTIST & EVENT</th>
                  <th className="border-0 py-3 text-muted font-monospace small">LOCATION</th>
                  <th className="border-0 py-3 text-muted font-monospace small">STATUS</th>
                  <th className="border-0 py-3 pe-4 text-end text-muted font-monospace small">UPDATE</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">No bookings found matching your criteria.</td></tr>
                ) : filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="py-3 ps-4">
                      <div className="fw-bold">{new Date(booking.eventDate).toLocaleDateString()}</div>
                      <div className="small text-muted">{booking.eventTime}</div>
                    </td>
                    <td className="py-3">
                      <div className="fw-bold">{booking.customerName}</div>
                      <div className="small text-muted">{booking.phone}</div>
                    </td>
                    <td className="py-3">
                      <div className="fw-bold" style={{ color: 'var(--primary-color)' }}>{booking.Artist?.name || 'Unknown Artist'}</div>
                      <div className="small text-muted text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>{booking.eventType}</div>
                    </td>
                    <td className="py-3">
                      <div className="small text-muted" style={{ maxWidth: '150px' }}>
                        {booking.location}
                      </div>
                    </td>
                    <td className="py-3">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="py-3 pe-4 text-end">
                      <Form.Select 
                        size="sm" 
                        value={booking.status} 
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        style={{ width: '130px', display: 'inline-block', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--soft-pink)' }}
                        className="fw-medium text-dark"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-4" style={{ position: 'fixed', zIndex: 9999 }}>
        <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide 
          className="border-0 shadow-lg"
          style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            borderLeft: `4px solid ${toast.type === 'success' ? 'var(--primary-color)' : '#dc3545'}` 
          }}>
          <Toast.Header closeButton={false} className="border-0 bg-pink pb-0">
            {toast.type === 'success' ? (
              <FiCheckCircle className="me-2" style={{ color: 'var(--primary-color)' }} size={18} />
            ) : (
              <FiAlertCircle className="me-2 text-danger" size={18} />
            )}
            <strong className="me-auto text-dark">{toast.type === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body className="pt-2 pb-3">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AdminBookings;

import { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Spinner, Button } from 'react-bootstrap';
import { FiDownload } from 'react-icons/fi';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error('Error updating order status', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'Confirmed': return <Badge bg="info">Confirmed</Badge>;
      case 'Processing': return <Badge bg="primary">Processing</Badge>;
      case 'Delivered': return <Badge bg="success">Delivered</Badge>;
      case 'Cancelled': return <Badge bg="danger">Cancelled</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(222, 50, 103); // Pookie pink
    doc.text("Pookie's Admin - Orders Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    const tableColumn = ["Order ID", "Date", "Customer", "Amount (Rs)", "Status", "Payment"];
    const tableRows = [];

    orders.forEach(order => {
      const orderData = [
        `#${order.id.toString().padStart(8, '0')}`,
        new Date(order.createdAt).toLocaleDateString(),
        order.customerName,
        order.totalAmount,
        order.status,
        order.paymentMethod || 'Cash on Delivery'
      ];
      tableRows.push(orderData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [222, 50, 103] },
      styles: { fontSize: 10 }
    });
    
    doc.save(`pookies_orders_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Date,Customer,Amount (Rs),Payment Method,Status\n";
    
    orders.forEach(order => {
      const row = [
        `#${order.id}`,
        new Date(order.createdAt).toLocaleDateString(),
        `"${order.customerName}"`,
        order.totalAmount,
        `"${order.paymentMethod || 'Cash on Delivery'}"`,
        order.status
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pookies_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Orders Management</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-success" className="d-flex align-items-center gap-2 rounded-pill hover-lift" onClick={generateCSV}>
            <FiDownload /> Export Excel
          </Button>
          <Button variant="outline-primary" className="d-flex align-items-center gap-2 rounded-pill hover-lift" onClick={generatePDF}>
            <FiDownload /> Export PDF
          </Button>
        </div>
      </div>
      
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4">Order ID & Date</th>
                  <th className="border-0 py-3">Customer Info</th>
                  <th className="border-0 py-3">Products</th>
                  <th className="border-0 py-3">Total Amount</th>
                  <th className="border-0 py-3">Payment</th>
                  <th className="border-0 py-3">Status</th>
                  <th className="border-0 py-3 pe-4 text-end">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4 text-muted">No orders found.</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 ps-4">
                      <div className="fw-bold text-dark">#{order.id.toString().padStart(8, '0')}</div>
                      <div className="small">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3">
                      <div className="fw-bold">{order.customerName}</div>
                      <div className="small text-muted">{order.phone}</div>
                    </td>
                    <td className="py-3">
                      <div className="small">
                        {order.products.length} items
                        <br/>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {order.products.slice(0,2).map(p => p.name).join(', ')}
                          {order.products.length > 2 && '...'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 fw-bold text-accent">₹{order.totalAmount}</td>
                    <td className="py-3 text-muted small">{order.paymentMethod || 'Cash on Delivery'}</td>
                    <td className="py-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 pe-4 text-end">
                      <Form.Select 
                        size="sm" 
                        value={order.status} 
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{ width: '130px', display: 'inline-block', backgroundColor: 'var(--bg-primary)', borderColor: 'var(--soft-pink)' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
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
    </div>
  );
};

export default AdminOrders;

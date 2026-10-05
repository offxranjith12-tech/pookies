import { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingBag, FiClock, FiCheckCircle, FiDownload } from 'react-icons/fi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/myorders');
        setOrders(res.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'processing': return <Badge bg="info">Processing</Badge>;
      case 'shipped': return <Badge bg="primary">Shipped</Badge>;
      case 'delivered': return <Badge bg="success">Delivered</Badge>;
      case 'cancelled': return <Badge bg="danger">Cancelled</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const generateBill = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(222, 50, 103);
    doc.text("Pookie's", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("BEAUTY THAT FEELS UNIQUELY YOURS", 14, 28);
    
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("TAX INVOICE", 150, 22);
    doc.setFontSize(10);
    doc.text(`Order ID: #${order.id.toString().padStart(8, '0')}`, 150, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 35);
    doc.text(`Payment: ${order.paymentMethod || 'Cash on Delivery'}`, 150, 40);

    // Bill to
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Bill To:", 14, 45);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(order.customerName || "Customer", 14, 52);
    
    // Items table
    const tableColumn = ["Item", "Qty", "Price", "Total"];
    const tableRows = [];
    
    let subtotal = 0;
    
    order.products.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      tableRows.push([
        item.name,
        item.quantity,
        `Rs. ${item.price}`,
        `Rs. ${itemTotal}`
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'striped',
      headStyles: { fillColor: [222, 50, 103] },
    });

    // GST Breakdown calculations
    const cgst = Math.round(subtotal * 0.09);
    const sgst = Math.round(subtotal * 0.09);
    const totalGst = cgst + sgst;
    const grandTotal = subtotal + totalGst;

    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Subtotal:", 130, finalY);
    doc.text(`Rs. ${subtotal}`, 180, finalY, { align: 'right' });
    
    doc.text("Discount:", 130, finalY + 7);
    doc.text("Rs. 0", 180, finalY + 7, { align: 'right' });
    
    doc.text("Taxable Amount:", 130, finalY + 14);
    doc.text(`Rs. ${subtotal}`, 180, finalY + 14, { align: 'right' });
    
    doc.text("CGST (9%):", 130, finalY + 21);
    doc.text(`Rs. ${cgst}`, 180, finalY + 21, { align: 'right' });
    
    doc.text("SGST (9%):", 130, finalY + 28);
    doc.text(`Rs. ${sgst}`, 180, finalY + 28, { align: 'right' });
    
    doc.text("Total GST:", 130, finalY + 35);
    doc.text(`Rs. ${totalGst}`, 180, finalY + 35, { align: 'right' });
    
    doc.text("Delivery Charge:", 130, finalY + 42);
    doc.text("FREE", 180, finalY + 42, { align: 'right' });
    
    // Line separator
    doc.setDrawColor(200);
    doc.line(130, finalY + 45, 185, finalY + 45);
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    doc.text("Grand Total:", 130, finalY + 52);
    doc.text(`Rs. ${grandTotal}`, 180, finalY + 52, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont(undefined, 'normal');
    doc.text("Amount Paid:", 130, finalY + 62);
    doc.text(order.paymentMethod ? `Rs. 0 (COD)` : `Rs. ${grandTotal}`, 180, finalY + 62, { align: 'right' });
    
    doc.text("Amount Due:", 130, finalY + 69);
    doc.text(`Rs. ${grandTotal}`, 180, finalY + 69, { align: 'right' });

    doc.save(`Bill_Pookies_Order_${order.id}.pdf`);
  };

  if (loading) return <div className="text-center py-5 mt-5"><Spinner animation="border" style={{ color: 'var(--primary-color)' }} /></div>;

  return (
    <div className="bg-light-pink fade-in min-vh-100">
      {/* Banner Section */}
      <div className="position-relative d-flex align-items-center justify-content-center mb-5" style={{ 
        minHeight: '30vh', 
        backgroundImage: `url('/images/orders_banner.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
        <div className="position-relative text-center z-index-1 p-4 rounded-4 shadow-sm mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)' }}>
          <h2 className="fw-bold mb-0 px-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>My Orders</h2>
        </div>
      </div>

      <Container className="pb-5">
      
      {orders.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 text-center py-5">
          <Card.Body>
            <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
              <FiShoppingBag size={40} className="text-muted" />
            </div>
            <h4 className="fw-bold">No orders yet</h4>
            <p className="text-muted mb-4">Looks like you haven't made any purchases yet.</p>
            <Link to="/products" className="btn btn-primary rounded-pill px-4">Start Shopping</Link>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 py-3 ps-4 text-muted font-monospace small">ORDER ID</th>
                    <th className="border-0 py-3 text-muted font-monospace small">DATE</th>
                    <th className="border-0 py-3 text-muted font-monospace small">ITEMS</th>
                    <th className="border-0 py-3 text-muted font-monospace small">TOTAL</th>
                    <th className="border-0 py-3 text-muted font-monospace small">STATUS</th>
                    <th className="border-0 py-3 pe-4 text-muted font-monospace small text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 ps-4 fw-medium text-dark">#{order.id.toString().padStart(8, '0')}</td>
                      <td className="py-3 text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        <ul className="list-unstyled mb-0 small">
                          {order.products && order.products.map((item, idx) => (
                            <li key={idx} className="text-truncate" style={{ maxWidth: '200px' }}>
                              {item.quantity}x {item.name}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3 fw-bold" style={{ color: 'var(--primary-color)' }}>₹{order.totalAmount}</td>
                      <td className="py-3">{getStatusBadge(order.status)}</td>
                      <td className="py-3 pe-4 text-end">
                        <button 
                          onClick={() => generateBill(order)} 
                          className="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-1 hover-lift"
                        >
                          <FiDownload size={14} /> Bill
                        </button>
                      </td>
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

export default Orders;

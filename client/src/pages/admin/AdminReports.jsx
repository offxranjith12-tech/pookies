import { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Badge, Form, Modal, Table } from 'react-bootstrap';
import axios from 'axios';
import { FiTrendingUp, FiDollarSign, FiBox, FiAlertCircle, FiCheckCircle, FiSearch, FiCalendar, FiDownload } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockModalType, setStockModalType] = useState('total');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get('/api/orders'),
          axios.get('/api/products')
        ]);
        
        setOrders(ordersRes.data.data || ordersRes.data || []);
        setProducts(productsRes.data.data || productsRes.data || []);
      } catch (error) {
        console.error('Error fetching report data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" style={{ color: 'var(--primary-color)' }} /></div>;
  }

  // Calculate times
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

  // Helper function to calculate sales and profit for a given period
  const getMetrics = (startDate) => {
    const filteredOrders = orders.filter(order => {
      if (order.status === 'Cancelled') return false;
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate;
    });

    const sales = filteredOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const profit = sales * 0.30; 
    
    return { sales, profit };
  };

  const dailyMetrics = getMetrics(oneDayAgo);
  const weeklyMetrics = getMetrics(oneWeekAgo);
  const monthlyMetrics = getMetrics(oneMonthAgo);

  // Stock calculations
  const totalProducts = products.length;
  const outOfStockProducts = products.filter(p => p.stock <= 0);
  const inStockProducts = products.filter(p => p.stock > 0);
  const outOfStockCount = outOfStockProducts.length;
  const inStockCount = inStockProducts.length;

  const handleStockClick = (type) => {
    setStockModalType(type);
    setShowStockModal(true);
  };

  // Chart Data: Last 7 Days
  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const daySales = orders.reduce((sum, order) => {
      if (order.status === 'Cancelled') return sum;
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (orderDate === dateStr) {
        return sum + Number(order.totalAmount || 0);
      }
      return sum;
    }, 0);

    last7DaysData.push({
      name: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      Sales: daySales,
      Profit: daySales * 0.30
    });
  }

  // Specific Date Search
  let specificDateSales = 0;
  let specificDateProfit = 0;
  if (selectedDate) {
    const dailyOrders = orders.filter(o => o.status !== 'Cancelled' && new Date(o.createdAt).toISOString().split('T')[0] === selectedDate);
    specificDateSales = dailyOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    specificDateProfit = specificDateSales * 0.30;
  }

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(216, 27, 96); // Pookie pink (approx)
    doc.text("Pookie's Admin - Sales & Stock Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    let currentY = 40;

    // Specific Date Section
    if (selectedDate) {
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text(`Results for Specific Date: ${new Date(selectedDate).toLocaleDateString()}`, 14, currentY);
      currentY += 10;
      doc.setFontSize(12);
      doc.text(`Sales: Rs. ${specificDateSales.toFixed(2)}`, 14, currentY);
      doc.text(`Estimated Profit (30%): Rs. ${specificDateProfit.toFixed(2)}`, 80, currentY);
      currentY += 15;
    }

    // Overview Section
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Cumulative Sales Overview", 14, currentY);
    currentY += 10;

    const overviewTable = [
      ["Period", "Sales (Rs)", "Estimated Profit (Rs)"],
      ["Last 24 Hours", dailyMetrics.sales.toFixed(2), dailyMetrics.profit.toFixed(2)],
      ["Last 7 Days", weeklyMetrics.sales.toFixed(2), weeklyMetrics.profit.toFixed(2)],
      ["Last 30 Days", monthlyMetrics.sales.toFixed(2), monthlyMetrics.profit.toFixed(2)],
    ];

    autoTable(doc, {
      head: [overviewTable[0]],
      body: overviewTable.slice(1),
      startY: currentY,
      theme: 'grid',
      headStyles: { fillColor: [216, 27, 96] },
    });
    
    currentY = doc.lastAutoTable.finalY + 15;

    // Last 7 Days Breakdown
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Last 7 Days Breakdown", 14, currentY);
    
    const last7Table = [
      ["Date", "Sales (Rs)", "Profit (Rs)"]
    ];
    
    // Add in chronological order
    [...last7DaysData].reverse().forEach(day => {
      last7Table.push([day.name, day.Sales.toFixed(2), day.Profit.toFixed(2)]);
    });

    autoTable(doc, {
      head: [last7Table[0]],
      body: last7Table.slice(1),
      startY: currentY + 10,
      theme: 'grid',
      headStyles: { fillColor: [25, 135, 84] }, // Success green
    });
    
    currentY = doc.lastAutoTable.finalY + 15;

    // Stock Overview
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text("Inventory & Stock Status", 14, currentY);
    
    const stockTable = [
      ["Metric", "Count"],
      ["Total Products", totalProducts.toString()],
      ["In Stock", inStockCount.toString()],
      ["Out of Stock", outOfStockCount.toString()]
    ];

    autoTable(doc, {
      head: [stockTable[0]],
      body: stockTable.slice(1),
      startY: currentY + 10,
      theme: 'grid',
      headStyles: { fillColor: [13, 110, 253] }, // Primary blue
    });

    doc.save(`pookies_reports_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateStockPDF = () => {
    const doc = new jsPDF();
    const title = stockModalType === 'total' 
      ? 'Total Products Overview' 
      : (stockModalType === 'instock' ? 'Products In Stock' : 'Out of Stock Products');
      
    doc.setFontSize(18);
    doc.setTextColor(216, 27, 96);
    doc.text(`Pookie's Admin - ${title}`, 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    const tableColumn = ["Product Name", "Category", "Price (Rs)", "Stock"];
    const tableRows = [];
    
    const dataList = stockModalType === 'total' ? products : (stockModalType === 'instock' ? inStockProducts : outOfStockProducts);
    
    dataList.forEach(product => {
      tableRows.push([
        product.name,
        product.category,
        product.price,
        product.stock.toString()
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: stockModalType === 'outstock' ? [220, 53, 69] : (stockModalType === 'instock' ? [25, 135, 84] : [13, 110, 253]) },
    });
    
    doc.save(`pookies_${stockModalType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="fade-in pb-5">
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>Reports & Analytics</h2>
          <p className="text-muted small mb-0">Overview of sales, profit, and stock status.</p>
        </div>
        
        <div className="d-flex flex-wrap gap-3 align-items-center">
          {/* Date Search Bar */}
          <div className="d-flex align-items-center bg-white p-2 rounded-pill shadow-sm border">
            <div className="d-flex align-items-center px-3 border-end text-muted">
              <FiSearch className="me-2" />
              <span className="small fw-bold">SEARCH BY DATE</span>
            </div>
            <Form.Control 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-0 shadow-none bg-transparent"
              style={{ minWidth: '150px' }}
            />
          </div>

          <Button 
            variant="outline-primary" 
            className="d-flex align-items-center gap-2 rounded-pill hover-lift py-2" 
            onClick={generatePDF}
          >
            <FiDownload /> Export PDF
          </Button>
        </div>
      </div>

      {/* Specific Date Results */}
      {selectedDate && (
        <Card className="border-0 shadow-sm rounded-4 mb-4 bg-soft-pink border-start border-primary border-4">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={4} className="mb-3 mb-md-0">
                <div className="d-flex align-items-center">
                  <div className="bg-white p-3 rounded-circle me-3 shadow-sm">
                    <FiCalendar size={24} className="text-primary" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">Results for</h6>
                    <span className="text-primary fw-bold">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </Col>
              <Col md={4} className="border-start border-end px-4 mb-3 mb-md-0">
                <span className="text-muted d-block small fw-bold">SALES ON THIS DAY</span>
                <h3 className="fw-bold mb-0">₹{specificDateSales.toFixed(2)}</h3>
              </Col>
              <Col md={4} className="px-4">
                <span className="text-muted d-block small fw-bold">PROFIT ON THIS DAY (30%)</span>
                <h3 className="fw-bold mb-0 text-success">₹{specificDateProfit.toFixed(2)}</h3>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Chart Section */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0 text-accent">Sales & Profit Trends (Last 7 Days)</h5>
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d81b60" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d81b60" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#198754" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#198754" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} tickFormatter={(value) => `₹${value}`} dx={-10} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`₹${value.toFixed(2)}`]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="Sales" stroke="#d81b60" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="Profit" stroke="#198754" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>

      <h5 className="fw-bold mb-3 mt-4 text-accent">Cumulative Sales Overview</h5>
      <Row className="g-4 mb-4">
        {/* Daily Metrics */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <FiDollarSign size={24} className="text-primary" />
                </div>
                <h5 className="fw-bold mb-0">Last 24 Hours</h5>
              </div>
              <div className="mb-2">
                <span className="text-muted d-block small fw-bold">SALES</span>
                <h3 className="fw-bold mb-0">₹{dailyMetrics.sales.toFixed(2)}</h3>
              </div>
              <div>
                <span className="text-muted d-block small fw-bold mt-2">EST. PROFIT (30%)</span>
                <h4 className="fw-bold mb-0 text-success">₹{dailyMetrics.profit.toFixed(2)}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Weekly Metrics */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                  <FiTrendingUp size={24} className="text-info" />
                </div>
                <h5 className="fw-bold mb-0">Last 7 Days</h5>
              </div>
              <div className="mb-2">
                <span className="text-muted d-block small fw-bold">SALES</span>
                <h3 className="fw-bold mb-0">₹{weeklyMetrics.sales.toFixed(2)}</h3>
              </div>
              <div>
                <span className="text-muted d-block small fw-bold mt-2">EST. PROFIT (30%)</span>
                <h4 className="fw-bold mb-0 text-success">₹{weeklyMetrics.profit.toFixed(2)}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Monthly Metrics */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                  <FiTrendingUp size={24} className="text-success" />
                </div>
                <h5 className="fw-bold mb-0">Last 30 Days</h5>
              </div>
              <div className="mb-2">
                <span className="text-muted d-block small fw-bold">SALES</span>
                <h3 className="fw-bold mb-0">₹{monthlyMetrics.sales.toFixed(2)}</h3>
              </div>
              <div>
                <span className="text-muted d-block small fw-bold mt-2">EST. PROFIT (30%)</span>
                <h4 className="fw-bold mb-0 text-success">₹{monthlyMetrics.profit.toFixed(2)}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h5 className="fw-bold mb-3 mt-5 text-accent">Inventory & Stock Status</h5>
      <Row className="g-4">
        <Col md={4}>
          <Card 
            className="border-0 shadow-sm rounded-4 h-100 hover-lift" 
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => handleStockClick('total')}
          >
            <Card.Body className="p-4 d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                <FiBox size={24} className="text-primary" />
              </div>
              <div>
                <span className="text-muted d-block small fw-bold">TOTAL PRODUCTS</span>
                <h3 className="fw-bold mb-0">{totalProducts}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            className="border-0 shadow-sm rounded-4 h-100 hover-lift"
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => handleStockClick('instock')}
          >
            <Card.Body className="p-4 d-flex align-items-center">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                <FiCheckCircle size={24} className="text-success" />
              </div>
              <div>
                <span className="text-muted d-block small fw-bold">IN STOCK</span>
                <h3 className="fw-bold mb-0">{inStockCount}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card 
            className="border-0 shadow-sm rounded-4 h-100 border-start border-danger border-4 hover-lift"
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => handleStockClick('outstock')}
          >
            <Card.Body className="p-4 d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                <FiAlertCircle size={24} className="text-danger" />
              </div>
              <div>
                <span className="text-danger d-block small fw-bold">OUT OF STOCK</span>
                <h3 className="fw-bold mb-0 text-danger">{outOfStockCount}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stock Details Modal */}
      <Modal show={showStockModal} onHide={() => setShowStockModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0 d-flex align-items-center">
          <Modal.Title className="fw-bold h5 mb-0">
            {stockModalType === 'total' && 'Total Products Overview'}
            {stockModalType === 'instock' && 'Products Currently In Stock'}
            {stockModalType === 'outstock' && 'Out of Stock Products (Action Required)'}
          </Modal.Title>
          <Button 
            variant="outline-primary" 
            size="sm"
            className="ms-auto me-2 d-flex align-items-center gap-1 rounded-pill" 
            onClick={generateStockPDF}
          >
            <FiDownload /> Download PDF
          </Button>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-2 text-muted font-monospace small">PRODUCT</th>
                  <th className="border-0 py-2 text-muted font-monospace small">CATEGORY</th>
                  <th className="border-0 py-2 text-muted font-monospace small">PRICE</th>
                  <th className="border-0 py-2 text-muted font-monospace small text-end">STOCK</th>
                </tr>
              </thead>
              <tbody>
                {(stockModalType === 'total' ? products : (stockModalType === 'instock' ? inStockProducts : outOfStockProducts)).map(product => (
                  <tr key={product._id}>
                    <td className="py-2 fw-bold">{product.name}</td>
                    <td className="py-2">{product.category}</td>
                    <td className="py-2">₹{product.price}</td>
                    <td className="py-2 text-end">
                      <Badge bg={product.stock > 0 ? "success" : "danger"} className="rounded-pill px-3 py-2 bg-opacity-10 border" style={{ borderColor: product.stock > 0 ? 'var(--bs-success)' : 'var(--bs-danger)', color: product.stock > 0 ? 'var(--bs-success)' : 'var(--bs-danger)' }}>
                        {product.stock}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(stockModalType === 'total' ? products : (stockModalType === 'instock' ? inStockProducts : outOfStockProducts)).length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">No products found in this category.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminReports;

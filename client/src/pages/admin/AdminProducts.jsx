import { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Spinner, Toast, ToastContainer, Row, Col } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiPlus, FiCheckCircle, FiAlertCircle, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    featured: false
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products', error);
      setLoading(false);
      showToast('Failed to load products', 'error');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      name: '', brand: '', category: '', description: '', price: '', stock: '', image: '', featured: false
    });
    setImageFile(null);
  };

  const handleShow = () => setShowModal(true);

  const handleEdit = (product) => {
    setEditMode(true);
    setCurrentId(product._id);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      featured: product.featured
    });
    setImageFile(null);
    handleShow();
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/products/${productToDelete._id}`);
      fetchProducts();
      showToast('Product deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting product', error);
      showToast('Failed to delete product', 'error');
    } finally {
      setSubmitting(false);
      setProductToDelete(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setImageFile(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append('name', formData.name);
      uploadData.append('brand', formData.brand);
      uploadData.append('category', formData.category);
      uploadData.append('description', formData.description);
      uploadData.append('price', formData.price);
      uploadData.append('stock', formData.stock);
      uploadData.append('featured', formData.featured);
      
      if (imageFile) {
        uploadData.append('image', imageFile);
      }

      if (editMode) {
        await axios.put(`/api/products/${currentId}`, uploadData);
        showToast('Product updated successfully');
      } else {
        await axios.post('/api/products', uploadData);
        showToast('Product added successfully');
      }
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Error saving product', error);
      showToast(error.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Pookie's - Products Report", 14, 15);
    
    const tableColumn = ["ID", "Name", "Brand", "Category", "Price", "Stock"];
    const tableRows = [];

    products.forEach(product => {
      const row = [
        product._id.substring(0, 8),
        product.name,
        product.brand,
        product.category,
        product.price,
        product.stock
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save(`pookies_products_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Product ID,Name,Brand,Category,Price (Rs),Stock\n";
    
    products.forEach(product => {
      const row = [
        `"${product._id}"`,
        `"${product.name}"`,
        `"${product.brand}"`,
        `"${product.category}"`,
        product.price,
        product.stock
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pookies_products_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" style={{ color: 'var(--primary-color)' }} /></div>;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>Products Management</h2>
          <p className="text-muted small mb-0">Manage your catalog, stock, and pricing.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-success" className="d-flex align-items-center gap-2 rounded-pill hover-lift" onClick={generateCSV}>
            <FiDownload /> Export Excel
          </Button>
          <Button variant="outline-primary" className="d-flex align-items-center gap-2 rounded-pill hover-lift" onClick={generatePDF}>
            <FiDownload /> Export PDF
          </Button>
          <Button variant="primary" onClick={handleShow} className="rounded-pill px-4 d-flex align-items-center hover-lift ms-2">
            <FiPlus className="me-2" /> Add Product
          </Button>
        </div>
      </div>
      
      <Card className="border-0 shadow-sm rounded-4 hover-lift" style={{ transition: 'all 0.3s' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4 text-muted font-monospace small">PRODUCT</th>
                  <th className="border-0 py-3 text-muted font-monospace small">CATEGORY</th>
                  <th className="border-0 py-3 text-muted font-monospace small">PRICE</th>
                  <th className="border-0 py-3 text-muted font-monospace small">STOCK</th>
                  <th className="border-0 py-3 text-muted font-monospace small">STATUS</th>
                  <th className="border-0 py-3 pe-4 text-end text-muted font-monospace small">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <img 
                          src={product.image && product.image !== 'no-photo.jpg' ? (product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`) : "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=100&q=80"} 
                          alt="" 
                          className="rounded-3 me-3 object-fit-cover shadow-sm"
                          style={{ width: '48px', height: '48px' }}
                        />
                        <div>
                          <h6 className="mb-0 fw-bold">{product.name}</h6>
                          <small className="text-muted text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>{product.brand}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{product.category}</td>
                    <td className="py-3 fw-bold" style={{ color: 'var(--primary-color)' }}>₹{product.price}</td>
                    <td className="py-3">{product.stock}</td>
                    <td className="py-3">
                      {product.stock > 0 ? (
                        <Badge bg="success" className="rounded-pill px-3 py-2 fw-medium bg-opacity-10 text-success border border-success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger" className="rounded-pill px-3 py-2 fw-medium bg-opacity-10 text-danger border border-danger">Out of Stock</Badge>
                      )}
                    </td>
                    <td className="py-3 pe-4 text-end">
                      <Button variant="light" size="sm" className="me-2 text-primary rounded-circle p-2 hover-lift" onClick={() => handleEdit(product)}>
                        <FiEdit2 />
                      </Button>
                      <Button variant="light" size="sm" className="text-danger rounded-circle p-2 hover-lift" onClick={() => confirmDelete(product)}>
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No products found. Add some to your catalog!</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold h4">{editMode ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form onSubmit={handleSubmit}>
            <Row className="gy-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Product Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required className="py-2" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Brand</Form.Label>
                  <Form.Control type="text" name="brand" value={formData.brand} onChange={handleChange} required className="py-2" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Category</Form.Label>
                  <Form.Select name="category" value={formData.category} onChange={handleChange} required className="py-2">
                    <option value="">Select Category...</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Lip Care">Lip Care</option>
                    <option value="Beauty Tools">Beauty Tools</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Price (₹)</Form.Label>
                  <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required className="py-2" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Stock</Form.Label>
                  <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required className="py-2" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Image</Form.Label>
                  <Form.Control type="file" name="image" onChange={handleChange} accept="image/*" className="py-2" />
                  {formData.image && typeof formData.image === 'string' && <div className="mt-2 text-muted small">Current: <a href={formData.image.startsWith('http') ? formData.image : `http://localhost:5000${formData.image}`} target="_blank" rel="noreferrer">View Image</a></div>}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Check type="switch" id="custom-switch" label="Featured Product" name="featured" checked={formData.featured} onChange={handleChange} className="fw-medium text-dark" />
              </Col>
            </Row>
            <div className="text-end mt-4">
              <Button variant="light" onClick={handleClose} className="me-2 rounded-pill px-4 font-weight-medium">Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitting} className="rounded-pill px-4">
                {submitting ? <Spinner size="sm" animation="border" /> : (editMode ? 'Update Product' : 'Save Product')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Body className="text-center p-4">
          <div className="mb-3">
            <div className="mx-auto bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <FiAlertCircle size={30} className="text-danger" />
            </div>
          </div>
          <h5 className="fw-bold mb-3">Delete Product?</h5>
          <p className="text-muted mb-4 text-sm">
            Are you sure you want to delete <span className="fw-bold text-dark">{productToDelete?.name}</span>? This action cannot be undone.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="light" onClick={() => setShowDeleteModal(false)} className="rounded-pill px-4 w-50">Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={submitting} className="rounded-pill px-4 w-50">
              {submitting ? <Spinner size="sm" animation="border" /> : 'Delete'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

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

export default AdminProducts;

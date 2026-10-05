import { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Spinner, Row, Col, Toast, ToastContainer } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiPlus, FiStar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const AdminArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    location: '',
    experience: '',
    startingPrice: '',
    description: '',
    services: '',
    image: '',
    available: true
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchArtists = async () => {
    try {
      const res = await axios.get('/api/artists');
      setArtists(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artists', error);
      setLoading(false);
      showToast('Failed to load artists', 'error');
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      name: '', specialization: '', location: '', experience: '', startingPrice: '', description: '', services: '', image: '', available: true
    });
    setImageFile(null);
  };

  const handleShow = () => setShowModal(true);

  const handleEdit = (artist) => {
    setEditMode(true);
    setCurrentId(artist._id);
    setFormData({
      name: artist.name || '',
      specialization: artist.specialization || '',
      location: artist.location || '',
      experience: artist.experience || '',
      startingPrice: artist.startingPrice || '',
      description: artist.description || '',
      services: artist.services ? artist.services.join(', ') : '',
      image: artist.image || '',
      available: artist.available ?? true
    });
    setImageFile(null);
    handleShow();
  };

  const confirmDelete = (artist) => {
    setArtistToDelete(artist);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!artistToDelete) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/artists/${artistToDelete._id}`);
      fetchArtists();
      showToast('Artist deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting artist', error);
      showToast('Failed to delete artist', 'error');
    } finally {
      setSubmitting(false);
      setArtistToDelete(null);
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
      uploadData.append('specialization', formData.specialization);
      uploadData.append('location', formData.location);
      uploadData.append('experience', formData.experience);
      uploadData.append('startingPrice', formData.startingPrice);
      uploadData.append('description', formData.description);
      uploadData.append('services', formData.services);
      uploadData.append('available', formData.available);
      
      if (imageFile) {
        uploadData.append('image', imageFile);
      }

      if (editMode) {
        await axios.put(`/api/artists/${currentId}`, uploadData);
        showToast('Artist updated successfully');
      } else {
        await axios.post('/api/artists', uploadData);
        showToast('Artist added successfully');
      }
      fetchArtists();
      handleClose();
    } catch (error) {
      console.error('Error saving artist', error);
      showToast(error.response?.data?.message || 'Failed to save artist', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" style={{ color: 'var(--primary-color)' }} /></div>;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>Artists Management</h2>
          <p className="text-muted small mb-0">Manage professional makeup artists and stylists.</p>
        </div>
        <Button variant="primary" onClick={handleShow} className="rounded-pill px-4 d-flex align-items-center hover-lift">
          <FiPlus className="me-2" /> Add Artist
        </Button>
      </div>
      
      <Card className="border-0 shadow-sm rounded-4 hover-lift" style={{ transition: 'all 0.3s' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4 text-muted font-monospace small">ARTIST</th>
                  <th className="border-0 py-3 text-muted font-monospace small">SPECIALIZATION</th>
                  <th className="border-0 py-3 text-muted font-monospace small">LOCATION</th>
                  <th className="border-0 py-3 text-muted font-monospace small">PRICE</th>
                  <th className="border-0 py-3 text-muted font-monospace small">STATUS</th>
                  <th className="border-0 py-3 pe-4 text-end text-muted font-monospace small">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {artists.map((artist) => (
                  <tr key={artist._id}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center">
                        <img 
                          src={artist.image && artist.image !== 'no-photo.jpg' ? (artist.image.startsWith('http') ? artist.image : `http://localhost:5000${artist.image}`) : "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=100&q=80"} 
                          alt="" 
                          className="rounded-circle me-3 object-fit-cover shadow-sm"
                          style={{ width: '48px', height: '48px' }}
                        />
                        <div>
                          <h6 className="mb-0 fw-bold">{artist.name}</h6>
                          <small className="text-muted"><FiStar className="text-warning" style={{ fill: 'var(--bs-warning)' }} /> {artist.rating?.toFixed(1) || '5.0'}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{artist.specialization}</td>
                    <td className="py-3">{artist.location}</td>
                    <td className="py-3 fw-bold" style={{ color: 'var(--primary-color)' }}>₹{artist.startingPrice}</td>
                    <td className="py-3">
                      {artist.available ? (
                        <Badge bg="success" className="rounded-pill px-3 py-2 fw-medium bg-opacity-10 text-success border border-success">Available</Badge>
                      ) : (
                        <Badge bg="secondary" className="rounded-pill px-3 py-2 fw-medium bg-opacity-10 text-secondary border border-secondary">Unavailable</Badge>
                      )}
                    </td>
                    <td className="py-3 pe-4 text-end">
                      <Button variant="light" size="sm" className="me-2 text-primary rounded-circle p-2 hover-lift" onClick={() => handleEdit(artist)}>
                        <FiEdit2 />
                      </Button>
                      <Button variant="light" size="sm" className="text-danger rounded-circle p-2 hover-lift" onClick={() => confirmDelete(artist)}>
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
                {artists.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No artists found. Add professionals to your platform!</td>
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
          <Modal.Title className="fw-bold h4">{editMode ? 'Edit Artist' : 'Add New Artist'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form onSubmit={handleSubmit}>
            <Row className="gy-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Artist Name</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required className="py-2" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Specialization</Form.Label>
                  <Form.Control type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Bridal Makeup" required className="py-2" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Location</Form.Label>
                  <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} required className="py-2" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Experience</Form.Label>
                  <Form.Control type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5 Years" required className="py-2" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Starting Price (₹)</Form.Label>
                  <Form.Control type="number" name="startingPrice" value={formData.startingPrice} onChange={handleChange} required className="py-2" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold">Services (Comma separated)</Form.Label>
                  <Form.Control type="text" name="services" value={formData.services} onChange={handleChange} placeholder="Bridal Makeup, Party Makeup, Hair Styling" required className="py-2" />
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
                <Form.Check type="switch" id="artist-availability" label="Available for Booking" name="available" checked={formData.available} onChange={handleChange} className="fw-medium text-dark" />
              </Col>
            </Row>
            <div className="text-end mt-4">
              <Button variant="light" onClick={handleClose} className="me-2 rounded-pill px-4 font-weight-medium">Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitting} className="rounded-pill px-4">
                {submitting ? <Spinner size="sm" animation="border" /> : (editMode ? 'Update Artist' : 'Save Artist')}
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
          <h5 className="fw-bold mb-3">Delete Artist?</h5>
          <p className="text-muted mb-4 text-sm">
            Are you sure you want to delete <span className="fw-bold text-dark">{artistToDelete?.name}</span>? This action cannot be undone.
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

export default AdminArtists;

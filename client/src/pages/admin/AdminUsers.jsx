import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Form, InputGroup, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { FiTrash2, FiSearch, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users', error);
      setLoading(false);
      showToast('Failed to load users', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setSubmitting(true);
    try {
      await axios.delete(`/api/users/${userToDelete._id}`);
      fetchUsers();
      showToast('User deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user', error);
      showToast(error.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setSubmitting(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" style={{ color: 'var(--primary-color)' }} /></div>;

  return (
    <div className="fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>Users Management</h2>
          <p className="text-muted small mb-0">Manage platform users and administrators.</p>
        </div>
        
        <div className="d-flex gap-2">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-pink border-end-0">
              <FiSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name or email..."
              className="border-start-0 ps-0 focus-ring-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>
      
      <Card className="border-0 shadow-sm rounded-4 hover-lift" style={{ transition: 'all 0.3s' }}>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4 text-muted font-monospace small">USER</th>
                  <th className="border-0 py-3 text-muted font-monospace small">EMAIL</th>
                  <th className="border-0 py-3 text-muted font-monospace small">ROLE</th>
                  <th className="border-0 py-3 text-muted font-monospace small">JOINED DATE</th>
                  <th className="border-0 py-3 pe-4 text-end text-muted font-monospace small">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">No users found matching your criteria.</td></tr>
                ) : filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td className="py-3 ps-4 fw-bold">{u.name} {currentUser?._id === u._id && <span className="badge bg-secondary ms-2 small">You</span>}</td>
                    <td className="py-3 text-muted">{u.email}</td>
                    <td className="py-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-primary' : 'bg-info'} bg-opacity-10 text-${u.role === 'admin' ? 'primary' : 'info'} border border-${u.role === 'admin' ? 'primary' : 'info'} rounded-pill px-3 py-1`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 pe-4 text-end">
                      <Button 
                        variant="light" 
                        size="sm" 
                        className="text-danger rounded-circle p-2 hover-lift" 
                        onClick={() => confirmDelete(u)}
                        disabled={currentUser?._id === u._id}
                        title={currentUser?._id === u._id ? "Cannot delete yourself" : "Delete User"}
                      >
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Body className="text-center p-4">
          <div className="mb-3">
            <div className="mx-auto bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <FiAlertCircle size={30} className="text-danger" />
            </div>
          </div>
          <h5 className="fw-bold mb-3">Delete User?</h5>
          <p className="text-muted mb-4 text-sm">
            Are you sure you want to delete <span className="fw-bold text-dark">{userToDelete?.name}</span>? This action cannot be undone.
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

export default AdminUsers;

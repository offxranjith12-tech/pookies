import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { FiUser, FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useAuth(); // login is actually dispatching setting user
  
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await axios.put('/api/auth/profile', {
        name: profileData.name,
        phone: profileData.phone
      });
      // We should ideally update the context user here, but just a reload or keeping local state works
      // Assuming context listens to storage, or we can just rely on the API success.
      showToast('Profile updated successfully');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }

    setUpdatingPassword(true);
    try {
      const res = await axios.put('/api/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Update token in localStorage
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password updated successfully');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="bg-light-pink fade-in min-vh-100 pb-5">
      {/* Banner Section */}
      <div className="position-relative d-flex align-items-center justify-content-center mb-5" style={{ 
        minHeight: '30vh', 
        backgroundImage: `url('/images/user_profile_header.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}></div>
        <div className="position-relative text-center z-index-1 p-4 rounded-4 shadow-sm mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)' }}>
          <h2 className="fw-bold mb-0 px-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>My Profile</h2>
        </div>
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
          
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3 text-primary">
                  <FiUser size={24} />
                </div>
                <h4 className="fw-bold mb-0">Personal Information</h4>
              </div>
              
              <Form onSubmit={handleProfileSubmit}>
                <Row className="gy-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">Email Address</Form.Label>
                      <Form.Control type="email" value={profileData.email} disabled className="py-2 bg-light" />
                      <Form.Text className="text-muted">Email cannot be changed.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">Full Name</Form.Label>
                      <Form.Control type="text" name="name" value={profileData.name} onChange={handleProfileChange} required className="py-2 focus-ring-primary" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">Phone Number</Form.Label>
                      <Form.Control type="text" name="phone" value={profileData.phone} onChange={handleProfileChange} className="py-2 focus-ring-primary" />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-4 text-end">
                  <Button variant="primary" type="submit" disabled={updatingProfile} className="rounded-pill px-4">
                    {updatingProfile ? <Spinner size="sm" animation="border" /> : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3 text-warning">
                  <FiLock size={24} />
                </div>
                <h4 className="fw-bold mb-0">Change Password</h4>
              </div>
              
              <Form onSubmit={handlePasswordSubmit}>
                <Row className="gy-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">Current Password</Form.Label>
                      <Form.Control type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required className="py-2 focus-ring-primary" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">New Password</Form.Label>
                      <Form.Control type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength={6} className="py-2 focus-ring-primary" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small text-muted fw-bold">Confirm New Password</Form.Label>
                      <Form.Control type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength={6} className="py-2 focus-ring-primary" />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-4 text-end">
                  <Button variant="dark" type="submit" disabled={updatingPassword} className="rounded-pill px-4">
                    {updatingPassword ? <Spinner size="sm" animation="border" /> : 'Change Password'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
    </Container>
    </div>
  );
};

export default Profile;

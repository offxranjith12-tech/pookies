import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FiSettings, FiLock, FiUser, FiSave } from 'react-icons/fi';
import axios from 'axios';

const Settings = () => {
  const { user, login } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [passAlert, setPassAlert] = useState({ show: false, message: '', variant: 'success' });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', variant: 'success' });

    try {
      await axios.put('/api/auth/profile', profileData);
      setAlert({ show: true, message: 'Profile updated successfully!', variant: 'success' });
    } catch (error) {
      setAlert({ 
        show: true, 
        message: error.response?.data?.message || 'Failed to update profile', 
        variant: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassAlert({ show: true, message: 'New passwords do not match', variant: 'danger' });
      return;
    }

    setPassLoading(true);
    setPassAlert({ show: false, message: '', variant: 'success' });

    try {
      await axios.put('/api/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPassAlert({ show: true, message: 'Password updated successfully!', variant: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPassAlert({ 
        show: true, 
        message: error.response?.data?.message || 'Failed to update password', 
        variant: 'danger' 
      });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <Container className="py-5 fade-in min-vh-100">
      <div className="d-flex align-items-center mb-4">
        <FiSettings size={28} className="me-3" style={{ color: 'var(--primary-color)' }} />
        <h2 className="fw-bold mb-0" style={{ fontFamily: 'var(--font-heading)' }}>Account Settings</h2>
      </div>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <FiUser size={24} className="me-2 text-muted" />
                <h4 className="fw-bold mb-0">Personal Information</h4>
              </div>
              
              {alert.show && <Alert variant={alert.variant} className="border-0">{alert.message}</Alert>}
              
              <Form onSubmit={handleProfileSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold">Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={profileData.name} 
                    onChange={handleProfileChange} 
                    className="py-2" 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold">Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="py-2 bg-light text-muted" 
                  />
                  <Form.Text className="text-muted small">Email cannot be changed.</Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="small text-muted fw-bold">Phone Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleProfileChange} 
                    className="py-2" 
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={loading} className="rounded-pill px-4 d-flex align-items-center">
                  {loading ? <Spinner size="sm" className="me-2" /> : <FiSave className="me-2" />}
                  Save Changes
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center mb-4">
                <FiLock size={24} className="me-2 text-muted" />
                <h4 className="fw-bold mb-0">Security</h4>
              </div>
              
              {passAlert.show && <Alert variant={passAlert.variant} className="border-0">{passAlert.message}</Alert>}
              
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold">Current Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="currentPassword" 
                    value={passwordData.currentPassword} 
                    onChange={handlePasswordChange} 
                    className="py-2" 
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold">New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="newPassword" 
                    value={passwordData.newPassword} 
                    onChange={handlePasswordChange} 
                    className="py-2" 
                    minLength="6"
                    required 
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="small text-muted fw-bold">Confirm New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="confirmPassword" 
                    value={passwordData.confirmPassword} 
                    onChange={handlePasswordChange} 
                    className="py-2" 
                    minLength="6"
                    required 
                  />
                </Form.Group>
                
                <Button variant="outline-primary" type="submit" disabled={passLoading} className="rounded-pill px-4 d-flex align-items-center">
                  {passLoading ? <Spinner size="sm" className="me-2" /> : <FiLock className="me-2" />}
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;

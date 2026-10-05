import { Card } from 'react-bootstrap';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ArtistProfile = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>My Artist Profile</h2>
      
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-5 text-center">
          <div className="bg-soft-pink rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '100px', height: '100px' }}>
            <FiUser size={48} className="text-primary" />
          </div>
          <h3 className="fw-bold text-dark">{user.name}</h3>
          <p className="text-muted text-uppercase fw-bold small">Makeup Artist</p>
          <hr className="my-4 mx-5" />
          <p className="text-muted max-w-500 mx-auto">
            Your profile is visible to customers when they browse artists. Profile editing functionality will be available shortly.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ArtistProfile;

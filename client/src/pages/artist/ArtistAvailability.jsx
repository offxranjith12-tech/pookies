import { Card } from 'react-bootstrap';
import { FiCheckCircle } from 'react-icons/fi';

const ArtistAvailability = () => {
  return (
    <div>
      <h2 className="fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Manage Availability</h2>
      
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-5 text-center">
          <FiCheckCircle size={64} className="text-success mb-4 opacity-50" />
          <h4 className="fw-bold">You are currently available for bookings!</h4>
          <p className="text-muted max-w-500 mx-auto mt-3">
            In future updates, you will be able to block off specific days and times from your calendar. For now, all dates are open for customer requests.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ArtistAvailability;

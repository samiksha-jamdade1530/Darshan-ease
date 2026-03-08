import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from "../../utils/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my-bookings');
      setBookings(data);
    } catch {
      // Demo data
      setBookings([
        {
          _id: 'b1', ticketId: 'DE-1710000001-AB12', bookingStatus: 'CONFIRMED', numberOfDevotees: 2,
          totalAmount: 300, bookingDate: new Date().toISOString(),
          temple: { templeName: 'Tirupati Balaji', location: 'Andhra Pradesh', imageUrl: 'https://images.unsplash.com/photo-1625736301182-6e02abb6fa28?w=80&h=80&fit=crop' },
          slot: { poojaType: 'Morning Darshan', startTime: '06:00', endTime: '08:00', date: new Date().toISOString() },
        },
        {
          _id: 'b2', ticketId: 'DE-1710000002-CD34', bookingStatus: 'CANCELLED', numberOfDevotees: 1,
          totalAmount: 150, bookingDate: new Date().toISOString(),
          temple: { templeName: 'Kashi Vishwanath', location: 'Varanasi', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=80&h=80&fit=crop' },
          slot: { poojaType: 'Abhishek Darshan', startTime: '10:00', endTime: '12:00', date: new Date().toISOString() },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const statusBadge = (status) => {
    if (status === 'CONFIRMED') return <span className="badge bg-success">Confirmed</span>;
    if (status === 'CANCELLED') return <span className="badge bg-danger">Cancelled</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  if (loading) return (
    <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
  );

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">
        <i className="fas fa-ticket-alt me-2" style={{ color: 'var(--primary)' }}></i>
        My Darshan Bookings
      </h3>

      {bookings.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="fas fa-ticket-alt fa-3x mb-3"></i>
          <p>You have no bookings yet. <a href="/temples">Book a darshan now!</a></p>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b) => (
            <div key={b._id} className="col-md-6">
              <div className="booking-card card p-4">
                <div className="d-flex gap-3 align-items-start">
                  <img src={b.temple?.imageUrl} alt="" className="rounded-3" style={{ width: 70, height: 70, objectFit: 'cover' }} />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bold mb-1">{b.temple?.templeName}</h6>
                      {statusBadge(b.bookingStatus)}
                    </div>
                    <p className="text-muted small mb-1"><i className="fas fa-map-marker-alt me-1"></i>{b.temple?.location}</p>
                    <p className="small mb-1"><i className="far fa-clock me-1 text-warning"></i>{b.slot?.startTime} – {b.slot?.endTime} | {b.slot?.poojaType}</p>
                    <p className="small text-muted mb-1">👥 {b.numberOfDevotees} Devotee{b.numberOfDevotees > 1 ? 's' : ''} · ₹{b.totalAmount}</p>
                    <div className="ticket-badge d-inline-block mt-1">{b.ticketId}</div>
                  </div>
                </div>
                {b.bookingStatus === 'CONFIRMED' && (
                  <button className="btn btn-outline-danger btn-sm mt-3 w-100" onClick={() => handleCancel(b._id)}>
                    <i className="fas fa-times me-1"></i>Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const OrganizerDashboard = () => {
  const [temples, setTemples] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddTemple, setShowAddTemple] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [templeForm, setTempleForm] = useState({ templeName: '', location: '', description: '', darshanStartTime: '', darshanEndTime: '', imageUrl: '' });
  const [slotForm, setSlotForm] = useState({ temple: '', date: '', startTime: '', endTime: '', totalSeats: 50, price: 100, poojaType: 'General Darshan' });

  const fetchData = async () => {
    try {
      const [t, s, b] = await Promise.all([
        API.get('/temples/my-temples'),
        API.get('/slots/my-slots'),
        API.get('/bookings/organizer'),
      ]);
      setTemples(t.data);
      setSlots(s.data);
      setBookings(b.data);
    } catch {
      // Demo fallback
      setTemples([{ _id: 't1', templeName: 'My Temple', location: 'City', isActive: true }]);
      setSlots([]);
      setBookings([]);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddTemple = async (e) => {
    e.preventDefault();
    try {
      await API.post('/temples', templeForm);
      toast.success('Temple added successfully!');
      setShowAddTemple(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await API.post('/slots', slotForm);
      toast.success('Slot added successfully!');
      setShowAddSlot(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteTemple = async (id) => {
    if (!confirm('Delete this temple?')) return;
    try {
      await API.delete(`/temples/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const stats = [
    { label: 'My Temples', value: temples.length, icon: 'fa-gopuram', color: '#d4622a' },
    { label: 'My Slots', value: slots.length, icon: 'fa-calendar', color: '#f5a623' },
    { label: 'Bookings', value: bookings.length, icon: 'fa-ticket-alt', color: '#28a745' },
    { label: 'Revenue', value: `₹${bookings.filter(b => b.bookingStatus === 'CONFIRMED').reduce((s, b) => s + (b.totalAmount || 0), 0)}`, icon: 'fa-rupee-sign', color: '#17a2b8' },
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar d-none d-md-block">
        <div className="text-center py-4 px-3">
          <div className="display-4">🛕</div>
          <h6 className="text-white mt-2 fw-bold">Organizer Panel</h6>
        </div>
        {[
          ['overview', 'fa-tachometer-alt', 'Overview'],
          ['temples', 'fa-gopuram', 'My Temples'],
          ['slots', 'fa-calendar-alt', 'My Slots'],
          ['bookings', 'fa-ticket-alt', 'Bookings'],
        ].map(([key, icon, label]) => (
          <a key={key} href="#" className={`nav-link ${activeTab === key ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab(key); }}>
            <i className={`fas ${icon} me-2`}></i>{label}
          </a>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4">
          {activeTab === 'overview' && '📊 Dashboard Overview'}
          {activeTab === 'temples' && '🛕 My Temples'}
          {activeTab === 'slots' && '📅 Darshan Slots'}
          {activeTab === 'bookings' && '🎫 Bookings'}
        </h4>

        {/* Overview */}
        {activeTab === 'overview' && (
          <>
            <div className="row g-3 mb-4">
              {stats.map((s) => (
                <div key={s.label} className="col-sm-6 col-xl-3">
                  <div className="stat-card" style={{ background: s.color }}>
                    <i className={`fas ${s.icon} fa-2x mb-2 opacity-75`}></i>
                    <h3 className="fw-bold">{s.value}</h3>
                    <p className="mb-0 small opacity-75">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-3">
                  <h6 className="fw-bold mb-3">Recent Bookings</h6>
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b._id} className="d-flex justify-content-between py-2 border-bottom small">
                      <span>{b.user?.name} — {b.temple?.templeName}</span>
                      <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>{b.bookingStatus}</span>
                    </div>
                  ))}
                  {bookings.length === 0 && <p className="text-muted small">No bookings yet.</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Temples */}
        {activeTab === 'temples' && (
          <>
            <button className="btn btn-primary mb-3" onClick={() => setShowAddTemple(!showAddTemple)}>
              <i className="fas fa-plus me-1"></i>Add Temple
            </button>
            {showAddTemple && (
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h6 className="fw-bold mb-3">Add New Temple</h6>
                <form onSubmit={handleAddTemple}>
                  <div className="row g-3">
                    <div className="col-md-6"><input className="form-control" placeholder="Temple Name *" value={templeForm.templeName} onChange={(e) => setTempleForm({ ...templeForm, templeName: e.target.value })} required /></div>
                    <div className="col-md-6"><input className="form-control" placeholder="Location *" value={templeForm.location} onChange={(e) => setTempleForm({ ...templeForm, location: e.target.value })} required /></div>
                    <div className="col-md-6"><input type="time" className="form-control" placeholder="Start Time" value={templeForm.darshanStartTime} onChange={(e) => setTempleForm({ ...templeForm, darshanStartTime: e.target.value })} required /></div>
                    <div className="col-md-6"><input type="time" className="form-control" placeholder="End Time" value={templeForm.darshanEndTime} onChange={(e) => setTempleForm({ ...templeForm, darshanEndTime: e.target.value })} required /></div>
                    <div className="col-12"><input className="form-control" placeholder="Image URL" value={templeForm.imageUrl} onChange={(e) => setTempleForm({ ...templeForm, imageUrl: e.target.value })} /></div>
                    <div className="col-12"><textarea className="form-control" rows="2" placeholder="Description" value={templeForm.description} onChange={(e) => setTempleForm({ ...templeForm, description: e.target.value })}></textarea></div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">Save Temple</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddTemple(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div className="row g-3">
              {temples.map((t) => (
                <div key={t._id} className="col-md-4">
                  <div className="card border-0 shadow-sm rounded-4 p-3">
                    <h6 className="fw-bold">{t.templeName}</h6>
                    <p className="text-muted small mb-2"><i className="fas fa-map-marker-alt me-1"></i>{t.location}</p>
                    <span className={`badge ${t.isActive ? 'bg-success' : 'bg-secondary'}`}>{t.isActive ? 'Active' : 'Inactive'}</span>
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-outline-danger btn-sm flex-grow-1" onClick={() => handleDeleteTemple(t._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Slots */}
        {activeTab === 'slots' && (
          <>
            <button className="btn btn-primary mb-3" onClick={() => setShowAddSlot(!showAddSlot)}>
              <i className="fas fa-plus me-1"></i>Add Slot
            </button>
            {showAddSlot && (
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h6 className="fw-bold mb-3">Add Darshan Slot</h6>
                <form onSubmit={handleAddSlot}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <select className="form-select" value={slotForm.temple} onChange={(e) => setSlotForm({ ...slotForm, temple: e.target.value })} required>
                        <option value="">Select Temple *</option>
                        {temples.map((t) => <option key={t._id} value={t._id}>{t.templeName}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6"><input type="date" className="form-control" value={slotForm.date} onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })} required /></div>
                    <div className="col-md-4"><input type="time" className="form-control" placeholder="Start" value={slotForm.startTime} onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })} required /></div>
                    <div className="col-md-4"><input type="time" className="form-control" placeholder="End" value={slotForm.endTime} onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })} required /></div>
                    <div className="col-md-4"><input type="number" className="form-control" placeholder="Total Seats" value={slotForm.totalSeats} onChange={(e) => setSlotForm({ ...slotForm, totalSeats: e.target.value })} /></div>
                    <div className="col-md-6"><input type="number" className="form-control" placeholder="Price (₹)" value={slotForm.price} onChange={(e) => setSlotForm({ ...slotForm, price: e.target.value })} /></div>
                    <div className="col-md-6"><input className="form-control" placeholder="Pooja Type" value={slotForm.poojaType} onChange={(e) => setSlotForm({ ...slotForm, poojaType: e.target.value })} /></div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">Save Slot</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddSlot(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div className="table-responsive">
              <table className="table table-hover bg-white rounded-4 overflow-hidden shadow-sm">
                <thead style={{ background: '#d4622a', color: 'white' }}>
                  <tr><th>Temple</th><th>Date</th><th>Time</th><th>Pooja</th><th>Seats</th><th>Price</th></tr>
                </thead>
                <tbody>
                  {slots.map((s) => (
                    <tr key={s._id}>
                      <td>{s.temple?.templeName}</td>
                      <td>{new Date(s.date).toLocaleDateString('en-IN')}</td>
                      <td>{s.startTime} – {s.endTime}</td>
                      <td>{s.poojaType}</td>
                      <td><span className={`badge ${s.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`}>{s.availableSeats}/{s.totalSeats}</span></td>
                      <td>₹{s.price}</td>
                    </tr>
                  ))}
                  {slots.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-3">No slots created yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div className="table-responsive">
            <table className="table table-hover bg-white rounded-4 overflow-hidden shadow-sm">
              <thead style={{ background: '#d4622a', color: 'white' }}>
                <tr><th>Ticket ID</th><th>Devotee</th><th>Temple</th><th>Devotees</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td><small className="text-muted">{b.ticketId}</small></td>
                    <td>{b.user?.name}<br/><small className="text-muted">{b.user?.email}</small></td>
                    <td>{b.temple?.templeName}</td>
                    <td>{b.numberOfDevotees}</td>
                    <td>₹{b.totalAmount}</td>
                    <td><span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>{b.bookingStatus}</span></td>
                  </tr>
                ))}
                {bookings.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-3">No bookings yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;

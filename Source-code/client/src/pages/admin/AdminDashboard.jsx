import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, orgsRes, bookingsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/organizers'),
        API.get('/bookings'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setOrganizers(orgsRes.data);
      setBookings(bookingsRes.data);
    } catch {
      setStats({ totalUsers: 24, totalOrganizers: 5, totalTemples: 12, totalBookings: 87, confirmedBookings: 72, cancelledBookings: 15, totalRevenue: 54300 });
      setUsers([
        { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@mail.com', phone: '9876543210', isActive: true },
        { _id: 'u2', name: 'Priya Singh', email: 'priya@mail.com', phone: '9123456789', isActive: true },
      ]);
      setOrganizers([
        { _id: 'o1', name: 'Temple Trust A', email: 'trust@temple.com', phone: '9000000001', isActive: true },
      ]);
      setBookings([]);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggleUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/toggle`);
      toast.success('User status updated');
      fetchData();
    } catch { toast.error('Failed'); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      fetchData();
    } catch { toast.error('Failed'); }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: 'fa-users', color: '#4e73df' },
    { label: 'Organizers', value: stats.totalOrganizers, icon: 'fa-user-tie', color: '#1cc88a' },
    { label: 'Temples', value: stats.totalTemples, icon: 'fa-gopuram', color: '#36b9cc' },
    { label: 'Bookings', value: stats.totalBookings, icon: 'fa-ticket-alt', color: '#d4622a' },
    { label: 'Confirmed', value: stats.confirmedBookings, icon: 'fa-check-circle', color: '#28a745' },
    { label: 'Cancelled', value: stats.cancelledBookings, icon: 'fa-times-circle', color: '#dc3545' },
    { label: 'Revenue', value: `₹${stats.totalRevenue || 0}`, icon: 'fa-rupee-sign', color: '#f5a623' },
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar d-none d-md-block">
        <div className="text-center py-4 px-3">
          <div className="display-4">⚙️</div>
          <h6 className="text-white mt-2 fw-bold">Admin Panel</h6>
        </div>
        {[
          ['overview', 'fa-tachometer-alt', 'Overview'],
          ['users', 'fa-users', 'Users'],
          ['organizers', 'fa-user-tie', 'Organizers'],
          ['bookings', 'fa-ticket-alt', 'All Bookings'],
        ].map(([key, icon, label]) => (
          <a key={key} href="#" className={`nav-link ${activeTab === key ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab(key); }}>
            <i className={`fas ${icon} me-2`}></i>{label}
          </a>
        ))}
      </div>

      {/* Content */}
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4">
          {activeTab === 'overview' && '📊 Admin Dashboard'}
          {activeTab === 'users' && '👤 Manage Users'}
          {activeTab === 'organizers' && '🏛️ Manage Organizers'}
          {activeTab === 'bookings' && '🎫 All Bookings'}
        </h4>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="row g-3">
            {statCards.map((s) => (
              <div key={s.label} className="col-sm-6 col-xl-3">
                <div className="stat-card" style={{ background: s.color }}>
                  <i className={`fas ${s.icon} fa-2x mb-2 opacity-75`}></i>
                  <h3 className="fw-bold">{s.value ?? '—'}</h3>
                  <p className="mb-0 small opacity-75">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="table-responsive">
            <table className="table table-hover bg-white rounded-4 overflow-hidden shadow-sm">
              <thead style={{ background: '#4e73df', color: 'white' }}>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td><span className={`badge ${u.isActive ? 'bg-success' : 'bg-secondary'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-outline-warning btn-sm" onClick={() => handleToggleUser(u._id)}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-3">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Organizers */}
        {activeTab === 'organizers' && (
          <div className="table-responsive">
            <table className="table table-hover bg-white rounded-4 overflow-hidden shadow-sm">
              <thead style={{ background: '#1cc88a', color: 'white' }}>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {organizers.map((o, i) => (
                  <tr key={o._id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{o.name}</td>
                    <td>{o.email}</td>
                    <td>{o.phone || '—'}</td>
                    <td><span className={`badge ${o.isActive ? 'bg-success' : 'bg-secondary'}`}>{o.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button className="btn btn-outline-warning btn-sm" onClick={() => handleToggleUser(o._id)}>
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
                {organizers.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-3">No organizers found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* All Bookings */}
        {activeTab === 'bookings' && (
          <div className="table-responsive">
            <table className="table table-hover bg-white rounded-4 overflow-hidden shadow-sm">
              <thead style={{ background: '#d4622a', color: 'white' }}>
                <tr><th>Ticket ID</th><th>User</th><th>Temple</th><th>Devotees</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td><small>{b.ticketId}</small></td>
                    <td>{b.user?.name}</td>
                    <td>{b.temple?.templeName}</td>
                    <td>{b.numberOfDevotees}</td>
                    <td>₹{b.totalAmount}</td>
                    <td><span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'bg-success' : 'bg-danger'}`}>{b.bookingStatus}</span></td>
                    <td><small>{new Date(b.bookingDate).toLocaleDateString('en-IN')}</small></td>
                  </tr>
                ))}
                {bookings.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-3">No bookings found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', role: 'USER',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      login(data);
      toast.success('Registration successful! Welcome to DarshanEase 🙏');
      if (data.role === 'ORGANIZER') navigate('/organizer/dashboard');
      else navigate('/temples');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 rounded-4 p-4">
            <div className="text-center mb-4">
              <div className="display-4">🙏</div>
              <h3 className="fw-bold mt-2">Create Account</h3>
              <p className="text-muted small">Join DarshanEase today</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Full Name *</label>
                  <input type="text" className="form-control" placeholder="Your full name" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Email *</label>
                  <input type="email" className="form-control" placeholder="Your email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Password *</label>
                  <input type="password" className="form-control" placeholder="Min 6 characters" value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone</label>
                  <input type="text" className="form-control" placeholder="Phone number" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Register As</label>
                  <select className="form-select" value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    <option value="USER">Devotee (User)</option>
                    <option value="ORGANIZER">Temple Organizer</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Address</label>
                  <input type="text" className="form-control" placeholder="Your address" value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 mt-4" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                Create Account
              </button>
            </form>
            <hr />
            <p className="text-center mb-0 small">
              Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Temples = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/temples');
        setTemples(data);
      } catch {
        // fallback sample data for demo
        setTemples([
          { _id: '1', templeName: 'Tirupati Balaji', location: 'Tirupati, Andhra Pradesh', description: 'One of the most visited temples in the world.', darshanStartTime: '06:00', darshanEndTime: '22:00', imageUrl: 'https://images.unsplash.com/photo-1625736301182-6e02abb6fa28?w=400&h=200&fit=crop' },
          { _id: '2', templeName: 'Kashi Vishwanath', location: 'Varanasi, Uttar Pradesh', description: 'Sacred Shiva temple on the banks of Ganges.', darshanStartTime: '04:00', darshanEndTime: '23:00', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=200&fit=crop' },
          { _id: '3', templeName: 'Shirdi Sai Baba', location: 'Shirdi, Maharashtra', description: 'Temple of Saint Sai Baba, revered across all faiths.', darshanStartTime: '05:00', darshanEndTime: '23:00', imageUrl: 'https://images.unsplash.com/photo-1567057419565-4349c49d8a04?w=400&h=200&fit=crop' },
          { _id: '4', templeName: 'Golden Temple', location: 'Amritsar, Punjab', description: 'The holiest Gurdwara and most important pilgrimage site of Sikhism.', darshanStartTime: '00:00', darshanEndTime: '23:59', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop' },
          { _id: '5', templeName: 'Somnath Temple', location: 'Gujarat', description: 'First of the twelve Jyotirlinga shrines of God Shiva.', darshanStartTime: '06:00', darshanEndTime: '22:00', imageUrl: 'https://images.unsplash.com/photo-1575383793714-d0ca25d13a01?w=400&h=200&fit=crop' },
          { _id: '6', templeName: 'Vaishno Devi', location: 'Jammu & Kashmir', description: 'Cave temple dedicated to Goddess Vaishno Devi in Trikuta Mountains.', darshanStartTime: '05:00', darshanEndTime: '21:00', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=200&fit=crop' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = temples.filter(
    (t) =>
      t.templeName.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Explore Temples</h2>
        <p className="text-muted">Discover sacred temples and book your darshan slot</p>
        <div className="col-md-5 mx-auto mt-3">
          <div className="input-group">
            <span className="input-group-text bg-white"><i className="fas fa-search text-muted"></i></span>
            <input type="text" className="form-control border-start-0" placeholder="Search by temple name or location..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning"></div>
          <p className="mt-3 text-muted">Loading temples...</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((temple) => (
            <div key={temple._id} className="col-md-4">
              <div className="card temple-card h-100">
                <img
                  src={temple.imageUrl || 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=400&h=200&fit=crop'}
                  className="card-img-top"
                  alt={temple.templeName}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{temple.templeName}</h5>
                  <p className="text-muted small mb-2">
                    <i className="fas fa-map-marker-alt me-1" style={{ color: 'var(--primary)' }}></i>
                    {temple.location}
                  </p>
                  <p className="small text-secondary">{temple.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-success fw-semibold">
                      <i className="far fa-clock me-1"></i>
                      {temple.darshanStartTime} – {temple.darshanEndTime}
                    </small>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 pb-3">
                  <Link to={`/temples/${temple._id}`} className="btn btn-primary w-100 btn-sm">
                    <i className="fas fa-ticket-alt me-1"></i>Book Darshan
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-12 text-center py-5 text-muted">
              <i className="fas fa-search fa-3x mb-3"></i>
              <p>No temples found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Temples;

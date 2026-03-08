const Footer = () => (
  <footer className="mt-5">
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <h5>🙏 DarshanEase</h5>
          <p className="small mt-2">
            Your gateway to seamless temple darshan experiences. Book slots, manage visits, and
            connect with the divine effortlessly.
          </p>
        </div>
        <div className="col-md-2 mb-3">
          <h5 className="small text-uppercase fw-bold mb-3">Quick Links</h5>
          <ul className="list-unstyled small">
            <li><a href="/" className="text-white-50 text-decoration-none">Home</a></li>
            <li><a href="/temples" className="text-white-50 text-decoration-none">Temples</a></li>
            <li><a href="/register" className="text-white-50 text-decoration-none">Register</a></li>
          </ul>
        </div>
        <div className="col-md-3 mb-3">
          <h5 className="small text-uppercase fw-bold mb-3">Contact</h5>
          <ul className="list-unstyled small text-white-50">
            <li><i className="fas fa-envelope me-2"></i>support@darshanease.com</li>
            <li><i className="fas fa-phone me-2"></i>+91 98765 43210</li>
            <li><i className="fas fa-map-marker-alt me-2"></i>India</li>
          </ul>
        </div>
        <div className="col-md-3 mb-3">
          <h5 className="small text-uppercase fw-bold mb-3">Follow Us</h5>
          <div className="d-flex gap-3">
            <a href="#" className="text-white-50"><i className="fab fa-facebook fa-lg"></i></a>
            <a href="#" className="text-white-50"><i className="fab fa-twitter fa-lg"></i></a>
            <a href="#" className="text-white-50"><i className="fab fa-instagram fa-lg"></i></a>
          </div>
        </div>
      </div>
      <hr className="border-secondary" />
      <p className="text-center text-white-50 small mb-0">
        &copy; {new Date().getFullYear()} DarshanEase. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;

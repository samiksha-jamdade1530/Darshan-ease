import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

const Home = () => {
  const [temples, setTemples] = useState([]);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await API.get("/temples");
        setTemples(res.data.slice(0, 6)); // only featured temples
      } catch (err) {
        console.log(err);
      }
    };

    fetchTemples();
  }, []);

  const features = [
    {
      icon: "fa-search",
      title: "Browse Temples",
      desc: "Explore famous temples across India with complete darshan timings.",
      link: "/temples",
    },
    {
      icon: "fa-calendar-check",
      title: "Book Slots",
      desc: "Choose available darshan slots and book instantly.",
      link: "/temples",
    },
    {
      icon: "fa-ticket-alt",
      title: "My Bookings",
      desc: "View and manage your confirmed darshan bookings.",
      link: "/user/bookings",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <div className="container text-center text-white">
          <div className="mb-3">
  <i className="fas fa-place-of-worship fa-3x text-light"></i>
</div>

          <h1 className="display-4 fw-bold mb-3">
            Welcome to DarshanEase
          </h1>

          <p className="lead mb-4">
            Book temple darshan tickets easily and plan your spiritual journey.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/temples" className="btn btn-light btn-lg px-4">
              Explore Temples
            </Link>

            <Link to="/register" className="btn btn-outline-light btn-lg px-4">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED TEMPLES */}
      <section className="container my-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Featured Temples</h2>
          <p className="text-muted">
            Explore popular temples and book your darshan slot
          </p>
        </div>

        <div className="row g-4">
          {temples.map((temple) => (
            <div key={temple._id} className="col-md-4">
              <div className="card temple-card h-100 shadow-sm">

                <img
                  src={
                    temple.imageUrl
                      ? temple.imageUrl
                      : `/temples/${temple.templeName
                          .toLowerCase()
                          .replace(/\s/g, "")}.jpg`
                  }
                  className="card-img-top"
                  alt={temple.templeName}
                  onError={(e) => {
                    e.target.src = "/temples/default-temple.jpg";
                  }}
                />

                <div className="card-body">
                  <h5 className="fw-bold">{temple.templeName}</h5>

                  <p className="text-muted small">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    {temple.location}
                  </p>
                </div>

                <div className="card-footer bg-white border-0">
                  <Link
                    to={`/temples/${temple._id}`}
                    className="btn btn-primary w-100"
                  >
                    Book Darshan
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Link to="/temples" className="btn btn-outline-primary btn-lg">
            View All Temples →
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-5 bg-white">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose DarshanEase?</h2>
            <p className="text-muted">
              Everything you need for a seamless temple booking experience
            </p>
          </div>

          <div className="row g-4">
            {features.map((f) => (
              <div key={f.title} className="col-md-4 text-center">

                <div className="display-5 mb-3 text-warning">
                  <i className={`fas ${f.icon}`}></i>
                </div>

                <h5 className="fw-bold">{f.title}</h5>

                <p className="text-muted small">{f.desc}</p>

                <Link to={f.link} className="btn btn-outline-primary btn-sm">
                  Go
                </Link>

              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Home;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const TempleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [devotees, setDevotees] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templeRes = await API.get(`/temples/${id}`);
        const slotsRes = await API.get(`/slots/temple/${id}`);

        console.log("Temple Data:", templeRes.data);
        console.log("Slots Data:", slotsRes.data);

        setTemple(templeRes.data);
        setSlots(slotsRes.data);
      } catch (error) {
        console.error("API ERROR:", error);

        // fallback demo data
        setTemple({
          _id: id,
          templeName: "Tirupati Balaji",
          location: "Tirupati, Andhra Pradesh",
          description:
            "One of the most visited temples in the world dedicated to Lord Venkateswara.",
          darshanStartTime: "06:00",
          darshanEndTime: "22:00",
          imageUrl: "/temples/default-temple.jpg",
        });

        setSlots([
          {
            _id: "s1",
            startTime: "06:00",
            endTime: "08:00",
            availableSeats: 20,
            price: 100,
            poojaType: "Morning Darshan",
          },
          {
            _id: "s2",
            startTime: "10:00",
            endTime: "12:00",
            availableSeats: 35,
            price: 150,
            poojaType: "Abhishek Darshan",
          },
          {
            _id: "s3",
            startTime: "14:00",
            endTime: "16:00",
            availableSeats: 0,
            price: 100,
            poojaType: "Afternoon Darshan",
          },
          {
            _id: "s4",
            startTime: "18:00",
            endTime: "20:00",
            availableSeats: 12,
            price: 200,
            poojaType: "Evening Aarti",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBook = async () => {
    if (!userInfo) {
      toast.info("Please login to book a darshan slot");
      return navigate("/login");
    }

    if (!selectedSlot) {
      return toast.warning("Please select a time slot");
    }

    setBooking(true);

    try {
      await API.post("/bookings", {
        slotId: selectedSlot._id,
        templeId: id,
        numberOfDevotees: devotees,
      });

      toast.success("🎉 Booking confirmed! Check My Bookings.");
      navigate("/user/bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );

  return (
    <div>
      {/* Temple Banner */}
      <div style={{ height: 280, overflow: "hidden", position: "relative" }}>
        <img
          src={temple?.imageUrl ? temple.imageUrl : "/temples/default-temple.jpg"}
          alt={temple?.templeName}
          onError={(e) => {
            e.target.src = "/temples/default-temple.jpg";
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "flex-end",
            padding: 30,
          }}
        >
          <div className="text-white">
            <h2 className="fw-bold mb-1">{temple?.templeName}</h2>
            <p>
              <i className="fas fa-map-marker-alt me-1"></i>
              {temple?.location}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Temple Details */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3">Temple Details</h5>

              <p className="text-muted">{temple?.description}</p>

              <hr />

              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="far fa-clock text-warning"></i>
                <span className="small">
                  Darshan: {temple?.darshanStartTime} – {temple?.darshanEndTime}
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-map-marker-alt text-danger"></i>
                <span className="small">{temple?.location}</span>
              </div>
            </div>
          </div>

          {/* Slot Booking */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-4">Select Darshan Slot</h5>

              <div className="row g-3">
                {slots.map((slot) => (
                  <div key={slot._id} className="col-md-6">
                    <div
                      className={`slot-card ${
                        selectedSlot?._id === slot._id ? "selected" : ""
                      } ${slot.availableSeats === 0 ? "opacity-50" : ""}`}
                      onClick={() =>
                        slot.availableSeats > 0 && setSelectedSlot(slot)
                      }
                      style={{
                        cursor:
                          slot.availableSeats === 0
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="fw-bold">{slot.poojaType}</h6>

                          <p className="small text-muted">
                            <i className="far fa-clock me-1"></i>
                            {slot.startTime} – {slot.endTime}
                          </p>

                          <span
                            className={`badge ${
                              slot.availableSeats === 0
                                ? "bg-danger"
                                : "bg-success"
                            }`}
                          >
                            {slot.availableSeats === 0
                              ? "Full"
                              : `${slot.availableSeats} seats`}
                          </span>
                        </div>

                        <div className="text-end">
                          <h5
                            className="fw-bold mb-0"
                            style={{ color: "var(--primary)" }}
                          >
                            ₹{slot.price}
                          </h5>
                          <small className="text-muted">per person</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Booking Summary */}
              {selectedSlot && (
                <div
                  className="mt-4 p-3 rounded-3"
                  style={{ background: "#fff3ee" }}
                >
                  <h6 className="fw-bold mb-3">Booking Summary</h6>

                  <div className="d-flex align-items-center gap-3 mb-3">
                    <label className="fw-semibold small">
                      Number of Devotees:
                    </label>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          setDevotees(Math.max(1, devotees - 1))
                        }
                      >
                        −
                      </button>

                      <span className="fw-bold px-2">{devotees}</span>

                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          setDevotees(
                            Math.min(selectedSlot.availableSeats, devotees + 1)
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Total Amount:</span>

                    <span
                      className="fw-bold fs-5"
                      style={{ color: "var(--primary)" }}
                    >
                      ₹{selectedSlot.price * devotees}
                    </span>
                  </div>

                  <button
                    className="btn btn-primary w-100 mt-3 py-2"
                    onClick={handleBook}
                    disabled={booking}
                  >
                    {booking ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <i className="fas fa-ticket-alt me-2"></i>
                    )}
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleDetail;
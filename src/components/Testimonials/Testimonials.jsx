import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHandPointRight } from "@fortawesome/free-solid-svg-icons";
import "./Testimonials.css";
import PrevNextButtons from "./PrevNextButtons";

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:7500/review");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewClick = () => {
    navigate("/login");
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : reviews.length - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < reviews.length - 1 ? prevIndex + 1 : 0
    );
  };

  const currentReview = reviews.length > 0 && reviews[currentIndex] ? reviews[currentIndex] : {};

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex < reviews.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000); // Change the testimonial every 5 seconds

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, [reviews.length]);

  useEffect(() => {
    console.log('Current Review:', currentReview);
    if (currentReview.userId) {
      console.log('Image URL:', `http://localhost:7500/user/picture/${currentReview.userId.picture}`);
    }
  }, [currentReview]);

  return (
    <div className="review-page" id="testimonials">
      <div className="t-header">
        <h2>Testimonials</h2>
        <span className="text-5">
          To provide you always better services than before, <br />write us your
          feedbacks please and rate the app too.
        </span>
        <span className="text-6">Tell others what you think</span>
        <p className="write-review" onClick={handleReviewClick}>
          <FontAwesomeIcon
            icon={faHandPointRight}
            style={{ color: "#ff00ff", fontSize: "20px", marginRight: "5px" }}
          />
          Write your review
        </p>
      </div>
      {Array.isArray(reviews) && reviews.length > 0 && (
        <div className="review-display">
          <div className="review-container">
            <div className="img-container">
              {currentReview.userId && (
                <img
                  src={`http://localhost:7500/user/picture/${currentReview.userId._id}`} 
                  alt={`${currentReview.userId.firstName} ${currentReview.userId.lastName}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'fallback-image-url.jpg'; // Optional fallback image
                  }}
                />
              )}
            </div>
            <div className="review-details">
              <p className="review-name">
                {`${currentReview.userId.firstName} ${currentReview.userId.lastName}`}
              </p>
              <div className="stars">
                {[...Array(currentReview.rating || 0)].map((_, index) => (
                  <span className="dynamic-star" key={index}>⭐</span>
                ))}
              </div>
              <p className="review-message">{currentReview.message}</p>
            </div>
          </div>
          <div className="slider-container">
            <PrevNextButtons
              onPrevClick={handlePrevClick}
              onNextClick={handleNextClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Testimonials;

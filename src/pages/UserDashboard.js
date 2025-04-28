import React, { useState } from "react";
import "../pages/UserDashboard.css";  // Importing the CSS

// Sample data for categories, doctors, and doctor profiles
const doctorsByCategory = {
  "Cardiology": [
    { name: "Dr. John", experience: "10 years", specialty: "Cardiology", education: "MD in Cardiology", photo: "/images/dr-john.jpg" },
    { name: "Dr. Smith", experience: "8 years", specialty: "Cardiology", education: "MBBS, MD", photo: "/images/dr-smith.jpg" },
  ],
  "Dermatology": [
    { name: "Dr. Lee", experience: "5 years", specialty: "Dermatology", education: "MD in Dermatology", photo: "/images/dr-lee.jpg" },
    { name: "Dr. Gupta", experience: "12 years", specialty: "Dermatology", education: "MBBS, MD", photo: "/images/dr-gupta.jpg" },
  ],
  "Neurology": [
    { name: "Dr. Adams", experience: "7 years", specialty: "Neurology", education: "MD in Neurology", photo: "/images/dr-adams.jpg" },
    { name: "Dr. Moore", experience: "15 years", specialty: "Neurology", education: "MBBS, MD", photo: "/images/dr-moore.jpg" },
  ],
};

export default function UserDashboard({ isLoggedIn, username, cardNumber }) {
    isLoggedIn = true;
    username = "Chakradhar";
    cardNumber = "5734567";
  const [category, setCategory] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Handle category change
  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    setDoctor(null); // Reset doctor when category changes
    checkFormCompletion(selectedCategory, null, date, time);
  };

  // Handle doctor change
  const handleDoctorChange = (selectedDoctor) => {
    setDoctor(selectedDoctor);
    checkFormCompletion(category, selectedDoctor, date, time);
  };

  // Handle date change
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    checkFormCompletion(category, doctor, selectedDate, time);
  };

  // Handle time change
  const handleTimeChange = (event) => {
    const selectedTime = event.target.value;
    setTime(selectedTime);
    checkFormCompletion(category, doctor, date, selectedTime);
  };

  // Check if form is complete
  const checkFormCompletion = (category, doctor, date, time) => {
    if (category && doctor && date && time) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isFormValid) {
      console.log("Appointment booked:", { category, doctor, date, time });
      alert("Your appointment has been booked!");

      // Reset form after submission
      setCategory("");
      setDoctor(null);
      setDate("");
      setTime("");
      setIsFormValid(false);
    } else {
      alert("Please fill all the fields!");
    }
  };

  return (
    <div className="appointment-container">
      <div className="welcome-container">
      {isLoggedIn ? (
        // If the user is logged in, display user info and remove the book appointment header
        <div className="user-info">
          <h2>Welcome, {username}</h2>
          <p>Card Number: {cardNumber}</p>
        </div>
      ) : (
        // If the user is not logged in, show "Book Appointment" header
        <h1>Book an Appointment</h1>
      )}
      {/* Rest of your Category form/content goes here */}
    </div>

      {/* Category Selection - Grid with images */}
      <div className="category-grid">
        {Object.keys(doctorsByCategory).map((categoryName) => (
          <div
            key={categoryName}
            className="category-card"
            onClick={() => handleCategoryChange(categoryName)}
          >
            <img
              src={`/images/${categoryName.toLowerCase()}.jpg`} // Ensure you have category images like cardiology.jpg, dermatology.jpg, etc.
              alt={categoryName}
              className="category-image"
            />
            <h3>{categoryName}</h3>
          </div>
        ))}
      </div>

      {/* Doctor Selection - Display doctors based on selected category */}
      {category && (
        <>
          <label htmlFor="doctor">Doctor</label>
          <select id="doctor" value={doctor ? doctor.name : ""} onChange={(e) => handleDoctorChange(doctorsByCategory[category].find(d => d.name === e.target.value))}>
            <option value="">Select Doctor</option>
            {doctorsByCategory[category].map((doctorItem) => (
              <option key={doctorItem.name} value={doctorItem.name}>
                {doctorItem.name}
              </option>
            ))}
          </select>

          {/* Display selected doctor's profile */}
          {doctor && (
            <div className="doctor-profile">
              <img src={doctor.photo} alt={doctor.name} className="doctor-photo" />
              <h3>{doctor.name}</h3>
              <p><strong>Experience:</strong> {doctor.experience}</p>
              <p><strong>Specialty:</strong> {doctor.specialty}</p>
              <p><strong>Education:</strong> {doctor.education}</p>
            </div>
          )}
        </>
      )}

      {/* Appointment Date and Time */}
      {doctor && (
        <>
          <label htmlFor="date">Appointment Date</label>
          <input type="date" id="date" value={date} onChange={handleDateChange} />

          <label htmlFor="time">Appointment Time</label>
          <input type="time" id="time" value={time} onChange={handleTimeChange} />

          <button id="submit" onClick={handleSubmit} disabled={!isFormValid}>
            Book Appointment
          </button>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner'; // Import the spinner

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Stop loading after 3 seconds (simulate data load)
    }, 3000);
  }, []);

  return (
    <div className="container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1>Welcome to Our Hospital</h1>
          <p>Delivering Compassionate Care, Backed by Excellence and Innovation.</p>
        </>
      )}
    </div>
  );
}

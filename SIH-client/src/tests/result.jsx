import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import DetailedResult from './detailedresult'; // Adjust the import path based on your actual file structure

const ResultComponent = ({ scores = {} }) => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [submitted, setSubmitted] = useState(false);
  const [existingResult, setExistingResult] = useState(null); // State to store existing result
  const navigate = useNavigate(); // Hook to navigate to a different route

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserName(user.displayName || user.email);
      setUserId(user.uid); // Set the user ID from Firebase Auth

      // Fetch existing result for the user
      fetchResult(user.uid);
    }
  }, []);

  const fetchResult = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/all-results?user_id=${encodeURIComponent(userId)}`);
      const data = await response.json();
      setExistingResult(data);
    } catch (error) {
      console.error('Error fetching result:', error);
      // Handle error fetching result
    } finally {
      setLoading(false);
    }
  };

  const submitNewTest = async () => {
    try {
      setLoading(true);

      // Assuming scores is already structured correctly as an object
      const response = await fetch(`http://localhost:3000/result/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scores),
      });

      const data = await response.json();
      setExistingResult(data); // Update the existing result state with the updated result
    } catch (error) {
      console.error('Error updating result:', error);
      // Handle error updating result
    } finally {
      setLoading(false);
      setSubmitted(true);
      navigate('/admin/dashboard'); // Navigate to the dashboard route
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="text-center mt-8">
      <h2 className="text-xl font-semibold mb-4">THANK YOU FOR ATTEMPTING THE TEST, {userName}</h2>
      <DetailedResult scores={scores}/>

      <button onClick={submitNewTest} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2">
        Save Progress!
      </button>
    </div>
  );
};

export default ResultComponent;

import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import ChartComponent from './chartComponent copy';
import Profile from './profile';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserName(user.displayName || user.email);
      setUserId(user.uid);
    }
  }, []);

  const backHome=()=>{
    navigate('/');
  }

  return (
    <div className="px-4 lg:px-24 ">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">

        <div className="px-4 py-6 bg-gradient-to-r from-yellow-200 to-yellow-300 shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center">User Profile</h1>
          <Profile userId={userId} />
          <button
            className="bg-black hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded block w-1/3 "
           onClick={backHome}
          >
           Back To Home
          </button>
        </div>

        {/* Second column, first row */}
        <div className="grid grid-rows-2 gap-8">
          <div className="px-4 py-6 bg-white shadow-md">
            <h1 className="text-3xl font-bold mb-4 text-center">Your Progress</h1>
            <ChartComponent userId={userId} />
          </div>

          {/* Second column, second row */}
          <div className="px-4 py-6 bg-white shadow-md">
            <h1 className="text-3xl font-bold mb-4 text-center">Badges</h1>
          </div>
        </div>
      </div>
    </div>
  );





};

export default Dashboard;

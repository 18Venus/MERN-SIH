import React, { useContext } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { AuthContext } from '../contacts/AuthProviders';
 // Update this path

const PrivateRoute = ({ children }) => {
    const { user, loading} = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="text-center">
                <Spinner aria-label="center-aligned spinner example" />
            </div>
        );
    }

    if (user) {
        return children;
    }

    return(
        <Navigate to="/login" state={{from: location}} replace></Navigate>
    )
    
    }

export default PrivateRoute;

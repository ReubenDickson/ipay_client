import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleRoute = ({ allowedRoles, children }) => {
    const { currentUser, userRole } = useAuth();
    
    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    
    return allowedRoles.includes(userRole) ? (
        children
    ) : (
        <Navigate to="/unauthorized" />
    );
}

export default RoleRoute;

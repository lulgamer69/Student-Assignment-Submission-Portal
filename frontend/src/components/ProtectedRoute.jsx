import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole, userRole, isAuthenticated }) {
  // Fallback checks using localStorage for robustness
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  // Use passed userRole first, fall back to localStorage
  const actualRole = userRole || role;
  
  if (requiredRole && actualRole !== requiredRole) {
    return <Navigate to="/errors/403" replace />;
  }

  return children;
}

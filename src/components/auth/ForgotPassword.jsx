import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPassword = () => {
    const [email, setEmail]  = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { resetPassword } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setMessage("");
            setError("");
            setLoading(true);
            await resetPassword(email);
            setMessage("Check your email for password reset instructions");
        } catch (error) {
            setError(`Failed to reset password: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="forgot-password-container">
          <h2>Reset Your Password</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button disabled={loading} type="submit" className="btn-primary">
              Reset Password
            </button>
          </form>
          
          <div className="auth-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      );
}

export default ForgotPassword;
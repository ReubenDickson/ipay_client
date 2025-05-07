import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bvn, setBvn] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        // form validation
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }
        if (password.length < 8) {
            return setError("Password must be at least 8 characters");
        }

        try {
            setError("");
            setLoading(true);
            await signup(email, password, firstName, lastName, bvn);
            setTimeout(() => {
              alert("Account created successfully! Please log in."); // Clear the alert popup
            }, 3000);
            navigate("/login");
            } catch (error) {
                setError(`Failed to create an account: ${error.message}`);
            } finally {
                setLoading(false);
            }
    }

    return (
        <div className="register-container">
      <h2>Create Your <span>iPay</span> Bank Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>BVN</label>
          <input
            type="text"
            value={bvn}
            onChange={(e) => setBvn(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button disabled={loading} type="submit" className="btn-primary">
          Create My Account
        </button>
      </form>
      
      <div className="auth-links">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
    );
}

export default Register;
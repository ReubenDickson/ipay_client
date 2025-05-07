import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, signInWithGoogle, signInWithFacebook } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/dashboard");
        } catch (error) {
            setError(`Failed to login: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignIn() {
        try {
            setError("");
            setLoading(true);
            await signInWithGoogle();
            navigate("/dashboard");
        } catch (error) {
            setError(`Failed to sign in with Google: ${error.message}`);
        } finally {
            setLoading(false);
        }   
    }

    async function handleFacebookSignIn() {
        try {
            setError("");
            setLoading(true);
            await signInWithFacebook();
            navigate("/dashboard");
        } catch (error) {
            setError(`Failed to sign in with Facebook: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
          <h2>Welcome to <span>iPay</span> Bank</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
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
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button disabled={loading} type="submit" className="btn-primary">
              Log In
            </button>
          </form>
          
          <div className="social-login">
            <button 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              className="btn-google"
            >
              Sign in with Google
            </button>
            
            <button 
              onClick={handleFacebookSignIn} 
              disabled={loading}
              className="btn-facebook"
            >
              Sign in with Facebook
            </button>
          </div>
          
          <div className="auth-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <br />
            Need an account? <Link to="/register">Create an <span>iPay</span> Account</Link>
          </div>
        </div>
      );
}

export default Login;
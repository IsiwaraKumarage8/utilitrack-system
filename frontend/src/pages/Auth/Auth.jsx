import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import * as authApi from '../../api/authApi';
import './Auth.css';

const Auth = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    full_name: '',
    phone: '',
    user_role: 'Billing Clerk',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authApi.login(loginData.username, loginData.password);
      
      if (response.success) {
        const userData = response.data.user;
        login(userData);
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authApi.register(signupData);
      
      if (response.success) {
        toast.success('Registration successful! Please login.');
        setIsToggled(false); // Switch to login form
        setSignupData({ 
          username: '', 
          email: '', 
          password: '',
          full_name: '',
          phone: '',
          user_role: 'Billing Clerk',
          department: ''
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-wrapper ${isToggled ? 'toggled' : ''}`}>
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>
        
        {/* Login Panel */}
        <div className="credentials-panel signin">
          <h2 className="slide-element">Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="field-wrapper slide-element">
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                required
              />
              <label>Username</label>
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Don't have an account? <br />
                <a href="#" onClick={(e) => { e.preventDefault(); setIsToggled(true); }}>
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Welcome Section - Login */}
        <div className="welcome-section signin">
          <h2 className="slide-element">WELCOME BACK!</h2>
        </div>

        {/* Signup Panel */}
        <div className="credentials-panel signup">
          <h2 className="slide-element">Register</h2>
          <form onSubmit={handleSignupSubmit}>
            <div className="field-wrapper slide-element">
              <input
                type="text"
                value={signupData.full_name}
                onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                required
              />
              <label>Full Name</label>
              <i className="fa-solid fa-user"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="text"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                required
              />
              <label>Username</label>
              <i className="fa-solid fa-user-tag"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
              <label>Email</label>
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <label>Password</label>
              <i className="fa-solid fa-lock"></i>
            </div>

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>
                Already have an account? <br />
                <a href="#" onClick={(e) => { e.preventDefault(); setIsToggled(false); }}>
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Welcome Section - Signup */}
        <div className="welcome-section signup">
          <h2 className="slide-element">WELCOME!</h2>
        </div>
      </div>

      <div className="footer">
        <p>Made with ❤️ by <a href="#" target="_blank" rel="noopener noreferrer">CodeZenithAI</a></p>
      </div>
    </div>
  );
};

export default Auth;

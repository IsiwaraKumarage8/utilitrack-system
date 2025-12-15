import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pin, User, Lock, Mail, UserCircle } from 'lucide-react';
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
        const authToken = response.data.token;
        login(userData, authToken);
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
      {/* Demo Credentials Sticky Note */}
      <div className="demo-credentials">
        <div className="sticky-note-header">
          <Pin size={16} />
          <span>Demo Credentials</span>
        </div>
        <div className="credentials-list">
          <div className="credential-item">
            <strong>Admin</strong>
            <span>admin / admin123</span>
          </div>
          <div className="credential-item">
            <strong>Field Officer</strong>
            <span>rperera / password123</span>
          </div>
          <div className="credential-item">
            <strong>Cashier</strong>
            <span>sfernando / password123</span>
          </div>
          <div className="credential-item">
            <strong>Manager</strong>
            <span>mjohnson / password123</span>
          </div>
          <div className="credential-item">
            <strong>Billing Clerk</strong>
            <span>ndias / password123</span>
          </div>
        </div>
      </div>

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
              <User size={18} />
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <label>Password</label>
              <Lock size={18} />
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
              <User size={18} />
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="text"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                required
              />
              <label>Username</label>
              <UserCircle size={18} />
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
              <label>Email</label>
              <Mail size={18} />
            </div>

            <div className="field-wrapper slide-element">
              <input
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <label>Password</label>
              <Lock size={18} />
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
    </div>
  );
};

export default Auth;

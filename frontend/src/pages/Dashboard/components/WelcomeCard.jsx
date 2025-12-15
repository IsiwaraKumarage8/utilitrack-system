import { Calendar, Briefcase } from 'lucide-react';
import './WelcomeCard.css';

/**
 * Welcome Card Component - Personalized greeting for dashboard
 * @param {string} userName - User's full name
 * @param {string} userRole - User's role
 * @param {string} quickMessage - Quick summary message
 */
const WelcomeCard = ({ userName, userRole, quickMessage }) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="welcome-card">
      <div className="welcome-card__gradient-overlay"></div>
      
      <div className="welcome-card__content">
        <div className="welcome-card__main">
          <h1 className="welcome-card__greeting">
            {getGreeting()}, {userName}! 👋
          </h1>
          <div className="welcome-card__info">
            <div className="welcome-card__info-item">
              <Calendar size={16} />
              <span>{getCurrentDateTime()}</span>
            </div>
            <div className="welcome-card__info-item">
              <Briefcase size={16} />
              <span className="welcome-card__role-badge">{userRole}</span>
            </div>
          </div>
        </div>
        
        {quickMessage && (
          <div className="welcome-card__message">
            <div className="welcome-card__message-icon">📊</div>
            <p>{quickMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeCard;

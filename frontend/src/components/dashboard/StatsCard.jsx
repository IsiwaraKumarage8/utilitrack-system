import './StatsCard.css';

/**
 * Enhanced Stats Card Component with Premium Gradients and Animations
 * @param {ReactNode} icon - Icon component
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {string} trend - Trend indicator text
 * @param {string} color - Card accent color (blue, green, orange, purple)
 */
const StatsCard = ({ icon: Icon, title, value, trend, color = 'blue' }) => {
  return (
    <div className={`stats-card stats-card--${color}`}>
      {/* Gradient overlay */}
      <div className={`stats-card__gradient-overlay stats-card__gradient-overlay--${color}`}></div>
      
      <div className="stats-card__content">
        {/* Icon with gradient and glow */}
        <div className={`stats-card__icon stats-card__icon--${color}`}>
          <Icon />
          <div className={`stats-card__icon-glow stats-card__icon-glow--${color}`}></div>
        </div>
        
        {/* Content */}
        <div className="stats-card__info">
          <p className="stats-card__title">{title}</p>
          <p className={`stats-card__value stats-card__value--${color}`}>{value}</p>
          {trend && (
            <div className="stats-card__trend">
              <span className="stats-card__trend-text">{trend}</span>
              <div className="stats-card__trend-dot"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

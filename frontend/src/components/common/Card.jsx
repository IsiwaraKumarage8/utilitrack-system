import './Card.css';

/**
 * Enhanced Reusable Card Component with Premium Styling
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 */
const Card = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {/* Subtle gradient overlay */}
      <div className="card__gradient-overlay"></div>
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

export default Card;

import './Badge.css';

/**
 * Enhanced Status Badge Component with Gradients
 * @param {string} status - Status type (success, warning, danger, info)
 * @param {string} children - Badge text content
 */
const Badge = ({ status = 'info', children }) => {
  return (
    <span className={`badge badge--${status}`}>
      {children}
    </span>
  );
};

export default Badge;

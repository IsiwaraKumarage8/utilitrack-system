import './Button.css';

/**
 * Reusable Button Component
 * @param {string} variant - Button style variant (primary, secondary, success, danger)
 * @param {string} size - Button size (sm, md, lg)
 * @param {ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`button button--${variant} button--${size} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

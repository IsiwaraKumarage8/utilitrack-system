/**
 * Status Badge Component
 * @param {string} status - Status type (success, warning, danger, info)
 * @param {string} children - Badge text content
 */
const Badge = ({ status = 'info', children }) => {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${variants[status]}`}>
      {children}
    </span>
  );
};

export default Badge;

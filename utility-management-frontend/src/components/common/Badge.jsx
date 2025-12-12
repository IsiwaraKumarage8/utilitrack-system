/**
 * Enhanced Status Badge Component with Gradients
 * @param {string} status - Status type (success, warning, danger, info)
 * @param {string} children - Badge text content
 */
const Badge = ({ status = 'info', children }) => {
  const variants = {
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 shadow-green-200/50',
    warning: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200 shadow-orange-200/50',
    danger: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200 shadow-red-200/50',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 shadow-blue-200/50',
  };
  
  return (
    <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full border shadow-sm ${variants[status]}`}>
      {children}
    </span>
  );
};

export default Badge;

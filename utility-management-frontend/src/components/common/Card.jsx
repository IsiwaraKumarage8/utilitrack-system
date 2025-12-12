/**
 * Enhanced Reusable Card Component with Premium Styling
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 */
const Card = ({ children, className = '' }) => {
  return (
    <div className={`relative bg-gradient-to-br from-white via-white to-gray-50/50 rounded-2xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300 group overflow-hidden ${className}`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;

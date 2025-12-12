/**
 * Reusable Card Component
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 */
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 p-8 ${className}`}>
      {children}
    </div>
  );
};

export default Card;

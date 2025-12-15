import PropTypes from 'prop-types';
import './ReportCard.css';

/**
 * ReportCard Component
 * Reusable card container for report sections with title, actions, and content
 */
const ReportCard = ({ title, subtitle, icon: Icon, actions, children, loading, error, className = '' }) => {
  return (
    <div className={`report-card ${className}`}>
      {/* Card Header */}
      <div className="report-card__header">
        <div className="report-card__header-left">
          {Icon && <Icon className="report-card__icon" size={20} />}
          <div className="report-card__title-group">
            <h3 className="report-card__title">{title}</h3>
            {subtitle && <p className="report-card__subtitle">{subtitle}</p>}
          </div>
        </div>
        {actions && (
          <div className="report-card__actions">
            {actions}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="report-card__content">
        {loading ? (
          <div className="report-card__loading">
            <div className="report-card__spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : error ? (
          <div className="report-card__error">
            <p className="report-card__error-title">Error loading data</p>
            <p className="report-card__error-message">{error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

ReportCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

export default ReportCard;

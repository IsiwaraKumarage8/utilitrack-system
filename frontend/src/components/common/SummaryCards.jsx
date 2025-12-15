import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './SummaryCards.css';

/**
 * SummaryCards Component
 * Display grid of summary metric cards with icons, values, and trends
 */
const SummaryCards = ({ cards, loading, className = '' }) => {
  if (loading) {
    return (
      <div className={`summary-cards ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="summary-card summary-card--loading">
            <div className="summary-card__skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (!trend || trend === 0) return <Minus size={16} />;
    return trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  const getTrendClass = (trend) => {
    if (!trend || trend === 0) return 'summary-card__trend--neutral';
    return trend > 0 ? 'summary-card__trend--positive' : 'summary-card__trend--negative';
  };

  return (
    <div className={`summary-cards ${className}`}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="summary-card">
            <div className="summary-card__header">
              <div className={`summary-card__icon-wrapper summary-card__icon-wrapper--${card.color || 'blue'}`}>
                {Icon && <Icon className="summary-card__icon" size={20} />}
              </div>
              {card.trend !== undefined && card.trend !== null && (
                <div className={`summary-card__trend ${getTrendClass(card.trend)}`}>
                  {getTrendIcon(card.trend)}
                  <span>{Math.abs(card.trend)}%</span>
                </div>
              )}
            </div>

            <div className="summary-card__content">
              <h3 className="summary-card__title">{card.title}</h3>
              <p className="summary-card__value">{card.value}</p>
              {card.subtitle && (
                <p className="summary-card__subtitle">{card.subtitle}</p>
              )}
            </div>

            {card.footer && (
              <div className="summary-card__footer">
                {card.footer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

SummaryCards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      subtitle: PropTypes.string,
      icon: PropTypes.elementType,
      color: PropTypes.oneOf(['blue', 'green', 'red', 'yellow', 'purple', 'indigo']),
      trend: PropTypes.number,
      footer: PropTypes.node
    })
  ).isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default SummaryCards;

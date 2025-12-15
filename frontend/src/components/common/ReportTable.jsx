import PropTypes from 'prop-types';
import './ReportTable.css';

/**
 * ReportTable Component
 * Reusable table for displaying tabular report data with sorting and pagination support
 */
const ReportTable = ({ 
  columns, 
  data, 
  loading, 
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true,
  className = ''
}) => {
  if (loading) {
    return (
      <div className="report-table__loading">
        <div className="report-table__spinner"></div>
        <p>Loading table data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="report-table__empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`report-table ${className}`}>
      <div className="report-table__wrapper">
        <table className={`
          report-table__table 
          ${striped ? 'report-table__table--striped' : ''} 
          ${hoverable ? 'report-table__table--hoverable' : ''}
        `}>
          <thead className="report-table__thead">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`report-table__th ${column.align ? `report-table__th--${column.align}` : ''}`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="report-table__tbody">
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="report-table__tr">
                {columns.map((column, colIndex) => (
                  <td
                    key={`${rowIndex}-${column.key || colIndex}`}
                    className={`report-table__td ${column.align ? `report-table__td--${column.align}` : ''}`}
                  >
                    {column.render 
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ReportTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      align: PropTypes.oneOf(['left', 'center', 'right']),
      width: PropTypes.string,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array,
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  striped: PropTypes.bool,
  hoverable: PropTypes.bool,
  className: PropTypes.string
};

export default ReportTable;

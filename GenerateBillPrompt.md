I need to implement the complete "Generate Bill" functionality for my Utility Management System. This includes frontend UI, backend API, database interactions, and automatic bill calculation using the stored procedure we already created.

CONTEXT:
We have a stored procedure `sp_GenerateBill` that takes a meter reading and automatically:
- Finds the appropriate tariff based on utility type and customer type
- Calculates consumption charges and total amount
- Creates a bill record with all calculated values
- Updates bill status based on business rules

WORKFLOW:
1. User clicks "+ Generate Bill" button on Billing page
2. Modal opens showing unprocessed meter readings
3. User selects a meter reading
4. System fetches preview data and shows calculation breakdown
5. User confirms and clicks "Generate Bill"
6. Backend calls stored procedure to create bill
7. Bill is created with all calculated amounts
8. Success message shown and bills table refreshes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART 1: BACKEND API UPDATES

FILE: models/billingModel.js (ADD THESE FUNCTIONS)

Add to existing billingModel object:
```javascript
const { query, executeProcedure } = require('../config/database');

// ... existing functions ...

// Get unprocessed meter readings (readings without bills yet)
findUnprocessedReadings: async () => {
  const queryString = `
    SELECT 
      mr.reading_id,
      mr.meter_id,
      mr.reading_date,
      mr.current_reading,
      mr.previous_reading,
      mr.consumption,
      mr.reading_type,
      m.meter_number,
      m.meter_type,
      c.customer_id,
      c.first_name,
      c.last_name,
      c.first_name + ' ' + c.last_name AS customer_name,
      c.customer_type,
      c.email,
      c.phone,
      ut.utility_type_id,
      ut.utility_name AS utility_type,
      ut.unit_of_measurement,
      sc.connection_id,
      sc.connection_number,
      sc.property_address
    FROM Meter_Reading mr
    INNER JOIN Meter m ON mr.meter_id = m.meter_id
    INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
    INNER JOIN Customer c ON sc.customer_id = c.customer_id
    INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
    LEFT JOIN Billing b ON mr.reading_id = b.reading_id
    WHERE b.bill_id IS NULL  -- No bill exists for this reading yet
      AND mr.reading_type = 'Actual'  -- Only actual readings can generate bills
      AND sc.connection_status = 'Active'  -- Only active connections
    ORDER BY mr.reading_date DESC
  `;
  
  try {
    const result = await query(queryString);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error fetching unprocessed readings: ${error.message}`);
  }
},

// Get bill preview data (what the bill will look like before generation)
getBillPreview: async (readingId) => {
  const queryString = `
    SELECT 
      -- Meter Reading Info
      mr.reading_id,
      mr.reading_date,
      mr.consumption,
      mr.current_reading,
      mr.previous_reading,
      
      -- Customer Info
      c.customer_id,
      c.first_name + ' ' + c.last_name AS customer_name,
      c.customer_type,
      c.email,
      c.phone,
      c.address,
      c.city,
      
      -- Connection Info
      sc.connection_id,
      sc.connection_number,
      sc.property_address,
      
      -- Meter Info
      m.meter_number,
      m.meter_type,
      
      -- Utility Info
      ut.utility_type_id,
      ut.utility_name AS utility_type,
      ut.unit_of_measurement,
      
      -- Tariff Info (find matching tariff)
      tp.tariff_id,
      tp.tariff_name,
      tp.rate_per_unit,
      tp.fixed_charge,
      
      -- Calculate amounts
      mr.consumption * tp.rate_per_unit AS consumption_charge,
      (mr.consumption * tp.rate_per_unit) + tp.fixed_charge AS total_amount,
      
      -- Billing period dates
      (SELECT TOP 1 reading_date FROM Meter_Reading WHERE meter_id = mr.meter_id AND reading_id < mr.reading_id ORDER BY reading_date DESC) AS period_start,
      mr.reading_date AS period_end
      
    FROM Meter_Reading mr
    INNER JOIN Meter m ON mr.meter_id = m.meter_id
    INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
    INNER JOIN Customer c ON sc.customer_id = c.customer_id
    INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
    INNER JOIN Tariff_Plan tp ON 
      tp.utility_type_id = ut.utility_type_id 
      AND tp.customer_type = c.customer_type
      AND tp.tariff_status = 'Active'
      AND tp.effective_from <= GETDATE()
      AND (tp.effective_to IS NULL OR tp.effective_to >= GETDATE())
    WHERE mr.reading_id = @readingId
  `;
  
  try {
    const result = await query(queryString, { readingId });
    return result.recordset[0];
  } catch (error) {
    throw new Error(`Error fetching bill preview: ${error.message}`);
  }
},

// Generate bill using stored procedure
generateBill: async (readingId, dueDate = null) => {
  try {
    // If no due date provided, default to 30 days from today
    const finalDueDate = dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Call the stored procedure
    const result = await executeProcedure('sp_GenerateBill', {
      reading_id: readingId,
      due_date: finalDueDate
    });
    
    // The stored procedure should return the generated bill number
    const billNumber = result.recordset[0]?.bill_number;
    
    if (!billNumber) {
      throw new Error('Failed to generate bill - no bill number returned');
    }
    
    // Fetch and return the complete bill details
    const bill = await billingModel.findByBillNumber(billNumber);
    return bill;
    
  } catch (error) {
    throw new Error(`Error generating bill: ${error.message}`);
  }
},

// Find bill by bill number
findByBillNumber: async (billNumber) => {
  const queryString = `
    SELECT 
      b.*,
      c.customer_id,
      c.first_name + ' ' + c.last_name AS customer_name,
      c.customer_type,
      c.email,
      c.phone,
      ut.utility_name AS utility_type,
      sc.connection_number,
      m.meter_number
    FROM Billing b
    INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
    INNER JOIN Customer c ON sc.customer_id = c.customer_id
    INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
    INNER JOIN Meter m ON sc.connection_id = m.connection_id
    WHERE b.bill_number = @billNumber
  `;
  
  try {
    const result = await query(queryString, { billNumber });
    return result.recordset[0];
  } catch (error) {
    throw new Error(`Error fetching bill by number: ${error.message}`);
  }
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: controllers/billingController.js (ADD THESE FUNCTIONS)

Add to existing billingController object:
```javascript
// ... existing functions ...

// GET /api/billing/unprocessed-readings - Get meter readings without bills
getUnprocessedReadings: async (req, res, next) => {
  try {
    const { utility_type } = req.query;
    
    let readings = await billingModel.findUnprocessedReadings();
    
    // Filter by utility type if provided
    if (utility_type && utility_type !== 'All') {
      readings = readings.filter(r => r.utility_type === utility_type);
    }

    res.status(200).json({
      success: true,
      count: readings.length,
      data: readings
    });
  } catch (error) {
    next(error);
  }
},

// GET /api/billing/preview/:readingId - Get bill preview before generation
getBillPreview: async (req, res, next) => {
  try {
    const { readingId } = req.params;

    const preview = await billingModel.getBillPreview(readingId);

    if (!preview) {
      return next(new AppError('Reading not found or bill already exists', 404));
    }

    res.status(200).json({
      success: true,
      data: preview
    });
  } catch (error) {
    next(error);
  }
},

// POST /api/billing/generate - Generate bill from meter reading
generateBill: async (req, res, next) => {
  try {
    const { reading_id, due_date } = req.body;

    // Validate input
    if (!reading_id) {
      return next(new AppError('Meter reading ID is required', 400));
    }

    // Check if bill already exists for this reading
    const existingBill = await query(
      'SELECT bill_id FROM Billing WHERE reading_id = @reading_id',
      { reading_id }
    );

    if (existingBill.recordset.length > 0) {
      return next(new AppError('Bill already exists for this meter reading', 400));
    }

    // Generate the bill using stored procedure
    const bill = await billingModel.generateBill(reading_id, due_date);

    res.status(201).json({
      success: true,
      message: 'Bill generated successfully',
      data: bill
    });
  } catch (error) {
    next(error);
  }
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: routes/billingRoutes.js (ADD THESE ROUTES)

Add to existing routes:
```javascript
// ... existing routes ...

// GET /api/billing/unprocessed-readings - Get readings without bills
router.get('/unprocessed-readings', billingController.getUnprocessedReadings);

// GET /api/billing/preview/:readingId - Get bill preview
router.get('/preview/:readingId', billingController.getBillPreview);

// POST /api/billing/generate - Generate new bill
router.post('/generate', billingController.generateBill);
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART 2: FRONTEND API SERVICE

FILE: frontend/src/api/billingApi.js (CREATE OR UPDATE)
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const billingApi = {
  // Get all bills
  getAll: async () => {
    const response = await api.get('/billing');
    return response.data;
  },

  // Get bill by ID
  getById: async (id) => {
    const response = await api.get(`/billing/${id}`);
    return response.data;
  },

  // Search bills
  search: async (searchTerm) => {
    const response = await api.get(`/billing?search=${searchTerm}`);
    return response.data;
  },

  // Filter by status
  filterByStatus: async (status) => {
    const response = await api.get(`/billing?status=${status}`);
    return response.data;
  },

  // Get billing statistics
  getStats: async () => {
    const response = await api.get('/billing/stats/summary');
    return response.data;
  },

  // ========== GENERATE BILL FUNCTIONS ==========

  // Get unprocessed readings
  getUnprocessedReadings: async (utilityType = 'All') => {
    const url = utilityType === 'All' 
      ? '/billing/unprocessed-readings'
      : `/billing/unprocessed-readings?utility_type=${utilityType}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get bill preview
  getBillPreview: async (readingId) => {
    const response = await api.get(`/billing/preview/${readingId}`);
    return response.data;
  },

  // Generate bill
  generateBill: async (readingId, dueDate) => {
    const response = await api.post('/billing/generate', {
      reading_id: readingId,
      due_date: dueDate
    });
    return response.data;
  }
};

export default billingApi;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART 3: FRONTEND GENERATE BILL MODAL

FILE: frontend/src/pages/Billing/GenerateBillModal.jsx (CREATE THIS)
```javascript
import React, { useState, useEffect } from 'react';
import billingApi from '../../api/billingApi';
import toast from 'react-hot-toast';
import { X, FileText, User, Zap, Calendar, DollarSign, Calculator } from 'lucide-react';
import './GenerateBillModal.css';

const GenerateBillModal = ({ isOpen, onClose, onSuccess }) => {
  // State management
  const [step, setStep] = useState(1); // 1: Select Reading, 2: Preview & Confirm
  const [unprocessedReadings, setUnprocessedReadings] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);
  const [billPreview, setBillPreview] = useState(null);
  const [utilityFilter, setUtilityFilter] = useState('All');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Set default due date (30 days from today)
  useEffect(() => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  }, []);

  // Fetch unprocessed readings when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUnprocessedReadings();
      setStep(1);
      setSelectedReading(null);
      setBillPreview(null);
    }
  }, [isOpen, utilityFilter]);

  // Fetch unprocessed readings
  const fetchUnprocessedReadings = async () => {
    try {
      setLoading(true);
      const response = await billingApi.getUnprocessedReadings(utilityFilter);
      setUnprocessedReadings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching readings:', error);
      toast.error('Failed to load meter readings');
      setLoading(false);
    }
  };

  // Handle reading selection
  const handleReadingSelect = async (reading) => {
    try {
      setSelectedReading(reading);
      setLoading(true);

      // Fetch bill preview
      const response = await billingApi.getBillPreview(reading.reading_id);
      setBillPreview(response.data);
      setStep(2);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching preview:', error);
      toast.error('Failed to load bill preview');
      setLoading(false);
    }
  };

  // Handle bill generation
  const handleGenerateBill = async () => {
    try {
      setGenerating(true);

      const response = await billingApi.generateBill(
        selectedReading.reading_id,
        dueDate
      );

      toast.success('✓ Bill generated successfully!');
      
      // Close modal and refresh parent
      onClose();
      onSuccess();
      
      // Ask if user wants to view bill details
      setTimeout(() => {
        if (window.confirm('Bill generated! Would you like to view the bill details?')) {
          // You can implement navigation to bill details here
          console.log('Navigate to bill:', response.data);
        }
      }, 500);

    } catch (error) {
      console.error('Error generating bill:', error);
      toast.error(error.response?.data?.message || 'Failed to generate bill');
    } finally {
      setGenerating(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Get utility icon
  const getUtilityIcon = (utilityType) => {
    switch(utilityType) {
      case 'Electricity': return '⚡';
      case 'Water': return '💧';
      case 'Gas': return '🔥';
      default: return '📊';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container generate-bill-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <FileText className="modal-icon" size={24} />
            <div>
              <h2>Generate Bill</h2>
              <p className="modal-subtitle">
                {step === 1 ? 'Select a meter reading to generate bill' : 'Review and confirm bill details'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Select Reading</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Confirm & Generate</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          
          {/* STEP 1: SELECT READING */}
          {step === 1 && (
            <div className="step-content">
              
              {/* Utility Filter */}
              <div className="filter-section">
                <label>Filter by Utility Type:</label>
                <div className="utility-filter-tabs">
                  {['All', 'Electricity', 'Water', 'Gas'].map(type => (
                    <button
                      key={type}
                      className={`filter-tab ${utilityFilter === type ? 'active' : ''}`}
                      onClick={() => setUtilityFilter(type)}
                    >
                      {type !== 'All' && getUtilityIcon(type)} {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading meter readings...</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && unprocessedReadings.length === 0 && (
                <div className="empty-state">
                  <FileText size={48} color="#9CA3AF" />
                  <p>No unprocessed meter readings found</p>
                  <small>All recent readings have been billed</small>
                </div>
              )}

              {/* Readings List */}
              {!loading && unprocessedReadings.length > 0 && (
                <div className="readings-list">
                  {unprocessedReadings.map((reading) => (
                    <div
                      key={reading.reading_id}
                      className="reading-card"
                      onClick={() => handleReadingSelect(reading)}
                    >
                      <div className="reading-card-header">
                        <div className="utility-badge">
                          <span className="utility-icon">{getUtilityIcon(reading.utility_type)}</span>
                          <span>{reading.utility_type}</span>
                        </div>
                        <span className="reading-date">{formatDate(reading.reading_date)}</span>
                      </div>
                      
                      <div className="reading-card-body">
                        <div className="customer-info">
                          <User size={16} />
                          <span className="customer-name">{reading.customer_name}</span>
                          <span className="customer-type-badge">{reading.customer_type}</span>
                        </div>
                        
                        <div className="meter-info">
                          <span className="meter-number">{reading.meter_number}</span>
                          <span className="connection-number">{reading.connection_number}</span>
                        </div>
                        
                        <div className="consumption-display">
                          <Calculator size={16} />
                          <span className="consumption-value">
                            {reading.consumption} {reading.unit_of_measurement}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PREVIEW & CONFIRM */}
          {step === 2 && billPreview && (
            <div className="step-content preview-step">
              
              {/* Customer & Connection Details */}
              <div className="preview-section">
                <h3>Customer & Connection Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Customer</label>
                    <div className="detail-value">
                      <User size={16} />
                      <span>{billPreview.customer_name}</span>
                      <span className="badge badge-small">{billPreview.customer_type}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <label>Utility Type</label>
                    <div className="detail-value">
                      <span className="utility-icon-large">{getUtilityIcon(billPreview.utility_type)}</span>
                      <span>{billPreview.utility_type}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <label>Connection Number</label>
                    <div className="detail-value">{billPreview.connection_number}</div>
                  </div>
                  
                  <div className="detail-item">
                    <label>Meter Number</label>
                    <div className="detail-value">{billPreview.meter_number}</div>
                  </div>
                </div>
              </div>

              {/* Billing Period */}
              <div className="preview-section">
                <h3>Billing Period</h3>
                <div className="billing-period">
                  <Calendar size={20} />
                  <span>
                    {formatDate(billPreview.period_start)} - {formatDate(billPreview.period_end)}
                  </span>
                  <span className="period-days">
                    ({Math.ceil((new Date(billPreview.period_end) - new Date(billPreview.period_start)) / (1000 * 60 * 60 * 24))} days)
                  </span>
                </div>
              </div>

              {/* Consumption Details */}
              <div className="preview-section">
                <h3>Consumption</h3>
                <div className="consumption-breakdown">
                  <div className="consumption-row">
                    <span>Previous Reading:</span>
                    <span>{billPreview.previous_reading} {billPreview.unit_of_measurement}</span>
                  </div>
                  <div className="consumption-row">
                    <span>Current Reading:</span>
                    <span>{billPreview.current_reading} {billPreview.unit_of_measurement}</span>
                  </div>
                  <div className="consumption-row total">
                    <span>Total Consumption:</span>
                    <span className="consumption-total">
                      {billPreview.consumption} {billPreview.unit_of_measurement}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tariff Applied */}
              <div className="preview-section">
                <h3>Tariff Applied</h3>
                <div className="tariff-info">
                  <div className="tariff-name">{billPreview.tariff_name}</div>
                  <div className="tariff-details">
                    <div className="tariff-rate">
                      <span>Rate per Unit:</span>
                      <span>{formatCurrency(billPreview.rate_per_unit)}</span>
                    </div>
                    <div className="tariff-rate">
                      <span>Fixed Charge:</span>
                      <span>{formatCurrency(billPreview.fixed_charge)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="preview-section calculation-section">
                <h3>Calculation Breakdown</h3>
                <div className="calculation-table">
                  <div className="calc-row">
                    <span className="calc-label">Consumption Charge:</span>
                    <span className="calc-formula">
                      {billPreview.consumption} × {formatCurrency(billPreview.rate_per_unit)}
                    </span>
                    <span className="calc-amount">{formatCurrency(billPreview.consumption_charge)}</span>
                  </div>
                  
                  <div className="calc-row">
                    <span className="calc-label">Fixed Charge:</span>
                    <span className="calc-formula"></span>
                    <span className="calc-amount">{formatCurrency(billPreview.fixed_charge)}</span>
                  </div>
                  
                  <div className="calc-divider"></div>
                  
                  <div className="calc-row total-row">
                    <span className="calc-label">TOTAL AMOUNT:</span>
                    <span className="calc-formula"></span>
                    <span className="calc-total">{formatCurrency(billPreview.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Due Date Selection */}
              <div className="preview-section">
                <h3>Due Date</h3>
                <div className="due-date-input">
                  <Calendar size={20} />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <small>Default: 30 days from today</small>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {step === 1 && (
            <>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </>
          )}
          
          {step === 2 && (
            <>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setStep(1);
                  setSelectedReading(null);
                  setBillPreview(null);
                }}
                disabled={generating}
              >
                ← Back
              </button>
              
              <button 
                className="btn btn-primary" 
                onClick={handleGenerateBill}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <div className="btn-spinner"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    Generate Bill
                  </>
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default GenerateBillModal;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: frontend/src/pages/Billing/GenerateBillModal.css (CREATE THIS)
```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* Modal Container */
.generate-bill-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}Continue5:25 PM@keyframes modalSlideIn {
from {
opacity: 0;
transform: translateY(-20px) scale(0.95);
}
to {
opacity: 1;
transform: translateY(0) scale(1);
}
}
/* Modal Header */
.modal-header {
padding: 24px;
border-bottom: 1px solid #E5E7EB;
display: flex;
justify-content: space-between;
align-items: flex-start;
background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
color: white;
border-radius: 16px 16px 0 0;
}
.modal-header-content {
display: flex;
gap: 16px;
align-items: flex-start;
}
.modal-icon {
flex-shrink: 0;
margin-top: 2px;
}
.modal-header h2 {
margin: 0;
font-size: 24px;
font-weight: 600;
}
.modal-subtitle {
margin: 4px 0 0 0;
font-size: 14px;
opacity: 0.9;
}
.modal-close-btn {
background: rgba(255, 255, 255, 0.2);
border: none;
border-radius: 8px;
padding: 8px;
cursor: pointer;
color: white;
transition: all 0.2s;
}
.modal-close-btn:hover {
background: rgba(255, 255, 255, 0.3);
}
/* Progress Steps */
.progress-steps {
display: flex;
align-items: center;
justify-content: center;
padding: 24px;
background: #F9FAFB;
}
.progress-step {
display: flex;
flex-direction: column;
align-items: center;
gap: 8px;
}
.step-number {
width: 40px;
height: 40px;
border-radius: 50%;
background: #E5E7EB;
color: #6B7280;
display: flex;
align-items: center;
justify-content: center;
font-weight: 600;
font-size: 16px;
transition: all 0.3s;
}
.progress-step.active .step-number {
background: #3B82F6;
color: white;
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.progress-step span {
font-size: 13px;
color: #6B7280;
font-weight: 500;
}
.progress-step.active span {
color: #3B82F6;
}
.progress-line {
width: 80px;
height: 2px;
background: #E5E7EB;
margin: 0 16px;
}
/* Modal Body */
.modal-body {
flex: 1;
overflow-y: auto;
padding: 24px;
}
/* Step Content */
.step-content {
animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
from {
opacity: 0;
}
to {
opacity: 1;
}
}
/* Filter Section */
.filter-section {
margin-bottom: 24px;
}
.filter-section label {
display: block;
font-size: 14px;
font-weight: 600;
color: #374151;
margin-bottom: 12px;
}
.utility-filter-tabs {
display: flex;
gap: 8px;
}
.filter-tab {
padding: 10px 20px;
border: 2px solid #E5E7EB;
background: white;
border-radius: 8px;
font-size: 14px;
font-weight: 500;
cursor: pointer;
transition: all 0.2s;
color: #6B7280;
}
.filter-tab:hover {
border-color: #3B82F6;
background: #EFF6FF;
}
.filter-tab.active {
border-color: #3B82F6;
background: #3B82F6;
color: white;
}
/* Readings List */
.readings-list {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
gap: 16px;
max-height: 400px;
overflow-y: auto;
}
/* Reading Card */
.reading-card {
border: 2px solid #E5E7EB;
border-radius: 12px;
padding: 16px;
cursor: pointer;
transition: all 0.2s;
background: white;
}
.reading-card:hover {
border-color: #3B82F6;
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
transform: translateY(-2px);
}
.reading-card-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 12px;
}
.utility-badge {
display: flex;
align-items: center;
gap: 6px;
background: #EFF6FF;
padding: 4px 12px;
border-radius: 12px;
font-size: 13px;
font-weight: 500;
color: #3B82F6;
}
.utility-icon {
font-size: 16px;
}
.reading-date {
font-size: 12px;
color: #6B7280;
}
.reading-card-body {
display: flex;
flex-direction: column;
gap: 10px;
}
.customer-info {
display: flex;
align-items: center;
gap: 8px;
font-size: 14px;
}
.customer-name {
font-weight: 600;
color: #111827;
}
.customer-type-badge {
background: #F3F4F6;
padding: 2px 8px;
border-radius: 6px;
font-size: 11px;
color: #6B7280;
}
.meter-info {
display: flex;
gap: 8px;
font-size: 12px;
color: #6B7280;
}
.meter-number {
font-family: monospace;
background: #F9FAFB;
padding: 2px 6px;
border-radius: 4px;
}
.consumption-display {
display: flex;
align-items: center;
gap: 8px;
padding: 8px;
background: #F0FDF4;
border-radius: 8px;
color: #10B981;
font-weight: 600;
}
/* Preview Step */
.preview-step {
display: flex;
flex-direction: column;
gap: 20px;
}
.preview-section {
background: #F9FAFB;
border-radius: 12px;
padding: 20px;
}
.preview-section h3 {
margin: 0 0 16px 0;
font-size: 16px;
font-weight: 600;
color: #111827;
}
/* Detail Grid */
.detail-grid {
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 16px;
}
.detail-item {
display: flex;
flex-direction: column;
gap: 6px;
}
.detail-item label {
font-size: 12px;
color: #6B7280;
font-weight: 500;
}
.detail-value {
display: flex;
align-items: center;
gap: 8px;
font-size: 14px;
font-weight: 600;
color: #111827;
}
.utility-icon-large {
font-size: 20px;
}
/* Billing Period */
.billing-period {
display: flex;
align-items: center;
gap: 12px;
background: white;
padding: 12px;
border-radius: 8px;
font-size: 14px;
font-weight: 600;
}
.period-days {
color: #6B7280;
font-weight: 400;
font-size: 13px;
}
/* Consumption Breakdown */
.consumption-breakdown {
background: white;
border-radius: 8px;
padding: 16px;
}
.consumption-row {
display: flex;
justify-content: space-between;
padding: 10px 0;
border-bottom: 1px solid #F3F4F6;
font-size: 14px;
}
.consumption-row:last-child {
border-bottom: none;
}
.consumption-row.total {
padding-top: 12px;
margin-top: 8px;
border-top: 2px solid #E5E7EB;
font-weight: 600;
}
.consumption-total {
color: #10B981;
font-size: 16px;
}
/* Tariff Info */
.tariff-info {
background: white;
border-radius: 8px;
padding: 16px;
}
.tariff-name {
font-weight: 600;
font-size: 15px;
margin-bottom: 12px;
color: #111827;
}
.tariff-details {
display: flex;
flex-direction: column;
gap: 8px;
}
.tariff-rate {
display: flex;
justify-content: space-between;
font-size: 14px;
}
/* Calculation Table */
.calculation-section {
background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
border: 2px solid #3B82F6;
}
.calculation-table {
background: white;
border-radius: 8px;
padding: 20px;
}
.calc-row {
display: grid;
grid-template-columns: 2fr 2fr 1fr;
gap: 16px;
padding: 12px 0;
align-items: center;
}
.calc-label {
font-size: 14px;
color: #374151;
}
.calc-formula {
font-size: 13px;
color: #6B7280;
font-family: monospace;
}
.calc-amount {
text-align: right;
font-size: 15px;
font-weight: 600;
color: #111827;
}
.calc-divider {
height: 2px;
background: #E5E7EB;
margin: 12px 0;
}
.total-row {
background: #F9FAFB;
padding: 16px;
border-radius: 8px;
margin-top: 8px;
}
.total-row .calc-label {
font-weight: 700;
font-size: 16px;
color: #111827;
}
.calc-total {
text-align: right;
font-size: 24px;
font-weight: 700;
color: #3B82F6;
}
/* Due Date Input */
.due-date-input {
display: flex;
align-items: center;
gap: 12px;
background: white;
padding: 12px;
border-radius: 8px;
}
.due-date-input input[type="date"] {
flex: 1;
padding: 10px 12px;
border: 2px solid #E5E7EB;
border-radius: 8px;
font-size: 14px;
font-weight: 500;
}
.due-date-input input[type="date"]:focus {
outline: none;
border-color: #3B82F6;
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.due-date-input small {
color: #6B7280;
font-size: 12px;
}
/* Loading State */
.loading-container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 60px 20px;
gap: 16px;
}
.spinner {
width: 50px;
height: 50px;
border: 4px solid #F3F4F6;
border-top-color: #3B82F6;
border-radius: 50%;
animation: spin 0.8s linear infinite;
}
@keyframes spin {
to { transform: rotate(360deg); }
}
/* Empty State */
.empty-state {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 60px 20px;
gap: 12px;
color: #6B7280;
}
.empty-state p {
font-size: 16px;
font-weight: 500;
margin: 0;
}
.empty-state small {
font-size: 14px;
}
/* Modal Footer */
.modal-footer {
padding: 20px 24px;
border-top: 1px solid #E5E7EB;
display: flex;
justify-content: flex-end;
gap: 12px;
}
.btn {
padding: 12px 24px;
border-radius: 8px;
font-size: 14px;
font-weight: 600;
cursor: pointer;
border: none;
display: flex;
align-items: center;
gap: 8px;
transition: all 0.2s;
}
.btn-secondary {
background: white;
border: 2px solid #E5E7EB;
color: #374151;
}
.btn-secondary:hover {
background: #F9FAFB;
border-color: #D1D5DB;
}
.btn-primary {
background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
color: white;
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.btn-primary:hover {
transform: translateY(-2px);
box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}
.btn:disabled {
opacity: 0.5;
cursor: not-allowed;
transform: none !important;
}
.btn-spinner {
width: 16px;
height: 16px;
border: 2px solid rgba(255, 255, 255, 0.3);
border-top-color: white;
border-radius: 50%;
animation: spin 0.6s linear infinite;
}
/* Responsive */
@media (max-width: 768px) {
.generate-bill-modal {
max-width: 100%;
margin: 0;
border-radius: 0;
max-height: 100vh;
}
.detail-grid {
grid-template-columns: 1fr;
}
.readings-list {
grid-template-columns: 1fr;
}
.calc-row {
grid-template-columns: 1fr;
gap: 8px;
}
.calc-formula,
.calc-amount {
text-align: left;
}
.utility-filter-tabs {
flex-wrap: wrap;
}
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART 4: INTEGRATE WITH BILLING PAGE

FILE: frontend/src/pages/Billing/Billing.jsx (UPDATE)

Add modal state and handlers:
```javascript
import React, { useState, useEffect } from 'react';
import GenerateBillModal from './GenerateBillModal'; // Import modal
import billingApi from '../../api/billingApi';
import toast from 'react-hot-toast';
import './Billing.css';

const Billing = () => {
  // ... existing state ...
  
  // Add modal state
  const [showGenerateBillModal, setShowGenerateBillModal] = useState(false);

  // ... existing functions ...

  // Handler for Generate Bill button
  const handleGenerateBillClick = () => {
    setShowGenerateBillModal(true);
  };

  // Handler for modal close
  const handleModalClose = () => {
    setShowGenerateBillModal(false);
  };

  // Handler for successful bill generation
  const handleBillGenerated = () => {
    // Refresh bills list
    fetchBills();
    toast.success('Bill generated and added to the list!');
  };

  return (
    <div className="billing-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Billing Management</h1>
          <p>Manage bills and generate invoices</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleGenerateBillClick}
        >
          + Generate Bill
        </button>
      </div>

      {/* ... rest of your existing JSX ... */}

      {/* Generate Bill Modal */}
      <GenerateBillModal
        isOpen={showGenerateBillModal}
        onClose={handleModalClose}
        onSuccess={handleBillGenerated}
      />
    </div>
  );
};

export default Billing;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TESTING INSTRUCTIONS:

1. Start backend:
```bash
cd backend
npm run dev
```

2. Test API endpoints:
```bash
# Get unprocessed readings
curl http://localhost:5000/api/billing/unprocessed-readings

# Get bill preview
curl http://localhost:5000/api/billing/preview/1

# Generate bill
curl -X POST http://localhost:5000/api/billing/generate \
  -H "Content-Type: application/json" \
  -d '{"reading_id": 1, "due_date": "2025-01-15"}'
```

3. Start frontend:
```bash
cd frontend
npm run dev
```

4. Test functionality:
- Navigate to Billing page
- Click "+ Generate Bill"
- Modal should open showing unprocessed readings
- Select a reading
- Review the calculation preview
- Click "Generate Bill"
- Bill should be created and appear in bills table

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY OF WHAT THIS DOES:

✅ Backend fetches unprocessed meter readings (readings without bills)
✅ User selects a reading from the modal
✅ System fetches tariff based on utility type + customer type
✅ System calculates:
   - Consumption charge = consumption × rate_per_unit
   - Total = consumption_charge + fixed_charge
✅ Shows complete preview with breakdown
✅ User confirms and clicks "Generate Bill"
✅ Backend calls stored procedure `sp_GenerateBill`
✅ Stored procedure:
   - Validates data
   - Finds correct tariff
   - Calculates all amounts
   - Creates bill record
   - Updates related tables
✅ Bill appears in bills table
✅ Success notification shown

This is a complete, production-ready implementation of automated bill generation!
I need to create complete REST APIs for Billing, Payments, and Complaints modules of my Utility Management System. Follow the EXACT same structure and patterns as my existing Customers API (models, controllers, routes).

EXISTING API STRUCTURE TO FOLLOW:
backend/
├── config/
│   └── database.js (has getPool, query, executeProcedure functions)
├── models/
│   ├── customerModel.js (EXISTING - use as reference)
│   ├── billingModel.js (CREATE THIS)
│   ├── paymentModel.js (CREATE THIS)
│   └── complaintModel.js (CREATE THIS)
├── controllers/
│   ├── customerController.js (EXISTING - use as reference)
│   ├── billingController.js (CREATE THIS)
│   ├── paymentController.js (CREATE THIS)
│   └── complaintController.js (CREATE THIS)
├── routes/
│   ├── customerRoutes.js (EXISTING - use as reference)
│   ├── billingRoutes.js (CREATE THIS)
│   ├── paymentRoutes.js (CREATE THIS)
│   └── complaintRoutes.js (CREATE THIS)
└── server.js (UPDATE - add new routes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE STRUCTURES:

BILLING TABLE:
- bill_id (PK)
- connection_id (FK)
- reading_id (FK)
- tariff_id (FK)
- bill_number (unique)
- bill_date
- due_date
- billing_period_start
- billing_period_end
- consumption
- rate_per_unit
- fixed_charge
- consumption_charge
- total_amount
- amount_paid
- outstanding_balance
- bill_status (Unpaid, Partially Paid, Paid, Overdue, Cancelled)
- notes
- created_at
- updated_at

PAYMENT TABLE:
- payment_id (PK)
- bill_id (FK)
- customer_id (FK)
- payment_number (unique)
- payment_date
- payment_amount
- payment_method (Cash, Card, Bank Transfer, Online, Cheque)
- transaction_reference
- received_by (FK to User)
- payment_status (Completed, Pending, Failed, Refunded)
- notes
- created_at

COMPLAINT TABLE:
- complaint_id (PK)
- customer_id (FK)
- connection_id (FK, nullable)
- complaint_number (unique)
- complaint_date
- complaint_type (Billing Issue, Meter Fault, Service Disruption, Quality Issue, Connection Request, Other)
- priority (Low, Medium, High, Urgent)
- description
- assigned_to (FK to User, nullable)
- complaint_status (Open, In Progress, Resolved, Closed, Rejected)
- resolution_date (nullable)
- resolution_notes (nullable)
- created_at
- updated_at

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API 1: BILLING API

FILE: models/billingModel.js
```javascript
const { query } = require('../config/database');

const billingModel = {
  // Get all bills with customer and utility details
  findAll: async () => {
    const queryString = `
      SELECT 
        b.bill_id,
        b.bill_number,
        b.bill_date,
        b.due_date,
        b.billing_period_start,
        b.billing_period_end,
        b.consumption,
        b.rate_per_unit,
        b.fixed_charge,
        b.consumption_charge,
        b.total_amount,
        b.amount_paid,
        b.outstanding_balance,
        b.bill_status,
        b.notes,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        ut.utility_name AS utility_type,
        sc.connection_number
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      ORDER BY b.bill_date DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching bills: ${error.message}`);
    }
  },

  // Get bill by ID with full details
  findById: async (billId) => {
    const queryString = `
      SELECT 
        b.*,
        c.customer_id,
        c.first_name,
        c.last_name,
        c.customer_type,
        c.email,
        c.phone,
        c.address,
        c.city,
        ut.utility_name AS utility_type,
        ut.unit_of_measurement,
        sc.connection_number,
        sc.property_address,
        m.meter_number,
        tp.tariff_name
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      INNER JOIN Meter m ON sc.connection_id = m.connection_id
      INNER JOIN Tariff_Plan tp ON b.tariff_id = tp.tariff_id
      WHERE b.bill_id = @billId
    `;
    
    try {
      const result = await query(queryString, { billId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching bill: ${error.message}`);
    }
  },

  // Filter bills by status
  filterByStatus: async (billStatus) => {
    const queryString = `
      SELECT 
        b.bill_id,
        b.bill_number,
        b.bill_date,
        b.due_date,
        b.billing_period_start,
        b.billing_period_end,
        b.consumption,
        b.total_amount,
        b.amount_paid,
        b.outstanding_balance,
        b.bill_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        ut.utility_name AS utility_type,
        sc.connection_number
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE b.bill_status = @billStatus
      ORDER BY b.bill_date DESC
    `;
    
    try {
      const result = await query(queryString, { billStatus });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering bills: ${error.message}`);
    }
  },

  // Search bills by bill number or customer name
  search: async (searchTerm) => {
    const queryString = `
      SELECT 
        b.bill_id,
        b.bill_number,
        b.bill_date,
        b.due_date,
        b.total_amount,
        b.outstanding_balance,
        b.bill_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        ut.utility_name AS utility_type
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Customer c ON sc.customer_id = c.customer_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE 
        b.bill_number LIKE '%' + @searchTerm + '%'
        OR c.first_name LIKE '%' + @searchTerm + '%'
        OR c.last_name LIKE '%' + @searchTerm + '%'
      ORDER BY b.bill_date DESC
    `;
    
    try {
      const result = await query(queryString, { searchTerm });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error searching bills: ${error.message}`);
    }
  },

  // Get billing statistics
  getStats: async () => {
    const queryString = `
      SELECT 
        COUNT(*) AS total_bills,
        SUM(total_amount) AS total_billed,
        SUM(amount_paid) AS total_collected,
        SUM(outstanding_balance) AS total_outstanding,
        COUNT(CASE WHEN bill_status = 'Unpaid' THEN 1 END) AS unpaid_count,
        COUNT(CASE WHEN bill_status = 'Paid' THEN 1 END) AS paid_count,
        COUNT(CASE WHEN bill_status = 'Partially Paid' THEN 1 END) AS partial_count,
        COUNT(CASE WHEN bill_status = 'Overdue' THEN 1 END) AS overdue_count
      FROM Billing
      WHERE MONTH(bill_date) = MONTH(GETDATE())
        AND YEAR(bill_date) = YEAR(GETDATE())
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error getting billing stats: ${error.message}`);
    }
  },

  // Get bills by customer ID
  findByCustomer: async (customerId) => {
    const queryString = `
      SELECT 
        b.*,
        ut.utility_name AS utility_type,
        sc.connection_number
      FROM Billing b
      INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
      INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      WHERE sc.customer_id = @customerId
      ORDER BY b.bill_date DESC
    `;
    
    try {
      const result = await query(queryString, { customerId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customer bills: ${error.message}`);
    }
  }
};

module.exports = billingModel;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: controllers/billingController.js
```javascript
const billingModel = require('../models/billingModel');
const { AppError } = require('../middleware/errorHandler');

const billingController = {
  // GET /api/billing - Get all bills
  getAllBills: async (req, res, next) => {
    try {
      const { search, status } = req.query;

      let bills;

      if (search) {
        bills = await billingModel.search(search);
      } else if (status && status !== 'All') {
        bills = await billingModel.filterByStatus(status);
      } else {
        bills = await billingModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: bills.length,
        data: bills
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/billing/:id - Get bill by ID
  getBillById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const bill = await billingModel.findById(id);

      if (!bill) {
        return next(new AppError('Bill not found', 404));
      }

      res.status(200).json({
        success: true,
        data: bill
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/billing/stats/summary - Get billing statistics
  getBillingStats: async (req, res, next) => {
    try {
      const stats = await billingModel.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/billing/customer/:customerId - Get bills by customer
  getBillsByCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;

      const bills = await billingModel.findByCustomer(customerId);

      res.status(200).json({
        success: true,
        count: bills.length,
        data: bills
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = billingController;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: routes/billingRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

// GET /api/billing/stats/summary - Get billing statistics
router.get('/stats/summary', billingController.getBillingStats);

// GET /api/billing/customer/:customerId - Get bills by customer
router.get('/customer/:customerId', billingController.getBillsByCustomer);

// GET /api/billing/:id - Get bill by ID
router.get('/:id', billingController.getBillById);

// GET /api/billing - Get all bills (with optional filters)
router.get('/', billingController.getAllBills);

module.exports = router;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API 2: PAYMENTS API

FILE: models/paymentModel.js
```javascript
const { query } = require('../config/database');

const paymentModel = {
  // Get all payments with customer and bill details
  findAll: async () => {
    const queryString = `
      SELECT 
        p.payment_id,
        p.payment_number,
        p.payment_date,
        p.payment_amount,
        p.payment_method,
        p.transaction_reference,
        p.payment_status,
        p.notes,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        b.bill_id,
        b.bill_number,
        b.total_amount AS bill_amount,
        u.full_name AS received_by
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      LEFT JOIN [User] u ON p.received_by = u.user_id
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching payments: ${error.message}`);
    }
  },

  // Get payment by ID
  findById: async (paymentId) => {
    const queryString = `
      SELECT 
        p.*,
        c.customer_id,
        c.first_name,
        c.last_name,
        c.customer_type,
        c.email,
        c.phone,
        c.address,
        b.bill_number,
        b.bill_date,
        b.total_amount AS bill_total,
        b.outstanding_balance,
        u.full_name AS received_by_name,
        u.user_role AS received_by_role
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      LEFT JOIN [User] u ON p.received_by = u.user_id
      WHERE p.payment_id = @paymentId
    `;
    
    try {
      const result = await query(queryString, { paymentId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching payment: ${error.message}`);
    }
  },

  // Filter payments by method
  filterByMethod: async (paymentMethod) => {
    const queryString = `
      SELECT 
        p.payment_id,
        p.payment_number,
        p.payment_date,
        p.payment_amount,
        p.payment_method,
        p.transaction_reference,
        p.payment_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        b.bill_number,
        u.full_name AS received_by
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      LEFT JOIN [User] u ON p.received_by = u.user_id
      WHERE p.payment_method = @paymentMethod
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { paymentMethod });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering payments: ${error.message}`);
    }
  },

  // Filter payments by status
  filterByStatus: async (paymentStatus) => {
    const queryString = `
      SELECT 
        p.payment_id,
        p.payment_number,
        p.payment_date,
        p.payment_amount,
        p.payment_method,
        p.payment_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        b.bill_number
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      WHERE p.payment_status = @paymentStatus
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { paymentStatus });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering payments by status: ${error.message}`);
    }
  },

  // Search payments
  search: async (searchTerm) => {
    const queryString = `
      SELECT 
        p.payment_id,
        p.payment_number,
        p.payment_date,
        p.payment_amount,
        p.payment_method,
        p.payment_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        b.bill_number
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      WHERE 
        p.payment_number LIKE '%' + @searchTerm + '%'
        OR b.bill_number LIKE '%' + @searchTerm + '%'
        OR c.first_name LIKE '%' + @searchTerm + '%'
        OR c.last_name LIKE '%' + @searchTerm + '%'
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { searchTerm });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error searching payments: ${error.message}`);
    }
  },

  // Get payment statistics
  getStats: async () => {
    const queryString = `
      SELECT 
        -- Today's collections
        SUM(CASE WHEN CAST(payment_date AS DATE) = CAST(GETDATE() AS DATE) THEN payment_amount ELSE 0 END) AS today_collections,
        
        -- This month's collections
        SUM(CASE WHEN MONTH(payment_date) = MONTH(GETDATE()) AND YEAR(payment_date) = YEAR(GETDATE()) THEN payment_amount ELSE 0 END) AS monthly_collections,
        
        -- Pending payments count
        COUNT(CASE WHEN payment_status = 'Pending' THEN 1 END) AS pending_count,
        
        -- Failed payments count
        COUNT(CASE WHEN payment_status = 'Failed' THEN 1 END) AS failed_count,
        
        -- Total payments this month
        COUNT(CASE WHEN MONTH(payment_date) = MONTH(GETDATE()) AND YEAR(payment_date) = YEAR(GETDATE()) THEN 1 END) AS monthly_payment_count
      FROM Payment
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error getting payment stats: ${error.message}`);
    }
  },

  // Get payments by customer
  findByCustomer: async (customerId) => {
    const queryString = `
      SELECT 
        p.*,
        b.bill_number,
        b.total_amount AS bill_amount
      FROM Payment p
      INNER JOIN Billing b ON p.bill_id = b.bill_id
      WHERE p.customer_id = @customerId
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { customerId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customer payments: ${error.message}`);
    }
  },

  // Get payments by bill
  findByBill: async (billId) => {
    const queryString = `
      SELECT 
        p.*,
        c.first_name + ' ' + c.last_name AS customer_name,
        u.full_name AS received_by_name
      FROM Payment p
      INNER JOIN Customer c ON p.customer_id = c.customer_id
      LEFT JOIN [User] u ON p.received_by = u.user_id
      WHERE p.bill_id = @billId
      ORDER BY p.payment_date DESC
    `;
    
    try {
      const result = await query(queryString, { billId });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching bill payments: ${error.message}`);
    }
  }
};

module.exports = paymentModel;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: controllers/paymentController.js
```javascript
const paymentModel = require('../models/paymentModel');
const { AppError } = require('../middleware/errorHandler');

const paymentController = {
  // GET /api/payments - Get all payments
  getAllPayments: async (req, res, next) => {
    try {
      const { search, method, status } = req.query;

      let payments;

      if (search) {
        payments = await paymentModel.search(search);
      } else if (method && method !== 'All') {
        payments = await paymentModel.filterByMethod(method);
      } else if (status && status !== 'All') {
        payments = await paymentModel.filterByStatus(status);
      } else {
        payments = await paymentModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/payments/:id - Get payment by ID
  getPaymentById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const payment = await paymentModel.findById(id);

      if (!payment) {
        return next(new AppError('Payment not found', 404));
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/payments/stats/summary - Get payment statistics
  getPaymentStats: async (req, res, next) => {
    try {
      const stats = await paymentModel.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/payments/customer/:customerId - Get payments by customer
  getPaymentsByCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;

      const payments = await paymentModel.findByCustomer(customerId);

      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/payments/bill/:billId - Get payments by bill
  getPaymentsByBill: async (req, res, next) => {
    try {
      const { billId } = req.params;

      const payments = await paymentModel.findByBill(billId);

      res.status(200).json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = paymentController;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: routes/paymentRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET /api/payments/stats/summary - Get payment statistics
router.get('/stats/summary', paymentController.getPaymentStats);

// GET /api/payments/customer/:customerId - Get payments by customer
router.get('/customer/:customerId', paymentController.getPaymentsByCustomer);

// GET /api/payments/bill/:billId - Get payments by bill
router.get('/bill/:billId', paymentController.getPaymentsByBill);

// GET /api/payments/:id - Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// GET /api/payments - Get all payments (with optional filters)
router.get('/', paymentController.getAllPayments);

module.exports = router;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API 3: COMPLAINTS API

FILE: models/complaintModel.js
```javascript
const { query } = require('../config/database');

const complaintModel = {
  // Get all complaints with customer and assignment details
  findAll: async () => {
    const queryString = `
      SELECT 
        comp.complaint_id,
        comp.complaint_number,
        comp.complaint_date,
        comp.complaint_type,
        comp.priority,
        comp.description,
        comp.complaint_status,
        comp.resolution_date,
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        c.phone,
        c.email,
        sc.connection_number,
        ut.utility_name AS utility_type,
        u.user_id AS assigned_to_id,
        u.full_name AS assigned_to_name
      FROM Complaint comp
      INNER JOIN Customer c ON comp.customer_id = c.customer_id
      LEFT JOIN Service_Connection sc ON comp.connection_id = sc.connection_id
      LEFT JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN [User] u ON comp.assigned_to = u.user_id
      ORDER BY comp.complaint_date DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching complaints: ${error.message}`);
    }
  },

  // Get complaint by ID
  findById: async (complaintId) => {
    const queryString = `
      SELECT 
        comp.*,
        c.customer_id,
        c.first_name,
        c.last_name,
        c.customer_type,
        c.email,
        c.phone,
        c.address,
        sc.connection_number,
        sc.property_address,
        ut.utility_name AS utility_type,
        u.user_id AS assigned_to_id,
        u.full_name AS assigned_to_name,
        u.email AS assigned_to_email
      FROM Complaint comp
      INNER JOIN Customer c ON comp.customer_id = c.customer_id
      LEFT JOIN Service_Connection sc ON comp.connection_id = sc.connection_id
      LEFT JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
      LEFT JOIN [User] u ON comp.assigned_to = u.user_id
      WHERE comp.complaint_id = @complaintId
    `;
    
    try {
      const result = await query(queryString, { complaintId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching complaint: ${error.message}`);
    }
  },

  // Filter complaints by status
  filterByStatus: async (complaintStatus) => {
    const queryString = `
      SELECT 
        comp.complaint_id,
        comp.complaint_number,
        comp.complaint_date,
        comp.complaint_type,
        comp.priority,
        comp.description,
        comp.complaint_status,
        c.first_name + ' ' + c.last_name AS customer_name,
        u.full_name AS assigned_to_name
      FROM Complaint comp
      INNER JOIN Customer c ON comp.customer_id = c.customer_id
      LEFT JOIN [User] u ON comp.assigned_to = u.user_id
      WHERE comp.complaint_status = @complaintStatus
      ORDER BY comp.complaint_date DESC
    `;
    
    try {
      const result = await query(queryString, { complaintStatus });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering complaints: ${error.message}`);
    }
  },

  // Filter complaints by priority
  filterByPriority: async (priority) => {
    const queryString = `
      SELECT 
        comp.complaint_id,
        comp.complaint_number,
        comp.complaint_date,
        comp.complaint_type,
        comp.priority,
        comp.description,
        comp.

        complaint_status,
c.first_name + ' ' + c.last_name AS customer_name,
u.full_name AS assigned_to_name
FROM Complaint comp
INNER JOIN Customer c ON comp.customer_id = c.customer_id
LEFT JOIN [User] u ON comp.assigned_to = u.user_id
WHERE comp.priority = @priority
ORDER BY comp.complaint_date DESC
`;
try {
  const result = await query(queryString, { priority });
  return result.recordset;
} catch (error) {
  throw new Error(`Error filtering complaints by priority: ${error.message}`);
}
},
// Filter complaints by type
filterByType: async (complaintType) => {
const queryString =       SELECT          comp.complaint_id,         comp.complaint_number,         comp.complaint_date,         comp.complaint_type,         comp.priority,         comp.description,         comp.complaint_status,         c.first_name + ' ' + c.last_name AS customer_name,         u.full_name AS assigned_to_name       FROM Complaint comp       INNER JOIN Customer c ON comp.customer_id = c.customer_id       LEFT JOIN [User] u ON comp.assigned_to = u.user_id       WHERE comp.complaint_type = @complaintType       ORDER BY comp.complaint_date DESC    ;
try {
  const result = await query(queryString, { complaintType });
  return result.recordset;
} catch (error) {
  throw new Error(`Error filtering complaints by type: ${error.message}`);
}
},
// Search complaints
search: async (searchTerm) => {
const queryString =       SELECT          comp.complaint_id,         comp.complaint_number,         comp.complaint_date,         comp.complaint_type,         comp.priority,         comp.description,         comp.complaint_status,         c.first_name + ' ' + c.last_name AS customer_name       FROM Complaint comp       INNER JOIN Customer c ON comp.customer_id = c.customer_id       WHERE          comp.complaint_number LIKE '%' + @searchTerm + '%'         OR c.first_name LIKE '%' + @searchTerm + '%'         OR c.last_name LIKE '%' + @searchTerm + '%'         OR comp.description LIKE '%' + @searchTerm + '%'       ORDER BY comp.complaint_date DESC    ;
try {
  const result = await query(queryString, { searchTerm });
  return result.recordset;
} catch (error) {
  throw new Error(`Error searching complaints: ${error.message}`);
}
},
// Get complaint statistics
getStats: async () => {
const queryString =       SELECT          COUNT(*) AS total_complaints,         COUNT(CASE WHEN complaint_status = 'Open' THEN 1 END) AS open_count,         COUNT(CASE WHEN complaint_status = 'In Progress' THEN 1 END) AS in_progress_count,         COUNT(CASE WHEN complaint_status = 'Resolved' THEN 1 END) AS resolved_count,         COUNT(CASE WHEN complaint_status = 'Closed' THEN 1 END) AS closed_count,         COUNT(CASE WHEN priority = 'Urgent' THEN 1 END) AS urgent_count,         CASE            WHEN COUNT(*) > 0            THEN CAST(COUNT(CASE WHEN complaint_status IN ('Resolved', 'Closed') THEN 1 END) * 100.0 / COUNT(*) AS DECIMAL(5,2))           ELSE 0          END AS resolution_rate       FROM Complaint    ;
try {
  const result = await query(queryString);
  return result.recordset[0];
} catch (error) {
  throw new Error(`Error getting complaint stats: ${error.message}`);
}
},
// Get complaints by customer
findByCustomer: async (customerId) => {
const queryString =       SELECT          comp.*,         sc.connection_number,         ut.utility_name AS utility_type,         u.full_name AS assigned_to_name       FROM Complaint comp       LEFT JOIN Service_Connection sc ON comp.connection_id = sc.connection_id       LEFT JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id       LEFT JOIN [User] u ON comp.assigned_to = u.user_id       WHERE comp.customer_id = @customerId       ORDER BY comp.complaint_date DESC    ;
try {
  const result = await query(queryString, { customerId });
  return result.recordset;
} catch (error) {
  throw new Error(`Error fetching customer complaints: ${error.message}`);
}
},
// Get unassigned complaints
findUnassigned: async () => {
const queryString =       SELECT          comp.complaint_id,         comp.complaint_number,         comp.complaint_date,         comp.complaint_type,         comp.priority,         comp.description,         comp.complaint_status,         c.first_name + ' ' + c.last_name AS customer_name       FROM Complaint comp       INNER JOIN Customer c ON comp.customer_id = c.customer_id       WHERE comp.assigned_to IS NULL         AND comp.complaint_status IN ('Open', 'In Progress')       ORDER BY          CASE comp.priority           WHEN 'Urgent' THEN 1           WHEN 'High' THEN 2           WHEN 'Medium' THEN 3           WHEN 'Low' THEN 4         END,         comp.complaint_date ASC    ;
try {
  const result = await query(queryString);
  return result.recordset;
} catch (error) {
  throw new Error(`Error fetching unassigned complaints: ${error.message}`);
}
}
};
module.exports = complaintModel;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: controllers/complaintController.js
```javascript
const complaintModel = require('../models/complaintModel');
const { AppError } = require('../middleware/errorHandler');

const complaintController = {
  // GET /api/complaints - Get all complaints
  getAllComplaints: async (req, res, next) => {
    try {
      const { search, status, priority, type } = req.query;

      let complaints;

      if (search) {
        complaints = await complaintModel.search(search);
      } else if (status && status !== 'All') {
        complaints = await complaintModel.filterByStatus(status);
      } else if (priority && priority !== 'All') {
        complaints = await complaintModel.filterByPriority(priority);
      } else if (type && type !== 'All') {
        complaints = await complaintModel.filterByType(type);
      } else {
        complaints = await complaintModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: complaints.length,
        data: complaints
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/complaints/:id - Get complaint by ID
  getComplaintById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const complaint = await complaintModel.findById(id);

      if (!complaint) {
        return next(new AppError('Complaint not found', 404));
      }

      res.status(200).json({
        success: true,
        data: complaint
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/complaints/stats/summary - Get complaint statistics
  getComplaintStats: async (req, res, next) => {
    try {
      const stats = await complaintModel.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/complaints/customer/:customerId - Get complaints by customer
  getComplaintsByCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;

      const complaints = await complaintModel.findByCustomer(customerId);

      res.status(200).json({
        success: true,
        count: complaints.length,
        data: complaints
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/complaints/unassigned - Get unassigned complaints
  getUnassignedComplaints: async (req, res, next) => {
    try {
      const complaints = await complaintModel.findUnassigned();

      res.status(200).json({
        success: true,
        count: complaints.length,
        data: complaints
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = complaintController;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: routes/complaintRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// GET /api/complaints/stats/summary - Get complaint statistics
router.get('/stats/summary', complaintController.getComplaintStats);

// GET /api/complaints/unassigned - Get unassigned complaints
router.get('/unassigned', complaintController.getUnassignedComplaints);

// GET /api/complaints/customer/:customerId - Get complaints by customer
router.get('/customer/:customerId', complaintController.getComplaintsByCustomer);

// GET /api/complaints/:id - Get complaint by ID
router.get('/:id', complaintController.getComplaintById);

// GET /api/complaints - Get all complaints (with optional filters)
router.get('/', complaintController.getAllComplaints);

module.exports = router;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILE: server.js (UPDATE - Add new routes)

Add these lines to your existing server.js after the customers route:
```javascript
// API Routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));      // ADD THIS
app.use('/api/payments', require('./routes/paymentRoutes'));    // ADD THIS
app.use('/api/complaints', require('./routes/complaintRoutes')); // ADD THIS
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TESTING THE APIs:

1. Start backend server:
```bash
cd backend
npm run dev
```

2. Test endpoints:

BILLING:
```bash
# Get all bills
curl http://localhost:5000/api/billing

# Get billing stats
curl http://localhost:5000/api/billing/stats/summary

# Search bills
curl http://localhost:5000/api/billing?search=BILL-2024

# Filter by status
curl http://localhost:5000/api/billing?status=Unpaid
```

PAYMENTS:
```bash
# Get all payments
curl http://localhost:5000/api/payments

# Get payment stats
curl http://localhost:5000/api/payments/stats/summary

# Filter by method
curl http://localhost:5000/api/payments?method=Cash

# Filter by status
curl http://localhost:5000/api/payments?status=Completed
```

COMPLAINTS:
```bash
# Get all complaints
curl http://localhost:5000/api/complaints

# Get complaint stats
curl http://localhost:5000/api/complaints/stats/summary

# Filter by status
curl http://localhost:5000/api/complaints?status=Open

# Filter by priority
curl http://localhost:5000/api/complaints?priority=Urgent

# Get unassigned
curl http://localhost:5000/api/complaints/unassigned
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT NOTES:

1. All APIs follow the same pattern as customerModel
2. Each model has:
   - findAll() - Get all records with joins
   - findById() - Get single record with full details
   - search() - Search functionality
   - filter functions - Multiple filter options
   - getStats() - Statistics endpoint
3. Controllers handle query parameters (search, filters)
4. Routes follow RESTful conventions
5. Error handling with try-catch and next(error)
6. Consistent response format:
```javascript
   {
     success: true,
     count: X,
     data: [...]
   }
```

7. All queries include proper JOINs to get related data
8. Use parameterized queries to prevent SQL injection
9. Order results by most recent first (DESC)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please create all model, controller, and route files for Billing, Payments, and Complaints following the exact same structure as the Customers API.

Make sure to:
- Use proper JOINs to get related data
- Include statistics endpoints
- Implement search and filter functionality
- Add proper error handling
- Follow consistent naming conventions
- Test all endpoints
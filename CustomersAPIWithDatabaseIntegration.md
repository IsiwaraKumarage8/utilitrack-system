I need to create a complete Customers API for my Utility Management System and integrate it with my existing frontend. Currently, I have a Customers page with hardcoded sample data in a table. I want to replace this with real data from my SQL Server database.

DATABASE STRUCTURE - Customer Table:
```sql
CREATE TABLE Customer (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_type VARCHAR(20) NOT NULL DEFAULT 'Residential',
    CONSTRAINT CHK_customer_type CHECK (customer_type IN ('Residential', 'Commercial', 'Industrial', 'Government')),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    company_name VARCHAR(100) NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    registration_date DATE NOT NULL DEFAULT GETDATE(),
    status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT CHK_status CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
```

BACKEND FOLDER STRUCTURE:
backend/
├── config/
│   └── database.js (already exists - has getPool, query, executeProcedure functions)
├── controllers/
│   └── customerController.js (CREATE THIS)
├── models/
│   └── customerModel.js (CREATE THIS)
├── routes/
│   └── customerRoutes.js (CREATE THIS)
├── middleware/
│   └── (already has errorHandler)
└── server.js (already exists - need to add customer routes)

FRONTEND STRUCTURE:
frontend/src/
├── api/
│   └── customerApi.js (CREATE THIS)
└── pages/
    └── Customers/
        └── Customers.jsx (MODIFY THIS - remove hardcoded data)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BACKEND FILES TO CREATE:

1. models/customerModel.js
Create database query functions for Customer operations:
```javascript
const { query } = require('../config/database');

const customerModel = {
  // Get all customers
  findAll: async () => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }
  },

  // Get customer by ID
  findById: async (customerId) => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      WHERE customer_id = @customerId
    `;
    
    try {
      const result = await query(queryString, { customerId });
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error fetching customer: ${error.message}`);
    }
  },

  // Search customers by name, email, or phone
  search: async (searchTerm) => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      WHERE 
        first_name LIKE '%' + @searchTerm + '%'
        OR last_name LIKE '%' + @searchTerm + '%'
        OR email LIKE '%' + @searchTerm + '%'
        OR phone LIKE '%' + @searchTerm + '%'
        OR company_name LIKE '%' + @searchTerm + '%'
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await query(queryString, { searchTerm });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error searching customers: ${error.message}`);
    }
  },

  // Filter customers by type
  filterByType: async (customerType) => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      WHERE customer_type = @customerType
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await query(queryString, { customerType });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering customers: ${error.message}`);
    }
  },

  // Filter customers by status
  filterByStatus: async (status) => {
    const queryString = `
      SELECT 
        customer_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        email,
        phone,
        address,
        city,
        postal_code,
        registration_date,
        status,
        created_at,
        updated_at
      FROM Customer
      WHERE status = @status
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await query(queryString, { status });
      return result.recordset;
    } catch (error) {
      throw new Error(`Error filtering customers by status: ${error.message}`);
    }
  },

  // Get customer count by type
  getCountByType: async () => {
    const queryString = `
      SELECT 
        customer_type,
        COUNT(*) as count
      FROM Customer
      GROUP BY customer_type
    `;
    
    try {
      const result = await query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error getting customer count: ${error.message}`);
    }
  }
};

module.exports = customerModel;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. controllers/customerController.js
Create controller functions to handle requests:
```javascript
const customerModel = require('../models/customerModel');
const { AppError } = require('../middleware/errorHandler');

const customerController = {
  // GET /api/customers - Get all customers
  getAllCustomers: async (req, res, next) => {
    try {
      const { search, type, status } = req.query;

      let customers;

      // If search parameter exists, search customers
      if (search) {
        customers = await customerModel.search(search);
      } 
      // If type filter exists, filter by type
      else if (type && type !== 'All') {
        customers = await customerModel.filterByType(type);
      }
      // If status filter exists, filter by status
      else if (status && status !== 'All') {
        customers = await customerModel.filterByStatus(status);
      }
      // Otherwise get all customers
      else {
        customers = await customerModel.findAll();
      }

      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/customers/:id - Get customer by ID
  getCustomerById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const customer = await customerModel.findById(id);

      if (!customer) {
        return next(new AppError('Customer not found', 404));
      }

      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/customers/stats/count - Get customer statistics
  getCustomerStats: async (req, res, next) => {
    try {
      const countByType = await customerModel.getCountByType();

      res.status(200).json({
        success: true,
        data: countByType
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. routes/customerRoutes.js
Create route definitions:
```javascript
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET /api/customers - Get all customers (with optional filters)
// Query params: ?search=term, ?type=Residential, ?status=Active
router.get('/', customerController.getAllCustomers);

// GET /api/customers/stats/count - Get customer statistics
router.get('/stats/count', customerController.getCustomerStats);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', customerController.getCustomerById);

module.exports = router;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. server.js (UPDATE - Add customer routes)
Add this line to your existing server.js:
```javascript
// After other middleware, before error handlers
app.use('/api/customers', require('./routes/customerRoutes'));
```

Full context where to add it:
```javascript
// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/customers', require('./routes/customerRoutes')); // ADD THIS LINE

// Global error handler (comes after routes)
app.use((err, req, res, next) => {
  // ... error handler code
});
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRONTEND FILES TO CREATE/MODIFY:

5. frontend/src/api/customerApi.js (CREATE THIS)
Create API service for frontend:
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token (if needed later)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
);

const customerApi = {
  // Get all customers
  getAll: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  // Get customer by ID
  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  // Search customers
  search: async (searchTerm) => {
    const response = await api.get(`/customers?search=${searchTerm}`);
    return response.data;
  },

  // Filter by type
  filterByType: async (type) => {
    const response = await api.get(`/customers?type=${type}`);
    return response.data;
  },

  // Filter by status
  filterByStatus: async (status) => {
    const response = await api.get(`/customers?status=${status}`);
    return response.data;
  },

  // Get customer statistics
  getStats: async () => {
    const response = await api.get('/customers/stats/count');
    return response.data;
  }
};

export default customerApi;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. frontend/src/pages/Customers/Customers.jsx (MODIFY THIS)
Update your existing Customers component to use real data:

INSTRUCTIONS FOR MODIFICATION:
1. Remove all hardcoded mock data arrays
2. Import customerApi
3. Add useState for customers data, loading state, error state
4. Add useEffect to fetch data on component mount
5. Add loading spinner while fetching
6. Add error message if fetch fails
7. Keep all existing UI/styling exactly as is
8. Just replace data source from mockData to API response

Example structure:
```javascript
import React, { useState, useEffect } from 'react';
import customerApi from '../../api/customerApi';
import toast from 'react-hot-toast';
import './Customers.css';

const Customers = () => {
  // State management
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers function
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await customerApi.getAll();
      
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Failed to load customers');
      setLoading(false);
      toast.error('Failed to load customers');
    }
  };

  // Handle search
  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (term.trim() === '') {
      fetchCustomers();
      return;
    }

    try {
      setLoading(true);
      const response = await customerApi.search(term);
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching customers:', err);
      toast.error('Search failed');
      setLoading(false);
    }
  };

  // Handle filter by type
  const handleFilterByType = async (type) => {
    setFilterType(type);

    try {
      setLoading(true);
      
      if (type === 'All') {
        await fetchCustomers();
      } else {
        const response = await customerApi.filterByType(type);
        setCustomers(response.data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error filtering customers:', err);
      toast.error('Filter failed');
      setLoading(false);
    }
  };

  // Handle filter by status
  const handleFilterByStatus = async (status) => {
    setFilterStatus(status);

    try {
      setLoading(true);
      
      if (status === 'All') {
        await fetchCustomers();
      } else {
        const response = await customerApi.filterByStatus(status);
        setCustomers(response.data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error filtering customers:', err);
      toast.error('Filter failed');
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="customers-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="customers-page">
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={fetchCustomers} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (customers.length === 0) {
    return (
      <div className="customers-page">
        {/* Keep your existing header/filters */}
        
        <div className="empty-state">
          <p>No customers found</p>
          <button onClick={fetchCustomers} className="refresh-button">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="customers-page">
      {/* Keep ALL your existing JSX structure */}
      {/* Just replace mockData with customers variable */}
      
      {/* Example table rendering */}
      <table className="customers-table">
        <thead>
          {/* Your existing table headers */}
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>
                <div className="customer-avatar">
                  {customer.first_name[0]}{customer.last_name[0]}
                </div>
              </td>
              <td>{customer.first_name} {customer.last_name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <span className={`badge badge-${customer.customer_type.toLowerCase()}`}>
                  {customer.customer_type}
                </span>
              </td>
              <td>{customer.city}</td>
              <td>
                <span className={`badge badge-${customer.status.toLowerCase()}`}>
                  {customer.status}
                </span>
              </td>
              <td>
                {/* Your existing action buttons */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. Add loading spinner CSS (if not exists)
Add to Customers.css:
```css
/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error state */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.error-message {
  color: #ef4444;
  font-size: 16px;
  font-weight: 500;
}

.retry-button {
  padding: 10px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: #6b7280;
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TESTING INSTRUCTIONS:

1. Start backend server:
```bash
cd backend
npm run dev
```

Should see:
✅ Database connected successfully
🚀 Server running on port 5000

2. Test API endpoint directly:
```bash
curl http://localhost:5000/api/customers
```

Should return JSON with customers array.

3. Start frontend:
```bash
cd frontend
npm run dev
```

4. Navigate to Customers page
Should see:
- Loading spinner initially
- Then table populated with real database data
- Search should work
- Filters should work

5. Check browser console for any errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT NOTES:

1. Keep ALL existing CSS styling exactly as is
2. Keep ALL existing UI components (buttons, filters, table structure)
3. Only replace data source (mockData → API response)
4. Add loading, error, and empty states
5. Use toast notifications for user feedback
6. Handle errors gracefully
7. The customer object structure matches your database exactly

Data mapping:
- customer_id → customer.customer_id
- first_name → customer.first_name  
- last_name → customer.last_name
- customer_type → customer.customer_type (Residential/Commercial/Industrial/Government)
- status → customer.status (Active/Inactive/Suspended)
- All other fields map directly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please create all backend files (model, controller, routes) and modify the frontend Customers component to use real API data while keeping all existing styling and UI structure intact.

Make sure error handling is robust and user-friendly!
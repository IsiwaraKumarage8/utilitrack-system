const sql = require('mssql');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SQL SERVER CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true, // Use encryption for Azure
    trustServerCertificate: true, // Trust self-signed certificates for local development
    enableArithAbort: true,
    requestTimeout: 30000 // 30 seconds
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONNECTION POOL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let pool = null;

/**
 * Get database connection pool
 * Creates a new pool if one doesn't exist
 * @returns {Promise<sql.ConnectionPool>} Database connection pool
 */
const getPool = async () => {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('✅ Database connected successfully');
      console.log(`📊 Database: ${config.database}`);
      console.log(`🖥️  Server: ${config.server}`);
      
      // Handle pool errors
      pool.on('error', err => {
        console.error('❌ Database pool error:', err);
        pool = null;
      });
      
      return pool;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      pool = null;
      throw error;
    }
  }
  return pool;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Execute a SQL query with parameters
 * @param {string} queryString - SQL query to execute
 * @param {Object} params - Query parameters (key-value pairs)
 * @returns {Promise<Object>} Query result
 */
const query = async (queryString, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.query(queryString);
    return result;
  } catch (error) {
    console.error('Query execution error:', error.message);
    console.error('Query:', queryString);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Execute a stored procedure with parameters
 * @param {string} procedureName - Name of the stored procedure
 * @param {Object} params - Procedure parameters (key-value pairs)
 * @returns {Promise<Object>} Procedure result
 */
const executeProcedure = async (procedureName, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.execute(procedureName);
    return result;
  } catch (error) {
    console.error('Stored procedure execution error:', error.message);
    console.error('Procedure:', procedureName);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Execute a query with type-safe parameters
 * More control over parameter types
 * @param {string} queryString - SQL query to execute
 * @param {Array} params - Array of {name, type, value} objects
 * @returns {Promise<Object>} Query result
 */
const queryWithTypes = async (queryString, params = []) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add typed parameters to request
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });
    
    const result = await request.query(queryString);
    return result;
  } catch (error) {
    console.error('Typed query execution error:', error.message);
    console.error('Query:', queryString);
    console.error('Params:', params);
    throw error;
  }
};

/**
 * Close database connection pool
 * Should be called on application shutdown
 * @returns {Promise<void>}
 */
const closePool = async () => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('🔌 Database connection pool closed');
    }
  } catch (error) {
    console.error('❌ Error closing database pool:', error.message);
    throw error;
  }
};

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection is successful
 */
const testConnection = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 AS test');
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports = {
  sql,
  getPool,
  query,
  executeProcedure,
  queryWithTypes,
  closePool,
  testConnection
};

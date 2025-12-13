# Database Schema Field Mapping Reference

## ✅ VERIFIED - All Frontend Code Now Matches Database Schema

### Customer Table
**Database Fields:**
- `customer_id` (INT, PRIMARY KEY)
- `customer_type` (VARCHAR(20)) - VALUES: 'Residential', 'Commercial', 'Industrial', 'Government'
- `first_name` (VARCHAR(50))
- `last_name` (VARCHAR(50))
- `company_name` (VARCHAR(100), NULLABLE)
- `email` (VARCHAR(100), UNIQUE)
- `phone` (VARCHAR(15))
- `address` (VARCHAR(255))
- `city` (VARCHAR(50))
- `postal_code` (VARCHAR(10))
- `registration_date` (DATE)
- `status` (VARCHAR(20)) - VALUES: 'Active', 'Inactive', 'Suspended'
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**Frontend Implementation:** ✅ Customers.jsx - ALL FIELDS MATCH

---

### Service_Connection Table
**Database Fields:**
- `connection_id` (INT, PRIMARY KEY)
- `customer_id` (INT, FOREIGN KEY → Customer)
- `utility_type_id` (INT, FOREIGN KEY → Utility_Type) ⚠️ **NOT a string!**
- `connection_number` (VARCHAR(50), UNIQUE) - e.g., 'ELEC-2020-001'
- `connection_date` (DATE) - NOT 'installation_date'
- `disconnection_date` (DATE, NULLABLE)
- `connection_status` (VARCHAR(20)) - NOT 'status' - VALUES: 'Active', 'Disconnected', 'Suspended', 'Pending'
- `property_address` (VARCHAR(255)) - NOT 'location'
- `notes` (VARCHAR(500), NULLABLE)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**Frontend Implementation:** ✅ Connections.jsx - ALL FIELDS CORRECTED

**Important Notes:**
- ❌ NO `connection_type` field (like "Single Phase", "Three Phase") - use `notes` instead
- ❌ NO `meter_number` field - this is in Meter table
- ❌ NO `tariff_plan` field - this is fetched via JOIN with Tariff_Plan table
- ❌ NO `last_reading` or `current_consumption` - these are in Meter_Reading table

---

### Utility_Type Table
**Database Fields:**
- `utility_type_id` (INT, PRIMARY KEY)
- `utility_name` (VARCHAR(50), UNIQUE)
- `unit_of_measurement` (VARCHAR(20))
- `description` (VARCHAR(255), NULLABLE)
- `status` (VARCHAR(20)) - VALUES: 'Active', 'Inactive'
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**Sample Data (IDs):**
1. Electricity (kWh)
2. Water (Cubic Meters)
3. Gas (Cubic Meters)
4. Sewage (Cubic Meters)
5. Street Lighting (kWh)

**Frontend Implementation:** ✅ ALL utilities correctly mapped with IDs

---

### Tariff_Plan Table
**Database Fields:**
- `tariff_id` (INT, PRIMARY KEY)
- `utility_type_id` (INT, FOREIGN KEY → Utility_Type)
- `tariff_name` (VARCHAR(100))
- `customer_type` (VARCHAR(20)) - VALUES: 'Residential', 'Commercial', 'Industrial', 'Government'
- `rate_per_unit` (DECIMAL(10,2))
- `fixed_charge` (DECIMAL(10,2))
- `effective_from` (DATE)
- `effective_to` (DATE, NULLABLE)
- `tariff_status` (VARCHAR(20)) - VALUES: 'Active', 'Inactive', 'Expired'
- `description` (VARCHAR(500), NULLABLE)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**Frontend Implementation:** ✅ Tariff plans match database sample data

---

### Meter Table
**Database Fields:**
- `meter_id` (INT, PRIMARY KEY)
- `connection_id` (INT, FOREIGN KEY → Service_Connection)
- `meter_number` (VARCHAR(50), UNIQUE)
- `meter_type` (VARCHAR(50)) - e.g., 'Digital', 'Analog', 'Smart Meter'
- `manufacturer` (VARCHAR(100), NULLABLE)
- `installation_date` (DATE)
- `last_maintenance_date` (DATE, NULLABLE)
- `initial_reading` (DECIMAL(10,2))
- `meter_status` (VARCHAR(20)) - VALUES: 'Active', 'Faulty', 'Replaced', 'Removed'
- `notes` (VARCHAR(500), NULLABLE)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**Relationship:** One Service_Connection can have ONE Meter

---

### Meter_Reading Table
**Database Fields:**
- `reading_id` (INT, PRIMARY KEY)
- `meter_id` (INT, FOREIGN KEY → Meter)
- `reading_date` (DATE)
- `previous_reading` (DECIMAL(10,2))
- `current_reading` (DECIMAL(10,2))
- `consumption` (DECIMAL(10,2)) - calculated field
- `reading_type` (VARCHAR(20)) - VALUES: 'Scheduled', 'Special', 'Final'
- `reader_id` (INT, FOREIGN KEY → User, NULLABLE)
- `notes` (VARCHAR(500), NULLABLE)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

**Frontend Display:** Current consumption and last reading date come from this table via JOIN

---

## Critical Points for Backend Implementation

### 1. **Foreign Key Relationships**
When fetching connections for frontend, you MUST JOIN:
```sql
SELECT 
    sc.connection_id,
    sc.customer_id,
    c.first_name + ' ' + c.last_name AS customer_name,
    sc.utility_type_id,
    ut.utility_name AS utility_type,
    sc.connection_number,
    sc.connection_date,
    sc.disconnection_date,
    sc.connection_status,
    sc.property_address,
    sc.notes,
    m.meter_number,
    tp.tariff_name AS tariff_plan,
    mr.reading_date AS last_reading,
    mr.consumption AS current_consumption
FROM Service_Connection sc
INNER JOIN Customer c ON sc.customer_id = c.customer_id
INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
LEFT JOIN Meter m ON sc.connection_id = m.connection_id
LEFT JOIN Tariff_Plan tp ON sc.utility_type_id = tp.utility_type_id 
    AND tp.tariff_status = 'Active'
LEFT JOIN (
    SELECT meter_id, reading_date, consumption,
           ROW_NUMBER() OVER (PARTITION BY meter_id ORDER BY reading_date DESC) as rn
    FROM Meter_Reading
) mr ON m.meter_id = mr.meter_id AND mr.rn = 1
```

### 2. **Field Name Mappings (Database → Frontend Display)**
- `connection_status` → display as "Status"
- `property_address` → display as "Location"
- `connection_date` → display as "Installation Date"
- `utility_type_id` (1-5) → JOIN to get `utility_name` → display as "Utility Type"

### 3. **Creating New Connection**
Must create records in MULTIPLE tables:
1. Insert into `Service_Connection` (with `utility_type_id`, not string)
2. Insert into `Meter` (with generated `meter_number`)
3. Insert initial `Meter_Reading` (with `initial_reading`)
4. Associate with appropriate `Tariff_Plan` (via `utility_type_id` and `customer_type`)

### 4. **Validation Rules**
- `connection_number` must be UNIQUE
- `meter_number` must be UNIQUE
- `utility_type_id` must exist in Utility_Type table
- `customer_id` must exist in Customer table
- `connection_status` must be one of: 'Active', 'Disconnected', 'Suspended', 'Pending'

---

## Status Field Values (All Tables)

| Table | Field Name | Allowed Values |
|-------|-----------|----------------|
| Customer | `status` | 'Active', 'Inactive', 'Suspended' |
| Service_Connection | `connection_status` | 'Active', 'Disconnected', 'Suspended', 'Pending' |
| Meter | `meter_status` | 'Active', 'Faulty', 'Replaced', 'Removed' |
| Tariff_Plan | `tariff_status` | 'Active', 'Inactive', 'Expired' |
| Utility_Type | `status` | 'Active', 'Inactive' |

---

## Common Mistakes to Avoid

❌ **DO NOT:**
- Use `utility_type` as a string - it's `utility_type_id` (integer)
- Use field name `location` - it's `property_address`
- Use field name `status` in Service_Connection - it's `connection_status`
- Use field name `installation_date` - it's `connection_date`
- Store `meter_number` in Service_Connection - it's in Meter table
- Expect `connection_type` field - doesn't exist (use `notes`)

✅ **DO:**
- Always use JOINs to fetch related data (utility names, customer names, meter info)
- Use `utility_type_id` when inserting/updating Service_Connection
- Map IDs to display values in frontend
- Validate against database CHECK constraints
- Use correct field names exactly as defined in schema

---

**Last Verified:** December 13, 2025
**Schema File:** d:\utilitrack-system\ums_db.sql
**Frontend Files Verified:**
- ✅ Customers.jsx
- ✅ Connections.jsx  
- ✅ ConnectionForm.jsx
- ✅ ConnectionDetails.jsx

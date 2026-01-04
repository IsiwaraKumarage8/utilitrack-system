CREATE DATABASE ums_db;

GO

USE ums_db;

GO

-- Entities

CREATE TABLE [User] (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    
    username VARCHAR(50) NOT NULL UNIQUE,
    -- Login username
    
    password VARCHAR(255) NOT NULL,
    -- Password (plain text for demo purposes only)
    
    full_name VARCHAR(100) NOT NULL,
    
    email VARCHAR(100) UNIQUE NOT NULL,
    
    phone VARCHAR(15) NULL,
    
    user_role VARCHAR(20) NOT NULL,
    CONSTRAINT CHK_user_role CHECK (user_role IN ('Admin', 'Field Officer', 'Cashier', 'Manager', 'Billing Clerk')),
    
    department VARCHAR(50) NULL,
    -- e.g., 'Operations', 'Finance', 'Customer Service'
    
    hire_date DATE NOT NULL DEFAULT GETDATE(),
    
    user_status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT CHK_user_status CHECK (user_status IN ('Active', 'Inactive', 'Suspended')),
    
    last_login DATETIME NULL,
    -- Track last login time
    
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Customer (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_type VARCHAR(20) NOT NULL DEFAULT 'Residential',
    -- Use CHECK constraint instead of ENUM
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

CREATE TABLE Utility_Type (
    utility_type_id INT IDENTITY(1,1) PRIMARY KEY,
    utility_name VARCHAR(50) NOT NULL UNIQUE,
    -- e.g., 'Electricity', 'Water', 'Gas'
    
    unit_of_measurement VARCHAR(20) NOT NULL,
    -- e.g., 'kWh', 'cubic meters', 'cubic meters'
    
    description VARCHAR(255) NULL,
    -- Brief description of the utility service
    
    status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT CHK_utility_status CHECK (status IN ('Active', 'Inactive')),
    
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Tariff_Plan (
    tariff_id INT IDENTITY(1,1) PRIMARY KEY,
    utility_type_id INT NOT NULL,
    
    tariff_name VARCHAR(100) NOT NULL,
    -- e.g., 'Residential Electricity Standard', 'Commercial Water Rate'
    
    customer_type VARCHAR(20) NOT NULL,
    CONSTRAINT CHK_tariff_customer_type CHECK (customer_type IN ('Residential', 'Commercial', 'Industrial', 'Government')),
    
    rate_per_unit DECIMAL(10,2) NOT NULL,
    -- Price per kWh, cubic meter, etc.
    
    fixed_charge DECIMAL(10,2) DEFAULT 0.00,
    -- Monthly fixed/service charge regardless of consumption
    
    effective_from DATE NOT NULL,
    -- When this tariff becomes active
    
    effective_to DATE NULL,
    -- When this tariff expires (NULL = currently active)
    
    tariff_status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT CHK_tariff_status CHECK (tariff_status IN ('Active', 'Inactive', 'Expired')),
    
    description VARCHAR(500) NULL,
    
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (utility_type_id) REFERENCES Utility_Type(utility_type_id)
);

CREATE TABLE Service_Connection (
    connection_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    utility_type_id INT NOT NULL,
    
    connection_number VARCHAR(50) NOT NULL UNIQUE,
    -- Unique identifier for this service connection (e.g., 'ELEC-2024-001')
    
    connection_date DATE NOT NULL DEFAULT GETDATE(),
    disconnection_date DATE NULL,
    
    connection_status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT CHK_connection_status CHECK (connection_status IN ('Active', 'Disconnected', 'Suspended', 'Pending')),
    
    property_address VARCHAR(255) NOT NULL,
    -- Physical location where service is provided
    
    notes VARCHAR(500) NULL,
    -- Any special notes about this connection
    
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (utility_type_id) REFERENCES Utility_Type(utility_type_id)
);

CREATE TABLE Meter (
    meter_id INT IDENTITY(1,1) PRIMARY KEY,
    connection_id INT NOT NULL,
    
    meter_number VARCHAR(50) NOT NULL UNIQUE,
    -- Physical meter serial number (e.g., 'MTR-ELEC-2024-12345')
    
    meter_type VARCHAR(50) NOT NULL,
    -- e.g., 'Digital', 'Analog', 'Smart Meter'
    
    manufacturer VARCHAR(100) NULL,
    -- e.g., 'Siemens', 'Landis+Gyr', 'Sensus'
    
    installation_date DATE NOT NULL DEFAULT GETDATE(),
    last_maintenance_date DATE NULL,
    
    initial_reading DECIMAL(10,2) DEFAULT 0.00,
    -- Starting reading when meter was installed
    
    meter_status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT CHK_meter_status CHECK (meter_status IN ('Active', 'Faulty', 'Replaced', 'Removed')),
    
    notes VARCHAR(500) NULL,
    
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (connection_id) REFERENCES Service_Connection(connection_id)
);

CREATE TABLE Meter_Reading (
    reading_id INT IDENTITY(1,1) PRIMARY KEY,
    meter_id INT NOT NULL,
    
    reading_date DATE NOT NULL DEFAULT GETDATE(),
    -- Date when the reading was taken
    
    current_reading DECIMAL(10,2) NOT NULL,
    -- Current meter reading value
    
    previous_reading DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    -- Previous reading for reference
    
    consumption DECIMAL(10,2) NOT NULL,
    -- Calculated: current_reading - previous_reading
    
    reading_type VARCHAR(20) DEFAULT 'Actual',
    CONSTRAINT CHK_reading_type CHECK (reading_type IN ('Actual', 'Estimated', 'Customer-Submitted')),
    
    reader_id INT NULL,
    -- Field officer who took the reading
    
    notes VARCHAR(500) NULL,
    -- Any anomalies or issues noted during reading
    
    created_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (meter_id) REFERENCES Meter(meter_id),
    FOREIGN KEY (reader_id) REFERENCES [User](user_id)
);

CREATE TABLE Billing (
    bill_id INT IDENTITY(1,1) PRIMARY KEY,
    connection_id INT NOT NULL,
    reading_id INT NOT NULL,
    tariff_id INT NOT NULL,
    
    bill_number VARCHAR(50) NOT NULL UNIQUE,
    -- Unique bill reference (e.g., 'BILL-2024-001')
    
    bill_date DATE NOT NULL DEFAULT GETDATE(),
    due_date DATE NOT NULL,
    -- Typically bill_date + 15 or 30 days
    
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    -- The period this bill covers
    
    consumption DECIMAL(10,2) NOT NULL,
    -- Units consumed (copied from meter reading)
    
    rate_per_unit DECIMAL(10,2) NOT NULL,
    -- Rate applied (copied from tariff for record-keeping)
    
    fixed_charge DECIMAL(10,2) DEFAULT 0.00,
    -- Fixed monthly charge
    
    consumption_charge DECIMAL(10,2) NOT NULL,
    -- Calculated: consumption × rate_per_unit
    
    total_amount DECIMAL(10,2) NOT NULL,
    -- consumption_charge + fixed_charge
    
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    -- Total paid so far
    
    outstanding_balance DECIMAL(10,2) NOT NULL,
    -- total_amount - amount_paid
    
    bill_status VARCHAR(20) DEFAULT 'Unpaid',
    CONSTRAINT CHK_bill_status CHECK (bill_status IN ('Unpaid', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled')),
    
    notes VARCHAR(500) NULL,
    
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (connection_id) REFERENCES Service_Connection(connection_id),
    FOREIGN KEY (reading_id) REFERENCES Meter_Reading(reading_id),
    FOREIGN KEY (tariff_id) REFERENCES Tariff_Plan(tariff_id)
);

CREATE TABLE Payment (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    bill_id INT NOT NULL,
    customer_id INT NOT NULL,
    
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    -- Unique payment reference (e.g., 'PAY-2024-001')
    
    payment_date DATE NOT NULL DEFAULT GETDATE(),
    
    payment_amount DECIMAL(10,2) NOT NULL,
    -- Amount paid in this transaction
    
    payment_method VARCHAR(20) NOT NULL,
    CONSTRAINT CHK_payment_method CHECK (payment_method IN ('Cash', 'Card', 'Bank Transfer', 'Online', 'Cheque')),
    
    transaction_reference VARCHAR(100) NULL,
    -- Bank reference, cheque number, card transaction ID, etc.
    
    received_by INT NULL,
    -- User (cashier/clerk) who processed the payment
    
    payment_status VARCHAR(20) DEFAULT 'Completed',
    CONSTRAINT CHK_payment_status CHECK (payment_status IN ('Completed', 'Pending', 'Failed', 'Refunded')),
    
    notes VARCHAR(500) NULL,
    
    created_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (bill_id) REFERENCES Billing(bill_id),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (received_by) REFERENCES [User](user_id)
);

CREATE TABLE Complaint (
    complaint_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    connection_id INT NULL,
    -- Optional: complaint might be about a specific service connection
    
    complaint_number VARCHAR(50) NOT NULL UNIQUE,
    -- Unique complaint reference (e.g., 'COMP-2024-001')
    
    complaint_date DATE NOT NULL DEFAULT GETDATE(),
    
    complaint_type VARCHAR(50) NOT NULL,
    CONSTRAINT CHK_complaint_type CHECK (complaint_type IN ('Billing Issue', 'Meter Fault', 'Service Disruption', 'Quality Issue', 'Connection Request', 'Other')),
    
    priority VARCHAR(20) DEFAULT 'Medium',
    CONSTRAINT CHK_priority CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    
    description VARCHAR(1000) NOT NULL,
    -- Detailed complaint description
    
    assigned_to INT NULL,
    -- User (staff member) assigned to handle this complaint
    
    complaint_status VARCHAR(20) DEFAULT 'Open',
    CONSTRAINT CHK_complaint_status CHECK (complaint_status IN ('Open', 'In Progress', 'Resolved', 'Closed', 'Rejected')),
    
    resolution_date DATE NULL,
    -- When the complaint was resolved
    
    resolution_notes VARCHAR(1000) NULL,
    -- Details of how complaint was resolved
    
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (connection_id) REFERENCES Service_Connection(connection_id),
    FOREIGN KEY (assigned_to) REFERENCES [User](user_id)
);

GO

-- Sample Data

-- Sample data for [User] table
-- NOTE: All passwords are now plain text: password123
-- WARNING: This is insecure and only for coursework/demo purposes
INSERT INTO [User] (username, password, full_name, email, phone, user_role, department, hire_date, user_status, last_login)
VALUES
('admin', 'admin123', 'System Administrator', 'admin@utilityco.com', '0770000000', 'Admin', 'IT', '2020-01-15', 'Active', '2024-12-10 09:30:00'),
('jsmith', 'password123', 'John Smith', 'john.smith@utilityco.com', '0771234567', 'Admin', 'Operations', '2020-01-15', 'Active', '2024-12-10 09:30:00'),
('mjohnson', 'password123', 'Mary Johnson', 'mary.johnson@utilityco.com', '0772345678', 'Manager', 'Finance', '2020-03-22', 'Active', '2024-12-11 08:15:00'),
('rperera', 'password123', 'Ruwan Perera', 'ruwan.perera@utilityco.com', '0773456789', 'Field Officer', 'Operations', '2021-06-10', 'Active', '2024-12-10 16:45:00'),
('sfernando', 'password123', 'Shalini Fernando', 'shalini.fernando@utilityco.com', '0774567890', 'Cashier', 'Finance', '2021-09-05', 'Active', '2024-12-11 10:20:00'),
('asilva', 'password123', 'Anton Silva', 'anton.silva@utilityco.com', '0775678901', 'Field Officer', 'Operations', '2022-01-12', 'Active', '2024-12-09 14:30:00'),
('ndias', 'password123', 'Nimal Dias', 'nimal.dias@utilityco.com', '0776789012', 'Billing Clerk', 'Finance', '2022-04-18', 'Active', '2024-12-11 11:00:00'),
('kwijesinghe', 'password123', 'Kumari Wijesinghe', 'kumari.w@utilityco.com', '0777890123', 'Cashier', 'Finance', '2022-07-25', 'Active', '2024-12-10 15:10:00'),
('pweerasinghe', 'password123', 'Priya Weerasinghe', 'priya.weerasinghe@utilityco.com', '0778901234', 'Field Officer', 'Operations', '2023-02-14', 'Active', '2024-12-11 07:50:00'),
('dbandara', 'password123', 'Dinesh Bandara', 'dinesh.bandara@utilityco.com', '0770123456', 'Manager', 'Customer Service', '2023-05-08', 'Active', '2024-12-11 09:00:00'),
('tgunasekara', 'password123', 'Thilini Gunasekara', 'thilini.g@utilityco.com', '0771234568', 'Billing Clerk', 'Finance', '2023-08-20', 'Active', '2024-12-10 13:25:00'),
('lranasinghe', '$2a$12$n75G2PWkljGwzgtSVLb3jeGEGozqXYnyDcixVpRTYb6bnp1jqrEP2', 'Lakshan Ranasinghe', 'lakshan.r@utilityco.com', '0772345679', 'Field Officer', 'Operations', '2024-01-10', 'Active', '2024-12-09 12:40:00'),
('mgamage', '$2a$12$bvwAdwFJB2hssDoUCKVOfeA4s6StFUcnAQ4qofHV8OcNl9ScZxkJW', 'Madhavi Gamage', 'madhavi.gamage@utilityco.com', '0773456780', 'Cashier', 'Finance', '2024-03-15', 'Active', '2024-12-11 08:45:00');

GO

-- Sample data for Customer table
INSERT INTO Customer (customer_type, first_name, last_name, company_name, email, phone, address, city, postal_code, registration_date, status)
VALUES
('Residential', 'Kamal', 'Jayawardena', NULL, 'kamal.j@email.com', '0712345678', '45/2 Galle Road', 'Colombo', '00300', '2020-01-20', 'Active'),
('Residential', 'Sandya', 'Wickramasinghe', NULL, 'sandya.w@email.com', '0723456789', '12 Temple Lane', 'Kandy', '20000', '2020-03-15', 'Active'),
('Commercial', 'Rohan', 'De Silva', 'Lanka Traders (Pvt) Ltd', 'rohan@lankatraders.lk', '0734567890', '78 Main Street', 'Negombo', '11500', '2020-05-10', 'Active'),
('Residential', 'Nimali', 'Fernando', NULL, 'nimali.fernando@email.com', '0745678901', '23/A Lotus Road', 'Galle', '80000', '2020-08-22', 'Active'),
('Industrial', 'Chandana', 'Perera', 'Ceylon Manufacturing Ltd', 'chandana@ceylonmfg.com', '0756789012', 'Industrial Zone, Plot 15', 'Ratmalana', '10390', '2020-10-05', 'Active'),
('Residential', 'Anura', 'Rajapaksa', NULL, 'anura.r@email.com', '0767890123', '56 Highlevel Road', 'Maharagama', '10280', '2021-01-12', 'Active'),
('Commercial', 'Dilini', 'Amarasinghe', 'Green Supermarket', 'dilini@greensupermarket.lk', '0778901234', '89 Station Road', 'Matara', '81000', '2021-03-28', 'Active'),
('Residential', 'Gamini', 'Wijeratne', NULL, 'gamini.w@email.com', '0789012345', '34/B Park Avenue', 'Panadura', '12500', '2021-06-14', 'Active'),
('Government', 'Susantha', 'Gunawardena', 'District Health Office', 'susantha.g@health.gov.lk', '0770123456', 'Government Complex', 'Kurunegala', '60000', '2021-09-01', 'Active'),
('Residential', 'Manjula', 'Dissanayake', NULL, 'manjula.d@email.com', '0771234567', '67 Sea View Road', 'Moratuwa', '10400', '2021-11-20', 'Active'),
('Commercial', 'Ranjith', 'Silva', 'Silva Hardware Store', 'ranjith@silvahardware.lk', '0772345678', '45 Market Street', 'Anuradhapura', '50000', '2022-02-08', 'Active'),
('Residential', 'Chaminda', 'Bandara', NULL, 'chaminda.b@email.com', '0773456789', '12/C Flower Road', 'Batticaloa', '30000', '2022-04-25', 'Active'),
('Industrial', 'Sunil', 'Jayasuriya', 'Ace Textiles Ltd', 'sunil@acetextiles.com', '0774567890', 'Export Processing Zone', 'Katunayake', '11450', '2022-07-15', 'Active'),
('Residential', 'Malini', 'Herath', NULL, 'malini.h@email.com', '0775678901', '89/1 Hill Street', 'Nuwara Eliya', '22200', '2022-10-03', 'Active'),
('Commercial', 'Upul', 'Mendis', 'Mendis Restaurant', 'upul@mendisrestaurant.lk', '0776789013', '23 Beach Road', 'Hikkaduwa', '80240', '2023-01-18', 'Active');

GO

-- Sample data for Utility_Type table
INSERT INTO Utility_Type (utility_name, unit_of_measurement, description, status)
VALUES
('Electricity', 'kWh', 'Electrical power supply for residential, commercial and industrial use', 'Active'),
('Water', 'Cubic Meters', 'Potable water supply for domestic and commercial consumption', 'Active'),
('Gas', 'Cubic Meters', 'Natural gas supply for cooking and heating purposes', 'Active'),
('Sewage', 'Cubic Meters', 'Wastewater collection and treatment services', 'Active'),
('Street Lighting', 'kWh', 'Public street and area lighting services', 'Active');

GO

-- Sample data for Tariff_Plan table
INSERT INTO Tariff_Plan (utility_type_id, tariff_name, customer_type, rate_per_unit, fixed_charge, effective_from, effective_to, tariff_status, description)
VALUES
(1, 'Residential Electricity Standard', 'Residential', 25.50, 150.00, '2024-01-01', NULL, 'Active', 'Standard electricity tariff for residential customers'),
(1, 'Commercial Electricity Rate', 'Commercial', 32.75, 500.00, '2024-01-01', NULL, 'Active', 'Electricity tariff for commercial establishments'),
(1, 'Industrial Electricity Rate', 'Industrial', 28.00, 2500.00, '2024-01-01', NULL, 'Active', 'Bulk electricity tariff for industrial consumers'),
(1, 'Government Electricity Rate', 'Government', 22.00, 300.00, '2024-01-01', NULL, 'Active', 'Subsidized electricity rate for government institutions'),
(2, 'Residential Water Standard', 'Residential', 45.00, 200.00, '2024-01-01', NULL, 'Active', 'Standard water tariff for residential customers'),
(2, 'Commercial Water Rate', 'Commercial', 65.00, 750.00, '2024-01-01', NULL, 'Active', 'Water tariff for commercial establishments'),
(2, 'Industrial Water Rate', 'Industrial', 55.00, 3000.00, '2024-01-01', NULL, 'Active', 'Bulk water tariff for industrial consumers'),
(2, 'Government Water Rate', 'Government', 40.00, 400.00, '2024-01-01', NULL, 'Active', 'Water tariff for government institutions'),
(3, 'Residential Gas Standard', 'Residential', 85.00, 250.00, '2024-01-01', NULL, 'Active', 'Standard gas tariff for residential customers'),
(3, 'Commercial Gas Rate', 'Commercial', 95.00, 900.00, '2024-01-01', NULL, 'Active', 'Gas tariff for commercial establishments'),
(4, 'Residential Sewage Standard', 'Residential', 30.00, 100.00, '2024-01-01', NULL, 'Active', 'Sewage service charge for residential properties'),
(4, 'Commercial Sewage Rate', 'Commercial', 50.00, 400.00, '2024-01-01', NULL, 'Active', 'Sewage service charge for commercial properties'),
(1, 'Residential Electricity Old Rate', 'Residential', 22.00, 120.00, '2023-01-01', '2023-12-31', 'Expired', 'Previous year electricity tariff - expired');

GO

-- Sample data for Service_Connection table
INSERT INTO Service_Connection (customer_id, utility_type_id, connection_number, connection_date, disconnection_date, connection_status, property_address, notes)
VALUES
(1, 1, 'ELEC-2020-001', '2020-01-25', NULL, 'Active', '45/2 Galle Road, Colombo 03', 'Primary residence connection'),
(1, 2, 'WATER-2020-001', '2020-01-25', NULL, 'Active', '45/2 Galle Road, Colombo 03', 'Primary residence connection'),
(2, 1, 'ELEC-2020-002', '2020-03-20', NULL, 'Active', '12 Temple Lane, Kandy', 'Standard residential connection'),
(2, 2, 'WATER-2020-002', '2020-03-20', NULL, 'Active', '12 Temple Lane, Kandy', 'Standard residential connection'),
(3, 1, 'ELEC-2020-003', '2020-05-15', NULL, 'Active', '78 Main Street, Negombo', 'Three-phase commercial connection'),
(3, 2, 'WATER-2020-003', '2020-05-15', NULL, 'Active', '78 Main Street, Negombo', 'Commercial water supply'),
(4, 1, 'ELEC-2020-004', '2020-08-28', NULL, 'Active', '23/A Lotus Road, Galle', NULL),
(5, 1, 'ELEC-2020-005', '2020-10-10', NULL, 'Active', 'Industrial Zone, Plot 15, Ratmalana', 'High voltage industrial connection'),
(5, 2, 'WATER-2020-005', '2020-10-10', NULL, 'Active', 'Industrial Zone, Plot 15, Ratmalana', 'Industrial water supply with high capacity'),
(6, 1, 'ELEC-2021-001', '2021-01-18', NULL, 'Active', '56 Highlevel Road, Maharagama', NULL),
(7, 1, 'ELEC-2021-002', '2021-04-02', NULL, 'Active', '89 Station Road, Matara', 'Commercial supermarket connection'),
(7, 2, 'WATER-2021-002', '2021-04-02', NULL, 'Active', '89 Station Road, Matara', NULL),
(8, 1, 'ELEC-2021-003', '2021-06-20', NULL, 'Active', '34/B Park Avenue, Panadura', NULL),
(9, 1, 'ELEC-2021-004', '2021-09-05', NULL, 'Active', 'Government Complex, Kurunegala', 'Government office complex'),
(9, 2, 'WATER-2021-004', '2021-09-05', NULL, 'Active', 'Government Complex, Kurunegala', NULL),
(10, 1, 'ELEC-2021-005', '2021-11-25', NULL, 'Active', '67 Sea View Road, Moratuwa', NULL),
(11, 1, 'ELEC-2022-001', '2022-02-12', NULL, 'Active', '45 Market Street, Anuradhapura', 'Hardware store connection'),
(12, 1, 'ELEC-2022-002', '2022-05-01', NULL, 'Active', '12/C Flower Road, Batticaloa', NULL),
(13, 1, 'ELEC-2022-003', '2022-07-20', NULL, 'Active', 'Export Processing Zone, Katunayake', 'Textile factory - three phase'),
(13, 2, 'WATER-2022-003', '2022-07-20', NULL, 'Active', 'Export Processing Zone, Katunayake', 'Industrial water for textile processing');

GO

-- Sample data for Meter table
INSERT INTO Meter (connection_id, meter_number, meter_type, manufacturer, installation_date, last_maintenance_date, initial_reading, meter_status, notes)
VALUES
(1, 'MTR-ELEC-2020-00001', 'Digital', 'Siemens', '2020-01-25', '2024-06-15', 0.00, 'Active', 'Single phase digital meter'),
(2, 'MTR-WATER-2020-00001', 'Digital', 'Sensus', '2020-01-25', '2024-06-15', 0.00, 'Active', 'Residential water meter'),
(3, 'MTR-ELEC-2020-00002', 'Smart Meter', 'Landis+Gyr', '2020-03-20', '2024-08-10', 0.00, 'Active', 'Smart meter with remote reading capability'),
(4, 'MTR-WATER-2020-00002', 'Digital', 'Sensus', '2020-03-20', '2024-08-10', 0.00, 'Active', NULL),
(5, 'MTR-ELEC-2020-00003', 'Digital', 'Siemens', '2020-05-15', '2024-05-20', 0.00, 'Active', 'Three-phase commercial meter'),
(6, 'MTR-WATER-2020-00003', 'Digital', 'Itron', '2020-05-15', '2024-05-20', 0.00, 'Active', 'Commercial grade water meter'),
(7, 'MTR-ELEC-2020-00004', 'Digital', 'Schneider Electric', '2020-08-28', '2024-09-05', 0.00, 'Active', NULL),
(8, 'MTR-ELEC-2020-00005', 'Smart Meter', 'ABB', '2020-10-10', '2024-10-15', 0.00, 'Active', 'Industrial smart meter with CT connection'),
(9, 'MTR-WATER-2020-00005', 'Digital', 'Itron', '2020-10-10', '2024-10-15', 0.00, 'Active', 'Large industrial water meter'),
(10, 'MTR-ELEC-2021-00001', 'Digital', 'Siemens', '2021-01-18', '2024-07-20', 0.00, 'Active', NULL),
(11, 'MTR-ELEC-2021-00002', 'Digital', 'Landis+Gyr', '2021-04-02', '2024-11-10', 0.00, 'Active', 'Supermarket connection'),
(12, 'MTR-WATER-2021-00002', 'Digital', 'Sensus', '2021-04-02', '2024-11-10', 0.00, 'Active', NULL),
(13, 'MTR-ELEC-2021-00003', 'Smart Meter', 'Siemens', '2021-06-20', NULL, 0.00, 'Active', 'Recently installed smart meter'),
(14, 'MTR-ELEC-2021-00004', 'Digital', 'Schneider Electric', '2021-09-05', '2024-09-12', 0.00, 'Active', 'Government building meter'),
(15, 'MTR-WATER-2021-00004', 'Digital', 'Itron', '2021-09-05', '2024-09-12', 0.00, 'Active', NULL),
(16, 'MTR-ELEC-2021-00005', 'Digital', 'Siemens', '2021-11-25', '2024-08-30', 0.00, 'Active', NULL),
(17, 'MTR-ELEC-2022-00001', 'Digital', 'Landis+Gyr', '2022-02-12', '2024-10-05', 0.00, 'Active', NULL),
(18, 'MTR-ELEC-2022-00002', 'Smart Meter', 'ABB', '2022-05-01', NULL, 0.00, 'Active', NULL),
(19, 'MTR-ELEC-2022-00003', 'Smart Meter', 'Siemens', '2022-07-20', '2024-11-15', 0.00, 'Active', 'Factory meter - high capacity'),
(20, 'MTR-WATER-2022-00003', 'Digital', 'Itron', '2022-07-20', '2024-11-15', 0.00, 'Active', 'Industrial water meter');

GO

-- Sample data for Meter_Reading table
INSERT INTO Meter_Reading (meter_id, reading_date, current_reading, previous_reading, consumption, reading_type, reader_id, notes)
VALUES
-- November 2024 readings
(1, '2024-11-05', 4850.00, 4620.00, 230.00, 'Actual', 3, 'Regular monthly reading'),
(2, '2024-11-05', 125.50, 112.30, 13.20, 'Actual', 3, NULL),
(3, '2024-11-06', 8920.00, 8640.00, 280.00, 'Actual', 5, NULL),
(4, '2024-11-06', 245.80, 228.50, 17.30, 'Actual', 5, NULL),
(5, '2024-11-07', 15640.00, 15120.00, 520.00, 'Actual', 8, 'Commercial establishment'),
(6, '2024-11-07', 485.20, 452.80, 32.40, 'Actual', 8, NULL),
(7, '2024-11-08', 3280.00, 3050.00, 230.00, 'Actual', 3, NULL),
(8, '2024-11-09', 78450.00, 75890.00, 2560.00, 'Actual', 5, 'Industrial high consumption'),
(9, '2024-11-09', 1825.60, 1682.30, 143.30, 'Actual', 5, NULL),
(10, '2024-11-10', 5620.00, 5380.00, 240.00, 'Actual', 8, NULL),
(11, '2024-11-11', 12840.00, 12340.00, 500.00, 'Actual', 3, 'Supermarket reading'),
(12, '2024-11-11', 368.90, 342.10, 26.80, 'Actual', 3, NULL),
(13, '2024-11-12', 6780.00, 6520.00, 260.00, 'Actual', 5, NULL),
(14, '2024-11-13', 9450.00, 9120.00, 330.00, 'Actual', 8, 'Government complex'),
(15, '2024-11-13', 425.70, 398.20, 27.50, 'Actual', 8, NULL),

-- December 2024 readings (current billing cycle)
(1, '2024-12-05', 5080.00, 4850.00, 230.00, 'Actual', 3, 'Regular monthly reading'),
(2, '2024-12-05', 138.70, 125.50, 13.20, 'Actual', 3, NULL),
(3, '2024-12-06', 9210.00, 8920.00, 290.00, 'Actual', 5, NULL),
(4, '2024-12-06', 263.10, 245.80, 17.30, 'Actual', 5, NULL),
(5, '2024-12-07', 16180.00, 15640.00, 540.00, 'Actual', 8, 'Higher consumption this month'),
(6, '2024-12-07', 518.60, 485.20, 33.40, 'Actual', 8, NULL),
(7, '2024-12-08', 3510.00, 3280.00, 230.00, 'Actual', 3, NULL),
(8, '2024-12-09', 81120.00, 78450.00, 2670.00, 'Actual', 5, 'Industrial - increased production'),
(9, '2024-12-09', 1972.90, 1825.60, 147.30, 'Actual', 5, NULL),
(10, '2024-12-10', 5870.00, 5620.00, 250.00, 'Actual', 8, NULL);

GO

-- Sample data for Billing table
INSERT INTO Billing (connection_id, reading_id, tariff_id, bill_number, bill_date, due_date, billing_period_start, billing_period_end, consumption, rate_per_unit, fixed_charge, consumption_charge, total_amount, amount_paid, outstanding_balance, bill_status, notes)
VALUES
-- November 2024 bills
(1, 1, 1, 'BILL-2024-1101', '2024-11-06', '2024-11-21', '2024-10-05', '2024-11-05', 230.00, 25.50, 150.00, 5865.00, 6015.00, 6015.00, 0.00, 'Paid', 'Paid on time'),
(2, 2, 5, 'BILL-2024-1102', '2024-11-06', '2024-11-21', '2024-10-05', '2024-11-05', 13.20, 45.00, 200.00, 594.00, 794.00, 794.00, 0.00, 'Paid', 'Paid in full'),
(3, 3, 1, 'BILL-2024-1103', '2024-11-07', '2024-11-22', '2024-10-06', '2024-11-06', 280.00, 25.50, 150.00, 7140.00, 7290.00, 7290.00, 0.00, 'Paid', NULL),
(4, 4, 5, 'BILL-2024-1104', '2024-11-07', '2024-11-22', '2024-10-06', '2024-11-06', 17.30, 45.00, 200.00, 778.50, 978.50, 978.50, 0.00, 'Paid', NULL),
(5, 5, 2, 'BILL-2024-1105', '2024-11-08', '2024-11-23', '2024-10-07', '2024-11-07', 520.00, 32.75, 500.00, 17030.00, 17530.00, 17530.00, 0.00, 'Paid', 'Commercial - paid promptly'),
(6, 6, 6, 'BILL-2024-1106', '2024-11-08', '2024-11-23', '2024-10-07', '2024-11-07', 32.40, 65.00, 750.00, 2106.00, 2856.00, 2856.00, 0.00, 'Paid', NULL),
(7, 7, 1, 'BILL-2024-1107', '2024-11-09', '2024-11-24', '2024-10-08', '2024-11-08', 230.00, 25.50, 150.00, 5865.00, 6015.00, 4000.00, 2015.00, 'Partially Paid', 'Partial payment received'),
(8, 8, 3, 'BILL-2024-1108', '2024-11-10', '2024-11-25', '2024-10-09', '2024-11-09', 2560.00, 28.00, 2500.00, 71680.00, 74180.00, 74180.00, 0.00, 'Paid', 'Industrial - large consumption'),
(9, 9, 7, 'BILL-2024-1109', '2024-11-10', '2024-11-25', '2024-10-09', '2024-11-09', 143.30, 55.00, 3000.00, 7881.50, 10881.50, 10881.50, 0.00, 'Paid', NULL),
(10, 10, 1, 'BILL-2024-1110', '2024-11-11', '2024-11-26', '2024-10-10', '2024-11-10', 240.00, 25.50, 150.00, 6120.00, 6270.00, 6270.00, 0.00, 'Paid', NULL),
(11, 11, 2, 'BILL-2024-1111', '2024-11-12', '2024-11-27', '2024-10-11', '2024-11-11', 500.00, 32.75, 500.00, 16375.00, 16875.00, 16875.00, 0.00, 'Paid', 'Supermarket monthly bill'),
(12, 12, 6, 'BILL-2024-1112', '2024-11-12', '2024-11-27', '2024-10-11', '2024-11-11', 26.80, 65.00, 750.00, 1742.00, 2492.00, 2492.00, 0.00, 'Paid', NULL),

-- December 2024 bills (current month - some unpaid)
(1, 16, 1, 'BILL-2024-1201', '2024-12-06', '2024-12-21', '2024-11-05', '2024-12-05', 230.00, 25.50, 150.00, 5865.00, 6015.00, 6015.00, 0.00, 'Paid', 'Paid early'),
(2, 17, 5, 'BILL-2024-1202', '2024-12-06', '2024-12-21', '2024-11-05', '2024-12-05', 13.20, 45.00, 200.00, 594.00, 794.00, 0.00, 794.00, 'Unpaid', NULL),
(3, 18, 1, 'BILL-2024-1203', '2024-12-07', '2024-12-22', '2024-11-06', '2024-12-06', 290.00, 25.50, 150.00, 7395.00, 7545.00, 7545.00, 0.00, 'Paid', NULL),
(4, 19, 5, 'BILL-2024-1204', '2024-12-07', '2024-12-22', '2024-11-06', '2024-12-06', 17.30, 45.00, 200.00, 778.50, 978.50, 0.00, 978.50, 'Unpaid', NULL),
(5, 20, 2, 'BILL-2024-1205', '2024-12-08', '2024-12-23', '2024-11-07', '2024-12-07', 540.00, 32.75, 500.00, 17685.00, 18185.00, 0.00, 18185.00, 'Unpaid', NULL),
(6, 21, 6, 'BILL-2024-1206', '2024-12-08', '2024-12-23', '2024-11-07', '2024-12-07', 33.40, 65.00, 750.00, 2171.00, 2921.00, 2921.00, 0.00, 'Paid', NULL),
(7, 22, 1, 'BILL-2024-1207', '2024-12-09', '2024-12-24', '2024-11-08', '2024-12-08', 230.00, 25.50, 150.00, 5865.00, 6015.00, 0.00, 6015.00, 'Unpaid', 'Previous balance also pending'),
(8, 23, 3, 'BILL-2024-1208', '2024-12-10', '2024-12-25', '2024-11-09', '2024-12-09', 2670.00, 28.00, 2500.00, 74760.00, 77260.00, 77260.00, 0.00, 'Paid', 'Industrial - paid immediately');

GO

-- Sample data for Payment table
INSERT INTO Payment (bill_id, customer_id, payment_number, payment_date, payment_amount, payment_method, transaction_reference, received_by, payment_status, notes)
VALUES
-- November 2024 payments
(1, 1, 'PAY-2024-1101', '2024-11-15', 6015.00, 'Bank Transfer', 'BT-2024-NOV-001', 4, 'Completed', 'Online banking payment'),
(2, 1, 'PAY-2024-1102', '2024-11-15', 794.00, 'Bank Transfer', 'BT-2024-NOV-002', 4, 'Completed', 'Same customer - water bill'),
(3, 2, 'PAY-2024-1103', '2024-11-18', 7290.00, 'Cash', NULL, 4, 'Completed', 'Cash payment at counter'),
(4, 2, 'PAY-2024-1104', '2024-11-18', 978.50, 'Cash', NULL, 4, 'Completed', NULL),
(5, 3, 'PAY-2024-1105', '2024-11-20', 17530.00, 'Cheque', 'CHQ-445621', 7, 'Completed', 'Company cheque'),
(6, 3, 'PAY-2024-1106', '2024-11-20', 2856.00, 'Cheque', 'CHQ-445622', 7, 'Completed', NULL),
(7, 4, 'PAY-2024-1107', '2024-11-22', 4000.00, 'Card', 'CARD-TXN-998765', 12, 'Completed', 'Partial payment - debit card'),
(8, 5, 'PAY-2024-1108', '2024-11-23', 74180.00, 'Bank Transfer', 'BT-2024-NOV-045', 6, 'Completed', 'Industrial customer payment'),
(9, 5, 'PAY-2024-1109', '2024-11-23', 10881.50, 'Bank Transfer', 'BT-2024-NOV-046', 6, 'Completed', NULL),
(10, 6, 'PAY-2024-1110', '2024-11-24', 6270.00, 'Online', 'ONLINE-PAY-7782', 4, 'Completed', 'Payment gateway transaction'),
(11, 7, 'PAY-2024-1111', '2024-11-25', 16875.00, 'Bank Transfer', 'BT-2024-NOV-052', 7, 'Completed', 'Supermarket payment'),
(12, 7, 'PAY-2024-1112', '2024-11-25', 2492.00, 'Bank Transfer', 'BT-2024-NOV-053', 7, 'Completed', NULL),

-- December 2024 payments
(13, 1, 'PAY-2024-1201', '2024-12-08', 6015.00, 'Online', 'ONLINE-PAY-8891', 4, 'Completed', 'Early payment discount applied'),
(15, 2, 'PAY-2024-1203', '2024-12-09', 7545.00, 'Cash', NULL, 12, 'Completed', 'Cash payment'),
(18, 3, 'PAY-2024-1206', '2024-12-10', 2921.00, 'Bank Transfer', 'BT-2024-DEC-008', 6, 'Completed', NULL),
(20, 5, 'PAY-2024-1208', '2024-12-10', 77260.00, 'Bank Transfer', 'BT-2024-DEC-012', 6, 'Completed', 'Industrial payment - prompt');

GO

-- Sample data for Complaint table
INSERT INTO Complaint (customer_id, connection_id, complaint_number, complaint_date, complaint_type, priority, description, assigned_to, complaint_status, resolution_date, resolution_notes)
VALUES
(1, 1, 'COMP-2024-001', '2024-10-15', 'Billing Issue', 'Medium', 'Received an unusually high electricity bill for October. Usage seems incorrect compared to previous months.', 6, 'Resolved', '2024-10-18', 'Meter reading was verified. Billing error corrected and revised bill issued.'),
(2, 3, 'COMP-2024-002', '2024-10-20', 'Meter Fault', 'High', 'Digital meter display not working. Cannot see current consumption readings.', 3, 'Resolved', '2024-10-22', 'Technician visited and replaced faulty meter display unit. New meter tested and working properly.'),
(4, 7, 'COMP-2024-003', '2024-11-05', 'Service Disruption', 'Urgent', 'Complete power outage since morning. Business operations affected.', 5, 'Resolved', '2024-11-05', 'Transformer fault in the area. Emergency repair completed. Service restored by 2 PM.'),
(6, 10, 'COMP-2024-004', '2024-11-10', 'Billing Issue', 'Low', 'Payment not reflected in account even after 3 days of bank transfer.', 6, 'Resolved', '2024-11-12', 'Payment reconciliation issue. Payment located and account updated.'),
(3, 5, 'COMP-2024-005', '2024-11-15', 'Quality Issue', 'High', 'Frequent voltage fluctuations causing damage to equipment. Multiple occurrences this week.', 8, 'In Progress', NULL, 'Site inspection conducted. Voltage stabilizer installation recommended. Awaiting approval.'),
(8, 13, 'COMP-2024-006', '2024-11-22', 'Meter Fault', 'Medium', 'Meter reading appears stuck. Same reading for last two months.', 3, 'Resolved', '2024-11-25', 'Meter mechanism jammed. Meter replaced with new smart meter. Customer billed based on average consumption.'),
(10, 16, 'COMP-2024-007', '2024-11-28', 'Service Disruption', 'Medium', 'Intermittent power cuts during evening hours for the past week.', 5, 'Resolved', '2024-11-30', 'Loose connection at distribution point identified and fixed. Issue resolved.'),
(7, 11, 'COMP-2024-008', '2024-12-02', 'Billing Issue', 'Medium', 'Fixed charges applied incorrectly. Should be commercial rate but charged residential.', 10, 'Resolved', '2024-12-04', 'Tariff classification error in system. Updated to correct commercial tariff. Refund processed.'),
(5, 8, 'COMP-2024-009', '2024-12-05', 'Connection Request', 'High', 'Need additional meter for new production unit in the factory. Urgent requirement.', 8, 'In Progress', NULL, 'Site survey completed. Technical feasibility confirmed. Waiting for payment clearance for new connection.'),
(12, 18, 'COMP-2024-010', '2024-12-06', 'Other', 'Low', 'Request for relocation of meter to more accessible location for easy reading.', 3, 'Open', NULL, 'Request logged. Site visit scheduled for next week.'),
(9, 14, 'COMP-2024-011', '2024-12-08', 'Service Disruption', 'Urgent', 'No water supply to government complex since yesterday morning. Affecting all departments.', 5, 'In Progress', NULL, 'Main supply line blockage detected. Repair crew on site. Expected resolution within 24 hours.'),
(11, 17, 'COMP-2024-012', '2024-12-09', 'Billing Issue', 'Low', 'Did not receive bill for current month. Payment due date approaching.', 10, 'Open', NULL, 'Bill generation delayed due to system update. Will be dispatched by courier tomorrow.'),
(14, NULL, 'COMP-2024-013', '2024-12-10', 'Connection Request', 'Medium', 'Request for new electricity connection for recently purchased property in Nuwara Eliya.', 8, 'Open', NULL, 'Application received. Document verification in progress.');

GO

-- Triggers

CREATE TRIGGER trg_CalculateBillingAmounts
ON Billing
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update the billing calculations for the inserted/updated records
    UPDATE b
    SET 
        consumption_charge = b.consumption * b.rate_per_unit,
        total_amount = (b.consumption * b.rate_per_unit) + b.fixed_charge,
        outstanding_balance = ((b.consumption * b.rate_per_unit) + b.fixed_charge) - b.amount_paid
    FROM Billing b
    INNER JOIN inserted i ON b.bill_id = i.bill_id;
    
END;

GO

CREATE TRIGGER trg_UpdateBillAfterPayment
ON Payment
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update the billing record when payment is made
    UPDATE b
    SET 
        amount_paid = b.amount_paid + i.payment_amount,
        outstanding_balance = b.total_amount - (b.amount_paid + i.payment_amount),
        bill_status = CASE
            WHEN b.total_amount - (b.amount_paid + i.payment_amount) = 0 THEN 'Paid'
            WHEN b.total_amount - (b.amount_paid + i.payment_amount) < b.total_amount 
                 AND b.total_amount - (b.amount_paid + i.payment_amount) > 0 THEN 'Partially Paid'
            ELSE b.bill_status
        END,
        updated_at = GETDATE()
    FROM Billing b
    INNER JOIN inserted i ON b.bill_id = i.bill_id;
    
END;

GO

CREATE TRIGGER trg_CalculateConsumption
ON Meter_Reading
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update consumption for the newly inserted reading
    UPDATE mr
    SET 
        consumption = i.current_reading - i.previous_reading
    FROM Meter_Reading mr
    INNER JOIN inserted i ON mr.reading_id = i.reading_id;
    
END;

GO

CREATE PROCEDURE sp_MarkOverdueBills
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update bill status to 'Overdue' for unpaid/partially paid bills past due date
    UPDATE Billing
    SET 
        bill_status = 'Overdue',
        updated_at = GETDATE()
    WHERE 
        due_date < GETDATE()
        AND bill_status IN ('Unpaid', 'Partially Paid')
        AND outstanding_balance > 0;
    
    -- Return count of bills marked overdue
    SELECT @@ROWCOUNT AS bills_marked_overdue;
END;

GO

-- UDFs

CREATE FUNCTION fn_CalculateLateFee
(
    @bill_id INT,
    @current_date DATE
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @late_fee DECIMAL(10,2) = 0.00;
    DECLARE @due_date DATE;
    DECLARE @outstanding_balance DECIMAL(10,2);
    DECLARE @days_overdue INT;
    
    -- Get bill details
    SELECT 
        @due_date = due_date,
        @outstanding_balance = outstanding_balance
    FROM Billing
    WHERE bill_id = @bill_id;
    
    -- Calculate days overdue
    SET @days_overdue = DATEDIFF(day, @due_date, @current_date);
    
    -- Calculate late fee if overdue
    IF @days_overdue > 0 AND @outstanding_balance > 0
    BEGIN

        SET @late_fee = CEILING(@days_overdue / 30.0) * 100.00;
        
    END
    
    RETURN @late_fee;
END;

GO

CREATE FUNCTION fn_GetCustomerBalance
(
    @customer_id INT
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @total_balance DECIMAL(10,2) = 0.00;
    
    -- Sum all outstanding balances for this customer's connections
    SELECT 
        @total_balance = ISNULL(SUM(b.outstanding_balance), 0.00)
    FROM Billing b
    INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
    WHERE sc.customer_id = @customer_id
      AND b.outstanding_balance > 0;
    
    RETURN @total_balance;
END;

GO

CREATE FUNCTION fn_GetAvgConsumption
(
    @meter_id INT,
    @months INT
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @avg_consumption DECIMAL(10,2) = 0.00;
    DECLARE @cutoff_date DATE;
    
    -- Calculate cutoff date (N months back)
    SET @cutoff_date = DATEADD(month, -@months, GETDATE());
    
    -- Calculate average consumption for the specified period
    SELECT 
        @avg_consumption = ISNULL(AVG(consumption), 0.00)
    FROM Meter_Reading
    WHERE meter_id = @meter_id
      AND reading_date >= @cutoff_date
      AND consumption > 0;  -- Exclude zero/null readings
    
    RETURN @avg_consumption;
END;

GO

CREATE FUNCTION fn_GenerateBillNumber
(
    @utility_type VARCHAR(20),
    @year INT,
    @sequence INT
)
RETURNS VARCHAR(50)
AS
BEGIN
    DECLARE @bill_number VARCHAR(50);
    DECLARE @utility_code VARCHAR(10);
    
    -- Map utility type to short code
    SET @utility_code = CASE @utility_type
        WHEN 'Electricity' THEN 'ELEC'
        WHEN 'Water' THEN 'WATR'
        WHEN 'Gas' THEN 'GAS'
        ELSE 'UTIL'
    END;
    
    -- Format: BILL-ELEC-2024-0001
    SET @bill_number = 'BILL-' + @utility_code + '-' + 
                       CAST(@year AS VARCHAR(4)) + '-' + 
                       RIGHT('0000' + CAST(@sequence AS VARCHAR(4)), 4);
    
    RETURN @bill_number;
END;

GO

-- Stored Procedures

-- Drop existing procedures if they exist (for re-running the script)
DROP PROCEDURE IF EXISTS sp_GenerateBill;
DROP PROCEDURE IF EXISTS sp_ProcessPayment;
DROP PROCEDURE IF EXISTS sp_MonthlyBillingRun;
GO

CREATE PROCEDURE sp_GenerateBill
    @reading_id INT,
    @bill_number_out VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @connection_id INT;
    DECLARE @meter_id INT;
    DECLARE @utility_type_id INT;
    DECLARE @customer_type VARCHAR(20);
    DECLARE @consumption DECIMAL(10,2);
    DECLARE @tariff_id INT;
    DECLARE @rate_per_unit DECIMAL(10,2);
    DECLARE @fixed_charge DECIMAL(10,2);
    DECLARE @consumption_charge DECIMAL(10,2);
    DECLARE @total_amount DECIMAL(10,2);
    DECLARE @bill_number VARCHAR(50);
    DECLARE @bill_date DATE = GETDATE();
    DECLARE @due_date DATE = DATEADD(day, 30, GETDATE());
    DECLARE @period_start DATE;
    DECLARE @period_end DATE;
    
    BEGIN TRY
        -- Get meter reading details
        SELECT 
            @meter_id = mr.meter_id,
            @consumption = mr.consumption,
            @period_end = mr.reading_date
        FROM Meter_Reading mr
        WHERE mr.reading_id = @reading_id;
        
        -- Get connection and utility details
        SELECT 
            @connection_id = m.connection_id,
            @utility_type_id = sc.utility_type_id,
            @customer_type = c.customer_type
        FROM Meter m
        INNER JOIN Service_Connection sc ON m.connection_id = sc.connection_id
        INNER JOIN Customer c ON sc.customer_id = c.customer_id
        WHERE m.meter_id = @meter_id;
        
        -- Calculate billing period start (assume 30 days back from reading date)
        SET @period_start = DATEADD(day, -30, @period_end);
        
        -- Find appropriate active tariff
        SELECT TOP 1
            @tariff_id = tariff_id,
            @rate_per_unit = rate_per_unit,
            @fixed_charge = fixed_charge
        FROM Tariff_Plan
        WHERE utility_type_id = @utility_type_id
          AND customer_type = @customer_type
          AND tariff_status = 'Active'
          AND effective_from <= @bill_date
          AND (effective_to IS NULL OR effective_to >= @bill_date)
        ORDER BY effective_from DESC;
        
        -- Check if tariff was found
        IF @tariff_id IS NULL
        BEGIN
            RAISERROR('No active tariff found for this utility and customer type', 16, 1);
            RETURN;
        END
        
        -- Calculate charges
        SET @consumption_charge = @consumption * @rate_per_unit;
        SET @total_amount = @consumption_charge + @fixed_charge;
        
        -- Generate unique bill number
        DECLARE @year INT = YEAR(@bill_date);
        DECLARE @sequence INT;
        
        SELECT @sequence = ISNULL(MAX(CAST(RIGHT(bill_number, 4) AS INT)), 0) + 1
        FROM Billing
        WHERE YEAR(bill_date) = @year;
        
        SET @bill_number = 'BILL-' + CAST(@year AS VARCHAR(4)) + '-' + RIGHT('0000' + CAST(@sequence AS VARCHAR(4)), 4);
        
        -- Insert the bill with calculated values
        INSERT INTO Billing (
            connection_id, reading_id, tariff_id, bill_number,
            bill_date, due_date, billing_period_start, billing_period_end,
            consumption, rate_per_unit, fixed_charge,
            consumption_charge, total_amount, outstanding_balance, amount_paid
        )
        VALUES (
            @connection_id, @reading_id, @tariff_id, @bill_number,
            @bill_date, @due_date, @period_start, @period_end,
            @consumption, @rate_per_unit, @fixed_charge,
            @consumption_charge, @total_amount, @total_amount, 0
        );
        
        -- Return the bill number
        SET @bill_number_out = @bill_number;
        
        SELECT 'Bill generated successfully' AS message, @bill_number AS bill_number;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;

GO

CREATE PROCEDURE sp_ProcessPayment
    @bill_id INT,
    @payment_amount DECIMAL(10,2),
    @payment_method VARCHAR(20),
    @received_by INT,
    @transaction_reference VARCHAR(100) = NULL,
    @payment_number_out VARCHAR(50) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @customer_id INT;
    DECLARE @outstanding_balance DECIMAL(10,2);
    DECLARE @payment_number VARCHAR(50);
    DECLARE @payment_date DATE = GETDATE();
    
    BEGIN TRY
        -- Get bill details and validate
        SELECT 
            @customer_id = sc.customer_id,
            @outstanding_balance = b.outstanding_balance
        FROM Billing b
        INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
        WHERE b.bill_id = @bill_id;
        
        -- Check if bill exists
        IF @customer_id IS NULL
        BEGIN
            RAISERROR('Bill not found', 16, 1);
            RETURN;
        END
        
        -- Validate payment amount
        IF @payment_amount <= 0
        BEGIN
            RAISERROR('Payment amount must be greater than zero', 16, 1);
            RETURN;
        END
        
        IF @payment_amount > @outstanding_balance
        BEGIN
            RAISERROR('Payment amount exceeds outstanding balance', 16, 1);
            RETURN;
        END
        
        -- Generate unique payment number
        DECLARE @year INT = YEAR(@payment_date);
        DECLARE @sequence INT;
        
        SELECT @sequence = ISNULL(MAX(CAST(RIGHT(payment_number, 4) AS INT)), 0) + 1
        FROM Payment
        WHERE YEAR(payment_date) = @year;
        
        SET @payment_number = 'PAY-' + CAST(@year AS VARCHAR(4)) + '-' + RIGHT('0000' + CAST(@sequence AS VARCHAR(4)), 4);
        
        -- Insert the payment
        INSERT INTO Payment (
            bill_id, customer_id, payment_number, payment_date,
            payment_amount, payment_method, transaction_reference,
            received_by, payment_status
        )
        VALUES (
            @bill_id, @customer_id, @payment_number, @payment_date,
            @payment_amount, @payment_method, @transaction_reference,
            @received_by, 'Completed'
        );
        
        SET @payment_number_out = @payment_number;
        
        SELECT 
            'Payment processed successfully' AS message, 
            @payment_number AS payment_number,
            @payment_amount AS amount_paid,
            @outstanding_balance - @payment_amount AS remaining_balance;
        
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;

GO

CREATE PROCEDURE sp_GetDefaulters
    @days_overdue INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.customer_id,
        c.first_name + ' ' + c.last_name AS customer_name,
        c.customer_type,
        c.email,
        c.phone,
        c.address,
        c.city,
        COUNT(b.bill_id) AS overdue_bills_count,
        SUM(b.outstanding_balance) AS total_outstanding,
        MIN(b.due_date) AS oldest_due_date,
        MAX(DATEDIFF(day, b.due_date, GETDATE())) AS max_days_overdue,
        STRING_AGG(b.bill_number, ', ') AS bill_numbers
    FROM Customer c
    INNER JOIN Service_Connection sc ON c.customer_id = sc.customer_id
    INNER JOIN Billing b ON sc.connection_id = b.connection_id
    WHERE b.bill_status IN ('Overdue', 'Unpaid', 'Partially Paid')
      AND b.outstanding_balance > 0
      AND DATEDIFF(day, b.due_date, GETDATE()) >= @days_overdue
    GROUP BY 
        c.customer_id,
        c.first_name,
        c.last_name,
        c.customer_type,
        c.email,
        c.phone,
        c.address,
        c.city
    ORDER BY total_outstanding DESC;
END;

GO

CREATE PROCEDURE sp_BulkMeterReadingEntry
    @meter_id INT,
    @current_reading DECIMAL(10,2),
    @reading_date DATE,
    @reading_type VARCHAR(20) = 'Actual',
    @reader_id INT,
    @notes VARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @previous_reading DECIMAL(10,2);
    DECLARE @consumption DECIMAL(10,2);
    DECLARE @reading_id INT;
    
    BEGIN TRY
        -- Get the previous reading for this meter
        SELECT TOP 1 @previous_reading = current_reading
        FROM Meter_Reading
        WHERE meter_id = @meter_id
        ORDER BY reading_date DESC, reading_id DESC;
        
        -- If no previous reading found, get initial reading from meter
        IF @previous_reading IS NULL
        BEGIN
            SELECT @previous_reading = initial_reading
            FROM Meter
            WHERE meter_id = @meter_id;
        END
        
        -- Set to 0 if still null
        SET @previous_reading = ISNULL(@previous_reading, 0.00);
        
        -- Validate current reading is greater than previous
        IF @current_reading < @previous_reading
        BEGIN
            RAISERROR('Current reading cannot be less than previous reading', 16, 1);
            RETURN;
        END
        
        -- Calculate consumption
        SET @consumption = @current_reading - @previous_reading;
        
        -- Insert the meter reading
        INSERT INTO Meter_Reading (
            meter_id, reading_date, current_reading, previous_reading,
            consumption, reading_type, reader_id, notes
        )
        VALUES (
            @meter_id, @reading_date, @current_reading, @previous_reading,
            @consumption, @reading_type, @reader_id, @notes
        );
        
        -- Get the inserted reading_id
        SET @reading_id = SCOPE_IDENTITY();
        
        -- Return success message with details
        SELECT 
            'Reading recorded successfully' AS message,
            @reading_id AS reading_id,
            @meter_id AS meter_id,
            @previous_reading AS previous_reading,
            @current_reading AS current_reading,
            @consumption AS consumption;
            
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;

GO

-- Views

CREATE VIEW v_UnpaidBills AS
SELECT 
    c.customer_id,
    c.first_name + ' ' + c.last_name AS customer_name,
    c.email,
    c.phone,
    sc.connection_number,
    ut.utility_name AS utility_type,
    b.bill_id,
    b.bill_number,
    b.bill_date,
    b.due_date,
    b.total_amount,
    b.amount_paid,
    b.outstanding_balance,
    b.bill_status,
    DATEDIFF(day, b.due_date, GETDATE()) AS days_overdue,
    CASE 
        WHEN DATEDIFF(day, b.due_date, GETDATE()) > 0 THEN 'Yes'
        ELSE 'No'
    END AS is_overdue
FROM Billing b
INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
INNER JOIN Customer c ON sc.customer_id = c.customer_id
INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
WHERE b.bill_status IN ('Unpaid', 'Partially Paid', 'Overdue')
  AND b.outstanding_balance > 0;

GO

CREATE VIEW v_CustomerPaymentHistory AS
SELECT 
    c.customer_id,
    c.first_name + ' ' + c.last_name AS customer_name,
    c.email,
    c.phone,
    c.customer_type,
    p.payment_id,
    p.payment_number,
    p.payment_date,
    p.payment_amount,
    p.payment_method,
    p.transaction_reference,
    p.payment_status,
    b.bill_number,
    b.bill_date,
    b.total_amount AS bill_total,
    b.outstanding_balance AS remaining_balance,
    ut.utility_name AS utility_type,
    sc.connection_number,
    u.full_name AS received_by_staff
FROM Payment p
INNER JOIN Billing b ON p.bill_id = b.bill_id
INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
INNER JOIN Customer c ON p.customer_id = c.customer_id
INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
LEFT JOIN [User] u ON p.received_by = u.user_id;

GO

CREATE VIEW v_MonthlyRevenue AS
SELECT 
    YEAR(b.bill_date) AS year,
    MONTH(b.bill_date) AS month,
    DATENAME(month, b.bill_date) AS month_name,
    ut.utility_name AS utility_type,
    COUNT(b.bill_id) AS total_bills_generated,
    SUM(b.total_amount) AS total_billed_amount,
    SUM(b.amount_paid) AS total_collected,
    SUM(b.outstanding_balance) AS total_outstanding,
    CAST(
        CASE 
            WHEN SUM(b.total_amount) > 0 
            THEN (SUM(b.amount_paid) * 100.0 / SUM(b.total_amount))
            ELSE 0 
        END AS DECIMAL(5,2)
    ) AS collection_percentage,
    COUNT(CASE WHEN b.bill_status = 'Paid' THEN 1 END) AS bills_fully_paid,
    COUNT(CASE WHEN b.bill_status IN ('Unpaid', 'Partially Paid', 'Overdue') THEN 1 END) AS bills_outstanding
FROM Billing b
INNER JOIN Service_Connection sc ON b.connection_id = sc.connection_id
INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
GROUP BY 
    YEAR(b.bill_date),
    MONTH(b.bill_date),
    DATENAME(month, b.bill_date),
    ut.utility_name;

GO

CREATE VIEW v_ActiveConnections AS
SELECT 
    sc.connection_id,
    sc.connection_number,
    sc.connection_date,
    sc.connection_status,
    sc.property_address,
    c.customer_id,
    c.first_name + ' ' + c.last_name AS customer_name,
    c.customer_type,
    c.email,
    c.phone,
    c.city,
    ut.utility_name AS utility_type,
    ut.unit_of_measurement,
    m.meter_id,
    m.meter_number,
    m.meter_type,
    m.manufacturer,
    m.installation_date,
    m.meter_status,
    DATEDIFF(day, m.installation_date, GETDATE()) AS meter_age_days,
    (
        SELECT TOP 1 current_reading 
        FROM Meter_Reading mr 
        WHERE mr.meter_id = m.meter_id 
        ORDER BY reading_date DESC
    ) AS last_meter_reading,
    (
        SELECT TOP 1 reading_date 
        FROM Meter_Reading mr 
        WHERE mr.meter_id = m.meter_id 
        ORDER BY reading_date DESC
    ) AS last_reading_date
FROM Service_Connection sc
INNER JOIN Customer c ON sc.customer_id = c.customer_id
INNER JOIN Utility_Type ut ON sc.utility_type_id = ut.utility_type_id
LEFT JOIN Meter m ON sc.connection_id = m.connection_id AND m.meter_status = 'Active'
WHERE sc.connection_status = 'Active';

GO
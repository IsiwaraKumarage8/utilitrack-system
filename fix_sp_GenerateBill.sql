-- Drop existing procedure
DROP PROCEDURE IF EXISTS sp_GenerateBill;
GO

-- Recreate with calculated values
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

-- ==========================================
-- 1. TRIGGERS: Automated Balance Logic
-- ==========================================

-- A. On Loan Disbursement: Increase Account Balance
CREATE OR REPLACE FUNCTION fn_disburse_loan_to_account()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'ACTIVE' AND OLD.status = 'PENDING') THEN
        UPDATE accounts 
        SET balance = balance + NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE account_id = NEW.account_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_disburse_loan
AFTER UPDATE ON loans
FOR EACH ROW EXECUTE FUNCTION fn_disburse_loan_to_account();

-- B. On Repayment: Reduce Loan Principal
CREATE OR REPLACE FUNCTION fn_update_loan_after_repayment()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'SUCCESSFUL') THEN
        UPDATE loans 
        SET principal_balance = principal_balance - NEW.amount,
            total_repaid = total_repaid + NEW.amount
        WHERE loan_id = NEW.loan_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_repayment_update
AFTER INSERT OR UPDATE ON repayments
FOR EACH ROW EXECUTE FUNCTION fn_update_loan_after_repayment();

-- C. On Transaction: Check Overdraft & Update Balance
CREATE OR REPLACE FUNCTION fn_process_transaction()
RETURNS TRIGGER AS $$
DECLARE
    current_bal DECIMAL(15,2);
BEGIN
    SELECT balance INTO current_bal FROM accounts WHERE account_id = NEW.account_id FOR UPDATE;

    IF (NEW.type IN ('WITHDRAWAL', 'TRANSFER', 'PAYMENT')) THEN
        IF (current_bal < NEW.amount) THEN
            RAISE EXCEPTION 'Insufficient funds: Transaction rejected.';
        END IF;
        UPDATE accounts SET balance = balance - NEW.amount WHERE account_id = NEW.account_id;
    ELSIF (NEW.type IN ('DEPOSIT', 'INTEREST')) THEN
        UPDATE accounts SET balance = balance + NEW.amount WHERE account_id = NEW.account_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_transaction_balance
BEFORE INSERT ON transactions
FOR EACH ROW EXECUTE FUNCTION fn_process_transaction();

-- ==========================================
-- 2. STORED PROCEDURES: Business Actions
-- ==========================================

-- A. Procedure to Approve Account
CREATE OR REPLACE PROCEDURE pr_approve_account(p_account_id INT)
AS $$
BEGIN
    UPDATE accounts 
    SET status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP 
    WHERE account_id = p_account_id;
    
    INSERT INTO audit_logs(entity_type, entity_id, action, new_value)
    VALUES ('ACCOUNT', p_account_id, 'UPDATE', '{"status": "ACTIVE"}');
END;
$$ LANGUAGE plpgsql;

-- B. Procedure to Process Loan Application
CREATE OR REPLACE PROCEDURE pr_process_loan_application(
    p_loan_id INT, 
    p_decision VARCHAR(10) -- 'APPROVE' or 'REJECT'
)
AS $$
BEGIN
    IF p_decision = 'APPROVE' THEN
        UPDATE loans SET 
            status = 'ACTIVE', 
            start_date = CURRENT_TIMESTAMP,
            due_date = CURRENT_DATE + (repayment_period_months * INTERVAL '1 month')
        WHERE loan_id = p_loan_id;
    ELSE
        UPDATE loans SET status = 'REJECTED' WHERE loan_id = p_loan_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- C. Procedure for Mini-Statement (Returns a result set)
CREATE OR REPLACE FUNCTION fn_get_mini_statement(p_account_id INT, p_limit INT DEFAULT 5)
RETURNS TABLE (
    tx_date TIMESTAMP,
    tx_type transaction_type,
    tx_amount DECIMAL(15,2),
    tx_status transaction_status
) AS $$
BEGIN
    RETURN QUERY 
    SELECT timestamp, type, amount, status 
    FROM transactions 
    WHERE account_id = p_account_id 
    ORDER BY timestamp DESC 
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
USE bank_system;
-- CHECK CONSTRAINTS (MySQL 8.0.16+)

ALTER TABLE accounts 
ADD CONSTRAINT chk_accounts_balance_non_negative 
CHECK (balance >= 0.00);

ALTER TABLE transactions 
ADD CONSTRAINT chk_transactions_amount_positive 
CHECK (amount > 0.00);

ALTER TABLE loans 
ADD CONSTRAINT chk_loans_amount_positive 
CHECK (amount > 0.00);

ALTER TABLE loans 
ADD CONSTRAINT chk_loans_interest_positive 
CHECK (interest_rate >= 0.00);

ALTER TABLE loans 
ADD CONSTRAINT chk_loans_term_positive 
CHECK (repayment_period_months > 0);

ALTER TABLE repayments 
ADD CONSTRAINT chk_repayments_amount_positive 
CHECK (amount > 0.00);

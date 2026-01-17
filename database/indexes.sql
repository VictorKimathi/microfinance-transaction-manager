-- 1. USERS: Email (Unique)
-- Note: The UNIQUE constraint in the table definition usually creates this automatically.
-- If you need to ensure it explicitly or purely for performance tuning on non-constraint columns:
CREATE UNIQUE INDEX CONCURRENTLY idx_users_email ON users(email);

-- 2. ACCOUNTS: Foreign Key Performance
-- Optimizes: JOINs between Users and Accounts
CREATE INDEX CONCURRENTLY idx_accounts_user_id ON accounts(user_id);

-- 3. ACCOUNTS: Status Filtering
-- Optimizes: Queries like "SELECT * FROM accounts WHERE status = 'FROZEN'"
CREATE INDEX CONCURRENTLY idx_accounts_status ON accounts(status);

-- 4. TRANSACTIONS: Account History (Composite Index)
-- Optimizes: "Get last 30 days of transactions for Account X"
-- Order matters: We filter by account_id first (equality), then range scan by timestamp.
-- We use DESC on timestamp because we usually want the most recent transactions first.
CREATE INDEX CONCURRENTLY idx_transactions_account_dt 
ON transactions(account_id, timestamp DESC);

-- 5. LOANS: User Status (Composite Index)
-- Optimizes: "Show me all ACTIVE loans for User Y"
CREATE INDEX CONCURRENTLY idx_loans_user_status 
ON loans(user_id, status);

-- 6. REPAYMENTS: Loan History (Composite Index)
-- Optimizes: "List all repayments for Loan Z sorted by date"
CREATE INDEX CONCURRENTLY idx_repayments_loan_dt 
ON repayments(loan_id, timestamp DESC);
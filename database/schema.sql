-- 1. Create ENUM Types first to enforce data integrity
CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED', 'PENDING');
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN', 'SUPPORT', 'AUDITOR');
CREATE TYPE account_type AS ENUM ('SAVINGS', 'CHECKING', 'CREDIT', 'INVESTMENT');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'FROZEN', 'CLOSED');
CREATE TYPE transaction_type AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT', 'INTEREST');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE loan_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'PAID_OFF', 'DEFAULTED');
CREATE TYPE repayment_method AS ENUM ('BANK_TRANSFER', 'CARD', 'CASH', 'MOBILE_MONEY');
CREATE TYPE repayment_status AS ENUM ('PENDING', 'SUCCESSFUL', 'FAILED');
CREATE TYPE notification_type AS ENUM ('INFO', 'WARNING', 'ALERT', 'PROMOTION');
CREATE TYPE notification_status AS ENUM ('UNREAD', 'READ', 'ARCHIVED');
CREATE TYPE audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT');

-- 2. USERS Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status user_status DEFAULT 'PENDING',
    role user_role DEFAULT 'CUSTOMER',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ACCOUNTS Table
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    account_type account_type NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    status account_status DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. TRANSACTIONS Table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    type transaction_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255),
    status transaction_status DEFAULT 'PENDING',
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- 5. LOANS Table
CREATE TABLE loans (
    loan_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    account_id INT NOT NULL, -- The account associated with disbursement/payment
    amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL, -- e.g., 5.50 for 5.5%
    repayment_period_months INT NOT NULL,
    status loan_status DEFAULT 'PENDING',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_date TIMESTAMP,
    due_date DATE,
    principal_balance DECIMAL(15, 2) NOT NULL,
    total_repaid DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_loans_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_loans_account FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- 6. REPAYMENTS Table
CREATE TABLE repayments (
    repayment_id SERIAL PRIMARY KEY,
    loan_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method repayment_method NOT NULL,
    reference VARCHAR(100),
    status repayment_status DEFAULT 'PENDING',
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_repayments_loan FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
);

-- 7. NOTIFICATIONS Table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type notification_type NOT NULL,
    message TEXT NOT NULL,
    status notification_status DEFAULT 'UNREAD',
    related_id INT, -- Generic ID pointing to a transaction, loan, etc.
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 8. AUDIT_LOGS Table
CREATE TABLE audit_logs (
    audit_id SERIAL PRIMARY KEY,
    user_id INT, -- Nullable because a system action might not have a user, or user was deleted
    entity_type VARCHAR(50) NOT NULL, -- e.g., 'LOAN', 'ACCOUNT'
    entity_id INT NOT NULL,
    action audit_action NOT NULL,
    old_value JSONB, -- JSONB is faster for querying/indexing than standard JSON
    new_value JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 9. Create Indexes for Performance (Best Practice)
CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_loans_user ON loans(user_id);
CREATE INDEX idx_loans_account ON loans(account_id);
CREATE INDEX idx_repayments_loan ON repayments(loan_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
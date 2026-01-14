

---

# **Microfinance Transaction Manager – Database Schema**

**Author:** Victor Kimathi  
**Date:** 14 January 2026

---

## **1. Overview**

The database is designed to handle **users, accounts, transactions, loans, and repayments** for a microfinance system.  
It enforces relational integrity, tracks workflows, and supports queries for mini-statements and loan balances.

---

## **2. Tables & Relationships**

### **2.1 Users**

Stores client and admin information.

|Column|Type|Constraints|Description|
|---|---|---|---|
|user_id|BIGINT|PK, Auto Increment|Unique identifier|
|name|VARCHAR(100)|NOT NULL|Full name of the user|
|email|VARCHAR(100)|NOT NULL, UNIQUE|User email|
|phone|VARCHAR(20)|NOT NULL, UNIQUE|Contact number|
|password_hash|VARCHAR(255)|NOT NULL|Hashed password|
|role|VARCHAR(20)|NOT NULL, DEFAULT 'client'|User role: client/admin|
|registration_date|TIMESTAMP|DEFAULT CURRENT_TIMESTAMP|Account registration date|
|status|VARCHAR(20)|DEFAULT 'PENDING'|Account status (Pending/Active/Suspended)|

---

### **2.2 Accounts**

Tracks balances for each user.

|Column|Type|Constraints|Description|
|---|---|---|---|
|account_id|BIGINT|PK, Auto Increment|Unique account ID|
|user_id|BIGINT|FK → Users(user_id)|Owner of the account|
|balance|DECIMAL(15,2)|DEFAULT 0.00|Current account balance|
|account_type|VARCHAR(50)|NOT NULL|e.g., Savings, Checking|
|status|VARCHAR(20)|DEFAULT 'ACTIVE'|Active / Suspended / Closed|
|created_at|TIMESTAMP|DEFAULT CURRENT_TIMESTAMP|Account creation date|

---

### **2.3 Transactions**

Logs deposits, withdrawals, and repayments.

|Column|Type|Constraints|Description|
|---|---|---|---|
|transaction_id|BIGINT|PK, Auto Increment|Unique transaction ID|
|account_id|BIGINT|FK → Accounts(account_id)|Account involved|
|type|VARCHAR(50)|NOT NULL|Deposit, Withdrawal, Repayment|
|amount|DECIMAL(15,2)|NOT NULL|Transaction amount|
|timestamp|TIMESTAMP|DEFAULT CURRENT_TIMESTAMP|Transaction time|
|description|VARCHAR(255)|NULL|Optional description|

---

### **2.4 Loans**

Tracks loans requested and granted to clients.

|Column|Type|Constraints|Description|
|---|---|---|---|
|loan_id|BIGINT|PK, Auto Increment|Unique loan ID|
|user_id|BIGINT|FK → Users(user_id)|Borrower|
|amount|DECIMAL(15,2)|NOT NULL|Loan principal|
|interest_rate|DECIMAL(5,2)|NOT NULL|Annual interest rate (%)|
|start_date|DATE|NOT NULL|Loan start date|
|due_date|DATE|NOT NULL|Loan due date|
|status|VARCHAR(20)|DEFAULT 'PENDING'|Pending / Approved / Repaid / Defaulted|

---

### **2.5 Repayments**

Logs payments made toward loans.

|Column|Type|Constraints|Description|
|---|---|---|---|
|repayment_id|BIGINT|PK, Auto Increment|Unique repayment ID|
|loan_id|BIGINT|FK → Loans(loan_id)|Loan being repaid|
|amount|DECIMAL(15,2)|NOT NULL|Payment amount|
|timestamp|TIMESTAMP|DEFAULT CURRENT_TIMESTAMP|Payment date/time|
|method|VARCHAR(50)|NULL|e.g., Cash, Bank Transfer|

---

## **3. Relationships**

- **Users → Accounts:** One-to-Many
    
- **Accounts → Transactions:** One-to-Many
    
- **Users → Loans:** One-to-Many
    
- **Loans → Repayments:** One-to-Many
    

---

## **4. Indexing & Constraints**

- **Primary Keys:** `user_id`, `account_id`, `transaction_id`, `loan_id`, `repayment_id`
    
- **Foreign Keys:**
    
    - `Accounts.user_id → Users.user_id`
        
    - `Transactions.account_id → Accounts.account_id`
        
    - `Loans.user_id → Users.user_id`
        
    - `Repayments.loan_id → Loans.loan_id`
        
- **Unique Constraints:** `Users.email`, `Users.phone`
    
- **Status Tracking:** `Users.status`, `Accounts.status`, `Loans.status`
    

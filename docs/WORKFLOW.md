# **Microfinance Transaction Manager – Complete Workflow Documentation**

**Author:** Victor Kimathi  
**Date:** 14 January 2026  
**Version:** 2.0 (Updated with Complete API Endpoints)

---

## **1. Overview**

This document explains the **complete workflows** of the Microfinance Transaction Manager system, including all interactions between users, accounts, transactions, loans, repayments, and notifications.

**Core Workflows Covered:**

- User registration and approval
- Account creation and management
- Loan requests, approvals, and disbursement
- Transactions (deposits, withdrawals, transfers)
- Repayment tracking and management
- Notifications and alerts
- Mini-statements and reporting
- Admin dashboard operations

**Key Principles:**

- **Data Integrity:** Foreign keys and constraints prevent orphaned records
- **Auditability:** All transactions logged with timestamps
- **Authorization:** Role-based access control enforced at each step
- **Automation:** Database triggers handle balance updates
- **Workflow Status:** All entities track their current state

---

## **2. User Registration & Approval Workflow**

**Actors:** New Client (Public), Existing Client, Admin

**Related Endpoints:**

- `POST /auth/register` – Client registers
- `GET /users` – Admin retrieves pending users
- `GET /users/{userId}` – View user profile
- `PUT /users/{userId}/approve` – Admin approves user
- `PUT /users/{userId}/suspend` – Admin suspends user
- `PUT /users/{userId}` – Update user profile

**Workflow Steps:**

### **Step 1: Client Registration**

```
Client accesses registration form on React frontend
  ↓
Enters: Name, Email, Phone, Password
  ↓
Frontend validates input (email format, password strength)
  ↓
POST /auth/register
  ↓
Backend validates:
  - Email uniqueness
  - Phone format
  - Password strength
  ↓
User created in database with status = "PENDING"
  ↓
Response: userId, name, email, status: "PENDING"
```

**Request Example:**

```json
POST /auth/register
{
  "name": "Alice Kimathi",
  "email": "alice@example.com",
  "phone": "+254712345678",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**

```json
{
  "userId": 1,
  "name": "Alice Kimathi",
  "email": "alice@example.com",
  "phone": "+254712345678",
  "status": "PENDING",
  "role": "client",
  "registrationDate": "2026-01-14T10:00:00"
}
```

### **Step 2: Admin Reviews Pending Users**

```
Admin logs in with admin credentials
  ↓
POST /auth/login with admin email/password
  ↓
Backend validates credentials
  ↓
Returns JWT token with role = "admin"
  ↓
Admin accesses dashboard
  ↓
GET /users?status=PENDING&limit=10
  ↓
System retrieves all pending user registrations
  ↓
Admin dashboard displays list
```

**Request:**

```
GET /users?status=PENDING&limit=10&page=1
Authorization: Bearer <JWT_ADMIN_TOKEN>
```

**Response:**

```json
{
  "total": 3,
  "page": 1,
  "limit": 10,
  "users": [
    {
      "userId": 1,
      "name": "Alice Kimathi",
      "email": "alice@example.com",
      "status": "PENDING",
      "registrationDate": "2026-01-14T10:00:00"
    },
    {
      "userId": 2,
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "status": "PENDING",
      "registrationDate": "2026-01-14T11:00:00"
    }
  ]
}
```

### **Step 3: Admin Approves User**

```
Admin reviews Alice's registration details
  ↓
Admin clicks "Approve" button
  ↓
PUT /users/{userId}/approve
  ↓
Backend validates:
  - Admin role confirmed
  - User status is "PENDING"
  ↓
User status updated to "ACTIVE"
  ↓
Database trigger creates notification
  ↓
Response confirms approval
```

**Request:**

```
PUT /users/1/approve
Authorization: Bearer <JWT_ADMIN_TOKEN>
{
  "status": "ACTIVE"
}
```

**Response (200 OK):**

```json
{
  "message": "User approved successfully",
  "userId": 1,
  "status": "ACTIVE",
  "notificationSent": true,
  "notificationId": 1
}
```

### **Step 4: Client Receives Notification**

```
Database trigger fires on user approval
  ↓
Notification record created:
  - Type: "ACCOUNT_APPROVED"
  - Message: "Your account has been approved"
  - Status: "UNREAD"
  ↓
Frontend polls GET /notifications/user/{userId}
  ↓
Client sees notification in UI
  ↓
Optional: Email sent via async job
```

**GET Notification:**

```
GET /notifications/user/1?status=UNREAD
Authorization: Bearer <JWT_CLIENT_TOKEN>
```

**Response:**

```json
[
  {
    "notificationId": 1,
    "userId": 1,
    "type": "ACCOUNT_APPROVED",
    "message": "Your account has been approved and is now active",
    "sentAt": "2026-01-14T10:30:00",
    "status": "UNREAD",
    "relatedId": 1
  }
]
```

### **Step 5: Client Updates Profile (Optional)**

```
Client logs in with email and password
  ↓
POST /auth/login
  ↓
Backend verifies credentials
  ↓
Validates status = "ACTIVE"
  ↓
Returns JWT token
  ↓
Client can now update profile
  ↓
PUT /users/{userId}
```

**Request:**

```
PUT /users/1
Authorization: Bearer <JWT_CLIENT_TOKEN>
{
  "name": "Alice Marie Kimathi",
  "phone": "+254712345679"
}
```

---

## **3. Account Creation & Management Workflow**

**Actors:** Admin, Client

**Related Endpoints:**

- `POST /accounts` – Admin creates account
- `GET /accounts/user/{userId}` – Client views accounts
- `GET /accounts/{accountId}` – View account details
- `PUT /accounts/{accountId}` – Admin updates account status
- `DELETE /accounts/{accountId}` – Close account

**Workflow Steps:**

### **Step 1: Admin Creates Account**

```
Admin navigates to account management
  ↓
Selects approved user (status = "ACTIVE")
  ↓
Chooses account type (SAVINGS, CURRENT, etc.)
  ↓
POST /accounts
  ↓
Backend validates:
  - User exists and is ACTIVE
  - Account type valid
  ↓
Account created with:
  - balance = 0.0
  - status = "ACTIVE"
  - created_at = now
  ↓
Response returns accountId, balance, status
```

**Request:**

```
POST /accounts
Authorization: Bearer <JWT_ADMIN_TOKEN>
{
  "userId": 1,
  "accountType": "SAVINGS"
}
```

**Response (201 Created):**

```json
{
  "accountId": 1,
  "userId": 1,
  "balance": 0.0,
  "accountType": "SAVINGS",
  "status": "ACTIVE",
  "createdAt": "2026-01-14T10:30:00"
}
```

### **Step 2: Client Views Accounts**

```
Client logs in successfully
  ↓
Dashboard loads
  ↓
GET /accounts/user/{userId}
  ↓
Backend retrieves all accounts for user
  ↓
Frontend displays account list
```

**Request:**

```
GET /accounts/user/1
Authorization: Bearer <JWT_CLIENT_TOKEN>
```

**Response:**

```json
[
  {
    "accountId": 1,
    "userId": 1,
    "balance": 0.0,
    "accountType": "SAVINGS",
    "status": "ACTIVE",
    "createdAt": "2026-01-14T10:30:00"
  },
  {
    "accountId": 2,
    "userId": 1,
    "balance": 2500.0,
    "accountType": "CURRENT",
    "status": "ACTIVE",
    "createdAt": "2026-01-14T11:00:00"
  }
]
```

### **Step 3: Client Views Account Details**

```
Client clicks on specific account
  ↓
GET /accounts/{accountId}
  ↓
Backend retrieves account with balance, status, metadata
  ↓
Frontend displays:
  - Current balance
  - Account type
  - Status
  - Last transaction date
```

**Request:**

```
GET /accounts/1
Authorization: Bearer <JWT_CLIENT_TOKEN>
```

**Response:**

```json
{
  "accountId": 1,
  "userId": 1,
  "balance": 500.0,
  "accountType": "SAVINGS",
  "status": "ACTIVE",
  "createdAt": "2026-01-14T10:30:00",
  "lastTransactionDate": "2026-01-14T13:00:00"
}
```

### **Step 4: Admin Suspends Account (If Needed)**

```
Admin detects suspicious activity
  ↓
Admin navigates to account management
  ↓
PUT /accounts/{accountId}
  ↓
Backend validates admin role
  ↓
Account status updated to "SUSPENDED"
  ↓
Client can no longer make transactions
  ↓
Notification sent to client
```

**Request:**

```
PUT /accounts/1
Authorization: Bearer <JWT_ADMIN_TOKEN>
{
  "status": "SUSPENDED"
}
```

---

## **4. Loan Request & Approval Workflow**

**Actors:** Client, Admin

**Related Endpoints:**

- `POST /loans` – Client requests loan
- `GET /loans/user/{userId}` – View client's loans
- `GET /loans/{loanId}` – View loan details
- `PUT /loans/{loanId}/approve` – Admin approves
- `PUT /loans/{loanId}/reject` – Admin rejects
- `POST /loans/{loanId}/disburse` – Admin disburses funds

**Workflow Steps:**

### **Step 1: Client Requests Loan**

```
Client navigates to Loan Request page
  ↓
Enters: Loan amount, repayment period, interest rate
  ↓
Frontend validates:
  - Amount > 0
  - Period valid (6-60 months)
  ↓
POST /loans
  ↓
Backend validates:
  - User status = "ACTIVE"
  - User has active account
  - Loan amount reasonable
  ↓
Loan created with:
  - status = "PENDING"
  - request_date = now
  - start_date = null
  - due_date = null
  ↓
Response returns loanId, status, amount
```

**Request:**

```
POST /loans
Authorization: Bearer <JWT_CLIENT_TOKEN>
{
  "userId": 1,
  "amount": 5000.0,
  "interestRate": 0.05,
  "repaymentPeriodMonths": 12
}
```

**Response (201 Created):**

```json
{
  "loanId": 1,
  "userId": 1,
  "amount": 5000.0,
  "interestRate": 0.05,
  "repaymentPeriodMonths": 12,
  "status": "PENDING",
  "requestDate": "2026-01-14T14:00:00",
  "startDate": null,
  "dueDate": null
}
```

### **Step 2: Admin Reviews Pending Loans**

```
Admin accesses Admin Dashboard
  ↓
GET /loans (filtered by status=PENDING)
  ↓
Backend retrieves all pending loans with user info
  ↓
Admin dashboard displays:
  - Loan amount
  - User details
  - Requested date
  - Repayment period
  ↓
Admin reviews eligibility criteria:
  - Account balance history
  - Previous loan repayment history
  - Credit risk assessment
```

**Request:**

```
GET /loans?status=PENDING&limit=20
Authorization: Bearer <JWT_ADMIN_TOKEN>
```

### **Step 3: Admin Approves Loan**

```
Admin reviews Alice's loan request for KES 5000
  ↓
Admin determines: Approve
  ↓
PUT /loans/{loanId}/approve
  ↓
Backend validates:
  - Admin role confirmed
  - Loan status = "PENDING"
  ↓
Loan status updated to "APPROVED"
Loan.start_date = today
Loan.due_date = today + (12 months)
  ↓
Notification created:
  - Type: "LOAN_APPROVED"
  - Message: "Your loan for KES 5000 has been approved"
  ↓
Response confirms approval
```

**Request:**

```
PUT /loans/1/approve
Authorization: Bearer <JWT_ADMIN_TOKEN>
{
  "approvedAmount": 5000.0,
  "approvalNotes": "Approved based on credit history and account standing"
}
```

**Response (200 OK):**

```json
{
  "loanId": 1,
  "status": "APPROVED",
  "approvedAmount": 5000.0,
  "startDate": "2026-01-14T14:30:00",
  "dueDate": "2027-01-14",
  "notificationSent": true,
  "notificationId": 2
}
```

### **Step 4: Loan Disbursement**

```
Admin reviews approved loan
  ↓
Confirms client's account to disburse to
  ↓
POST /loans/{loanId}/disburse
  ↓
Backend validates:
  - Admin role confirmed
  - Loan status = "APPROVED"
  - Target account exists and is ACTIVE
  ↓
Database transaction begins:
  - Loan status → "DISBURSED"
  - Loan.disbursement_date = now
  ↓
Transaction created:
  - account_id = target account
  - type = "LOAN_DISBURSEMENT"
  - amount = 5000.0
  ↓
Account balance updated:
  - OLD: 0.0
  - NEW: 5000.0 (via database trigger)
  ↓
Transaction committed
  ↓
Notification sent to client
  ↓
Response confirms disbursement
```

**Request:**

```
POST /loans/1/disburse
Authorization: Bearer <JWT_ADMIN_TOKEN>
{
  "accountId": 1
}
```

**Response (200 OK):**

```json
{
  "loanId": 1,
  "status": "DISBURSED",
  "disburseDate": "2026-01-14T15:00:00",
  "disburseAmount": 5000.0,
  "accountId": 1,
  "accountNewBalance": 5000.0,
  "notificationSent": true
}
```

### **Step 5: Admin Rejects Loan (Alternative)**

```
Admin reviews loan and determines: Reject
  ↓
PUT /loans/{loanId}/reject
  ↓
Backend validates:
  - Admin role
  - Loan status = "PENDING"
  ↓
Loan status updated to "REJECTED"
  ↓
Rejection reason stored
  ↓
Notification created:
  - Type: "LOAN_REJECTED"
  - Message: "Your loan request could not be approved at this time"
  ↓
Client receives notification
```

**Request:**

```
PUT /loans/1/reject
Authorization: Bearer <JWT_ADMIN_TOKEN>
{
  "rejectionReason": "Insufficient credit score and account history"
}
```

---

## **5. Deposit & Withdrawal Workflow**

**Actors:** Client, Admin

**Related Endpoints:**

- `POST /transactions` – Create transaction (deposit/withdrawal)
- `GET /transactions/account/{accountId}` – View transaction history
- `GET /transactions/{transactionId}` – View single transaction
- `PUT /transactions/{transactionId}` – Update transaction status
- `DELETE /transactions/{transactionId}` – Reverse transaction

**Workflow Steps:**

### **Step 1: Client Makes Deposit**

```
Client navigates to Deposit page
  ↓
Enters: Account (from dropdown), Amount, Description
  ↓
Frontend validates:
  - Amount > 0
  - Amount ≤ maximum allowed
  ↓
POST /transactions
  ↓
Backend validates:
  - Account exists
  - Account status = "ACTIVE"
  - Amount > 0
  ↓
Database transaction begins:
  - Transaction record created with status = "INITIATED"
  - type = "DEPOSIT"
  ↓
Account balance updated:
  - OLD: X
  - NEW: X + amount (via trigger)
  ↓
Transaction status → "COMPLETED"
  ↓
Transaction committed
  ↓
Response returns transactionId, new balance
```

**Request:**

```
POST /transactions
Authorization: Bearer <JWT_CLIENT_TOKEN>
{
  "accountId": 1,
  "type": "DEPOSIT",
  "amount": 1000.0,
  "description": "Salary deposit"
}
```

**Response (201 Created):**

```json
{
  "transactionId": 1,
  "accountId": 1,
  "type": "DEPOSIT",
  "amount": 1000.0,
  "timestamp": "2026-01-14T16:00:00",
  "description": "Salary deposit",
  "status": "COMPLETED",
  "referenceNumber": "TXN20260114001",
  "newBalance": 1000.0
}
```

### **Step 2: Client Makes Withdrawal**

```
Client navigates to Withdrawal page
  ↓
Enters: Account, Amount, Description
  ↓
Frontend validates input
  ↓
POST /transactions
  ↓
Backend validates:
  - Account status = "ACTIVE"
  - Amount > 0
  ↓
CRITICAL CHECK:
  - Current balance ≥ amount (NO OVERDRAFTS)
  ↓
If balance insufficient:
  - Response 400: "Insufficient balance"
  - Transaction NOT created
  ↓
If balance sufficient:
  - Database transaction begins
  - Transaction record created
  - Account balance updated:
    OLD: X
    NEW: X - amount (via trigger)
  - Transaction status → "COMPLETED"
  ↓
Response returns transactionId, new balance
```

**Request:**

```
POST /transactions
Authorization: Bearer <JWT_CLIENT_TOKEN>
{
  "accountId": 1,
  "type": "WITHDRAWAL",
  "amount": 200.0,
  "description": "Grocery shopping"
}
```

**Response (201 Created):**

```json
{
  "transactionId": 2,
  "accountId": 1,
  "type": "WITHDRAWAL",
  "amount": 200.0,
  "timestamp": "2026-01-14T16:30:00",
  "description": "Grocery shopping",
  "status": "COMPLETED",
  "referenceNumber": "TXN20260114002",
  "newBalance": 800.0
}
```

**Error Response (Insufficient Balance):**

```json
{
  "timestamp": "2026-01-14T16:45:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Insufficient balance. Current: 500.00, Requested: 600.00",
  "path": "/transactions"
}
```

### **Step 3: Client Views Transaction History**

```
Client clicks on account
  ↓
GET /transactions/account/{accountId}
  ↓
Backend retrieves all transactions for account
  ↓
Sorted by timestamp (newest first)
  ↓
Response returns transaction array
  ↓
Frontend displays in table/list format
```

**Request:**

```
GET /transactions/account/1?page=1&limit=20
Authorization: Bearer <JWT_CLIENT_TOKEN>
```

**Response:**

```json
[
  {
    "transactionId": 2,
    "accountId": 1,
    "type": "WITHDRAWAL",
    "amount": 200.0,
    "timestamp": "2026-01-14T16:30:00",
    "description": "Grocery shopping",
    "status": "COMPLETED"
  },
  {
    "transactionId": 1,
    "accountId": 1,
    "type": "DEPOSIT",
    "amount": 1000.0,
    "timestamp": "2026-01-14T16:00:00",
    "description": "Salary deposit",
    "status": "COMPLETED"
  }
]
```

### **Step 4: Admin Reverses Transaction (If Needed)**

```
Admin detects erroneous transaction
  ↓
Locates transaction in system
  ↓
DELETE /transactions/{transactionId}
  ↓
Backend validates:
  - Admin role confirmed
  - Transaction status = "COMPLETED"
  ↓
Database transaction begins:
  - Original transaction status → "REVERSED"
  - Reverse transaction created (opposite amount)
  - Account balance restored:
    IF original was WITHDRAWAL: balance += amount
    IF original was DEPOSIT: balance -= amount
  ↓
Both transactions linked
  ↓
Audit log created
  ↓
Notification sent to client
```

**Request:**

```
DELETE /transactions/1
Authorization: Bearer <JWT_ADMIN_TOKEN>
```

**Response:**

```json
{
  "message": "Transaction reversed successfully",
  "transactionId": 1,
  "originalAmount": 1000.0,
  "refundedAmount": 1000.0,
  "reverseTransactionId": 3
}
```

---

## **6. Loan Repayment Workflow**

**Actors:** Client, Admin

**Related Endpoints:**

- `POST /repayments` – Make repayment
- `GET /repayments/loan/{loanId}` – View repayment history
- `GET /repayments/{repaymentId}` – View single repayment
- `PUT /repayments/{repaymentId}` – Update repayment status
- `DELETE /repayments/{repaymentId}` – Reverse repayment

**Workflow Steps:**

### **Step 1: Client Views Loan Details**

```
Client navigates to Loans page
  ↓
GET /loans/user/{userId}
  ↓
Backend retrieves all loans for user
  ↓
Frontend displays loan list with:
  - Loan amount
  - Interest rate
  - Status
  - Start date
  - Due date
  ↓
Client clicks on specific loan
  ↓
GET /loans/{loanId}
  ↓
Response includes:
  - Principal balance remaining
  - Interest accrued
  - Total repaid
  - Repayment schedule
```

**Request:**

```
GET /loans/1
Authorization: Bearer <JWT_CLIENT_TOKEN>
```

**Response:**

```json
{
  "loanId": 1,
  "userId": 1,
  "amount": 5000.0,
  "interestRate": 0.05,
  "repaymentPeriodMonths": 12,
  "status": "DISBURSED",
  "requestDate": "2026-01-14T14:00:00",
  "startDate": "2026-01-14T15:00:00",
  "dueDate": "2027-01-14",
  "principalBalance": 5000.0,
  "totalRepaid": 0.0,
  "interestAccrued": 20.83
}
```

### **Step 2: Client Makes Repayment**

```
Client navigates to Make Repayment page
  ↓
Selects loan from dropdown
  ↓
System calculates:
  - Principal balance
  - Interest accrued
  - Total amount due
  ↓
Client enters:
  - Repayment amount
  - Payment method (BANK_TRANSFER, CASH, MOBILE_MONEY)
  - Reference number (optional)
  ↓
Frontend validates:
  - Amount > 0
  - Amount ≤ remaining balance + interest
  ↓
POST /repayments
  ↓
Backend validates:
  - Loan exists and status = "DISBURSED"
  - Client owns loan
  - Amount valid
  ↓
Database transaction begins:
  - Repayment record created with status = "COMPLETED"
  - Loan.principal_balance reduced
  - Loan.total_repaid increased
  ↓
Check if loan fully repaid:
  - IF principal_balance = 0:
    - Loan status → "COMPLETED"
  - ELSE:
    - Loan status → "REPAYING"
  ↓
Transaction created (for audit):
  - type = "REPAYMENT"
  - accountId = client's account
  - amount = repayment amount
  ↓
Database committed
  ↓
Response confirms repayment
```

**Request:**

```
POST /repayments
Authorization: Bearer <JWT_CLIENT_TOKEN>
{
  "loanId": 1,
  "amount": 500.0,
  "method": "BANK_TRANSFER",
  "reference": "TRF20260115001"
}
```

**Response (201 Created):**

```json
{
  "repaymentId": 1,
  "loanId": 1,
  "amount": 500.0,
  "timestamp": "2026-01-15T09:00:00",
  "method": "BANK_TRANSFER",
  "reference": "TRF20260115001",
  "status": "COMPLETED",
  "receiptNumber": "RCP20260115001",
  "remainingBalance": 4500.0,
  "loanStatus": "REPAYING"
}
```

### **Step 3: Client Views Repayment History**

```
Client clicks on loan
  ↓
GET /repayments/loan/{loanId}
  ↓
Backend retrieves all repayments for loan
  ↓
Sorted by date (newest first)
  ↓
Response returns repayment array
  ↓
Frontend displays repayment schedule
```

**Request:**

```
GET /repayments/loan/1?page=1&limit=10
Authorization: Bearer <JWT_CLIENT_TOKEN>
```

**Response:**

```json
[
  {
    "repaymentId": 1,
    "loanId": 1,
    "amount": 500.0,
    "timestamp": "2026-01-15T09:00:00",
    "method": "BANK_TRANSFER",
    "reference": "TRF20260115001",
    "status": "COMPLETED"
  }
]
```

### **Step 4: Admin Reverses Repayment (If Needed)**

```
Admin detects duplicate repayment
  ↓
DELETE /repayments/{repaymentId}
  ↓
Backend validates:
  - Admin role confirmed
  - Repayment status = "COMPLETED"
  ↓
Database transaction begins:
  - Repayment status → "REVERSED"
  - Loan.principal_balance restored
  - Loan.total_repaid reduced
  - Loan status recalculated
  - Reverse transaction created
  ↓
Audit log created
  ↓
Notification sent to client
```

---

## **7. Mini-Statement & Reporting Workflow**

**Actors:** Client, Admin

**Related Endpoints:**

- `GET /reports/statement/account/{accountId}` – Account statement
- `GET /reports/statement/loan/{loanId}` – Loan statement
- `GET /reports/dashboard/{userId}` – User dashboard summary
- `GET /reports/admin/dashboard` – Admin dashboard summary

**Workflow Steps:**

### **Step 1: Client Views Account Mini-Statement**

```
Client navigates to Statements page
  ↓
Selects account from dropdown
  ↓
Optionally filters by date range
  ↓
GET /reports/statement/account/{accountId}
  ↓
Backend queries:
  - Account details
  - All transactions for account
  - Transactions for date range (if provided)
  ↓
Calculation:
  - Opening balance (beginning of period)
  - All debits (withdrawals)
  - All credits (deposits)
  - Closing balance (end of period)
  ↓
Response returns formatted statement with:
  - Account info
  - Period covered
  - Opening/Closing balance
  - Transaction list
  - Totals (deposits, withdrawals)
  ↓
Frontend displays mini-statement
```

**Request:**

```
GET /reports/statement/account/1?startDate=2026-01-01&endDate=2026-01-31&format=json
Authorization: Bearer <JWT_CLIENT_TOKEN>
```

**Response:**

```json
{
  "accountId": 1,
  "accountType": "SAVINGS",
  "statementPeriod": "2026-01-01 to 2026-01-31",
  "openingBalance": 0.0,
  "closingBalance": 4300.0,
  "totalDeposits": 5000.0,
  "totalWithdrawals": 700.0,
  "transactionCount": 3,
  "transactions": [
    {
      "date": "2026-01-15T16:30:00",
      "description": "Grocery shopping",
      "debit": 200.0,
      "credit": null,
      "balance": 4800.0
    },
    {
      "date": "2026-01-14T16:00:00",
      "description": "Salary deposit",
      "debit": null,
      "credit": 5000.0,
      "balance": 5000.0
    }
  ]
}
```

### **Step 2: Client Views Loan Statement**

```
Client navigates to Loan Statements
  ↓
Selects loan from dropdown
  ↓
GET /reports/statement/loan/{loanId}
  ↓
Backend queries:
  - Loan details
  - All repayments for loan
  - Calculate remaining balance
  ↓
Response returns:
  - Original loan amount
  - Interest rate
  - Disbursement date
  - Due date
  - Principal repaid
  - Principal balance
  - Interest accrued
  - All repayments
  ↓
Frontend displays loan statement
```

**Request:**

```
GET /reports/statement/loan/1?format=json
Authorization: Bearer <JWT_CLIENT_TOKEN>
```

**Response:**

```json
{
  "loanId": 1,
  "userId": 1,
  "loanAmount": 5000.0,
  "interestRate": 0.05,
  "disburseDate": "2026-01-14",
  "dueDate": "2027-01-14",
  "principalRepaid": 500.0,
  "principalBalance": 4500.0,
  "interestAccrued": 125.0,
  "totalRepaid": 500.0,
  "status": "REPAYING",
  "repayments": [
    {
      "date": "2026-01-15T09:00:00",
      "amount": 500.0,
      "method": "BANK_TRANSFER"
    }
  ]
}
```

### **Step 3: Admin Views Dashboard Summary**

```
Admin logs in
  ↓
GET /reports/admin/dashboard
  ↓
Backend calculates:
  - Total users (ACTIVE, PENDING, SUSPENDED)
  - Pending user approvals
  - Pending loan approvals
  - Total loan disbursements today
  - Recent transactions
  - System health metrics
  ↓
Response returns summary
  ↓
Frontend displays admin dashboard
```

**Request:**

```
GET /reports/admin/dashboard
Authorization: Bearer <JWT_ADMIN_TOKEN>
```

**Response:**

```json
{
  "totalUsers": 25,
  "usersByStatus": {
    "ACTIVE": 20,
    "PENDING": 3,
    "SUSPENDED": 2
  },
  "pendingApprovals": {
    "users": 3,
    "loans": 5
  },
  "loansToday": {
    "requested": 2,
    "approved": 1,
    "disbursed": 1
  },
  "totalDisbursed": 15000.0,
  "recentTransactions": [
    {
      "transactionId": 5,
      "type": "WITHDRAWAL",
      "amount": 200.0,
      "timestamp": "2026-01-15T09:00:00"
    }
  ]
}
```

---

## **8. Notification Management Workflow**

**Actors:** System (Automatic), Admin (Manual), Client

**Related Endpoints:**

- `GET /notifications/user/{userId}` – Get user notifications
- `GET /notifications/{notificationId}` – View single notification
- `POST /notifications` – Create manual notification (Admin)
- `PUT /notifications/{notificationId}` – Mark as read
- `DELETE /notifications/{notificationId}` – Delete notification

**Notification Types:**

|Type|Trigger|Message|
|---|---|---|
|ACCOUNT_APPROVED|User approval|"Your account has been approved"|
|ACCOUNT_SUSPENDED|Admin action|"Your account has been suspended"|
|LOAN_APPROVED|Loan approval|"Your loan has been approved"|
|LOAN_REJECTED|Loan rejection|"Your loan request was rejected"|
|LOAN_DISBURSED|Disbursement|"Funds have been deposited"|
|REPAYMENT_RECEIVED|Repayment|"Repayment received"|
|DEPOSIT_RECEIVED|Deposit|"Deposit of X received"|
|WITHDRAWAL_COMPLETED|Withdrawal|"Withdrawal of X completed"|
|CUSTOM|Admin message|(custom)|

**Workflow Steps:**

### **Step 1: System Creates Automatic Notification**

```
Event occurs:
  - User approved
  - Loan approved
  - Loan disbursed
  - Repayment received
  ↓
Database trigger fires
  ↓
Notification record created with:
  - userId (recipient)
  - type (ACCOUNT_APPROVED, etc.)
  - message (auto-generated)
  - status = "UNREAD"
  - sentAt = now
  - relatedId = entity ID (userId, loanId, etc.)
  ↓
Async job (optional):
  - Send email to client
  - Send SMS notification
  ↓
Notification stored
```

### **Step 2: Client Views Notifications**

```
Client opens notification center
  ↓
GET /notifications/user/{userId}?status=UNREAD
  ↓
Backend retrieves unread notifications
  ↓
Sorted by sentAt (newest first)
  ↓
Response returns notification array
  ↓
Frontend displays notifications
```

**Request:**

```
GET /notifications/user/1?status=UNREAD&limit=10
Authorization: Bearer <JWT_CLIENT_TOKEN>
```

**Response:**

```json
[
  {
    "notificationId": 3,
    "userId": 1,
    "type": "LOAN_APPROVED",
    "message": "Your loan request for KES 5000 has been approved",
    "sentAt": "2026-01-14T15:00:00",
    "status": "UNREAD",
    "relatedId": 1
  },
  {
    "notificationId": 1,
    "userId": 1,
    "type": "ACCOUNT_APPROVED",
    "message": "Your account has been approved and is now active",
    "sentAt": "2026-01-14T10:30:00",
    "status": "READ",
    "relatedId": 1
  }
]
```

### **Step 3: Client Marks Notification as Read**

```
Client clicks notification
  ↓
PUT /notifications/{notificationId}
  ↓
Backend validates:
  - Notification exists
  - Client owns notification
  ↓
Notification status updated to "READ"
  ↓
Response confirms
```

**Request:**

```
PUT /notifications/3
Authorization: Bearer <JWT_CLIENT_TOKEN>
{
  "status": "READ"
}
```

**Response:**

```json
{
  "message": "Notification marked as read",
  "notificationId": 3,
  "status": "READ"
}
```

### **Step 4: Admin Sends Manual Notification**

```
Admin navigates to Notifications (Admin)
  ↓
Selects user
  ↓
Enters custom message
  ↓
POST /notifications
  ↓
Backend validates:
  - Admin role confirmed
  - User exists
  ↓
Notification created with:
  - type = "CUSTOM"
  - message = admin's message
  - status = "UNREAD"
  ↓
Notification stored
  ↓
Client receives notification
```

**Request:**

```
POST /notifications
Authorization: Bearer <JWT_ADMIN_TOKEN>
{
  "userId": 1,
  "type": "CUSTOM",
  "message": "System maintenance scheduled for tonight 10 PM - 11 PM"
}
```

---

## **9. Role-Based Access Control (Authorization)**

**Client Permissions:**

```
✓ Register account (before approval)
✓ View own profile
✓ Create deposit/withdrawal transactions
✓ Request loans
✓ Make repayments
✓ View own accounts
✓ View own transactions
✓ View own loans
✓ View own mini-statements
✓ View own notifications
✗ Approve other users
✗ Approve loans
✗ Create accounts for others
✗ View other users' data
```

**Admin Permissions:**

```
✓ View all users
✓ Approve/reject user registrations
✓ Suspend users
✓ Create accounts
✓ Suspend/close accounts
✓ View all transactions
✓ Reverse transactions
✓ Approve loans
✓ Reject loans
✓ Disburse loans
✓ View all loans
✓ View all repayments
✓ Send notifications
✓ Generate reports
✓ View admin dashboard
✓ System management
```

**Authorization Check (Example: Withdraw Money):**

```
Client submits withdrawal request
  ↓
Backend extracts JWT token
  ↓
Validates token signature
  ↓
Extracts userId and role from token
  ↓
Validates role ∈ [client, admin]
  ↓
IF client:
  - Confirms userId matches accountOwnerId
  ↓
IF admin:
  - Allows any accountId
  ↓
Processes transaction
```

---

## **10. Data Integrity & Constraint Enforcement**

**Foreign Key Constraints:**

```
accounts.user_id → users.id
transactions.account_id → accounts.id
loans.user_id → users.id
repayments.loan_id → loans.id
notifications.user_id → users.id
```

**Check Constraints:**

```
accounts.balance ≥ 0
transactions.amount > 0
loans.amount > 0
loans.interest_rate ≥ 0
repayments.amount > 0
```

**Unique Constraints:**

```
users.email UNIQUE
accounts.id UNIQUE
transactions.id UNIQUE (with timestamp)
loans.id UNIQUE
```

**Status Validation:**

```
users.status ∈ [PENDING, ACTIVE, SUSPENDED, REJECTED]
accounts.status ∈ [ACTIVE, SUSPENDED, CLOSED]
loans.status ∈ [PENDING, APPROVED, REJECTED, DISBURSED, REPAYING, COMPLETED]
transactions.status ∈ [INITIATED, COMPLETED, FAILED, REVERSED]
repayments.status ∈ [COMPLETED, REVERSED, VERIFIED]
notifications.status ∈ [UNREAD, READ, ARCHIVED]
```

---

## **11. Transaction (ACID) Compliance**

**Example: Loan Disbursement (Atomic Operation)**

```
BEGIN TRANSACTION
  ↓
1. UPDATE loans SET status='DISBURSED' WHERE id=1
  ↓
2. INSERT INTO transactions (account_id, type, amount) VALUES (1, 'LOAN_DISBURSEMENT', 5000)
  ↓
3. UPDATE accounts SET balance = balance + 5000 WHERE id=1
  ↓
4. INSERT INTO notifications (user_id, type, message) VALUES (1, 'LOAN_DISBURSED', '...')
  ↓
IF any step fails:
  ROLLBACK all changes
  Return error
ELSE:
  COMMIT all changes
  Return success
```

---

## **12. Error Handling & Edge Cases**

**Scenario 1: Withdrawal with Insufficient Balance**

```
Client attempts withdrawal of 600 from balance 500
  ↓
Backend check:
  IF balance < amount:
    Return 400 Bad Request
    Message: "Insufficient balance"
    Transaction NOT created
  ↓
Client receives error
```

**Scenario 2: Loan Approval for Unapproved User**

```
Admin attempts to approve loan for PENDING user
  ↓
Backend check:
  IF user.status != 'ACTIVE':
    Return 400 Bad Request
    Message: "User not approved"
    Loan NOT approved
  ↓
Admin receives error
```

**Scenario 3: Double Repayment**

```
Client makes two repayments before system processes first
  ↓
Both requests arrive simultaneously
  ↓
Database locks loan row
  ↓
First request processes:
  - Loan balance updated
  - First repayment saved
  ↓
Second request processed:
  - Balance recalculated from updated value
  - If overpayment: Return error OR apply to next period
  ↓
Transaction isolation ensures consistency
```

---

## **13. Complete Flow Example: Alice's Journey**

**Day 1 (Registration):**

```
1. Alice registers: POST /auth/register
   Status: PENDING
   ↓
2. Admin approves: PUT /users/1/approve
   Status: ACTIVE
   Notification: ACCOUNT_APPROVED
   ↓
3. Admin creates account: POST /accounts
   Account 1 created, balance: 0
```

**Day 2 (Deposit):**

```
4. Alice deposits: POST /transactions
   Amount: 5000, Type: DEPOSIT
   Account balance: 5000
   ↓
5. Alice requests loan: POST /loans
   Amount: 2000, Period: 12 months
   Status: PENDING
```

**Day 3 (Loan Approval):**

```
6. Admin approves loan: PUT /loans/1/approve
   Status: APPROVED
   Notification: LOAN_APPROVED
   ↓
7. Admin disburses: POST /loans/1/disburse
   Status: DISBURSED
   Account balance: 7000 (5000 + 2000 loan)
   Notification: LOAN_DISBURSED
```

**Day 4 (Withdrawal & Transaction):**

```
8. Alice withdraws: POST /transactions
   Amount: 500, Type: WITHDRAWAL
   Account balance: 6500
   ↓
9. Alice views statement: GET /reports/statement/account/1
   Shows all transactions
```

**Day 10 (Repayment):**

```
10. Alice makes repayment: POST /repayments
    Amount: 500, Method: BANK_TRANSFER
    Loan balance: 1500
    Status: REPAYING
    ↓
11. Alice views loan statement: GET /reports/statement/loan/1
    Shows repayment progress
```

**Day 14 (Final Repayment):**

```
12. Alice makes final repayment: POST /repayments
    Amount: 1500
    Loan balance: 0
    Status: COMPLETED
    Notification: LOAN_COMPLETED
```

---

## **14. System Architecture Summary**

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (React)                       │
│  Dashboard | Loan | Transactions | Notifications | Reports  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Backend API (REST)                      │
│  /auth | /users | /accounts | /loans | /transactions | ...  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│    User | Account | Transaction | Loan | Repayment Service  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL)                       │
│  users | accounts | transactions | loans | repayments | ...  │
│  + Indexes, Triggers, Constraints, Stored Procedures         │
└─────────────────────────────────────────────────────────────┘
```

---

**End of Workflow Documentation**
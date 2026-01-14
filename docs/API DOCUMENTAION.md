# **Microfinance Transaction Manager – Complete API Documentation**

**Author:** Victor Kimathi  
**Date:** 14 January 2026

**Base URL:** `http://localhost:8080/api` (change according to deployment)  
**Authentication:** JWT Token in `Authorization` header

```
Authorization: Bearer <JWT_TOKEN>
```

---

## **1. Authentication Endpoints**

### **1.1 Register User (Client)**

**Endpoint:** `POST /auth/register`  
**Description:** Register a new user (client)  
**Authentication:** None required  
**Role:** Public

**Request Body:**

```json
{
  "name": "Alice Kimathi",
  "email": "alice@example.com",
  "phone": "+254712345678",
  "password": "securepassword"
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

**Error Responses:**

- `400` – Email already exists / Invalid input
- `422` – Validation failed (weak password, invalid email format)

---

### **1.2 Login**

**Endpoint:** `POST /auth/login`  
**Description:** Authenticate user and return JWT token  
**Authentication:** None required  
**Role:** Public

**Request Body:**

```json
{
  "email": "alice@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "Alice Kimathi",
  "role": "client",
  "status": "ACTIVE"
}
```

**Error Responses:**

- `401` – Invalid email or password
- `403` – Account not approved yet (status != ACTIVE)

---

### **1.3 Logout**

**Endpoint:** `POST /auth/logout`  
**Description:** Invalidate JWT token (optional, client-side usually handles)  
**Authentication:** Required (JWT)  
**Role:** Client, Admin

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

---

### **1.4 Refresh Token**

**Endpoint:** `POST /auth/refresh`  
**Description:** Get a new JWT token using refresh token  
**Authentication:** Required (Refresh Token)

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## **2. User Management Endpoints (CRUD)**

### **2.1 Get User Profile**

**Endpoint:** `GET /users/{userId}`  
**Description:** Fetch user profile (own profile or admin viewing)  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Response (200 OK):**

```json
{
  "userId": 1,
  "name": "Alice Kimathi",
  "email": "alice@example.com",
  "phone": "+254712345678",
  "status": "ACTIVE",
  "role": "client",
  "registrationDate": "2026-01-14T10:00:00"
}
```

**Error Responses:**

- `401` – Unauthorized
- `403` – Forbidden (not own profile and not admin)
- `404` – User not found

---

### **2.2 Get All Users (Admin)**

**Endpoint:** `GET /users`  
**Description:** List all users with pagination and filtering  
**Authentication:** Required  
**Role:** Admin only

**Query Parameters:**

- `page` – Page number (default: 1)
- `limit` – Records per page (default: 10)
- `status` – Filter by status (PENDING, ACTIVE, SUSPENDED)
- `role` – Filter by role (client, admin)
- `search` – Search by name or email

**Response (200 OK):**

```json
{
  "total": 5,
  "page": 1,
  "limit": 10,
  "users": [
    {
      "userId": 1,
      "name": "Alice Kimathi",
      "email": "alice@example.com",
      "status": "ACTIVE",
      "role": "client",
      "registrationDate": "2026-01-14T10:00:00"
    },
    {
      "userId": 2,
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "status": "PENDING",
      "role": "client",
      "registrationDate": "2026-01-14T11:00:00"
    }
  ]
}
```

---

### **2.3 Update User Profile**

**Endpoint:** `PUT /users/{userId}`  
**Description:** Update user details (name, phone)  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Request Body:**

```json
{
  "name": "Alice Marie Kimathi",
  "phone": "+254712345679"
}
```

**Response (200 OK):**

```json
{
  "message": "User profile updated successfully",
  "userId": 1,
  "name": "Alice Marie Kimathi",
  "phone": "+254712345679"
}
```

**Error Responses:**

- `400` – Invalid input
- `403` – Forbidden
- `404` – User not found

---

### **2.4 Approve/Reject User (Admin)**

**Endpoint:** `PUT /users/{userId}/approve`  
**Description:** Approve a pending user registration  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
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
  "notificationSent": true
}
```

---

### **2.5 Suspend User (Admin)**

**Endpoint:** `PUT /users/{userId}/suspend`  
**Description:** Suspend a user account  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "reason": "Unusual activity detected"
}
```

**Response (200 OK):**

```json
{
  "message": "User suspended successfully",
  "userId": 1,
  "status": "SUSPENDED"
}
```

---

### **2.6 Delete User (Admin - Soft Delete)**

**Endpoint:** `DELETE /users/{userId}`  
**Description:** Soft delete user (mark as inactive)  
**Authentication:** Required  
**Role:** Admin only

**Response (200 OK):**

```json
{
  "message": "User deleted successfully",
  "userId": 1
}
```

---

## **3. Account Management Endpoints (CRUD)**

### **3.1 Get User Accounts**

**Endpoint:** `GET /accounts/user/{userId}`  
**Description:** Retrieve all accounts for a user  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Query Parameters:**

- `status` – Filter by status (ACTIVE, PENDING, SUSPENDED, CLOSED)

**Response (200 OK):**

```json
[
  {
    "accountId": 1,
    "userId": 1,
    "balance": 5000.00,
    "accountType": "SAVINGS",
    "status": "ACTIVE",
    "createdAt": "2026-01-14T10:05:00"
  },
  {
    "accountId": 2,
    "userId": 1,
    "balance": 2500.00,
    "accountType": "CURRENT",
    "status": "ACTIVE",
    "createdAt": "2026-01-14T11:05:00"
  }
]
```

---

### **3.2 Get Single Account**

**Endpoint:** `GET /accounts/{accountId}`  
**Description:** Fetch details of a specific account  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Response (200 OK):**

```json
{
  "accountId": 1,
  "userId": 1,
  "balance": 5000.00,
  "accountType": "SAVINGS",
  "status": "ACTIVE",
  "createdAt": "2026-01-14T10:05:00",
  "lastTransactionDate": "2026-01-14T13:00:00"
}
```

---

### **3.3 Create Account (Admin)**

**Endpoint:** `POST /accounts`  
**Description:** Create a new account for an approved user  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "userId": 1,
  "accountType": "SAVINGS"
}
```

**Response (201 Created):**

```json
{
  "accountId": 2,
  "userId": 1,
  "balance": 0.0,
  "accountType": "SAVINGS",
  "status": "ACTIVE",
  "createdAt": "2026-01-14T11:00:00"
}
```

**Error Responses:**

- `400` – User not approved or account type invalid
- `403` – Forbidden (not admin)
- `404` – User not found

---

### **3.4 Update Account**

**Endpoint:** `PUT /accounts/{accountId}`  
**Description:** Update account details (status)  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "status": "SUSPENDED"
}
```

**Response (200 OK):**

```json
{
  "message": "Account updated successfully",
  "accountId": 1,
  "status": "SUSPENDED"
}
```

---

### **3.5 Close Account (Admin)**

**Endpoint:** `DELETE /accounts/{accountId}`  
**Description:** Close/delete an account  
**Authentication:** Required  
**Role:** Admin only  
**Constraint:** Balance must be zero before closing

**Response (200 OK):**

```json
{
  "message": "Account closed successfully",
  "accountId": 1,
  "status": "CLOSED"
}
```

**Error Responses:**

- `400` – Account balance is not zero
- `404` – Account not found

---

## **4. Transaction Management Endpoints (CRUD)**

### **4.1 Get Account Transactions**

**Endpoint:** `GET /transactions/account/{accountId}`  
**Description:** Fetch transactions for a specific account with filters  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Query Parameters:**

- `type` – Filter by type (DEPOSIT, WITHDRAWAL, TRANSFER, REPAYMENT)
- `startDate` – From date (ISO format)
- `endDate` – To date (ISO format)
- `page` – Page number
- `limit` – Records per page

**Response (200 OK):**

```json
[
  {
    "transactionId": 1,
    "accountId": 1,
    "type": "DEPOSIT",
    "amount": 1000.00,
    "timestamp": "2026-01-14T12:00:00",
    "description": "Initial deposit",
    "status": "COMPLETED"
  },
  {
    "transactionId": 2,
    "accountId": 1,
    "type": "WITHDRAWAL",
    "amount": 200.00,
    "timestamp": "2026-01-14T13:00:00",
    "description": "Grocery payment",
    "status": "COMPLETED"
  }
]
```

---

### **4.2 Get Single Transaction**

**Endpoint:** `GET /transactions/{transactionId}`  
**Description:** Fetch details of a single transaction  
**Authentication:** Required  
**Role:** Client (own account), Admin (any)

**Response (200 OK):**

```json
{
  "transactionId": 1,
  "accountId": 1,
  "type": "DEPOSIT",
  "amount": 1000.00,
  "timestamp": "2026-01-14T12:00:00",
  "description": "Initial deposit",
  "status": "COMPLETED",
  "referenceNumber": "TXN20260114001"
}
```

---

### **4.3 Create Transaction (Deposit/Withdrawal)**

**Endpoint:** `POST /transactions`  
**Description:** Record deposit, withdrawal, or transfer  
**Authentication:** Required  
**Role:** Client (own account), Admin (any)

**Request Body:**

```json
{
  "accountId": 1,
  "type": "WITHDRAWAL",
  "amount": 200.00,
  "description": "Grocery payment"
}
```

**Response (201 Created):**

```json
{
  "transactionId": 2,
  "accountId": 1,
  "type": "WITHDRAWAL",
  "amount": 200.00,
  "timestamp": "2026-01-14T13:00:00",
  "description": "Grocery payment",
  "status": "COMPLETED",
  "referenceNumber": "TXN20260114002"
}
```

**Error Responses:**

- `400` – Amount invalid / Insufficient balance / Account suspended
- `403` – Forbidden
- `404` – Account not found

---

### **4.4 Update Transaction (Admin - Status Only)**

**Endpoint:** `PUT /transactions/{transactionId}`  
**Description:** Update transaction status (for reversals)  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "status": "REVERSED"
}
```

**Response (200 OK):**

```json
{
  "message": "Transaction updated successfully",
  "transactionId": 2,
  "status": "REVERSED"
}
```

---

### **4.5 Cancel/Reverse Transaction (Admin)**

**Endpoint:** `DELETE /transactions/{transactionId}`  
**Description:** Reverse/cancel a transaction  
**Authentication:** Required  
**Role:** Admin only  
**Constraint:** Only completed transactions can be reversed

**Response (200 OK):**

```json
{
  "message": "Transaction reversed successfully",
  "transactionId": 2,
  "originalAmount": 200.00,
  "refundedAmount": 200.00
}
```

---

## **5. Loan Management Endpoints (CRUD)**

### **5.1 Request Loan (Client)**

**Endpoint:** `POST /loans`  
**Description:** Client requests a new loan  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Request Body:**

```json
{
  "userId": 1,
  "amount": 1000.00,
  "interestRate": 0.05,
  "repaymentPeriodMonths": 12
}
```

**Response (201 Created):**

```json
{
  "loanId": 1,
  "userId": 1,
  "amount": 1000.00,
  "interestRate": 0.05,
  "repaymentPeriodMonths": 12,
  "status": "PENDING",
  "requestDate": "2026-01-14T10:00:00",
  "startDate": null,
  "dueDate": null
}
```

**Error Responses:**

- `400` – User not approved / Invalid amount
- `403` – Forbidden (not own profile and not admin)
- `404` – User not found

---

### **5.2 Get User Loans**

**Endpoint:** `GET /loans/user/{userId}`  
**Description:** Get all loans for a specific user  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Query Parameters:**

- `status` – Filter by status (PENDING, APPROVED, DISBURSED, REPAYING, COMPLETED)

**Response (200 OK):**

```json
[
  {
    "loanId": 1,
    "userId": 1,
    "amount": 1000.00,
    "interestRate": 0.05,
    "repaymentPeriodMonths": 12,
    "status": "APPROVED",
    "requestDate": "2026-01-14T10:00:00",
    "startDate": "2026-01-14T10:30:00",
    "dueDate": "2026-02-14"
  }
]
```

---

### **5.3 Get Single Loan**

**Endpoint:** `GET /loans/{loanId}`  
**Description:** Fetch details of a specific loan  
**Authentication:** Required  
**Role:** Client (own loan), Admin (any)

**Response (200 OK):**

```json
{
  "loanId": 1,
  "userId": 1,
  "amount": 1000.00,
  "interestRate": 0.05,
  "repaymentPeriodMonths": 12,
  "status": "APPROVED",
  "requestDate": "2026-01-14T10:00:00",
  "startDate": "2026-01-14T10:30:00",
  "dueDate": "2026-02-14",
  "principalBalance": 800.00,
  "totalRepaid": 200.00
}
```

---

### **5.4 Approve Loan (Admin)**

**Endpoint:** `PUT /loans/{loanId}/approve`  
**Description:** Approve a pending loan request  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "approvedAmount": 1000.00,
  "approvalNotes": "Approved based on credit history"
}
```

**Response (200 OK):**

```json
{
  "loanId": 1,
  "status": "APPROVED",
  "approvedAmount": 1000.00,
  "startDate": "2026-01-14T10:30:00",
  "dueDate": "2026-02-14",
  "notificationSent": true
}
```

---

### **5.5 Reject Loan (Admin)**

**Endpoint:** `PUT /loans/{loanId}/reject`  
**Description:** Reject a pending loan request  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "rejectionReason": "Insufficient credit score"
}
```

**Response (200 OK):**

```json
{
  "loanId": 1,
  "status": "REJECTED",
  "rejectionReason": "Insufficient credit score",
  "notificationSent": true
}
```

---

### **5.6 Disburse Loan (Admin)**

**Endpoint:** `POST /loans/{loanId}/disburse`  
**Description:** Disburse approved loan to account  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "accountId": 1
}
```

**Response (200 OK):**

```json
{
  "loanId": 1,
  "status": "DISBURSED",
  "disburseDate": "2026-01-14T10:30:00",
  "disburseAmount": 1000.00,
  "accountId": 1,
  "accountNewBalance": 1000.00
}
```

---

### **5.7 Update Loan**

**Endpoint:** `PUT /loans/{loanId}`  
**Description:** Update loan status  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "status": "REPAYING"
}
```

**Response (200 OK):**

```json
{
  "message": "Loan updated successfully",
  "loanId": 1,
  "status": "REPAYING"
}
```

---

### **5.8 Close Loan (Admin)**

**Endpoint:** `DELETE /loans/{loanId}`  
**Description:** Close/mark loan as completed  
**Authentication:** Required  
**Role:** Admin only  
**Constraint:** Balance must be fully repaid

**Response (200 OK):**

```json
{
  "message": "Loan closed successfully",
  "loanId": 1,
  "status": "COMPLETED"
}
```

---

## **6. Repayment Management Endpoints (CRUD)**

### **6.1 Make Repayment**

**Endpoint:** `POST /repayments`  
**Description:** Record a loan repayment  
**Authentication:** Required  
**Role:** Client (own loan), Admin (any)

**Request Body:**

```json
{
  "loanId": 1,
  "amount": 200.00,
  "method": "BANK_TRANSFER",
  "reference": "TRF20260114001"
}
```

**Response (201 Created):**

```json
{
  "repaymentId": 1,
  "loanId": 1,
  "amount": 200.00,
  "timestamp": "2026-01-14T14:00:00",
  "method": "BANK_TRANSFER",
  "reference": "TRF20260114001",
  "status": "COMPLETED",
  "remainingBalance": 800.00
}
```

**Error Responses:**

- `400` – Repayment amount invalid / Loan fully repaid
- `404` – Loan not found

---

### **6.2 Get Loan Repayments**

**Endpoint:** `GET /repayments/loan/{loanId}`  
**Description:** Fetch all repayments for a specific loan  
**Authentication:** Required  
**Role:** Client (own loan), Admin (any)

**Query Parameters:**

- `page` – Page number
- `limit` – Records per page

**Response (200 OK):**

```json
[
  {
    "repaymentId": 1,
    "loanId": 1,
    "amount": 200.00,
    "timestamp": "2026-01-14T14:00:00",
    "method": "BANK_TRANSFER",
    "reference": "TRF20260114001",
    "status": "COMPLETED"
  },
  {
    "repaymentId": 2,
    "loanId": 1,
    "amount": 300.00,
    "timestamp": "2026-01-15T09:00:00",
    "method": "MOBILE_MONEY",
    "reference": "MM20260115001",
    "status": "COMPLETED"
  }
]
```

---

### **6.3 Get Single Repayment**

**Endpoint:** `GET /repayments/{repaymentId}`  
**Description:** Fetch details of a specific repayment  
**Authentication:** Required  
**Role:** Client (own loan), Admin (any)

**Response (200 OK):**

```json
{
  "repaymentId": 1,
  "loanId": 1,
  "amount": 200.00,
  "timestamp": "2026-01-14T14:00:00",
  "method": "BANK_TRANSFER",
  "reference": "TRF20260114001",
  "status": "COMPLETED",
  "receiptNumber": "RCP20260114001"
}
```

---

### **6.4 Update Repayment (Admin - Status)**

**Endpoint:** `PUT /repayments/{repaymentId}`  
**Description:** Update repayment status  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "status": "VERIFIED"
}
```

**Response (200 OK):**

```json
{
  "message": "Repayment updated successfully",
  "repaymentId": 1,
  "status": "VERIFIED"
}
```

---

### **6.5 Reverse Repayment (Admin)**

**Endpoint:** `DELETE /repayments/{repaymentId}`  
**Description:** Reverse/cancel a repayment  
**Authentication:** Required  
**Role:** Admin only

**Response (200 OK):**

```json
{
  "message": "Repayment reversed successfully",
  "repaymentId": 1,
  "refundedAmount": 200.00,
  "loanBalanceRestored": 800.00
}
```

---

## **7. Notification Endpoints (CRUD)**

### **7.1 Get User Notifications**

**Endpoint:** `GET /notifications/user/{userId}`  
**Description:** Fetch all notifications for a user  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Query Parameters:**

- `status` – Filter by status (UNREAD, READ, ARCHIVED)
- `type` – Filter by type (ACCOUNT_APPROVED, LOAN_APPROVED, PAYMENT_RECEIVED)

**Response (200 OK):**

```json
[
  {
    "notificationId": 1,
    "userId": 1,
    "type": "ACCOUNT_APPROVED",
    "message": "Your account has been approved and is now active",
    "sentAt": "2026-01-14T10:30:00",
    "status": "READ",
    "relatedId": 1
  },
  {
    "notificationId": 2,
    "userId": 1,
    "type": "LOAN_APPROVED",
    "message": "Your loan request for KES 1000 has been approved",
    "sentAt": "2026-01-14T11:00:00",
    "status": "UNREAD",
    "relatedId": 1
  }
]
```

---

### **7.2 Get Single Notification**

**Endpoint:** `GET /notifications/{notificationId}`  
**Description:** Fetch a specific notification  
**Authentication:** Required

**Response (200 OK):**

```json
{
  "notificationId": 1,
  "userId": 1,
  "type": "ACCOUNT_APPROVED",
  "message": "Your account has been approved and is now active",
  "sentAt": "2026-01-14T10:30:00",
  "status": "READ",
  "relatedId": 1
}
```

---

### **7.3 Create Notification (Admin/System)**

**Endpoint:** `POST /notifications`  
**Description:** Send manual notification to user  
**Authentication:** Required  
**Role:** Admin only

**Request Body:**

```json
{
  "userId": 1,
  "type": "CUSTOM",
  "message": "System maintenance scheduled for tomorrow",
  "relatedId": null
}
```

**Response (201 Created):**

```json
{
  "notificationId": 3,
  "userId": 1,
  "type": "CUSTOM",
  "message": "System maintenance scheduled for tomorrow",
  "sentAt": "2026-01-14T15:00:00",
  "status": "UNREAD"
}
```

---

### **7.4 Mark Notification as Read**

**Endpoint:** `PUT /notifications/{notificationId}`  
**Description:** Mark notification as read  
**Authentication:** Required

**Request Body:**

```json
{
  "status": "READ"
}
```

**Response (200 OK):**

```json
{
  "message": "Notification marked as read",
  "notificationId": 1,
  "status": "READ"
}
```

---

### **7.5 Delete Notification**

**Endpoint:** `DELETE /notifications/{notificationId}`  
**Description:** Delete a notification  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Response (200 OK):**

```json
{
  "message": "Notification deleted successfully",
  "notificationId": 1
}
```

---

## **8. Reporting/Statement Endpoints**

### **8.1 Get Account Mini-Statement**

**Endpoint:** `GET /reports/statement/account/{accountId}`  
**Description:** Generate account mini-statement  
**Authentication:** Required  
**Role:** Client (own account), Admin (any)

**Query Parameters:**

- `startDate` – From date
- `endDate` – To date
- `format` – Response format (json, pdf)

**Response (200 OK):**

```json
{
  "accountId": 1,
  "accountType": "SAVINGS",
  "statementPeriod": "2026-01-01 to 2026-01-14",
  "openingBalance": 5000.00,
  "closingBalance": 7300.00,
  "totalDeposits": 2500.00,
  "totalWithdrawals": 200.00,
  "transactions": [
    {
      "date": "2026-01-14T12:00:00",
      "description": "Initial deposit",
      "debit": null,
      "credit": 1000.00,
      "balance": 6000.00
    }
  ]
}
```

---

### **8.2 Get Loan Statement**

**Endpoint:** `GET /reports/statement/loan/{loanId}`  
**Description:** Generate loan statement  
**Authentication:** Required  
**Role:** Client (own loan), Admin (any)

**Query Parameters:**

- `format` – Response format (json, pdf)

**Response (200 OK):**

```json
{
  "loanId": 1,
  "userId": 1,
  "loanAmount": 1000.00,
  "interestRate": 0.05,
  "disburseDate": "2026-01-14",
  "dueDate": "2026-02-14",
  "principalRepaid": 200.00,
  "principalBalance": 800.00,
  "interestAccrued": 50.00,
  "totalRepaid": 200.00,
  "status": "REPAYING",
  "repayments": [
    {
      "date": "2026-01-14T14:00:00",
      "amount": 200.00,
      "method": "BANK_TRANSFER"
    }
  ]
}
```

---

### **8.3 Get User Dashboard Summary**

**Endpoint:** `GET /reports/dashboard/{userId}`  
**Description:** Get summary of user accounts, loans, and transactions  
**Authentication:** Required  
**Role:** Client (own), Admin (any)

**Response (200 OK):**

```json
{
  "userId": 1,
  "totalAccountBalance": 7300.00,
  "accountCount": 2,
  "activeLoans": 1,
  "totalLoanBalance": 800.00,
  "recentTransactions": [
    {
      "transactionId": 2,
      "accountId": 1,
      "type": "WITHDRAWAL",
      "amount": 200.00,
      "timestamp": "2026-01-14T13:00:00"
    }
  ],
  "pendingApprovals": 0
}
```

---

### **8.4 Get Admin Dashboard Summary**

**Endpoint:** `GET /reports/admin/dashboard`  
**Description:** Get summary for admin (pending approvals, recent activity)  
**Authentication
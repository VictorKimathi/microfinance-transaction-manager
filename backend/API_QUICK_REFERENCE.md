# API Quick Reference Guide

## Base URL
```
http://localhost:8080/api
```

## 1. User Registration & Login Flow

### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Kimathi",
  "email": "alice@example.com",
  "phone": "+254712345678",
  "password": "securepassword123"
}

Response: 201 Created
{
  "userId": 1,
  "name": "Alice Kimathi",
  "email": "alice@example.com",
  "phone": "+254712345678",
  "status": "PENDING",
  "role": "CUSTOMER",
  "registrationDate": "2026-01-17T10:00:00"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "Alice Kimathi",
  "role": "CUSTOMER",
  "status": "ACTIVE"
}
```

## 2. Admin Operations

### Approve User (Admin Only)
```bash
PUT /api/users/1/approve
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "status": "ACTIVE"
}

Response: 200 OK
{
  "message": "User approved successfully",
  "data": {
    "userId": 1,
    "status": "ACTIVE",
    "notificationSent": true
  }
}
```

### Get All Users (Admin Only)
```bash
GET /api/users?page=0&limit=10&status=ACTIVE
Authorization: Bearer <ADMIN_TOKEN>

Response: 200 OK
{
  "total": 5,
  "page": 0,
  "limit": 10,
  "users": [...]
}
```

## 3. Account Management

### Create Account (Admin Only)
```bash
POST /api/accounts
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "userId": 1,
  "accountType": "SAVINGS"
}

Response: 201 Created
{
  "accountId": 1,
  "userId": 1,
  "balance": 0.00,
  "accountType": "SAVINGS",
  "status": "ACTIVE",
  "createdAt": "2026-01-17T10:05:00"
}
```

### Get User Accounts
```bash
GET /api/accounts/user/1
Authorization: Bearer <USER_TOKEN>

Response: 200 OK
[
  {
    "accountId": 1,
    "userId": 1,
    "balance": 5000.00,
    "accountType": "SAVINGS",
    "status": "ACTIVE",
    "createdAt": "2026-01-17T10:05:00"
  }
]
```

## 4. Transactions

### Make Deposit
```bash
POST /api/transactions
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "accountId": 1,
  "type": "DEPOSIT",
  "amount": 1000.00,
  "description": "Initial deposit"
}

Response: 201 Created
{
  "transactionId": 1,
  "accountId": 1,
  "type": "DEPOSIT",
  "amount": 1000.00,
  "timestamp": "2026-01-17T12:00:00",
  "description": "Initial deposit",
  "status": "COMPLETED",
  "referenceNumber": "TXN1705491600001ABC"
}
```

### Make Withdrawal
```bash
POST /api/transactions
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "accountId": 1,
  "type": "WITHDRAWAL",
  "amount": 200.00,
  "description": "ATM withdrawal"
}
```

### Get Account Transactions
```bash
GET /api/transactions/account/1?page=0&limit=10&type=DEPOSIT
Authorization: Bearer <USER_TOKEN>

Response: 200 OK
{
  "content": [...],
  "totalElements": 5,
  "totalPages": 1,
  "number": 0
}
```

## 5. Loan Management

### Request Loan
```bash
POST /api/loans
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "userId": 1,
  "accountId": 1,
  "amount": 10000.00,
  "interestRate": 5.0,
  "repaymentPeriodMonths": 12
}

Response: 201 Created
{
  "loanId": 1,
  "userId": 1,
  "accountId": 1,
  "amount": 10000.00,
  "interestRate": 5.0,
  "repaymentPeriodMonths": 12,
  "status": "PENDING",
  "requestDate": "2026-01-17T10:00:00",
  "principalBalance": 10000.00,
  "totalRepaid": 0.00
}
```

### Approve Loan (Admin Only)
```bash
PUT /api/loans/1/approve
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "approvedAmount": 10000.00,
  "approvalNotes": "Approved based on credit history"
}

Response: 200 OK
{
  "message": "Loan approved successfully",
  "data": {
    "loanId": 1,
    "status": "APPROVED",
    "approvedAmount": 10000.00,
    "startDate": "2026-01-17T10:30:00",
    "dueDate": "2027-01-17",
    "notificationSent": true
  }
}
```

### Disburse Loan (Admin Only)
```bash
POST /api/loans/1/disburse
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "accountId": 1
}

Response: 200 OK
{
  "message": "Loan disbursed successfully",
  "data": {
    "loanId": 1,
    "status": "ACTIVE",
    "disburseDate": "2026-01-17T10:30:00",
    "disburseAmount": 10000.00,
    "accountId": 1
  }
}
```

### Get User Loans
```bash
GET /api/loans/user/1?status=ACTIVE
Authorization: Bearer <USER_TOKEN>

Response: 200 OK
[
  {
    "loanId": 1,
    "userId": 1,
    "accountId": 1,
    "amount": 10000.00,
    "interestRate": 5.0,
    "status": "ACTIVE",
    "principalBalance": 8000.00,
    "totalRepaid": 2000.00
  }
]
```

## 6. Loan Repayments

### Make Repayment
```bash
POST /api/repayments
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "loanId": 1,
  "amount": 500.00,
  "method": "BANK_TRANSFER",
  "reference": "TRF20260117001"
}

Response: 201 Created
{
  "repaymentId": 1,
  "loanId": 1,
  "amount": 500.00,
  "timestamp": "2026-01-17T14:00:00",
  "method": "BANK_TRANSFER",
  "reference": "TRF20260117001",
  "status": "SUCCESSFUL",
  "receiptNumber": "RCP1705498800001XYZ",
  "remainingBalance": 9500.00
}
```

### Get Loan Repayments
```bash
GET /api/repayments/loan/1?page=0&limit=10
Authorization: Bearer <USER_TOKEN>

Response: 200 OK
{
  "content": [
    {
      "repaymentId": 1,
      "loanId": 1,
      "amount": 500.00,
      "timestamp": "2026-01-17T14:00:00",
      "method": "BANK_TRANSFER",
      "status": "SUCCESSFUL"
    }
  ],
  "totalElements": 1
}
```

## 7. Notifications

### Get User Notifications
```bash
GET /api/notifications/user/1?status=UNREAD
Authorization: Bearer <USER_TOKEN>

Response: 200 OK
[
  {
    "notificationId": 1,
    "userId": 1,
    "type": "ACCOUNT_APPROVED",
    "message": "Your account has been approved and is now active",
    "status": "UNREAD",
    "sentAt": "2026-01-17T10:30:00",
    "relatedId": 1
  }
]
```

### Mark Notification as Read
```bash
PUT /api/notifications/1
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "status": "READ"
}

Response: 200 OK
{
  "message": "Notification marked as read",
  "data": {
    "notificationId": 1,
    "status": "READ"
  }
}
```

### Create Custom Notification (Admin Only)
```bash
POST /api/notifications
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "userId": 1,
  "type": "CUSTOM",
  "message": "System maintenance scheduled for tomorrow",
  "relatedId": null
}
```

## Common Query Parameters

### Pagination
- `page` - Page number (default: 0)
- `limit` - Items per page (default: 10)

### Filtering
- `status` - Filter by status
- `type` - Filter by type
- `search` - Search term
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

## Response Status Codes

- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request
- `400 Bad Request` - Invalid input/validation error
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Enum Values

### User Status
- `ACTIVE`, `INACTIVE`, `BANNED`, `PENDING`

### User Role
- `CUSTOMER`, `ADMIN`, `SUPPORT`, `AUDITOR`

### Account Type
- `SAVINGS`, `CHECKING`, `CREDIT`, `INVESTMENT`

### Account Status
- `ACTIVE`, `FROZEN`, `CLOSED`

### Transaction Type
- `DEPOSIT`, `WITHDRAWAL`, `TRANSFER`, `PAYMENT`, `INTEREST`

### Transaction Status
- `PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`

### Loan Status
- `PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `PAID_OFF`, `DEFAULTED`

### Payment Method
- `BANK_TRANSFER`, `CARD`, `CASH`, `MOBILE_MONEY`

### Repayment Status
- `PENDING`, `SUCCESSFUL`, `FAILED`

### Notification Type
- `INFO`, `WARNING`, `ALERT`, `PROMOTION`, `ACCOUNT_APPROVED`, `LOAN_APPROVED`, `LOAN_REJECTED`, `PAYMENT_RECEIVED`, `PAYMENT_DUE`, `CUSTOM`

### Notification Status
- `UNREAD`, `READ`, `ARCHIVED`

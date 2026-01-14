

# **Microfinance Transaction Manager**

**Author:** Victor Kimathi
**Date:** 14 January 2026

---

## **Project Overview**

The **Microfinance Transaction Manager** is a relational database-driven application designed to manage **users, accounts, transactions, loans, and repayments** for small-scale fintech or microfinance institutions.

This project demonstrates:

* Relational database design
* CRUD operations via REST APIs
* Workflow management (account approval, loan approval)
* Multi-table joins for reporting
* Full-stack web interface with **React frontend** and **Spring Boot backend**

The system allows administrators to handle financial operations efficiently, while clients can register, track accounts, request loans, make repayments, and view mini-statements.

---

## **Features**

### **Client / User Features**

* Register a new account (status: Pending Approval)
* View account status (Pending, Active, or Suspended)
* Request loans after account approval
* Make purchases or withdrawals
* Make loan repayments
* View mini-statements showing account and loan activity
* Receive notifications on account and loan approvals

### **Admin / Staff Features**

* Approve or reject client registrations
* Approve or reject loan requests
* Manage users (Create, Read, Update, Delete)
* Manage accounts (Create, Update, Close)
* Log transactions
* Generate mini-statements and reports
* Send notifications to users

---

## **Main Scenario (Core Flow)**

1. Alice registers for an account. Status: **Pending Approval**
2. Admin reviews and approves Alice’s registration. Status: **Active**
3. Alice receives notification of account approval
4. Alice requests a $100 loan
5. Admin approves the loan; funds are added to Alice’s account
6. Alice makes purchases, and withdrawals are logged
7. Alice makes repayments, reducing her loan balance
8. Admin generates a mini-statement showing all transactions and repayments

This workflow demonstrates **interaction between users, accounts, loans, transactions, repayments, and workflow statuses**, highlighting multi-table relationships and CRUD operations.

---

## **Database Design**

### **Tables**

1. **Users** – Stores client information (`user_id`, `name`, `email`, `phone`, `registration_date`)
2. **Accounts** – Tracks user balances and account status (`account_id`, `user_id`, `balance`, `account_type`, `status`)
3. **Transactions** – Logs deposits, withdrawals, and repayments (`transaction_id`, `account_id`, `type`, `amount`, `timestamp`)
4. **Loans** – Stores loan details (`loan_id`, `user_id`, `amount`, `interest_rate`, `start_date`, `due_date`, `status`)
5. **Repayments** – Logs payments made toward loans (`repayment_id`, `loan_id`, `amount`, `timestamp`)

### **Relationships**

* **One-to-Many:** One user → Many accounts, One account → Many transactions, One user → Many loans, One loan → Many repayments
* **Constraints:** Foreign keys for referential integrity, unique IDs for transactions, status tracking for workflows

---

## **Interface**

* **React Frontend**:

  * Client Dashboard – View account status, loan requests, transactions, and mini-statements
  * Registration Form – Users sign up for accounts
  * Loan Request Form – Users apply for loans
  * Transactions Page – Track deposits, withdrawals, and repayments
  * Admin Dashboard – Approve accounts and loans, manage users and accounts, generate reports

* **Spring Boot Backend**:

  * REST API endpoints for CRUD operations
  * Database integration (PostgreSQL/MySQL)
  * Business logic for workflows and transactions

---

## **Getting Started**

### **Prerequisites**

* Java 17+ / JDK installed
* Maven or Gradle for backend
* Node.js 18+ and npm/yarn for frontend
* PostgreSQL/MySQL for the database
* Git

### **Installation**

1. Clone the repository:

```bash
git clone https://github.com/VictorKimathi/microfinance-transaction-manager.git
```

2. Navigate to backend and frontend folders:

```bash
cd microfinance-transaction-manager/backend
cd ../frontend
```

3. **Backend Setup (Spring Boot):**

```bash
# Navigate to backend folder
cd backend

# Build project
mvn clean install  # or ./gradlew build

# Run Spring Boot server
mvn spring-boot:run  # or ./gradlew bootRun
```

4. **Frontend Setup (React):**

```bash
# Navigate to frontend folder
cd ../frontend

# Install dependencies
npm install  # or yarn install

# Start frontend development server
npm start  # or yarn start
```

---

## **Usage**

1. **Register a new client** via React registration form
2. **Admin approves account** via Admin Dashboard
3. **Client requests loan**, admin approves
4. **Log transactions** for purchases or repayments
5. **Generate mini-statement** to view activity

All client actions interact with the **Spring Boot REST API**, which handles database operations and business logic.

---

## **Sample Backend API Endpoints**

* **Get account mini-statement:**

```http
GET /api/accounts/{userId}/transactions
```

* **Request a loan:**

```http
POST /api/loans
Content-Type: application/json

{
  "userId": 1,
  "amount": 100,
  "interestRate": 0.05
}
```

* **Make repayment:**

```http
POST /api/repayments
Content-Type: application/json

{
  "loanId": 1,
  "amount": 50
}
```

---

## **Contributing**

Contributions are welcome! Please create a pull request for improvements such as:

* Adding new features (e.g., notifications via email/SMS)
* Improving React frontend UI/UX
* Adding unit/integration tests for Spring Boot backend

---

## **License**

MIT License – free to use and modify

---

## **Contact**

Victor Kimathi – [victorcodes9532@gmail.com](mailto:victorcodes9532@gmail.com) | [LinkedIn](https://www.linkedin.com/in/victor-kimathi-517501267/) | [GitHub](https://github.com/VictorKimathi)



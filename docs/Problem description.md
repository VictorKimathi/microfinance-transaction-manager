
---

# **Problem Description Document**

**Project:** Microfinance Transaction Manager  
**Author:** Victor Kimathi  
**Date:** 14 January 2026

---

## **1. Project Overview**

The **Microfinance Transaction Manager** is a relational database-driven application designed to manage **users, accounts, transactions, loans, and repayments** for small-scale fintech or microfinance institutions. The system enables administrators to handle financial operations efficiently, while clients can track their accounts, loan activities, and account verification status.

The primary goal is to **demonstrate relational database design, CRUD operations, indexing, constraints, workflow management, and basic reporting** through a practical, real-world use case.

---

## **2. Problem Statement**

Microfinance institutions and small fintech platforms often struggle to maintain accurate records of client accounts, loans, and repayments. Manual record-keeping can result in errors, duplicate entries, and inconsistencies in account balances.

Additionally, modern fintech platforms require **user registration and account verification workflows** to ensure security and compliance before clients can access financial services.

This project addresses the need for a **reliable, relational database system** that:

- Allows clients to **register and request accounts**, with status pending admin approval
    
- Tracks clients and their accounts after verification
    
- Logs transactions with integrity constraints
    
- Manages loans and repayments
    
- Generates mini-statements for auditing and reporting
    

The system will **prevent overdrafts**, enforce unique constraints, and provide a **web interface or interactive console** for CRUD operations and workflow management.

---

## **3. Main Actors**

|Actor|Role|
|---|---|
|**Admin / Staff**|Manages user registrations, approves accounts, approves loans, tracks repayments, and generates statements.|
|**Client / User**|Registers for an account, monitors account status, requests loans, makes purchases and repayments, and receives notifications once their account is approved.|

---

## **4. System Scope**

The system will support the following features:

1. **User Registration & Verification** – Users can sign up; admins approve accounts.
    
2. **Account Management** – Create accounts after approval, track balances, enforce constraints.
    
3. **Transaction Management** – Log deposits, withdrawals, and prevent overdrafts.
    
4. **Loan Management** – Issue loans after account approval, track repayment schedules.
    
5. **Repayment Tracking** – Log repayments against specific loans.
    
6. **Mini Statements** – Generate reports combining account and loan data.
    
7. **Notifications** – Send alerts to clients when their account or loan is approved.
    
8. **Database Integrity** – Foreign keys, unique constraints, indexing, and workflow status tracking.
    

---

## **5. Main Scenario (Core Flow)**

1. **Alice registers for an account**, providing personal details. Account status is set to **“Pending Admin Approval.”**
    
2. **Admin reviews Alice’s registration** and approves it. Status changes to **“Active.”**
    
3. **Alice receives a notification** (email or system alert) that her account is now active.
    
4. **Alice requests a $100 loan.**
    
5. **Admin approves the loan**, and the funds are added to Alice’s account.
    
6. **Alice makes purchases**, and the system logs withdrawals from her account.
    
7. **Alice makes repayments**, reducing her loan balance.
    
8. **Admin generates a mini-statement** showing all transactions and repayments.
    

This scenario demonstrates the **interaction between users, accounts, transactions, loans, repayments, and workflow status**, highlighting multi-table relationships, CRUD operations, and realistic fintech processes.

---

## **6. Assumptions and Constraints**

- Each user can have **one or more accounts**, but accounts are only **active after admin approval**.
    
- Loans are linked to a **specific user** with an active account.
    
- Repayments are linked to a **specific loan**.
    
- The system enforces **no negative balances** for accounts.
    
- Unique transaction IDs ensure **no duplicate entries**.
    
- Account statuses must be clearly tracked: **Pending → Active → (optional: Suspended)**.
    
- Mini statements will be generated using **SQL joins across multiple tables**.
    

---

## **7. Deliverables**

1. **Relational Database**: Fully implemented with tables, indexes, constraints, and workflow status tracking.
    
2. **Interactive Interface**: Web app or REPL to perform CRUD operations, including user registration and admin approval.
    
3. **Sample Data**: Pre-populated users, accounts, loans, transactions, and workflow states.
    
4. **Documentation**: README with ER diagram, setup instructions, workflow explanation, and example queries.
    
5. **GitHub Repository**: Public source code for evaluation.
    

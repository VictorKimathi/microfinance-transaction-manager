# Microfinance Transaction Manager - Backend API

## Overview
Complete Spring Boot REST API for the Microfinance Transaction Manager system with JWT authentication, comprehensive CRUD operations, and database integration.

## Tech Stack
- **Java 17**
- **Spring Boot 4.0.1**
- **Spring Security with JWT**
- **Spring Data JPA**
- **MySQL 8.0+**
- **Lombok**
- **Maven**

## Project Structure
```
backend/microfinancemanager/
├── src/main/java/com/microfinancemanager/microfinancemanager/
│   ├── controller/          # REST API Controllers
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── AccountController.java
│   │   ├── TransactionController.java
│   │   ├── LoanController.java
│   │   ├── RepaymentController.java
│   │   └── NotificationController.java
│   │
│   ├── dto/                 # Data Transfer Objects
│   │   ├── auth/           # Login, Register requests/responses
│   │   ├── user/           # User DTOs
│   │   ├── account/        # Account DTOs
│   │   ├── transaction/    # Transaction DTOs
│   │   ├── loan/           # Loan DTOs
│   │   ├── repayment/      # Repayment DTOs
│   │   ├── notification/   # Notification DTOs
│   │   └── common/         # Common response wrappers
│   │
│   ├── model/              # JPA Entities
│   │   ├── User.java
│   │   ├── Account.java
│   │   ├── Transaction.java
│   │   ├── Loan.java
│   │   ├── Repayment.java
│   │   ├── Notification.java
│   │   └── AuditLog.java
│   │
│   ├── repository/         # JPA Repositories
│   │   ├── UserRepository.java
│   │   ├── AccountRepository.java
│   │   ├── TransactionRepository.java
│   │   ├── LoanRepository.java
│   │   ├── RepaymentRepository.java
│   │   ├── NotificationRepository.java
│   │   └── AuditLogRepository.java
│   │
│   ├── service/            # Business Logic
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── AccountService.java
│   │   ├── TransactionService.java
│   │   ├── LoanService.java
│   │   ├── RepaymentService.java
│   │   └── NotificationService.java
│   │
│   ├── security/           # Security Configuration
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── CustomUserDetailsService.java
│   │   └── SecurityConfig.java
│   │
│   ├── exception/          # Exception Handling
│   │   └── GlobalExceptionHandler.java
│   │
│   └── MicrofinancemanagerApplication.java
│
└── src/main/resources/
    └── application.properties
```

## Database Setup

### 1. Create MySQL Database
```sql
CREATE DATABASE bank_system;
USE bank_system;
```

### 2. Run Database Scripts
Execute the SQL scripts in order:
1. `database/schema.sql` - Creates all tables
2. `database/constraints.sql` - Adds constraints
3. `database/indexes.sql` - Creates indexes
4. `database/triggers_procedures.sql` - Creates triggers and procedures

## Configuration

### Update application.properties
Located at: `src/main/resources/application.properties`

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/bank_system
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE

# JWT Configuration (change in production)
jwt.secret=mySecretKeyForJWTTokenGenerationMustBeLongEnoughForHS256Algorithm
jwt.expiration=86400000
```

## Building and Running

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### Build the Project
```bash
cd backend/microfinancemanager
mvn clean install
```

### Run the Application
```bash
mvn spring-boot:run
```

The application will start on: **http://localhost:8080**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout

### Users (Admin)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{userId}` - Get user by ID
- `PUT /api/users/{userId}` - Update user profile
- `PUT /api/users/{userId}/approve` - Approve user (Admin)
- `PUT /api/users/{userId}/suspend` - Suspend user (Admin)
- `DELETE /api/users/{userId}` - Delete user (Admin)

### Accounts
- `GET /api/accounts/user/{userId}` - Get user accounts
- `GET /api/accounts/{accountId}` - Get account details
- `POST /api/accounts` - Create account (Admin)
- `PUT /api/accounts/{accountId}` - Update account status (Admin)
- `DELETE /api/accounts/{accountId}` - Close account (Admin)

### Transactions
- `GET /api/transactions/account/{accountId}` - Get account transactions
- `GET /api/transactions/{transactionId}` - Get transaction details
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{transactionId}` - Update transaction (Admin)
- `DELETE /api/transactions/{transactionId}` - Reverse transaction (Admin)

### Loans
- `POST /api/loans` - Request loan
- `GET /api/loans/user/{userId}` - Get user loans
- `GET /api/loans/{loanId}` - Get loan details
- `PUT /api/loans/{loanId}/approve` - Approve loan (Admin)
- `PUT /api/loans/{loanId}/reject` - Reject loan (Admin)
- `POST /api/loans/{loanId}/disburse` - Disburse loan (Admin)
- `DELETE /api/loans/{loanId}` - Close loan (Admin)

### Repayments
- `POST /api/repayments` - Make repayment
- `GET /api/repayments/loan/{loanId}` - Get loan repayments
- `GET /api/repayments/{repaymentId}` - Get repayment details
- `PUT /api/repayments/{repaymentId}` - Update repayment (Admin)
- `DELETE /api/repayments/{repaymentId}` - Reverse repayment (Admin)

### Notifications
- `GET /api/notifications/user/{userId}` - Get user notifications
- `GET /api/notifications/{notificationId}` - Get notification details
- `POST /api/notifications` - Create notification (Admin)
- `PUT /api/notifications/{notificationId}` - Mark as read
- `DELETE /api/notifications/{notificationId}` - Delete notification

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Example Login Request
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Example Protected Request
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## User Roles
- **CUSTOMER** - Regular users, can manage their own accounts/loans
- **ADMIN** - Full access, can approve/reject users, loans, manage all entities
- **SUPPORT** - Customer support access
- **AUDITOR** - Read-only access for auditing

## Security Features
✅ JWT-based authentication  
✅ Password encryption with BCrypt  
✅ Role-based access control  
✅ Protected endpoints  
✅ CORS configuration  
✅ Session management (stateless)

## Error Handling
All errors return consistent JSON format:
```json
{
  "message": "Error description",
  "data": null
}
```

Validation errors:
```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

## Testing

### Using Postman
Import the API endpoints and test with sample data.

### Sample Test Flow
1. Register a new user
2. Admin approves the user
3. User logs in and gets JWT token
4. User creates an account
5. User makes transactions
6. User requests a loan
7. Admin approves and disburses loan
8. User makes repayments

## Troubleshooting

### Common Issues

**Database Connection Error**
- Check MySQL is running
- Verify database credentials in `application.properties`
- Ensure `bank_system` database exists

**Port Already in Use**
- Change port in `application.properties`: `server.port=8081`

**JWT Token Invalid**
- Token expires after 24 hours by default
- Obtain new token by logging in again

## Production Deployment

### Before deploying to production:
1. Change JWT secret key
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Set `spring.jpa.hibernate.ddl-auto=validate`
5. Configure proper CORS origins
6. Set up database connection pooling
7. Enable production logging levels

## Author
**Victor Kimathi**  
Date: January 2026

## License
Proprietary - All rights reserved

# 🚀 Quick Start Guide - Microfinance Transaction Manager

## Prerequisites Check
Before starting, ensure you have:
- ✅ Java 17 or higher installed
- ✅ Maven 3.6+ installed  
- ✅ MySQL 8.0+ installed and running
- ✅ Git (optional)

## Step-by-Step Setup

### 1️⃣ Database Setup (5 minutes)

```bash
# Start MySQL
mysql -u root -p

# Create database and run scripts
CREATE DATABASE bank_system;
USE bank_system;

# Exit MySQL and run scripts
mysql -u root -p bank_system < database/schema.sql
mysql -u root -p bank_system < database/constraints.sql
mysql -u root -p bank_system < database/indexes.sql
mysql -u root -p bank_system < database/triggers_procedures.sql
```

### 2️⃣ Configure Application (2 minutes)

Edit `backend/microfinancemanager/src/main/resources/application.properties`:

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 3️⃣ Build Project (2 minutes)

```bash
cd backend/microfinancemanager
mvn clean install
```

### 4️⃣ Run Application (1 minute)

```bash
mvn spring-boot:run
```

You should see:
```
Microfinance Transaction Manager is running on http://localhost:8080
```

### 5️⃣ Create Admin User (Manual - One Time)

Since the first user needs to be an admin, manually insert into MySQL:

```sql
USE bank_system;

INSERT INTO users (name, email, phone, password_hash, status, role, registration_date)
VALUES (
    'Admin User',
    'admin@microfinance.com',
    '+254700000000',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- password: admin123
    'ACTIVE',
    'ADMIN',
    NOW()
);
```

### 6️⃣ Test the API

#### Login as Admin
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@microfinance.com",
    "password": "admin123"
  }'
```

You'll receive a JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "Admin User",
  "role": "ADMIN",
  "status": "ACTIVE"
}
```

#### Register a New Customer
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254712345678",
    "password": "password123"
  }'
```

#### Approve the Customer (Admin)
```bash
curl -X PUT http://localhost:8080/api/users/2/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACTIVE"}'
```

#### Create Account for Customer (Admin)
```bash
curl -X POST http://localhost:8080/api/accounts \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "accountType": "SAVINGS"
  }'
```

## 📱 Using Postman

1. Import the following as environment variables:
   - `baseUrl`: `http://localhost:8080/api`
   - `token`: (set after login)

2. Create requests:
   - **POST** {{baseUrl}}/auth/login
   - **POST** {{baseUrl}}/auth/register  
   - **GET** {{baseUrl}}/users
   - **POST** {{baseUrl}}/accounts
   - **POST** {{baseUrl}}/transactions
   - **POST** {{baseUrl}}/loans

3. Set Authorization header: `Bearer {{token}}`

## 🔍 Common Issues & Solutions

### Issue: Port 8080 already in use
**Solution:** Change port in `application.properties`:
```properties
server.port=8081
```

### Issue: MySQL Connection Failed
**Solution:** 
1. Check MySQL is running: `mysql --version`
2. Verify credentials in `application.properties`
3. Ensure database `bank_system` exists

### Issue: JWT Token Invalid
**Solution:** Token expires after 24 hours. Login again to get a new token.

### Issue: Build Fails
**Solution:** 
```bash
# Clean and rebuild
mvn clean
mvn install -U
```

## 📚 Next Steps

### For Testing:
1. Use Postman to test all endpoints
2. Check `backend/API_QUICK_REFERENCE.md` for examples
3. Review `backend/README.md` for complete documentation

### For Development:
1. Add custom business logic in services
2. Modify DTOs for additional fields
3. Add new endpoints as needed
4. Customize security rules in `SecurityConfig.java`

### For Production:
1. Change JWT secret in `application.properties`
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Set up proper database with connection pooling
5. Configure logging levels
6. Add monitoring and health checks

## 🎯 Testing Workflow Example

### Complete User Journey:
1. **Register** → User signs up
2. **Admin Approves** → Admin activates account
3. **User Login** → Get JWT token
4. **Create Account** → Admin creates savings account
5. **Make Deposit** → User deposits money
6. **Request Loan** → User applies for loan
7. **Admin Approves Loan** → Loan approved
8. **Disburse Loan** → Money added to account
9. **Make Repayment** → User pays back loan
10. **View Notifications** → User checks updates

## 📞 Support

For issues or questions:
- Check documentation in `/backend/README.md`
- Review API examples in `/backend/API_QUICK_REFERENCE.md`
- Check database schema in `/database/schema.sql`

## ✅ Success Indicators

Your application is working correctly when:
- ✅ Application starts on port 8080
- ✅ You can login and receive JWT token
- ✅ You can register new users
- ✅ Admin can approve users
- ✅ Accounts can be created
- ✅ Transactions update balances correctly
- ✅ Loans can be requested and approved
- ✅ Repayments update loan balances
- ✅ Notifications are sent for key events

---

**Happy Coding! 🎉**

Need help? Check the full documentation or contact support.

# Swagger API Documentation

## Overview
The Microfinance Transaction Manager API now includes comprehensive Swagger/OpenAPI documentation for easy testing and exploration of all endpoints.

## What's Implemented

### 1. Dependencies
- **springdoc-openapi-starter-webmvc-ui** (version 2.3.0)
  - Provides Swagger UI and OpenAPI specification generation
  - Automatically generates API documentation from controller annotations
  - Compatible with Spring Boot 4.x

### 2. Configuration
- **OpenApiConfig.java**: Configuration class that sets up:
  - API metadata (title, description, version, contact, license)
  - Development and production server URLs
  - JWT Bearer token authentication scheme
  - Security requirements for protected endpoints

### 3. Security Integration
- All API endpoints (except authentication and Swagger) require JWT Bearer tokens
- Swagger UI allows testing authenticated endpoints by:
  1. Logging in via `/api/auth/login` endpoint
  2. Copying the JWT token from the response
  3. Clicking "Authorize" button in Swagger UI
  4. Entering: `Bearer <your-token-here>`

### 4. Controller Documentation
All 7 controllers are tagged and documented:
- **Authentication**: User registration and login
- **User Management**: CRUD operations for users
- **Account Management**: Manage user accounts and balances
- **Transactions**: Deposits, withdrawals, transfers
- **Loan Management**: Loan applications, approvals, disbursements
- **Repayments**: Loan repayment tracking
- **Notifications**: User notification management

## Accessing Swagger UI

### Local Development
Once the application is running, access Swagger UI at:

```
http://localhost:8080/swagger-ui.html
```

Or the shorter alternative:
```
http://localhost:8080/swagger-ui/
```

### OpenAPI JSON Specification
The raw OpenAPI specification is available at:
```
http://localhost:8080/api-docs
```

For formatted JSON:
```
http://localhost:8080/api-docs?format=json
```

## How to Use Swagger UI

### Step 1: Start the Application
```bash
cd backend/microfinancemanager
mvn spring-boot:run
```

### Step 2: Access Swagger UI
Open your browser and navigate to `http://localhost:8080/swagger-ui.html`

### Step 3: Authenticate (For Protected Endpoints)
1. Scroll to **Authentication** section
2. Expand `POST /api/auth/login`
3. Click "Try it out"
4. Enter credentials:
   ```json
   {
     "email": "admin@example.com",
     "password": "your-password"
   }
   ```
5. Click "Execute"
6. Copy the `token` value from the response
7. Click the "Authorize" button at the top of the page
8. In the popup, enter: `Bearer <paste-token-here>`
9. Click "Authorize" then "Close"

### Step 4: Test API Endpoints
Now you can test any protected endpoint:
1. Expand any endpoint you want to test
2. Click "Try it out"
3. Fill in required parameters
4. Click "Execute"
5. View the response below

## Features

### Organized by Tags
All endpoints are organized into logical sections:
- Authentication
- User Management
- Account Management
- Transactions
- Loan Management
- Repayments
- Notifications

### Interactive Testing
- Test all API endpoints directly from the browser
- No need for Postman or curl
- Automatic request/response validation
- Example request bodies provided

### Schema Exploration
- View all DTOs and their properties
- See data types, required fields, and constraints
- Understand request/response structures

### Security Visualization
- See which endpoints require authentication
- Padlock icon indicates protected endpoints
- Clear indication of role-based access requirements

## Configuration Properties

The following properties are configured in `application.properties`:

```properties
# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true
```

### Property Explanations:
- `springdoc.api-docs.path`: URL path for OpenAPI JSON specification
- `springdoc.swagger-ui.path`: URL path for Swagger UI
- `springdoc.swagger-ui.enabled`: Enable/disable Swagger UI
- `springdoc.swagger-ui.operationsSorter`: Sort endpoints by HTTP method
- `springdoc.swagger-ui.tagsSorter`: Sort tags alphabetically
- `springdoc.swagger-ui.tryItOutEnabled`: Enable "Try it out" feature

## Security Exclusions

The following paths are publicly accessible (no JWT required):
- `/swagger-ui/**` - Swagger UI assets
- `/api-docs/**` - OpenAPI specification
- `/swagger-ui.html` - Swagger UI homepage
- `/api/auth/**` - Authentication endpoints

These exclusions are configured in `SecurityConfig.java`.

## Customization

### Disabling Swagger in Production
To disable Swagger in production, add to `application-prod.properties`:

```properties
springdoc.swagger-ui.enabled=false
springdoc.api-docs.enabled=false
```

### Adding More Server URLs
Edit `OpenApiConfig.java` to add more servers:

```java
.servers(List.of(
    new Server()
        .url("http://localhost:8080")
        .description("Development Server"),
    new Server()
        .url("https://api.microfinance.com")
        .description("Production Server"),
    new Server()
        .url("https://staging-api.microfinance.com")
        .description("Staging Server")
))
```

### Adding Operation-Level Documentation
Add `@Operation` annotations to controller methods for detailed descriptions:

```java
@Operation(
    summary = "Get user by ID",
    description = "Retrieves detailed information about a specific user",
    responses = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    }
)
@GetMapping("/{id}")
public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
    // implementation
}
```

## Troubleshooting

### Swagger UI Not Loading
1. Verify application is running on port 8080
2. Check `application.properties` has `springdoc.swagger-ui.enabled=true`
3. Clear browser cache
4. Try accessing: `http://localhost:8080/swagger-ui/index.html`

### 401 Unauthorized Errors
1. Ensure you've logged in via `/api/auth/login`
2. Copy the token from the response
3. Click "Authorize" button in Swagger UI
4. Enter `Bearer ` followed by the token (note the space)
5. Make sure token hasn't expired (24-hour validity)

### Endpoints Not Showing
1. Verify controllers have `@RestController` annotation
2. Check that methods have HTTP method annotations (`@GetMapping`, `@PostMapping`, etc.)
3. Rebuild the project: `mvn clean install`
4. Restart the application

## Benefits

1. **Developer-Friendly**: Easy exploration of API without reading documentation
2. **Interactive Testing**: Test endpoints directly from browser
3. **Auto-Generated**: Documentation stays in sync with code
4. **Standard Format**: OpenAPI 3.0 specification
5. **Client Generation**: Can generate client SDKs in multiple languages
6. **Reduced Postman Dependencies**: Built-in testing interface

## Additional Resources

- [SpringDoc OpenAPI Documentation](https://springdoc.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

## Next Steps

1. Start your application
2. Open `http://localhost:8080/swagger-ui.html`
3. Explore all available endpoints
4. Test authentication flow
5. Try making requests to different endpoints
6. Review request/response schemas

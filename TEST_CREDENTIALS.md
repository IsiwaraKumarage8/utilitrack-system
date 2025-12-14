# Test Login Credentials

## Sample Users from Database

All sample users have the password: **password123**

All passwords are hashed with bcrypt (12 rounds) and stored securely in the database.

### User Roles Available:
- **Admin** - Full system access
- **Manager** - Management and reporting access
- **Field Officer** - Meter reading and field operations
- **Cashier** - Payment processing
- **Billing Clerk** - Billing operations

### Sample Users in Database:
All users have password: **password123** (except admin)

1. **jsmith** (Admin, Operations) - password123
2. **mjohnson** (Manager, Finance) - password123
3. **rperera** (Field Officer, Operations) - password123
4. **sfernando** (Cashier, Finance) - password123
5. **asilva** (Field Officer, Operations) - password123
6. **ndias** (Billing Clerk, Finance) - password123
7. **kwijesinghe** (Cashier, Finance) - password123
8. **pweerasinghe** (Field Officer, Operations) - password123
9. **dbandara** (Manager, Customer Service) - password123
10. **tgunasekara** (Billing Clerk, Finance) - password123
11. **lranasinghe** (Field Officer, Operations) - password123
12. **mgamage** (Cashier, Finance) - password123

**Admin user created separately:**
- **admin** (Admin, Operations) - admin123

## Creating a Test User

You can register a new user through the signup form with the following roles:
- Admin
- Field Officer
- Cashier
- Manager
- Billing Clerk

## API Endpoints

- **POST /api/auth/login** - Login with username and password
- **POST /api/auth/register** - Register new user
- **GET /api/auth/verify** - Verify JWT token (requires auth)
- **POST /api/auth/change-password** - Change password (requires auth)

## Testing the Login

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to `http://localhost:5173`
4. Create a new user via the signup form
5. Login with your created credentials

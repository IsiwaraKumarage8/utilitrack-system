## 📋 Table of Contents

- [System Overview](#system-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Setup Instructions](#setup-instructions)
- [Design System](#design-system)

---

## 🎯 System Overview

UtiliTrack is a modern utility management platform that provides:

- **Customer Management**: Track residential, commercial, industrial, and government customers
- **Service Connections**: Manage electricity, water, and gas connections
- **Meter Management**: Monitor and record meter readings
- **Billing System**: Generate and track bills with payment status
- **Payment Processing**: Record and manage customer payments
- **Complaint Tracking**: Handle customer complaints with priority levels
- **Reports & Analytics**: Generate insights with visual dashboards
- **User Roles**: Admin, Field Officer, Cashier, Manager, Billing Clerk

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 4.x with gradient-heavy premium design
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Charts**: Recharts (Line & Pie charts)
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **State Management**: React Hooks (useState, useLocation)

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: Microsoft SQL Server (MSSQL)
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator
- **Logging**: Winston, Morgan
- **Environment**: dotenv

---

## 📁 Project Structure

```
utilitrack-system/
├── utility-management-backend/
│   ├── config/
│   │   ├── auth.js              # JWT configuration
│   │   └── database.js          # MSSQL connection setup
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── billingController.js # Billing operations
│   │   ├── complaintController.js
│   │   ├── customerController.js
│   │   ├── meterController.js
│   │   ├── paymentController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validateMiddleware.js # Input validation
│   ├── models/
│   │   ├── billingModel.js      # Billing database operations
│   │   ├── customerModel.js     # Customer CRUD
│   │   └── paymentModel.js      # Payment records
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth endpoints
│   │   ├── billingRoutes.js     # /api/billing endpoints
│   │   ├── customerRoutes.js    # /api/customers endpoints
│   │   └── paymentRoutes.js     # /api/payments endpoints
│   ├── utils/
│   │   ├── helpers.js           # Utility functions
│   │   └── logger.js            # Winston logger setup
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express app entry point
│
└── utility-management-frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Badge.jsx           # Status badge with gradients
    │   │   │   ├── Button.jsx          # Gradient button component
    │   │   │   └── Card.jsx            # Premium card wrapper
    │   │   ├── dashboard/
    │   │   │   ├── QuickActions.jsx    # 4-card action grid
    │   │   │   ├── RecentActivity.jsx  # Payment transactions table
    │   │   │   ├── RevenueChart.jsx    # Line chart (6-month revenue)
    │   │   │   ├── StatsCard.jsx       # Gradient stat cards
    │   │   │   └── UtilityPieChart.jsx # Pie chart (utility distribution)
    │   │   └── layout/
    │   │       ├── DashboardLayout.jsx # Main layout wrapper
    │   │       ├── Navbar.jsx          # Top navigation bar
    │   │       └── Sidebar.jsx         # Premium gradient sidebar
    │   ├── pages/
    │   │   ├── Dashboard.jsx           # Main dashboard (IMPLEMENTED)
    │   │   ├── Customers.jsx           # Placeholder
    │   │   ├── Connections.jsx         # Placeholder
    │   │   ├── Meters.jsx              # Placeholder
    │   │   ├── Readings.jsx            # Placeholder
    │   │   ├── Billing.jsx             # Placeholder
    │   │   ├── Payments.jsx            # Placeholder
    │   │   ├── Complaints.jsx          # Placeholder
    │   │   ├── Reports.jsx             # Placeholder
    │   │   └── Settings.jsx            # Placeholder
    │   ├── App.jsx                     # React Router setup
    │   ├── main.jsx                    # React entry point
    │   ├── index.css                   # Global styles + animations
    │   └── App.css
    ├── package.json
    ├── vite.config.js
    └── eslint.config.js
```

---

## 💾 Database Schema

### Core Tables

**Customer**
- `customer_id` (PK)
- `name`, `email`, `phone`, `address`
- `customer_type` (Residential, Commercial, Industrial, Government)
- `status` (Active, Inactive)

**Service_Connection**
- `connection_id` (PK)
- `customer_id` (FK)
- `utility_type_id` (Electricity, Water, Gas)
- `connection_number`, `connection_status`

**Meter**
- `meter_id` (PK)
- `connection_id` (FK)
- `meter_number`, `meter_type`, `meter_status`

**Meter_Reading**
- `reading_id` (PK)
- `meter_id` (FK)
- `reading_date`, `current_reading`, `consumption`

**Billing**
- `bill_id` (PK)
- `connection_id` (FK)
- `bill_number`, `bill_date`, `due_date`
- `total_amount`, `amount_paid`, `outstanding_balance`
- `bill_status` (Paid, Unpaid, Partial)

**Payment**
- `payment_id` (PK)
- `bill_id` (FK)
- `payment_number`, `payment_date`, `payment_amount`, `payment_method`

**Complaint**
- `complaint_id` (PK)
- `customer_id` (FK)
- `complaint_type`, `priority` (High, Medium, Low)
- `complaint_status`, `description`

**User**
- `user_id` (PK)
- `username`, `full_name`, `password_hash`
- `user_role` (Admin, Field Officer, Cashier, Manager, Billing Clerk)

---

## 🎨 Frontend Architecture

### Design System: **Premium Gradient Style**

#### Color Palette
- **Primary**: Blue (#3B82F6) to Cyan (#06B6D4) gradients
- **Success**: Green (#10B981) to Emerald (#059669)
- **Warning**: Orange (#F59E0B) to Amber (#F59E0B)
- **Danger**: Red (#EF4444) to Rose (#F43F5E)
- **Purple**: Purple (#A855F7) to Fuchsia (#D946EF)
- **Background**: Light gradients (Gray-50 → Blue-50 → Purple-50)

#### Key Features
- **Gradient-heavy design** with smooth transitions
- **Glassmorphism** effects (backdrop blur, semi-transparency)
- **Glow effects** on active elements (shadow-blue-500/40)
- **Micro-interactions** (hover scales, rotations, translate)
- **Color-coded components** (each menu item has unique gradient)
- **Custom animations** (fadeIn, slideIn, slideUp, pulse-slow)
- **Premium spacing** (generous padding, relaxed gaps)

### Component Breakdown

#### Layout Components

**Sidebar.jsx**
- Fixed sidebar (w-72) with gradient background
- 10 navigation items with color-coded gradients
- Active state: gradient bg + scale + pulsing dot
- Hover: translate-x, opacity changes, icon rotation
- Mobile: collapsible with overlay

**Navbar.jsx**
- Gradient background with subtle tints
- Search bar, notifications (with badge count), user avatar
- Logout button
- Responsive with mobile menu toggle

**DashboardLayout.jsx**
- Wraps all pages with Sidebar + Navbar
- Main content area with gradient background
- Manages sidebar open/close state

#### Dashboard Components

**StatsCard.jsx** (4 cards)
- Color-coded gradient backgrounds per stat type
- Large gradient text for values
- Icon with glow effect
- Trend indicator with pulsing dot
- Hover: scale + shadow

**RevenueChart.jsx**
- Recharts Line Chart (6 months data)
- Gradient wrapper container
- Smooth animations

**UtilityPieChart.jsx**
- Recharts Pie Chart (Electricity 55%, Water 30%, Gas 15%)
- Color-coded slices
- Gradient wrapper

**RecentActivity.jsx**
- Table with 10 recent payment transactions
- Gradient header background
- Row hover: gradient background + customer name color change
- Status badges (Paid/Unpaid/Partial)

**QuickActions.jsx**
- 4 action cards in grid
- Gradient backgrounds per action
- Hover: scale, glow, border animation
- Icons with rotation effects

#### Common Components

**Button.jsx**
- Variants: primary, secondary, success, danger
- Gradient backgrounds with shadow
- Sizes: sm, md, lg
- Hover: scale + shadow increase

**Card.jsx**
- White background with gradient overlay on hover
- Rounded-2xl corners
- Shadow-xl elevation

**Badge.jsx**
- Gradient backgrounds per status
- Rounded-full with border
- Font-bold text

### Routing Structure

```javascript
/ → redirects to /dashboard
/dashboard → Dashboard page (IMPLEMENTED)
/customers → Customers page (placeholder)
/connections → Service Connections (placeholder)
/meters → Meters (placeholder)
/readings → Meter Readings (placeholder)
/billing → Billing (placeholder)
/payments → Payments (placeholder)
/complaints → Complaints (placeholder)
/reports → Reports (placeholder)
/settings → Settings (placeholder)
```

### Custom Animations (index.css)

```css
@keyframes fadeIn { /* Page load animation */ }
@keyframes slideIn { /* Sidebar menu items */ }
@keyframes slideUp { /* Quick action cards */ }
@keyframes pulse-slow { /* Logo pulsing */ }
```

---

## ⚙️ Backend Architecture

### API Endpoints (Planned)

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

#### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

#### Billing
- `GET /api/billing` - Get all bills
- `GET /api/billing/:id` - Get bill by ID
- `POST /api/billing` - Generate new bill
- `PUT /api/billing/:id` - Update bill
- `GET /api/billing/unpaid` - Get unpaid bills

#### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record payment
- `GET /api/payments/customer/:id` - Get customer payments

### Middleware

- **authMiddleware.js**: JWT token verification
- **validateMiddleware.js**: Input validation using express-validator
- **errorHandler.js**: Global error handling with proper HTTP status codes

### Security Features

- JWT authentication
- Password hashing (bcryptjs)
- Rate limiting (express-rate-limit)
- CORS configuration
- Helmet security headers
- Input validation and sanitization

---


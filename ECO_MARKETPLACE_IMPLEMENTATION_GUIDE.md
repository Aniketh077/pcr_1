# Eco Marketplace Implementation Guide

## Overview
Complete B2B marketplace for Post-Consumer Recycled (PCR) materials with guest browsing and admin management.

## Backend Implementation Status ✅

### Models Created
1. **Industry.js** - Industries catalog (FMCG, Paints, Auto Lubes, etc.)
2. **Material.js** - PCR materials with dynamic attributes
3. **BuyerRequest.js** - Guest buyer requests with status tracking

### Controllers Created
1. **industryController.js** - CRUD operations for industries
2. **materialController.js** - Materials management with dynamic filtering
3. **buyerRequestController.js** - Request submission and management
4. **analyticsController.js** - Dashboard metrics and reports

### Routes Created
1. **/api/industries** - Public & admin industry endpoints
2. **/api/materials** - Public material browsing & admin management
3. **/api/buyer-requests** - Guest submission & admin management
4. **/api/analytics** - Admin analytics dashboard

### Email Templates
- **requestTemplates.js** - Request confirmation & status updates

### Key Features Implemented
✅ Dynamic attribute system for materials
✅ Dynamic filter generation based on material attributes
✅ Stock management with automatic deduction on confirmation
✅ Email notifications for buyers
✅ Admin request management with status workflow
✅ Analytics and reporting
✅ CSV export functionality

## Frontend Pages to Complete

### Public Pages (No Auth Required)
1. **EcoHomePage.jsx** ✅ - Landing page with industries
2. **IndustriesPage.jsx** - List all industries
3. **MaterialsPage.jsx** - Browse materials with dynamic filters
4. **MaterialDetailPage.jsx** - Material details + request form
5. **RequestConfirmationPage.jsx** - After request submission

### Admin Pages (Auth Required)
1. **AdminEcoHomePage.jsx** - Analytics dashboard
2. **AdminIndustries.jsx** - Manage industries
3. **AdminMaterials.jsx** - Manage materials & stock
4. **AdminRequests.jsx** - Manage buyer requests
5. **AdminAnalytics.jsx** - Reports and insights

## Database Configuration

### MongoDB Setup
```javascript
// Database name: eco_marketplace
const MONGODB_URI = "mongodb://localhost:27017/eco_marketplace"
```

### Collections
- industries
- materials
- buyerrequests
- users (admin only)

## Environment Variables Required

```env
# Database
MONGODB_URI=mongodb://localhost:27017/eco_marketplace

# JWT
JWT_SECRET=your_jwt_secret_here

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=eco-marketplace-images
AWS_REGION=ap-south-1

# Email (Gmail API)
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token
GMAIL_USER=your_email@gmail.com
ADMIN_EMAIL=admin@ecomarketplace.com

# App
APP_NAME=Eco Marketplace
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## API Endpoints Summary

### Public Endpoints (No Auth)
```
GET    /api/industries                 - List all active industries
GET    /api/industries/:slug           - Get industry by slug
GET    /api/materials                  - List materials with filters
GET    /api/materials/:id              - Get material details
GET    /api/materials/filters/:slug    - Get available filters
POST   /api/buyer-requests             - Submit guest request
GET    /api/buyer-requests/verify/:id  - Verify request
```

### Admin Endpoints (Requires Auth + Admin)
```
POST   /api/industries                 - Create industry
PUT    /api/industries/:id             - Update industry
DELETE /api/industries/:id             - Delete industry

POST   /api/materials                  - Create material
PUT    /api/materials/:id              - Update material
PATCH  /api/materials/:id/stock        - Adjust stock
POST   /api/materials/:id/attributes   - Update attributes

GET    /api/buyer-requests             - List all requests
GET    /api/buyer-requests/:id         - Get request details
PATCH  /api/buyer-requests/:id/status  - Update status
POST   /api/buyer-requests/:id/notes   - Add admin note
GET    /api/buyer-requests/export      - Export CSV

GET    /api/analytics/dashboard        - Dashboard metrics
GET    /api/analytics/requests-by-industry
GET    /api/analytics/top-materials
GET    /api/analytics/stock-report
GET    /api/analytics/buyer-insights
```

## Frontend Implementation Steps

### 1. Create Redux Slices
```javascript
// industrySlice.js - Industry state management
// materialSlice.js - Material state management
// buyerRequestSlice.js - Request state management
```

### 2. Build Public Pages
- Industries listing with material counts
- Materials catalog with dynamic filters component
- Material detail with image gallery
- Request form with validation
- Confirmation page

### 3. Build Admin Pages
- Dashboard with metrics cards
- Industries management (CRUD)
- Materials management with attribute editor
- Request management with status updates
- Analytics charts and reports

### 4. Create Shared Components
- DynamicFilters.jsx - Renders filters based on attributes
- MaterialCard.jsx - Material display card
- RequestForm.jsx - Guest request submission
- StatusBadge.jsx - Request status display
- StockIndicator.jsx - Material stock display

## Dynamic Filtering System

### How It Works
1. Admin adds custom attributes to materials (e.g., PCR Grade, Purity %)
2. Backend analyzes all materials in an industry
3. Generates filter options dynamically
4. Frontend renders appropriate filter UI (checkbox, range, select)
5. Filters applied via query parameters

### Example Material Attributes
```javascript
{
  "pcrGrade": {
    "label": "PCR Grade",
    "value": "A+",
    "type": "select",
    "filterEnabled": true
  },
  "purity": {
    "label": "Purity Level",
    "value": 98.5,
    "type": "number",
    "unit": "%",
    "filterEnabled": true
  },
  "colors": {
    "label": "Available Colors",
    "value": ["Clear", "Blue", "Green"],
    "type": "multiselect",
    "filterEnabled": true
  }
}
```

## Request Workflow

### Status Flow
1. **New** - Buyer submits request, receives confirmation email
2. **Reviewed** - Admin reviews availability
3. **Confirmed** - Admin confirms, stock auto-deducted, buyer notified
4. **Dispatched** - Materials shipped, buyer notified
5. **Completed** - Order fulfilled
6. **Cancelled** - Request cancelled

### Stock Management
- When admin confirms request:
  - Check if requested quantity <= available quantity
  - Deduct quantity from material stock
  - Mark request as stockDeducted
  - Send confirmation email

## Testing Checklist

### Backend Tests
- [ ] Create industry via API
- [ ] Create material with attributes
- [ ] Submit buyer request (guest)
- [ ] Update request status to Confirmed
- [ ] Verify stock deduction
- [ ] Test dynamic filter generation
- [ ] Export requests as CSV

### Frontend Tests
- [ ] Browse industries
- [ ] Filter materials by attributes
- [ ] View material details
- [ ] Submit request form
- [ ] Admin login
- [ ] Manage materials
- [ ] Update request status

## Deployment Steps

### 1. Database
```bash
# Create MongoDB database
mongosh
use eco_marketplace

# Indexes will be created automatically by Mongoose
```

### 2. Backend
```bash
cd server
npm install
npm start  # Port 5000
```

### 3. Frontend
```bash
cd ecotrade
npm install
npm run dev  # Port 5173
```

### 4. Create Admin User
```bash
# Via MongoDB or API call
db.users.insertOne({
  name: "Admin",
  email: "admin@ecomarketplace.com",
  password: "$2a$10$...",  # bcrypt hash
  role: "admin",
  isActive: true
})
```

## Sample Data Structure

### Industry Example
```json
{
  "name": "FMCG",
  "slug": "fmcg",
  "description": "Fast Moving Consumer Goods packaging materials",
  "icon": "https://s3.../fmcg-icon.png",
  "displayOrder": 1,
  "isActive": true
}
```

### Material Example
```json
{
  "materialCode": "PCR-FMCG-789123",
  "name": "High-Grade PCR PET Flakes",
  "industry": "ObjectId(...)",
  "description": "Food-grade recycled PET suitable for bottles",
  "images": ["https://s3.../image1.jpg"],
  "attributes": {
    "pcrGrade": {
      "label": "PCR Grade",
      "value": "A+",
      "type": "select",
      "filterEnabled": true
    }
  },
  "availableQuantity": 5000,
  "unit": "kg",
  "minimumOrderQuantity": 100,
  "certifications": ["ISO 9001", "FDA Approved"],
  "isActive": true
}
```

### Request Example
```json
{
  "requestId": "REQ-2025-001234",
  "buyerName": "John Doe",
  "buyerEmail": "john@company.com",
  "buyerMobile": "9876543210",
  "countryCode": "+91",
  "companyName": "ABC Industries",
  "material": "ObjectId(...)",
  "requestedQuantity": 500,
  "requestedUnit": "kg",
  "status": "New"
}
```

## Next Steps for Full Implementation

1. Complete remaining frontend pages (MaterialsPage, MaterialDetailPage, etc.)
2. Build admin dashboard with charts
3. Implement image upload for industries and materials
4. Add request filtering and search in admin
5. Build analytics charts (Chart.js or Recharts)
6. Add pagination for large datasets
7. Implement export functionality
8. Add email notifications for low stock
9. Create user manual/documentation

## Production Considerations

1. **Security**
   - Rate limiting on public endpoints
   - Input validation and sanitization
   - HTTPS only
   - Environment variable protection

2. **Performance**
   - Redis caching for filters
   - CDN for images
   - Database indexing
   - Lazy loading

3. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Email delivery monitoring
   - Stock alerts

4. **Backup**
   - Daily MongoDB backups
   - S3 versioning for images
   - Request data retention policy

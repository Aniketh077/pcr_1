# Eco Marketplace - Quick Start Guide

## 🚀 Run the Application

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend (Terminal 1)
```bash
cd /tmp/cc-agent/60776110/project/project/server
npm start
```
✅ Backend runs on: http://localhost:5000

### 3. Start Frontend (Terminal 2)
```bash
cd /tmp/cc-agent/60776110/project/project/ecotrade
npm run dev
```
✅ Frontend runs on: http://localhost:5173

---

## 🌐 Access Points

### Public Pages (No Auth)
- **Landing Page**: http://localhost:5173/eco-home
- **Browse Materials**: http://localhost:5173/eco-materials
- **Filter by Industry**: http://localhost:5173/eco-materials?industry=fmcg

### Admin Pages (Requires Auth)
- **Admin Login**: http://localhost:5173/admin (existing admin system)
- Note: Admin dashboard for Eco Marketplace needs to be built

### API Endpoints
- **Health Check**: http://localhost:5000/api/health
- **Industries**: http://localhost:5000/api/industries
- **Materials**: http://localhost:5000/api/materials

---

## 📝 Test the System

### Step 1: Create an Industry (Admin)
```bash
curl -X POST http://localhost:5000/api/industries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -d '{
    "name": "FMCG",
    "description": "Fast Moving Consumer Goods",
    "displayOrder": 1
  }'
```

### Step 2: Create a Material (Admin)
```bash
curl -X POST http://localhost:5000/api/materials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -d '{
    "name": "PCR PET Flakes",
    "industry": "INDUSTRY_ID_FROM_STEP_1",
    "description": "High-grade recycled PET",
    "availableQuantity": 5000,
    "unit": "kg",
    "minimumOrderQuantity": 100
  }'
```

### Step 3: Submit Request (Guest - No Auth)
```bash
curl -X POST http://localhost:5000/api/buyer-requests \
  -H "Content-Type: application/json" \
  -d '{
    "buyerName": "John Doe",
    "buyerEmail": "john@company.com",
    "buyerMobile": "9876543210",
    "companyName": "ABC Industries",
    "materialId": "MATERIAL_ID_FROM_STEP_2",
    "requestedQuantity": 500
  }'
```

---

## 🗂️ Database Structure

### Collections Created
```
eco_marketplace (database)
├── industries
├── materials
├── buyerrequests
└── users (admin)
```

### Sample Industry Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "FMCG",
  "slug": "fmcg",
  "description": "Fast Moving Consumer Goods",
  "displayOrder": 1,
  "isActive": true
}
```

### Sample Material Document
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "materialCode": "PCR-FMCG-789456",
  "name": "PCR PET Flakes",
  "industry": "507f1f77bcf86cd799439011",
  "availableQuantity": 5000,
  "unit": "kg",
  "minimumOrderQuantity": 100,
  "attributes": {
    "pcrGrade": {
      "label": "PCR Grade",
      "value": "A+",
      "type": "select",
      "filterEnabled": true
    }
  }
}
```

---

## 🎨 Key Features

### 1. Guest Browsing
- Browse industries without login
- Filter materials dynamically
- View material details
- Submit requests (no account needed)

### 2. Dynamic Filtering
- Filters generated from material attributes
- Multiple filter types (select, range, boolean)
- Real-time filtering
- Industry-specific filters

### 3. Request Management
- Guest submission with email confirmation
- Admin status updates (New → Reviewed → Confirmed → Dispatched → Completed)
- Automatic stock deduction on confirmation
- Email notifications

### 4. Stock Management
- Real-time availability tracking
- MOQ (Minimum Order Quantity) validation
- Auto-deduction on confirmation
- Stock alerts (low/out of stock)

---

## 🔑 Environment Variables

Make sure `.env` file has:
```env
MONGODB_URI=mongodb://localhost:27017/eco_marketplace
JWT_SECRET=eco_marketplace_jwt_secret_2025
APP_NAME=Eco Marketplace
FRONTEND_URL=http://localhost:5173
PORT=5000

# Optional (for production)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_USER=your_email@gmail.com
ADMIN_EMAIL=admin@ecomarketplace.com
```

---

## 🐛 Common Issues

### Issue: "MongoDB Connection Error"
**Solution:**
```bash
# Start MongoDB
mongod

# Check if running
mongo --eval "db.version()"
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill process
kill -9 $(lsof -ti:5000)
```

### Issue: "Module not found"
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 API Endpoints Reference

### Public (No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/industries | List industries |
| GET | /api/industries/:slug | Get industry |
| GET | /api/materials | List materials |
| GET | /api/materials/:id | Get material |
| GET | /api/materials/filters/:slug | Get filters |
| POST | /api/buyer-requests | Submit request |

### Admin (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/industries | Create industry |
| PUT | /api/industries/:id | Update industry |
| DELETE | /api/industries/:id | Delete industry |
| POST | /api/materials | Create material |
| PUT | /api/materials/:id | Update material |
| PATCH | /api/materials/:id/stock | Adjust stock |
| GET | /api/buyer-requests | List requests |
| PATCH | /api/buyer-requests/:id/status | Update status |
| GET | /api/analytics/dashboard | Get metrics |

---

## ✅ Build Status

- ✅ Backend: Fully implemented
- ✅ Frontend (Public): Implemented
- ⏳ Frontend (Admin): Needs to be built
- ✅ Database Models: Complete
- ✅ API Routes: Complete
- ✅ Email Templates: Complete

---

## 📦 What's Included

### Backend Files
```
server/
├── models/
│   ├── Industry.js
│   ├── Material.js
│   └── BuyerRequest.js
├── controllers/
│   ├── industryController.js
│   ├── materialController.js
│   ├── buyerRequestController.js
│   └── analyticsController.js
├── routes/
│   ├── industryRoutes.js
│   ├── materialRoutes.js
│   ├── buyerRequestRoutes.js
│   └── analyticsRoutes.js
├── emailService/
│   └── templates/requestTemplates.js
└── server.js
```

### Frontend Files
```
ecotrade/src/
├── api/
│   ├── industryAPI.js
│   ├── materialAPI.js
│   ├── buyerRequestAPI.js
│   └── analyticsAPI.js
├── pages/
│   ├── EcoHomePage.jsx
│   ├── MaterialsPage.jsx
│   └── MaterialDetailPage.jsx
└── App.jsx
```

---

## 🎯 Next Actions

1. **Test with real data**: Create industries and materials via API
2. **Build admin UI**: Create management pages for industries, materials, requests
3. **Setup MongoDB Atlas**: For production database
4. **Configure AWS S3**: For image storage
5. **Setup Gmail API**: For email notifications
6. **Deploy**: Backend + Frontend to production

---

## 📚 Documentation

- **Complete Guide**: `ECO_MARKETPLACE_IMPLEMENTATION_GUIDE.md`
- **Build Summary**: `ECO_MARKETPLACE_BUILD_COMPLETE.md`
- **This Guide**: `QUICK_START_GUIDE.md`

---

## 🎉 Success!

Your Eco Marketplace for PCR Materials is ready to run!

**Frontend**: http://localhost:5173/eco-home
**Backend**: http://localhost:5000/api

Happy coding! 🚀

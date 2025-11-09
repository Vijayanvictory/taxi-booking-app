🚖 Taxi Booking Web Application
A modern, full-stack taxi booking platform with real-time fare estimation, vehicle management, and a premium user interface.

🌐 Live Application
Frontend: https://taxi-booking-app-nine.vercel.app

Backend API: https://taxi-booking-app-t7xq.onrender.com

Admin Panel: https://taxi-booking-app-nine.vercel.app/admin/login

🔐 Demo Credentials
Username: admin

Password: admin123

✨ Features
🎯 Customer Features
Service Selection: Choose between One-Way trips and Round Trip journeys

Smart Search: Search by pickup location, drop location, date, and time

Real-Time Fare Estimation: Dynamic pricing based on distance and vehicle type

Vehicle Gallery: Browse vehicles with images, specifications, and pricing

Instant Booking: Quick booking process with unique reference ID

Booking Confirmation: Professional success page with booking details

Premium UI: Modern, gradient-based design with smooth animations

🔧 Admin Features
Secure Authentication: JWT-based admin login system

Dashboard Analytics: Real-time booking statistics and insights

Vehicle Management: Complete CRUD operations for vehicles

Add new vehicles with images (Cloudinary integration)

Edit vehicle details and pricing

Toggle vehicle status (Active/Inactive)

Delete vehicles

Booking Management: View and manage all customer bookings

Image Upload: Drag-and-drop image upload with Cloudinary

Responsive Design: Works seamlessly on all devices

🛠️ Tech Stack
Frontend
Framework: React.js 18 (Vite)

Routing: React Router v6

Styling: Tailwind CSS

Icons: Lucide React

HTTP Client: Axios

Build Tool: Vite

Backend
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL (Render)

Authentication: JWT (JSON Web Tokens)

Validation: Express Validator

Security: bcrypt, CORS

Deployment & Services
Frontend Hosting: Vercel

Backend Hosting: Render

Database: Render PostgreSQL (Free Tier)

Image Storage: Cloudinary

Version Control: GitHub

taxi-booking-app/
├── client/                    # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/
│   │   │   ├── admin/       # Admin pages
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── VehicleManagement.jsx
│   │   │   │   └── BookingManagement.jsx
│   │   │   └── customer/    # Customer pages
│   │   │       ├── LandingPage.jsx
│   │   │       ├── SearchResults.jsx
│   │   │       ├── BookingForm.jsx
│   │   │       └── BookingSuccess.jsx
│   │   ├── services/        # API integration
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json          # Vercel configuration
│
├── server/                   # Backend (Node.js/Express)
│   ├── config/
│   │   ├── db.js           # Database connection
│   │   ├── initDb.js       # Database initialization
│   │   └── cloudinary.js   # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   └── validation.js   # Input validation
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Vehicle.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vehicles.js
│   │   └── bookings.js
│   ├── utils/
│   │   └── helpers.js
│   ├── server.js           # Entry point
│   └── package.json
│
├── .gitignore
└── README.md

🚀 Local Development Setup
Prerequisites
Node.js (v16 or higher)

PostgreSQL (v14 or higher)

Git

Cloudinary Account (free tier)

1. Clone Repository
bash
git clone https://github.com/Vijayanvictory/taxi-booking-app.git
cd taxi-booking-app
2. Backend Setup
bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/taxibook
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOL

# Initialize database (creates tables and admin user)
node config/initDb.js

# Start development server
npm run dev
Backend will run at: http://localhost:5000

3. Frontend Setup
bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
EOL

# Start development server
npm run dev
Frontend will run at: http://localhost:5173

🌍 Deployment Guide
Backend (Render)
Create PostgreSQL Database

Go to Render Dashboard

Click "New +" → "PostgreSQL"

Copy the "Internal Database URL"

Deploy Backend

Click "New +" → "Web Service"

Connect GitHub repository

Configure:

Root Directory: server

Build Command: npm install

Start Command: npm start

Add Environment Variables:

text
PORT=5000
NODE_ENV=production
DATABASE_URL=<your-postgres-url>
JWT_SECRET=<random-secret-key>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
Initialize Database

Go to Shell tab in Render

Run: node config/initDb.js

Frontend (Vercel)
Deploy Frontend

Go to Vercel Dashboard

Click "Add New..." → "Project"

Import GitHub repository

Configure:

Framework: Vite

Root Directory: client

Build Command: npm run build

Output Directory: dist

Add Environment Variables:

text
VITE_API_URL=https://your-backend.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<your-preset>
Deploy

Click "Deploy"

Wait 2-3 minutes

Your app is live! 🎉

📊 API Endpoints
Authentication
POST /api/auth/login - Admin login

Vehicles
GET /api/vehicles - Get all vehicles

POST /api/vehicles - Create vehicle (Admin)

PUT /api/vehicles/:id - Update vehicle (Admin)

DELETE /api/vehicles/:id - Delete vehicle (Admin)

Bookings
GET /api/bookings - Get all bookings (Admin)

GET /api/bookings/:referenceId - Get booking by reference

POST /api/bookings - Create booking

DELETE /api/bookings/:id - Delete booking (Admin)

🔒 Environment Variables
Backend (.env)
text
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Frontend (.env)
text
VITE_API_URL=https://your-backend-url.com/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
🧪 Testing
Manual Testing Checklist
Customer Flow:

✅ Landing page loads

✅ Search for vehicles (One-Way/Round Trip)

✅ View search results with fare calculation

✅ Book a vehicle

✅ Receive booking confirmation with reference ID

Admin Flow:

✅ Login to admin panel

✅ View dashboard statistics

✅ Add new vehicle with image

✅ Edit vehicle details

✅ Toggle vehicle status

✅ View all bookings

✅ Delete bookings

🐛 Troubleshooting
Common Issues
1. CORS Error

Ensure backend allowedOrigins includes your frontend URL

Check Render environment variables

2. Database Connection Failed

Verify DATABASE_URL is correct

Ensure database is created and running

3. Images Not Uploading

Check Cloudinary credentials

Verify upload preset is unsigned

4. 404 on Page Refresh (Vercel)

Ensure vercel.json exists in client folder

Check React Router configuration

👨‍💻 Author
Vijayan

GitHub: @Vijayanvictory

Repository: taxi-booking-app

📝 License
This project is open source and available under the MIT License.

🙏 Acknowledgments
React.js Team

Vite Team

Tailwind CSS

Lucide Icons

Render & Vercel for hosting

Cloudinary for image storage

🚀 Future Enhancements
 Payment Gateway Integration (Razorpay/Stripe)

 Real-time driver tracking with maps

 Email/SMS notifications

 Ride history for customers

 Rating and review system

 Multi-language support

 Mobile app (React Native)

⭐ If you like this project, please give it a star on GitHub!

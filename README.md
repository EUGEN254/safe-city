🛡️ SafeCity - Community Safety Platform
SafeCity is a comprehensive community safety platform that enables citizens to report incidents, access safety resources, and connect with local authorities in real-time.

📋 Table of Contents
Features

Project Structure

Installation

Configuration

API Documentation

Deployment

Contributing

✨ Features
🎯 Core Features
Incident Reporting: Submit safety reports with images and location data

Real-time Dashboard: Visual analytics and statistics

Chat Support: Direct messaging with support team

Safety Resources: Emergency contacts and safety tips

Notifications: Real-time alerts and updates

🔧 Technical Features
Real-time Communication: Socket.io for live updates

File Upload: Cloudinary integration for image handling

Authentication: JWT-based secure authentication

Responsive Design: Mobile-first approach

Admin Dashboard: Comprehensive admin interface

🏗️ Project Structure
text
safecity/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions
├── admin/                  # Admin Dashboard Frontend
│   ├── src/
│   │   ├── components/     # Admin components
│   │   ├── pages/          # Admin pages
│   │   └── context/        # Admin context
└── backend/               # Node.js Backend API
    ├── controllers/        # Route controllers
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── middleware/        # Custom middleware
    └── utils/             # Utility functions
🚀 Installation
Prerequisites
Node.js (v16 or higher)

MongoDB

Cloudinary account (for file uploads)

1. Clone the Repository
bash
git clone <repository-url>
cd safecity
2. Backend Setup
bash
cd backend
npm install

# Create .env file
cp .env.example .env
Configure your .env file:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safecity
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
3. Frontend Setup (Client)
bash
cd ../client
npm install

# Create .env file
cp .env.example .env
Configure your .env file:

env
VITE_BACKEND_URL=http://localhost:5000
4. Admin Dashboard Setup
bash
cd ../admin
npm install

# Create .env file
cp .env.example .env
Configure your .env file:

env
VITE_BACKEND_URL=http://localhost:5000
🏃‍♂️ Running the Application
Development Mode
Start Backend Server:

bash
cd backend
npm run dev
Start Client Application:

bash
cd client
npm run dev
Start Admin Dashboard:

bash
cd admin
npm run dev
Production Build
bash
# Build all applications
cd client && npm run build
cd ../admin && npm run build
cd ../backend && npm start
📊 API Endpoints
Authentication
POST /api/user/register - User registration

POST /api/user/login - User login

POST /api/user/logout - User logout

GET /api/user/getme - Get current user

Reports
POST /api/reports - Create new report

GET /api/reports - Get all reports

GET /api/reports/:id - Get specific report

PUT /api/reports/:id - Update report

DELETE /api/reports/:id - Delete report

Messages
GET /api/messages/conversations - Get user conversations

POST /api/messages - Send message

PUT /api/messages/read/:userId - Mark messages as read

Dashboard
GET /api/dashboard/stats - Get dashboard statistics

GET /api/dashboard/analytics - Get analytics data

🗃️ Database Models
User Model
javascript
{
  fullname: String,
  email: String,
  password: String,
  role: String, // 'user', 'admin', 'support'
  profilePicture: String,
  isVerified: Boolean
}
Report Model
javascript
{
  title: String,
  description: String,
  category: String,
  urgency: String, // 'High', 'Medium', 'Low'
  images: [String],
  reporter: ObjectId,
  anonymous: Boolean,
  location: Object
}
Message Model
javascript
{
  senderId: ObjectId,
  receiverId: ObjectId,
  text: String,
  image: String,
  read: Boolean
}
🎨 UI Components
Main Components
Dashboard: User analytics and overview

Report: Incident reporting form

ChatSupport: Real-time messaging

SafetyTips: Educational resources

EmergencyContacts: Local emergency services

Settings: User preferences and account management

Admin Components
Admin Dashboard: Platform analytics

User Management: User administration

Report Management: Report moderation

System Settings: Platform configuration

🔧 Configuration
Cloudinary Setup
Create a Cloudinary account

Get your API credentials

Configure in backend .env file

Email Service
Configure email service (Gmail recommended)

Enable 2-factor authentication

Generate app-specific password

Socket.io
Real-time features are enabled through Socket.io for:

Live chat messages

Real-time notifications

Online user status

Dashboard updates

🚀 Deployment
Vercel Deployment
Each frontend application has vercel.json for easy deployment:

bash
# Deploy client
cd client && vercel --prod

# Deploy admin
cd admin && vercel --prod

# Deploy backend
cd backend && vercel --prod
Environment Variables for Production
Ensure all environment variables are set in your deployment platform.

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🆘 Support
For support and questions:

Check the Help Center in the application

Contact support through the chat feature

Create an issue in the repository

🔮 Future Enhancements
Mobile app development

Push notifications

Multi-language support

Advanced analytics

Integration with local authorities

Machine learning for threat detection

SafeCity - Building safer communities together! 🛡️
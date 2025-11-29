# 🛡️ SafeCity — Community Safety Platform

SafeCity is a comprehensive community safety platform designed to empower citizens to report incidents, access safety resources, and communicate with local authorities in real time.

---

## 📋 Table of Contents

- [Features](#-features)  
- [Project Structure](#-project-structure)  
- [Installation](#-installation)  
- [Configuration](#-configuration)  
- [Running the Application](#-running-the-application)  
- [API Documentation](#-api-documentation)  
- [Database Models](#-database-models)  
- [UI Components](#-ui-components)  
- [Deployment](#-deployment)  
- [Contributing](#-contributing)  
- [License](#-license)  
- [Support](#-support)  
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

### 🎯 Core Features
- **Incident Reporting** – Users can submit reports with images and location data.  
- **Real-time Dashboard** – Interactive analytics and safety insights.  
- **Live Chat Support** – Direct messaging between users and support teams.  
- **Safety Resources** – Emergency contacts, safety tips, and guides.  
- **Notifications** – Real-time alerts and important safety updates.

### 🔧 Technical Features
- **Realtime Communication** via Socket.io  
- **Image Uploads** powered by Cloudinary  
- **Secure Authentication** using JWT  
- **Responsive UI** designed mobile-first  
- **Admin Dashboard** for platform monitoring and user management  

---

## 🏗️ Project Structure

safecity/
├── client/ # React Frontend (User App)
│ └── src/
│ ├── components/ # Shared UI components
│ ├── pages/ # Application pages
│ ├── context/ # Global state management
│ └── utils/ # Helper functions

├── admin/ # Admin Dashboard (React)
│ └── src/
│ ├── components/ # Admin components
│ ├── pages/ # Admin pages
│ └── context/ # Admin context providers

└── backend/ # Node.js API Server
├── controllers/ # Route logic handlers
├── models/ # MongoDB models
├── routes/ # API endpoints
├── middleware/ # Auth & request middleware
└── utils/ # Utility scripts

yaml
Copy code

---

## 🚀 Installation

### **Prerequisites**
- Node.js (v16+)  
- MongoDB  
- Cloudinary account  

---

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd safecity
2. Backend Setup
bash
Copy code
cd backend
npm install
cp .env.example .env
Configure .env:

ini
Copy code
PORT=5000
MONGODB_URI=mongodb://localhost:27017/safecity
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
3. Client Setup
bash
Copy code
cd ../client
npm install
cp .env.example .env
ini
Copy code
VITE_BACKEND_URL=http://localhost:5000
4. Admin Dashboard Setup
bash
Copy code
cd ../admin
npm install
cp .env.example .env
ini
Copy code
VITE_BACKEND_URL=http://localhost:5000
🏃‍♂️ Running the Application
Development Mode
Start Backend

bash
Copy code
cd backend
npm run dev
Start Client App

bash
Copy code
cd client
npm run dev
Start Admin Dashboard

bash
Copy code
cd admin
npm run dev
Production Build
bash
Copy code
cd client && npm run build
cd ../admin && npm run build
cd ../backend && npm start
📊 API Documentation
Authentication
POST /api/user/register – Register user

POST /api/user/login – Login

POST /api/user/logout – Logout

GET /api/user/getme – Get current user

Reports
POST /api/reports – Create report

GET /api/reports – List all reports

GET /api/reports/:id – Get report

PUT /api/reports/:id – Update report

DELETE /api/reports/:id – Delete report

Messages
GET /api/messages/conversations – Get conversations

POST /api/messages – Send message

PUT /api/messages/read/:userId – Mark messages as read

Dashboard
GET /api/dashboard/stats – System statistics

GET /api/dashboard/analytics – Analytics data

🗃️ Database Models
User Model
javascript
Copy code
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
Copy code
{
  title: String,
  description: String,
  category: String,
  urgency: String, // High, Medium, Low
  images: [String],
  reporter: ObjectId,
  anonymous: Boolean,
  location: Object
}
Message Model
javascript
Copy code
{
  senderId: ObjectId,
  receiverId: ObjectId,
  text: String,
  image: String,
  read: Boolean
}
🎨 UI Components
Main App Components
Dashboard

Report Form

Chat Support

Safety Tips

Emergency Contacts

Settings

Admin Components
Admin Dashboard

User Management

Report Moderation

System Settings

🔧 Configuration
Cloudinary
Create an account

Retrieve API credentials

Add credentials to .env

Email Service
Use Gmail (recommended)

Enable 2FA

Generate App Password

Socket.io Usage
Live messaging

Real-time notifications

Online/offline tracking

Live dashboard updates

🚀 Deployment
Vercel Deployment
bash
Copy code
# Deploy client
cd client && vercel --prod

# Deploy admin dashboard
cd admin && vercel --prod

# Deploy backend
cd backend && vercel --prod
Ensure all environment variables are properly configured in Vercel or your hosting platform.

🤝 Contributing
Fork the repository

Create a new branch

bash
Copy code
git checkout -b feature/amazing-feature
Commit your changes

Push and open a Pull Request

📝 License
This project is licensed under the MIT License. See the LICENSE file for details.

🆘 Support
Use the in-app Help Center

Contact support via the chat feature

Open an issue in the repository

🔮 Future Enhancements
Mobile application

Push notifications

Multi-language support

Advanced analytics

Government authority integrations

Threat detection using machine learning
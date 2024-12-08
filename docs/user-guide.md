# Tour Booking Website User Guide

## 1. Introduction

### 1.1 Project Overview
This is a Tour Booking Website developed as a thesis project using Node.js and Express.js. The application provides a comprehensive platform for users to explore, book, and manage tour packages.

### 1.2 Key Technologies
- **Backend**: Node.js with Express.js
- **Database**: MySQL (via Sequelize ORM)
- **Template Engine**: Pug
- **Additional Technologies**:
  - TypeScript
  - Cloudinary (Image Management)
  - Nodemailer (Email Notifications)
  - Express Session
  - MD5 (Password Hashing)

## 2. System Requirements

### 2.1 Minimum Hardware Requirements
- Processor: Intel Core i3 or equivalent
- RAM: 4GB
- Storage: 10GB free disk space

### 2.2 Software Requirements
- Node.js (v16 or higher)
- MySQL Server
- Web Browser (Chrome, Firefox, Safari recommended)

## 3. Installation Guide

### 3.1 Prerequisites
1. Install Node.js from [official Node.js website](https://nodejs.org)
2. Install MySQL Server
3. Clone the project repository

### 3.2 Setup Steps
```bash
# Clone the repository
git clone https://github.com/caotoanng03/Tour-Site

# Navigate to project directory
cd tour-site

# Install dependencies
npm install

# Create .env file with necessary configurations
# (database credentials, email settings, etc.)

# Run database migrations
npm run migrate

# Start the application
npm start
```

## 4. Configuration

### 4.1 Environment Variables
Create a `.env` file in the root directory with the following keys:
- `DB_HOST`: MySQL database host
- `DB_USER`: Database username
- `DB_PASS`: Database password
- `DB_NAME`: Database name
- `EMAIL_USER`: Nodemailer email
- `EMAIL_PASS`: Email password
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## 5. Features

### 5.1 User Registration
- Create a new account
- Verify email
- Reset password functionality

### 5.2 Tour Browsing
- View available tour packages
- Filter tours by:
  - Destination
  - Price range
  - Duration
  - Difficulty level

### 5.3 Booking Process
- Select tour package
- Choose dates
- Add participants
- Make payment
- Receive booking confirmation

### 5.4 User Dashboard
- View booking history
- Manage personal information
- Track upcoming and past tours

## 6. Security Features
- Password hashing with MD5
- Session-based authentication
- CSRF protection
- Input validation

## 7. Troubleshooting

### 7.1 Common Issues
1. **Database Connection Error**
   - Check database credentials
   - Ensure MySQL service is running
   - Verify network connectivity

2. **Email Notification Failures**
   - Confirm email service credentials
   - Check internet connectivity
   - Verify SMTP settings

3. **Image Upload Problems**
   - Check Cloudinary configuration
   - Verify file size and format

## 8. Performance Optimization
- Implemented caching mechanisms
- Efficient database queries
- Asynchronous processing for emails and image uploads

## 9. Future Enhancements
- Real-time booking tracking
- Enhanced search functionality
- Mobile application
- Advanced analytics dashboard

## 10. Contact & Support
**Project Developer**: Cao Toan
**Contact Email**: caotoan940@gmail.com

## 11. License
This project is licensed under ISC License.

---

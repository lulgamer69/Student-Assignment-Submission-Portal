# 📢 Announcement System Setup Guide

## ✅ What's Included

- **Email Notifications**: Teachers post announcements → Emails sent to ALL students automatically
- **Database Storage**: All announcements saved in MongoDB
- **Role-Based Access**: Only teachers can create/delete announcements
- **Beautiful Email Template**: Professional HTML emails with Acadly branding

---

## 🚀 Quick Setup (3 Steps)

### Step 1️⃣: Install Dependencies
```bash
cd backend
npm install
```

### Step 2️⃣: Setup Gmail App Password

**Why?** Gmail blocks regular passwords for security. You need an "App Password".

1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not already done)
3. Search for "App passwords"
4. Select "Mail" + "Windows Computer"
5. Copy the 16-character password

### Step 3️⃣: Create `.env` File

Create `backend/.env`:
```
MONGO_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/acadly
JWT_SECRET=your_random_secret_key_12345
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
PORT=5000
```

---

## 🧪 Test It

### Teacher Creates Announcement
```bash
curl -X POST http://localhost:5000/api/announcements \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lab Submission Deadline Extended",
    "message": "The deadline for Lab 3 has been extended to Friday 5 PM. All students need to resubmit.\n\nFiles should be in PDF format.\n\nThanks!"
  }'
```

**Expected Response:**
```json
{
  "message": "✅ Announcement created + emails sent to all students",
  "announcement": { ... },
  "emailsSent": 5
}
```

Each student gets an email like this:

---

### Get All Announcements
```bash
curl -X GET http://localhost:5000/api/announcements \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📧 API Endpoints

| Method | Endpoint | Who | What |
|--------|----------|-----|------|
| POST | `/api/announcements` | Teachers | Create announcement + send emails |
| GET | `/api/announcements` | Everyone | See all announcements |
| DELETE | `/api/announcements/:id` | Teachers | Delete announcement |

---

## 🔐 Authentication

All endpoints require a Bearer token in header:
```
Authorization: Bearer <your_jwt_token>
```

Get token by logging in:
```bash
POST /api/auth/login
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

---

## ⚠️ Common Issues

### ❌ Email Not Sending?
- Check `EMAIL_USER` and `EMAIL_PASS` are correct
- Verify Gmail allows "Less secure apps" (if not using App Password)
- Check MongoDB connection is working

### ❌ "Only teachers can perform this action"
- Make sure you're logged in as a teacher role
- Check JWT token is valid

### ❌ No students found to email?
- Register at least one student account first
- Verify students have `role: "student"` in database

---

## 📁 File Structure

```
backend/
├── controllers/
│   └── announcementController.js (✅ Ready)
├── models/
│   └── Announcement.js (✅ Ready)
├── routes/
│   └── announcementRoutes.js (✅ Ready)
├── utils/
│   ├── sendEmail.js (✅ Ready)
│   └── emailTemplate.js (✅ Ready)
├── middleware/
│   ├── authMiddleware.js (✅ Updated with teacherOnly)
├── server.js (✅ Routes added)
├── package.json (✅ nodemailer added)
└── .env (⚠️ You need to create this)
```

---

## 🎯 Next: Add to Frontend

Soon you can add an announcements page to your UI with:
- List of all announcements
- Create announcement form (teacher only)
- Beautiful cards showing teacher name + date

---

## 💡 Pro Tips

✅ Announcements get sorted by **newest first**
✅ Emails include a "View in Dashboard" button
✅ Teachers can only delete their own announcements
✅ All fields are validated (title + message required)

---

Ready! 🚀

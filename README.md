# ☕️🍽️ Café Reservation System - README

A full-stack café reservation and blog website built using the **MERN stack** (MongoDB, Express, React, Node.js). This project supports admin management, customer reservations, a dynamic food menu, blog posts, and user feedback — all in one responsive platform.

---

## 🔗 Live Demo

> *\[Add your deployed frontend/backend links here if available]*

---

## 📁 Folder Structure

```
Week-1/
├── backend/         # Node.js + Express API with MongoDB
├── frontend/        # React-based client interface
├── README.md
├── build.sh         # Optional deployment helper
├── deploy.sh
```

---

## 🚀 Features

### 👥 User-Side

* View menu categorized as breakfast, lunch, dinner, drinks, desserts
* Make café reservations
* Preview blog posts
* Submit contact form
* Responsive layout for mobile and desktop

### 🔐 Admin Panel

* Admin login & authentication (JWT-based)
* View dashboard statistics (daily reservations, approvals, rejections, upcoming)
* Manage food menu (CRUD)
* Manage blogs and comments
* View contact messages
* Review and approve/reject reservations
* Update profile and settings (image upload, password change, notification toggle)

---

## 🛠️ Technologies Used

### Frontend:

* React + Vite
* React Router
* Tailwind CSS (assumed from context)
* Material UI (MUI)

### Backend:

* Node.js & Express
* MongoDB with Mongoose
* Multer (image upload)
* bcrypt, JWT (auth)
* Nodemailer (email templates for reservation confirmations)

---

## 🧪 Run Locally

### Prerequisites:

* Node.js
* MongoDB installed or MongoDB Atlas URI
* `npm` or `yarn`

### Backend

```bash
cd backend
npm install
npm run dev  # Or: nodemon server.js
```

* Environment variables required:

  ```
  PORT=5000
  MONGO_URI=your_mongodb_connection
  JWT_SECRET=your_jwt_secret
  ```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Scripts

* `build.sh` and `deploy.sh` can be used for server deployment (e.g., render, vercel, heroku).

---

## 📸 Screenshots

> Add screenshots or demo GIFs of your app here to make your repo visually engaging.

---

## 👨‍💼 Author

* **Taha Asad**
  [GitHub](https://github.com/Taha-Asad)

---

## 📝 License

This project is for educational and internship purposes. Contact the author before reusing or modifying commercially.

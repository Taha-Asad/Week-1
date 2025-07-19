# SkillifyZone Production Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- MongoDB database
- SMTP email service

### 1. Environment Setup

```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit environment variables
nano backend/.env
```

### 2. Database Setup

```bash
# Connect to MongoDB
# Update MONGODB_URI in .env file

# Seed admin account
cd backend
npm run seed
```

### 3. Build and Deploy

```bash
# Build frontend
cd frontend
npm install
npm run build

# Setup backend
cd ../backend
npm install --production
npm start
```

## 🔧 Environment Variables

### Required Variables
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/skillifyzone

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=3d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker

```bash
# Build backend
cd backend
docker build -t skillifyzone-backend .

# Build frontend
cd ../frontend
docker build -t skillifyzone-frontend .

# Run containers
docker run -d -p 5000:5000 skillifyzone-backend
docker run -d -p 3000:80 skillifyzone-frontend
```

## ☁️ Cloud Deployment

### Heroku
```bash
# Create Heroku app
heroku create skillifyzone-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Deploy backend (serverless)
cd ../backend
vercel
```

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🔒 Security Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Regular security updates
- [ ] Database backups

## 📊 Monitoring

### Health Checks
- Backend: `GET /health`
- API Status: `GET /`

### Logs
```bash
# View application logs
tail -f backend/logs/app.log

# Monitor errors
grep ERROR backend/logs/app.log
```

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check MongoDB connection
   mongo your-database-url
   ```

2. **Email Not Working**
   ```bash
   # Test email configuration
   node backend/scripts/testEmail.js
   ```

3. **File Uploads**
   ```bash
   # Check upload directory permissions
   ls -la backend/uploads/
   chmod 755 backend/uploads/
   ```

4. **CORS Issues**
   ```bash
   # Update FRONTEND_URL in .env
   # Restart backend server
   ```

## 📈 Performance Optimization

### Backend
- Enable gzip compression
- Use Redis for caching
- Optimize database queries
- Set up CDN for static files

### Frontend
- Enable code splitting
- Optimize bundle size
- Use CDN for assets
- Enable service workers

## 🔄 Updates

### Backend Updates
```bash
cd backend
git pull origin main
npm install
npm start
```

### Frontend Updates
```bash
cd frontend
git pull origin main
npm install
npm run build
```

## 📞 Support

For deployment issues:
1. Check logs in `backend/logs/`
2. Verify environment variables
3. Test database connection
4. Check network connectivity
5. Review error messages

## 📋 Production Checklist

- [ ] Environment variables configured
- [ ] Database connected and seeded
- [ ] Email service working
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] File uploads working
- [ ] Admin account created
- [ ] CORS settings updated
- [ ] Security headers enabled
- [ ] Error logging configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Performance optimized
- [ ] Security audit completed

---

**Happy Deploying! 🎉** 
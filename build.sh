#!/bin/bash

echo "🚀 Starting SkillifyZone Production Build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Create production directories
print_status "Creating production directories..."
mkdir -p production/backend
mkdir -p production/frontend

# Backend build
print_status "Building backend..."
cd backend

# Install dependencies
print_status "Installing backend dependencies..."
npm install --production

# Copy backend files
print_status "Copying backend files..."
cp -r * ../production/backend/
cp ../backend/env.example ../production/backend/.env.example

# Remove dev dependencies from production
rm -rf ../production/backend/node_modules
npm install --production
mv node_modules ../production/backend/

cd ..

# Frontend build
print_status "Building frontend..."
cd frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Build frontend
print_status "Building frontend for production..."
npm run build

# Copy frontend build
print_status "Copying frontend build..."
cp -r dist/* ../production/frontend/

cd ..

# Create production package.json
print_status "Creating production package.json..."
cat > production/package.json << EOF
{
  "name": "skillifyzone-production",
  "version": "1.0.0",
  "description": "SkillifyZone Restaurant Management System - Production Build",
  "scripts": {
    "start": "cd backend && npm start",
    "dev": "cd backend && npm run dev",
    "frontend": "cd frontend && npm run serve",
    "install-all": "cd backend && npm install && cd ../frontend && npm install",
    "setup": "npm run install-all && cd backend && npm run seed"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "keywords": ["restaurant", "management", "production"],
  "author": "SkillifyZone Team",
  "license": "MIT"
}
EOF

# Create deployment guide
print_status "Creating deployment guide..."
cat > production/DEPLOYMENT.md << 'EOF'
# SkillifyZone Production Deployment Guide

## Prerequisites
- Node.js 16+ and npm 8+
- MongoDB database (local or cloud)
- SMTP email service (for notifications)

## Environment Setup

1. **Copy environment file:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Configure environment variables:**
   - Update `MONGODB_URI` with your database URL
   - Set `JWT_SECRET` to a strong secret key
   - Configure email settings for notifications
   - Set `FRONTEND_URL` to your domain

## Database Setup

1. **Connect to MongoDB:**
   - Local: `mongodb://localhost:27017/skillifyzone`
   - Cloud: Use MongoDB Atlas or your cloud provider

2. **Seed admin account:**
   ```bash
   cd backend
   npm run seed
   ```

## Deployment Options

### Option 1: Traditional Server
1. Upload files to your server
2. Install dependencies: `npm run install-all`
3. Set up environment variables
4. Start the application: `npm start`

### Option 2: Docker (Recommended)
1. Create Dockerfile and docker-compose.yml
2. Build and run with Docker Compose

### Option 3: Cloud Platforms
- **Heroku**: Use Procfile and environment variables
- **Vercel**: Deploy frontend, use serverless for backend
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform or Droplets

## Production Checklist

- [ ] Environment variables configured
- [ ] Database connected and seeded
- [ ] Email service configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] File uploads working
- [ ] Admin account created
- [ ] CORS settings updated
- [ ] Security headers enabled
- [ ] Error logging configured

## Monitoring

- Health check: `GET /health`
- API status: `GET /`
- Monitor logs for errors
- Set up uptime monitoring

## Security

- Use strong JWT secrets
- Enable HTTPS
- Set up rate limiting
- Configure CORS properly
- Regular security updates
- Database backups

## Performance

- Enable gzip compression
- Use CDN for static files
- Optimize database queries
- Monitor memory usage
- Set up caching

## Troubleshooting

1. **Database connection issues:**
   - Check MongoDB URI
   - Verify network connectivity
   - Check database permissions

2. **File upload issues:**
   - Verify upload directory permissions
   - Check file size limits
   - Ensure disk space

3. **Email not working:**
   - Verify SMTP settings
   - Check email service credentials
   - Test with different email provider

## Support

For issues and questions:
- Check logs in `/backend/logs`
- Monitor application health
- Review error messages
- Contact development team
EOF

# Create Docker configuration
print_status "Creating Docker configuration..."
cat > production/docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
    env_file:
      - ./backend/.env
    volumes:
      - ./backend/uploads:/app/uploads
    depends_on:
      - mongodb
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000
    depends_on:
      - backend
    restart: unless-stopped

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=skillifyzone
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
EOF

# Create backend Dockerfile
cat > production/backend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["npm", "start"]
EOF

# Create frontend Dockerfile
cat > production/frontend/Dockerfile << 'EOF'
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create nginx configuration
cat > production/frontend/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # Handle React Router
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API proxy (if needed)
        location /api {
            proxy_pass http://backend:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF

# Create .dockerignore files
cat > production/backend/.dockerignore << 'EOF'
node_modules
npm-debug.log
.env
.env.local
.env.production
.git
.gitignore
README.md
EOF

cat > production/frontend/.dockerignore << 'EOF'
node_modules
dist
.env
.env.local
.env.production
.git
.gitignore
README.md
EOF

print_success "Production build completed successfully!"
print_status "Production files are in the 'production' directory"
print_status "Next steps:"
echo "1. Configure environment variables in production/backend/.env"
echo "2. Set up your database"
echo "3. Deploy using Docker or traditional server"
echo "4. Check DEPLOYMENT.md for detailed instructions"

print_warning "Remember to:"
echo "- Change default admin credentials"
echo "- Set strong JWT secrets"
echo "- Configure email settings"
echo "- Set up SSL certificates"
echo "- Configure domain and CORS settings" 
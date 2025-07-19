#!/bin/bash

echo "🚀 SkillifyZone Production Deployment"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Building frontend...${NC}"
cd frontend
npm install
npm run build
cd ..

echo -e "${BLUE}Setting up backend...${NC}"
cd backend
npm install --production
cd ..

echo -e "${GREEN}Build completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Copy the entire project to your server"
echo "2. Set up environment variables in backend/.env"
echo "3. Install MongoDB and connect to database"
echo "4. Run: cd backend && npm run seed"
echo "5. Start backend: cd backend && npm start"
echo "6. Serve frontend: cd frontend && npm run serve" 
#!/bin/bash

# --- CONFIGURATION ---
SERVER_USER="root"
SERVER_IP="194.146.123.114"
KEY_PATH="$HOME/.ssh/parspack-private-key.pem"
DEPLOY_PATH="/var/www/dist"
PM2_NAME="mysteryplay-web"
# ---------------------

# Exit immediately if a command exits with a non-zero status
set -e

# Ensure the key has the correct permissions (required by SSH)
chmod 400 "$KEY_PATH"

echo "🚀 Starting deployment..."

# 1. Build the web bundle locally
echo "📦 Building Expo web bundle..."
npx expo export -p web

# 2. Upload files to the server
# -e specifies the SSH command and tells it which key to use
echo "📤 Uploading files to server..."
rsync -avz --delete -e "ssh -i $KEY_PATH" ./dist/ ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}

# 3. Restart the server process via SSH
echo "🔄 Restarting the web server..."
ssh -i "$KEY_PATH" ${SERVER_USER}@${SERVER_IP} << EOF
  cd ${DEPLOY_PATH}
  
  # Check if PM2 is installed, if not, try to install it
  if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing..."
    npm install -g pm2 serve
  fi

  # Check if process is running
  if pm2 describe ${PM2_NAME} > /dev/null; then
    echo "Restarting existing PM2 process..."
    pm2 restart ${PM2_NAME}
  else
    echo "Starting new PM2 process..."
    pm2 start serve --name "${PM2_NAME}" -- -s . -p 8080
  fi
  
  pm2 save
EOF

echo "✅ Deployment complete!"


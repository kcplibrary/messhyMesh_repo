#!/bin/bash

echo "Starting messyMesh Master Setup..."

# 1. System Update
echo "Updating system..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git wget

# 2. Install VS Code
echo "Installing Visual Studio Code..."
wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" -y
sudo apt update && sudo apt install code -y

# 3. Install PHP & MySQL
echo "Installing PHP and MySQL..."
sudo apt install -y php-cli php-fpm php-mysql php-curl php-gd php-mbstring php-xml php-zip mysql-server

# 4. Install Node.js (via NVM)
echo "Installing Node.js..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts

# 5. Create messyMesh Folders in Documents
echo "Creating folders in ~/Documents/messyMesh..."
mkdir -p ~/Documents/messyMesh/backend/api
mkdir -p ~/Documents/messyMesh/backend/uploads
mkdir -p ~/Documents/messyMesh/backend/config
mkdir -p ~/Documents/messyMesh/frontend

# 6. Verification
echo "Checking installations..."
php -v | head -n 1
node -v
sudo systemctl is-active mysql

echo "AYAKERTSSS! Project is at ~/Documents/messyMesh"

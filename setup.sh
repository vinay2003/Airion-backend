#!/bin/bash
echo "Installing dependencies for User Website..."
cd user-website && npm install
cd ..

echo "Installing dependencies for Vendor Dashboard..."
cd vendor-dashboard && npm install
cd ..

echo "Installing dependencies for Admin Panel..."
cd admin-panel && npm install
cd ..

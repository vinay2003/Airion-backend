#!/bin/bash
echo "Installing dependencies for User Website..."
cd frontend/user-website && npm install
cd ../..

echo "Installing dependencies for Vendor Dashboard..."
cd frontend/vendor-dashboard && npm install
cd ../..

echo "Installing dependencies for Admin Panel..."
cd frontend/admin-panel && npm install
cd ../..

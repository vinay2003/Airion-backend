@echo off
echo Installing root dependencies...
npm install

echo Installing dependencies for User Website...
cd apps\user-website && npm install
cd ..\..

echo Installing dependencies for Vendor Dashboard...
cd apps\vendor-dashboard && npm install
cd ..\..

echo Installing dependencies for Admin Panel...
cd apps\admin-panel && npm install
cd ..\..

echo Installing dependencies for API...
cd apps\api && npm install
cd ..\..

echo Setup COMPLETE!
pause

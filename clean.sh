#! /bin/sh

echo "----------------------------------------"
echo "CLEAN - common"
echo "----------------------------------------"
cd common
npm run clean

echo "----------------------------------------"
echo "CLEAN - backend"
echo "----------------------------------------"
cd ../backend
npm run clean

echo "----------------------------------------"
echo "CLEAN - database"
echo "----------------------------------------"
cd ../database
npm run clean

echo "----------------------------------------"
echo "CLEAN - running"
echo "----------------------------------------"
cd ../backend
npm run clean
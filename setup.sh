#! /bin/sh

set -e # set to exit if non-zero return value

echo "----------------------------------------"
echo "SETUP - common"
echo "----------------------------------------"
cd common
npm install || exit 1
npm run build || exit 1

echo "----------------------------------------"
echo "SETUP - backend"
echo "----------------------------------------"
cd ../backend
npm install || exit 1
npm run build || exit 1

echo "----------------------------------------"
echo "SETUP - frontend"
echo "----------------------------------------"
cd ../frontend
npm install || exit 1
npm run build || exit 1

echo "----------------------------------------"
echo "SETUP - database"
echo "----------------------------------------"
cd ../database
npm install || exit 1
npm run build || exit 1
npm run new || exit 1

echo "----------------------------------------"
echo "SETUP - running"
echo "----------------------------------------"
cd ../backend
npm run run || exit 1
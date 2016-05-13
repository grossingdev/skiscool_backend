npm run build
npm run build-api
echo Running web app.
nohup npm run start-prod > /dev/null 2>&1 &
echo Running backend api.
nohup node dist/api/api.js > /dev/null 2>&1 &
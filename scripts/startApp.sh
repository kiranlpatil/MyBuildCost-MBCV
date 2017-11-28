fuser -k 80/tcp
cd /home/bitnami/apps/jobmosis-staging/myApp/dist/
mkdir -p logs
chown -R ubuntu /home/bitnami/apps/jobmosis-staging
npm -v
npm install
node app.server.prod2.js --NODE_ENV=staging> /dev/null 2> /dev/null < /dev/null &

fuser -k 8080/tcp
cd /home/ubuntu/apps/costcontrol-automation/
mkdir -p logs
npm -v
npm install
node app.server.prod.js --NODE_ENV=staging &> /dev/null 2> /dev/null < /dev/null &

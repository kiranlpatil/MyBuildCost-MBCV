sudo kill `sudo lsof -t -i:8080`
cd /home/ubuntu/apps/costcontrol-automation/dist/
mkdir -p logs
chown -R ubuntu /home/ubuntu/apps/costcontrol-automation/
npm -v
npm install
node app.server.prod.js --NODE_ENV=staging &> /dev/null 2> /dev/null < /dev/null &

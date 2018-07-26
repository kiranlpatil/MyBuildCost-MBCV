kill `sudo lsof -t -i:8080`
cd /home/bitnami/apps/costcontrol-automation/dist/
mkdir -p logs
chown -R ubuntu /home/bitnami/apps/costcontrol
npm -v
npm install
nohup node app.server.prod.js --NODE_ENV=staging &> /dev/null 2> /dev/null < /dev/null &

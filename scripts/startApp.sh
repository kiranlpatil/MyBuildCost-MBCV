fuser kill `sudo lsof -t -i:8080`
cd /home/bitnami/apps/costcontrol/costcontrol-automation/dist/
mkdir -p logs
npm -v
npm install
node app.server.prod.js --NODE_ENV=staging &> /dev/null 2> /dev/null < /dev/null &

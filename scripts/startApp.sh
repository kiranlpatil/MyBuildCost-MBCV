sudo kill `sudo lsof -t -i:8080`
cd /home/ubuntu/apps/costcontrol-automation/dist/
mkdir -p logs
chown -R ubuntu /home/ubuntu/apps/costcontrol-automation
sudo npm -v
sudo node -v
npm -v
node -v
node app.server.prod2.js --NODE_ENV=staging &> /dev/null 2> /dev/null < /dev/null &

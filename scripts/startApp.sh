sudo kill `sudo lsof -t -i:8080`
cd /home/ubuntu/apps/costcontrol-automation/dist/
sudo mkdir -p logs
sudo chown -R ubuntu /home/ubuntu/apps
sudo npm -v
sudo npm install
sudo node app.server.prod.js --NODE_ENV=staging &> /dev/null 2> /dev/null < /dev/null &

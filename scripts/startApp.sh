sudo kill `sudo lsof -t -i:80`
cd /home/indrajeetmalave/CostControl/costcontrol-prod-automation
curl -O -L -o myBuildCost https://bitbucket.org/tplabs/costcontrol/downloads/RA_Module_Production_Artifact.zip -u 'AnilGadge:Anil$1993'
sudo apt-get update
sudo apt-get install -y zip
unzip RA_Module_Production_Artifact.zip
chown -R ubuntu /home/indrajeetmalave/CostControl/costcontrol-prod-automation
sudo rm -rf RA_Module_Production_Artifact.zip
mkdir -p logs
sudo npm -v
sudo node -v
npm -v
node -v
sudo npm install
cd dist
node app.server.prod2.js --NODE_ENV=production > /dev/null 2> /dev/null < /dev/null &

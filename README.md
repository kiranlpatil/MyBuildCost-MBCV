#MyBuildCost QUICK START:

Steps for MyBuildCost In Short:-

In below context we discuss about how we can use that configuration.

Requirements:- 1. latest node version
                                2. latest npm version
                                3. mongodb

steps: 

       1.npm install    //npm install --unsafe -perm
       2.typings install (1) for install specific package defination -----> typings install dt~mongoose --save --global
                                   (2)for the installation of specific type file---> sudo npm install --save @types/crypto-js 
       3.start mongodb:  1. ~mongod

       4.For Development Environment:
                            1. ~npm start
                            2. ~node app.server.dev.js --NODE_ENV=development  //Default. for backend configuration (ubuntu) which is using http protocol. 
                                                         OR 
                                                       for http2
                                ~node app.server.dev.http2.js --NODE_ENV=development //Default. for backend configuration (ubuntu) which is using http2 protocol.
                                 
       5.For Staging Environment:
                            1. ~npm start
                            2. ~node app.server.dev.js --NODE_ENV=staging  //Default. for backend configuration (ubuntu) which is using http protocol. 
                                                         OR 
                                                       for http2
                                ~node app.server.dev.http2.js --NODE_ENV=development //Default. for backend configuration (ubuntu) which is using http2 protocol.
                                                                  
       6.For Production Environment:
                            1. ~gulp build.prod or ~npm run build.prod
                            2. cd dist
                            3. ~node app.server.prod2.js --NODE_ENV=production //for backend configurations(ubuntu)which is using http protocol. 
                                                         OR
                                                       for http2
                               ~node app.server.prod2.js --NODE_ENV=production //for backend configurations(ubuntu)which is using http2 protocol
         
        7. Manual Production Deployment :
                            1. Connect to production server using Putty
                            2. Go to 'CostControl > costcontrol-prod-automation' directory
                            3. Check if 'startApp.sh' file exists
                            4. If file does not exist or there are some changes in startApp.sh file, 
                              - Use this command to download startApp script :
                             curl -O -L -o MyBuildCost https://bitbucket.org/tplabs/costcontrol/downloads/startApp.sh -u 'AnilGadge:Anil$1993'
                             - After downloading script file.
                             - Give executable permission for file using : 
                             chmod +x startApp.sh
                             5. Run file using
                             ./startApp.sh

# License

MIT


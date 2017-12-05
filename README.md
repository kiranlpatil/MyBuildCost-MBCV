#JobMosis job portal QUICK START:

Steps for JobMosis In Short:-

JobMosis has both http and https configuration.In below context we discuss about how we can use that configuration.

pre for JobMosis Requirements:- 1. latest node version
                                2. latest npm version
                                3. mongodb

steps: 1.npm install    //npm install --unsafe -perm
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
                            2. ~node app.server.prod.js --NODE_ENV=production //for backend configurations(ubuntu)which is using http protocol. 
                                                         OR
                                                       for http2
                               ~node app.server.prod.js --NODE_ENV=production //for backend configurations(ubuntu)which is using http2 protocol
         
        

Typings is the simple way to manage and install TypeScript definitions. It uses typings.json, which can resolve to the Typings Registry, 
GitHub, NPM, Bower, HTTP and local files. Packages can use type definitions from various sources and different versions, 
knowing they will never conflict for users.
1.npm install typings --global

# Introduction

[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Build status](https://ci.appveyor.com/api/projects/status/lh1m985431jm79o3?svg=true)](https://ci.appveyor.com/project/vyakymenko/angular-seed-express)
[![Build Status](https://travis-ci.org/vyakymenko/angular-seed-express.svg?branch=master)](https://travis-ci.org/vyakymenko/angular-seed-express)
[![Dependency Status](https://david-dm.org/vyakymenko/angular-seed-express.svg)](https://david-dm.org/vyakymenko/angular-seed-express)
[![devDependency Status](https://david-dm.org/vyakymenko/angular-seed-express/dev-status.svg)](https://david-dm.org/vyakymenko/angular-seed-express#info=devDependencies)

**Want to feel like a full-stack Angular 2 developer but know only Express?**

This is an express seed project for Angular 2 apps based on [Minko Gechev's](https://github.com/mgechev) [angular2-seed](https://github.com/mgechev/angular2-seed).
Include:
 
- Full include from [Minko Gechev's](https://github.com/mgechev) [angular2-seed](https://github.com/mgechev/angular2-seed).
- [Express](https://expressjs.com/) Express Node.js server for production/development build API.
- [PM2](http://pm2.keymetrics.io/) daemon for a server running.
- [Nginx](https://github.com/vyakymenko/angular2-nginx-config-example/blob/master/ng2-application.conf) configuration file for your server.

# Fast start

For Angular 2 development information and wiki, look here:
 - [Angular2-Seed](https://github.com/mgechev/angular2-seed) Wow wow it's our parent :)
 - [Angular2-Seed-WIKI](https://github.com/mgechev/angular2-seed/wiki) Wiki Information about Seed!
 - [Angular2-Seed-Advanced](https://github.com/NathanWalker/angular-seed-advanced) It's a [Nathan's Walker](https://github.com/NathanWalker) child seed for multi-platform Angular2 apps.

```bash
git clone --depth 1 https://github.com/vyakymenko/angular2-seed-express.git
cd angular2-seed-express
# install the project dependencies
$ npm install
# watches your files and uses livereload by default
$ npm start
# api document for the app
# $ npm run build.docs

# dev build
$ npm run build.dev
# prod build
$ npm run build.prod

# run Redis
$ src/redis-server
# stop Redis
$ src/redis-cli
$ shutdown SAVE

# run Express server (keep in touch, only after `npm run build.prod` )
$ node app.server.prod.js
# or development
$ node app.server.dev.js

# run server in daemon mode
$ pm2 start app.server.prod.js
```
#Cordova
[Check more about cordova ](https://cordova.apache.org/docs/en/latest/guide/cli/)

```bash
#cordova build
npm run build.prod

#Run on device
cordova run android --device
or
cordova run device
```
#Create self signed ssl certificate to Run website on https
1) install the npm package by the command "npm install localhost-ssl"
2) Copy paste the below commands one by one in Terminal

    Step 1. openssl genrsa -des3 -passout pass:x -out server.pass.key 2048 

    Step 2. openssl rsa -passin pass:x -in server.pass.key -out server.key 

    Step 3. rm server.pass.key 

    Step 4. openssl req -new -key server.key -out server.csr                   (<----- Hit Enter to accept default values or enter your own)

    Step 5. openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

3) To run the site on https,Follow the steps mentioned in #TPl Mobile Seed QUICK START:
 

#Backend Debugging
 Create a Node.js run configuration by attaching the .js file 'app.server.dev.js'.put the breakpoints in .js files of your dist folder in order to debug the server side code.

# Need to know

Before starting development. Run you development server:
```sh
# run dev server
$ node app.server.dev.js
```

# Express Server

Express server run for prod build.

```sh
# run Express server (keep in touch, only after `npm run build.prod` )
# keep in mind that prod build will be builded with prod env flag
$ node app.server.prod.js

# run Express server in dev mode
$ node app.server.dev.js
```

# Daemonize Server

For daemonize your server I propose to uze `PM2`.
```sh
# before daemonize production server `npm run build.prod`
$ pm2 start app.server.prod.js

# restart only your project
$ pm restart <id>
# restart all project on daemon
$ pm2 restart all

# in cluster mode ( example 4 workers )
$ pm2 start app.server.prod.js -i 4
```

More details about [PM2](http://pm2.keymetrics.io/)

# How to configure my NginX

```
##
# Your Angular.io NginX .conf
##

http {
  log_format gzip '[$time_local] ' '"$request" $status $bytes_sent';
  access_log /dev/stdout;
  charset utf-8;

  default_type application/octet-stream;

  types {
    text/html               html;
    text/javascript         js;
    text/css                css;
    image/png               png;
    image/jpg               jpg;
    image/svg+xml           svg svgz;
    application/octet-steam eot;
    application/octet-steam ttf;
    application/octet-steam woff;
  }


  server {
    listen            3353;
    server_name       local.example.com;

    root app/;
    add_header "X-UA-Compatible" "IE=Edge,chrome=1";

    location ~ ^/(scripts|styles)/(.*)$ {
      root .tmp/;
      error_page 404 =200 @asset_pass;
      try_files $uri =404;
      break;
    }

    location @asset_pass {
      root app/;
      try_files $uri =404;
    }

    location / {
      expires -1;
      add_header Pragma "no-cache";
      add_header Cache-Control "no-store, no-cache, must-revalicate, post-check=0 pre-check=0";
      root app/;
      try_files $uri $uri/ /index.html =404;
      break;
    }
  }

  server {
    listen 3354;

    sendfile on;

    ##
    # Gzip Settings
    ##
    gzip on;
    gzip_http_version 1.1;
    gzip_disable      "MSIE [1-6]\.";
    gzip_min_length   1100;
    gzip_vary         on;
    gzip_proxied      expired no-cache no-store private auth;
    gzip_types        text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level   9;


    root dist/;

    location ~ ^/(assets|bower_components|scripts|styles|views) {
      expires     31d;
      add_header  Cache-Control public;
    }

    ##
    # Main file index.html
    ##
    location / {
      try_files $uri $uri/ /index.html =404;
    }
  }
}
```

You can look in source file [here](https://github.com/vyakymenko/angular2-nginx-config-example/blob/master/ng2-application.conf).



# Express Configuration

`src/server/index.js`

```ts
var _clientDir = '../client'; // Dist prod folder.
```

`app.server.dev.js`
```js
// Configure server Port ( keep in mind that this important if you will use reverse-proxy)
// Dev mode will give you only middleware.
// WARNING! DEPEND ON YOUR Angular2 SEED PROJECT API CONFIG!
/**
 * @ng2 Server Runner `Development`.
 */
require('./server')(9001, 'dev');
```

`app.server.prod.js`
```js
// Configure server Port ( keep in mind that this important if you will use reverse-proxy)
// Prod mode give you middleware + static.
// WARNING! DEPEND ON YOUR Angular2 SEED PROJECT API CONFIG!
/**
 * @ng2 Server Runner `Production`.
 */
require('./server')(9000);
```

# Reverse Proxy NginX Config Example
```
server {
    listen 80;

    # App Web Adress Listener
    server_name www.example.com example.com;

    location / {
        # Port where we have our daemon `pm2 start app.server.js`
        proxy_pass http://example.com:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

# Redis Download/Install

 - About [Redis](http://redis.io/).
 - [Download](http://redis.io/download#download) and [install](http://redis.io/download#installation) latest stable version of Redis.
 - [Documentation](http://redis.io/documentation) about Redis.

# Redis Start

After installation we need to start our server:
```sh
# start server
$ src/redis-server
```

# Redis More Settings + Daemonize

 - Redis [Persistence](http://redis.io/topics/quickstart#redis-persistence)
 - Redis [More Properties](http://redis.io/topics/quickstart#installing-redis-more-properly)

# MongoDB

 - In progress
 
# MongoDB update scripts

 - Version : 1.1.1
 - Date : 7 Sept 2017
 - Scenario : Industry code for 'IT' updated in master data so that need to update for candidates and recruiters who are consuming it.
 - Update Script :
 db.candidates.update({"industry.code" : "4"},
   {$set:{"industry.code" : "1000"}},
   { multi: true }
 );
 
 db.recruiters.find({}).forEach(function(recruiter) {
       recruiter.postedJobs.forEach(function(job){
           if(job.industry.code=="4"){
               job.industry.code = "1000"
           }
       })
 	db.recruiters.save(recruiter);
 })
 
 
 - Version : 1.1.2
 - Date : 25 Oct 2017
 - Scenario : Added new field 'isJobPostClosed' into recruiter job post (Run command using mongo shell instead of 
 robomongo)
 - Update Script : 
 db.getCollection('recruiters').find({}).forEach(function(recruiter) {
 for(var i = 0;i <= recruiter.postedJobs.length-1; i++){
     if(recruiter.postedJobs[i].isJobPostClosed == true || 
     recruiter.postedJobs[i].isJobPostClosed == false){
 print("skip");
         
 }else{
 	recruiter.postedJobs[i].isJobPostClosed = false;
     db.getCollection('recruiters').update(
     {"postedJobs._id":recruiter.postedJobs[i]._id},recruiter)
     print("success:" + recruiter.postedJobs[i]._id);
 }
 }
 
 })
 
 
 - Version : 1.1.3
 - Date : 3 Nov 2017
 - Extend job expiry date for all current jobs in production to 30th April 2018 [CN-1806]
 - Update Script
 db.getCollection('recruiters').find({}).forEach(function(recruiter) {
  for(var i = 0;i <= recruiter.postedJobs.length-1; i++){
      if(recruiter.postedJobs[i].isJobPostClosed == true){
  		print("skip");
  	}else {
 	 	recruiter.postedJobs[i].expiringDate = ISODate("2018-04-30T18:29:59.414Z");
 		 db.getCollection('recruiters').update(
 		 {"postedJobs._id":recruiter.postedJobs[i]._id},recruiter)
 		 print("success:" + recruiter.postedJobs[i]._id);
 	}
  }
 })
 
 //script for demo and staging
 db.getCollection('recruiters').find({}).forEach(function(recruiter) {
   for(var i = 0;i <= recruiter.postedJobs.length-1; i++){
       if(recruiter.postedJobs[i].isJobPostClosed == true){
   		print("skip");
   	}else {
  	 	recruiter.postedJobs[i].isJobPostExpired = false;
  		 db.getCollection('recruiters').update(
  		 {"postedJobs._id":recruiter.postedJobs[i]._id},recruiter)
  		 print("success:" + recruiter.postedJobs[i]._id);
  	}
   }
  })
  
  //Updated script for production
  db.getCollection('recruiters').find({}).forEach(function(recruiter) {
    for(var i = 0;i <= recruiter.postedJobs.length-1; i++){
        if(recruiter.postedJobs[i].isJobPostClosed == true){
    		print("skip");
    	}else {
   	 	recruiter.postedJobs[i].expiringDate = ISODate("2018-04-30T18:29:59.414Z");
   	 	recruiter.postedJobs[i].isJobPostExpired = false;
   		 db.getCollection('recruiters').update(
   		 {"postedJobs._id":recruiter.postedJobs[i]._id},recruiter)
   		 print("success:" + recruiter.postedJobs[i]._id);
   	}
    }
   })
   
   //script to create the indexes on table 
   db.getCollection('candidates').createIndex({'professionalDetails.experience':-1})
   db.getCollection('candidates').createIndex({'professionalDetails.currentSalary':1})
   db.getCollection('candidates').createIndex({'location.city':1})
   db.getCollection('candidates').createIndex({'proficiencies':1})
   db.getCollection('candidates').createIndex({'industry.name':1})
   db.getCollection('users').createIndex({'email':1})
   db.getCollection('jobprofiles').createIndex({'recruiterId':1})
   
 
 //Script for performance branch to seperate the postedjobs from recruiter
 db.getCollection('recruiters').find({}).forEach(function(recruiter) {
   for(var i = 0;i <= recruiter.postedJobs.length-1; i++){
       var jobprofile = recruiter.postedJobs[i];
   jobprofile.recruiterId = recruiter._id;
   db.getCollection('jobprofiles').insert(jobprofile);
   }
  })
  
  //Script for image path on Demo for user and recruiter table 
  
  db.getCollection('users').find({'picture':{'$exists':true}}).forEach(function(user) {
  if(user.picture){
  var pic = user.picture;
  print(pic.substr(pic.lastIndexOf('/') + 1));
  pic = '/public/profileImage/'+pic.substr(pic.lastIndexOf('/') + 1);
  print(user._id,pic);
  user.picture=pic.replace(/"/g, "");
  db.getCollection('users').update(
       {"_id":user._id},user);
       print("success:" + user._id);
  }
  })
  
  db.getCollection('recruiters').find({'company_logo':{'$exists':true}}).forEach(function(user) {
  if(user.company_logo){
  var pic = user.company_logo;
  print(pic.substr(pic.lastIndexOf('/') + 1));
  pic = '/public/profileImage/'+pic.substr(pic.lastIndexOf('/') + 1);
  print(user._id,pic);
  user.company_logo=pic.replace(/"/g, "");
  db.getCollection('recruiters').update(
       {"_id":user._id},user);
       print("success:" + user._id);
  }
  })
  
  // script to update experience 
  var experiences = [ "0 Year","1 Year","2 Year","3 Year","4 Year","5 Year","6 Year","7 Year","8 Year","9 Year","10 Year","11 Year","12 Year","13 Year","14 Year","15 Year","16 Year","17 Year","18 Year","19 Year","20 Year","21 Year","22 Year","23 Year","24 Year","25 Year","26 Year","27 Year","29 Year","30 Year" ];
  for(var i=0;i<experiences.length;i++ ){
  db.getCollection('candidates').update({'professionalDetails.experience':experiences[i]},{$set:{'professionalDetails.experience':i}},{multi:true})
  }
  
  //script to update the salary
  var   salary=[ "1 Lac","2 Lacs","3 Lacs","4 Lacs","5 Lacs","6 Lacs","7 Lacs","8 Lacs","9 Lacs","10 Lacs","11 Lacs","12 Lacs","13 Lacs","14 Lacs","15 Lacs","16 Lacs","17 Lacs","18 Lacs","19 Lacs","20 Lacs","21 Lacs","22 Lacs","23 Lacs","24 Lacs","25 Lacs","26 Lacs","27 Lacs","29 Lacs","30 Lacs" ];
  for(var i=0;i<salary.length;i++ ){
  db.getCollection('candidates').update({'professionalDetails.currentSalary':salary[i]},{$set:{'professionalDetails.currentSalary':i}},{multi:true})
  }
  
  
  
#Jobmosis Career_plugin 

Step 1:Inject these two script/link in index.html

<script src="http://34.214.128.209/public/career-plugin/career-plugin.js"></script>
<link rel="stylesheet" href="http://34.214.128.209/public/career-plugin/career-plugin.css">

Step 2: Add this tag in html page.

<div id="jobmosis-career-plugin" name="myIntegrationKey" draggable="true" style="position: absolute;top: 75px;" ></div>

Step 3: Add below code to initilise/load plugin script.

//Default colors is being used for header and button with this code.

var docLoad = new CareerPlugin();
docLoad.load();

or

// If You want diffrent colors(other than existing) for header and button. You can set, see below code.
// First parameter represent for header and second for buttton.

var docLoad = new CareerPlugin();
docLoad.load('#808080','#FF0000');

Note: To avoid typescript compilation error use below declartion(If typescript).
 declare var CareerPlugin:any;


# MySQL

 - In progress
 
# Messaging System Details:

 - we have used msg91 to send sms for otp verification.[https://msg91.com/].Purchase sms on this site and enter the Auth key in the file(/home/nilesh/Projects/tpl-web-fullstack-seed/src/server/app/services/user.service.ts) as follows,
 var msg91 = require("msg91")("AUTHKEY", "TPLSID", "4");//(4 -Transactional route,1-Promotional route)[https://www.npmjs.com/package/msg91]

# Deployment Process for Master Data :
I) Use Following steps to connect AWS server for uploading new Industry Json file :

Download FileZilla FTP Client.
1). Open the FileZilla client.
2). From the top of the home screen, click on Edit and select Settings.
3). On the left side of the menu, expand the Connection section and highlight SFTP.
4). Click on the [Add keyfile...] button and browse your local machine's directories and select your Private
Key file.                                                
5). Then, again from the top of FileZilla's home screen, click on File and select Site Manager.
6). Finally, on the left side of the Site Manager, click on the New Site button and type a unique name
under My Sites that will allow you to easily identify this particular remote server in the future.
7). Now, under the General tab, fill in the Host (an IP address) and Port fields (default is 22).
8). In the Protocol drop-down menu, select SFTP - SSH File Transfer Protocol.
9). In the Logon Type drop-down menu, select Normal.
10). Click on Connect button.


II) Use Following steps and call API for upload new Industry :
File upload steps:-
1). The interface is split in half -- the left side shows the files on your PC, the right side will show the files
on your hosted web space.
To transfer files from your computer to our hosted web space, you'll want to locate your website files on
your computer on the left side of the FTP client, then right-click on a file, then select the option to
'upload.'
( Excel name must be- NewIndustryDataExcel.xlsx )

Path for excel file upload:-(for right hand side i.e.server side)
bitnami/apps/CNext/c-next/src/server/app/framework/public/config
now select file from left side(your local PC files) and right click on the file to be upload and select
"upload". The file will be get uploaded to server(right hand side).
2). Hit the api http://ServerAddress/api/readxlsx from postman.
replace the ServerAddress with address you wish to work on(stagging IP address)


# Data recovery plan :
 We are defining the backup plan in AWS server, By using AWS Images we can create backup of all the things
 like database, application settings and other code .
 In AWS there is another facility of auto backup but now we are not using it because of it require script 
 In Future will give a automation for backup of AWS Server
  
 Follow below step's to create backup and recovery for Jobmosis Application 
 1. Goto  all Services and select EC2 menu
  ![Alt text](readme-images/1.jpg? "Optional Title")
  ![Alt text](readme-images/2.jpg? "Optional Title")
   2. Click on "Running Instances" option from "Resources".
  ![Alt text](readme-images/3.jpg? "Optional Title")
   3. It will give you list of instances running
  4. right click on the instance which you want to backup 
  ![Alt text](readme-images/4.jpg? "Optional Title")
  5. select option Image then select "Create Image"
 ![Alt text](readme-images/5.jpg? "Optional Title")
  6. It will prompt for enter details like Image name, Image Description 
  ![Alt text](readme-images/6.jpg? "Optional Title")
   7. Select No reboot option check
![Alt text](readme-images/8.jpg? "Optional Title")
   8. Click on "Create Image"
  ![Alt text](readme-images/7.jpg? "Optional Title")
 
 II) Restore Steps :
  Go To left side option Snapshots 
  1. check whether the Image is created or not.
  ![Alt text](readme-images/11.jpg? "Optional Title")
  2. click on the EC2 again
  ![Alt text](readme-images/12.jpg? "Optional Title")
  3. Click on the create Instance
  ![Alt text](readme-images/12.jpg? "Optional Title")
  4. Click on the My AMI's
  ![Alt text](readme-images/13.jpg? "Optional Title")
  5. select which backup image is restore
  ![Alt text](readme-images/14.jpg? "Optional Title")
  6. then select free tier and continue
  ![Alt text](readme-images/15.jpg? "Optional Title")
  
 # Deployment process of Code on Various Server :
  Go To left side option Snapshots 
  1. See Image for branches and commit directions :
    ![Alt text](readme-images/16.jpg? "Optional Title")
    

  
# Definition of DONE for developers:
 
 1. Every story should have acceptance criteria.
 2. When all the conditions mentioned in "Acceptance Criteria" is satisfied.
 3. Must follow best practices for coding.
 4. Must follow UI/UX best practices.
 5. Had done code review.
 6. Unit tests are written.
 7. Static code analysis.
 8. There should be zero code duplication.
 9. Time complexity should be minimum.
 10. Performance testing must be completed.
 11. Solution approach must be discussed before development.
 12. Before check in on development branch build prod aot. (gulp build.prod.aot)
 13. Handle exception in backend with proper error handling.
 14. If have any schema change, do changes in admin export functionality.
 
 # Definition of DONE for QA:
 
 1. Functional testing is completed.
 2. All tests are written in Test Suite.
 3. Change is verified on staging.
 4. Sanity test on demo is completed.
 
 # Service Level Agreement (SLA):
 1. SLA for ShowStopper: Item should be fixed and solution should be deployed on production server within 24 hours.
 2. SLA for HighPriority: Item should be fixed and solution should be deployed on production server within 48 hours. 
 Deployment on production server could be differed on case by case but fix need to be made available within 48 hours so that it is ready to deploy on production server/branch.
 
 # Schedule of deployment on production:
 Every last day of week we will deploy new certified & verified version on production server and send a release note to all stake holders.
  
 # Contributors

[<img alt="mgechev" src="https://avatars.githubusercontent.com/u/455023?v=3&s=117" width="117">](https://github.com/mgechev) |[<img alt="ludohenin" src="https://avatars.githubusercontent.com/u/1011516?v=3&s=117" width="117">](https://github.com/ludohenin) |[<img alt="d3viant0ne" src="https://avatars.githubusercontent.com/u/8420490?v=3&s=117" width="117">](https://github.com/d3viant0ne) |[<img alt="Shyam-Chen" src="https://avatars.githubusercontent.com/u/13535256?v=3&s=117" width="117">](https://github.com/Shyam-Chen) |[<img alt="tarlepp" src="https://avatars.githubusercontent.com/u/595561?v=3&s=117" width="117">](https://github.com/tarlepp) |[<img alt="NathanWalker" src="https://avatars.githubusercontent.com/u/457187?v=3&s=117" width="117">](https://github.com/NathanWalker) |
:---: |:---: |:---: |:---: |:---: |:---: |
[mgechev](https://github.com/mgechev) |[ludohenin](https://github.com/ludohenin) |[d3viant0ne](https://github.com/d3viant0ne) |[Shyam-Chen](https://github.com/Shyam-Chen) |[tarlepp](https://github.com/tarlepp) |[NathanWalker](https://github.com/NathanWalker) |

[<img alt="TheDonDope" src="https://avatars.githubusercontent.com/u/1188033?v=3&s=117" width="117">](https://github.com/TheDonDope) |[<img alt="nareshbhatia" src="https://avatars.githubusercontent.com/u/1220198?v=3&s=117" width="117">](https://github.com/nareshbhatia) |[<img alt="hank-ehly" src="https://avatars.githubusercontent.com/u/11639738?v=3&s=117" width="117">](https://github.com/hank-ehly) |[<img alt="Nightapes" src="https://avatars.githubusercontent.com/u/15911153?v=3&s=117" width="117">](https://github.com/Nightapes) |[<img alt="kiuka" src="https://avatars.githubusercontent.com/u/11283191?v=3&s=117" width="117">](https://github.com/kiuka) |[<img alt="vyakymenko" src="https://avatars.githubusercontent.com/u/7300673?v=3&s=117" width="117">](https://github.com/vyakymenko) |
:---: |:---: |:---: |:---: |:---: |:---: |
[TheDonDope](https://github.com/TheDonDope) |[nareshbhatia](https://github.com/nareshbhatia) |[hank-ehly](https://github.com/hank-ehly) |[Nightapes](https://github.com/Nightapes) |[kiuka](https://github.com/kiuka) |[vyakymenko](https://github.com/vyakymenko) |

[<img alt="jesperronn" src="https://avatars.githubusercontent.com/u/6267?v=3&s=117" width="117">](https://github.com/jesperronn) |[<img alt="njs50" src="https://avatars.githubusercontent.com/u/55112?v=3&s=117" width="117">](https://github.com/njs50) |[<img alt="aboeglin" src="https://avatars.githubusercontent.com/u/8297302?v=3&s=117" width="117">](https://github.com/aboeglin) |[<img alt="gkalpak" src="https://avatars.githubusercontent.com/u/8604205?v=3&s=117" width="117">](https://github.com/gkalpak) |[<img alt="ryzy" src="https://avatars.githubusercontent.com/u/994940?v=3&s=117" width="117">](https://github.com/ryzy) |[<img alt="sfabriece" src="https://avatars.githubusercontent.com/u/3108592?v=3&s=117" width="117">](https://github.com/sfabriece) |
:---: |:---: |:---: |:---: |:---: |:---: |
[jesperronn](https://github.com/jesperronn) |[njs50](https://github.com/njs50) |[aboeglin](https://github.com/aboeglin) |[gkalpak](https://github.com/gkalpak) |[ryzy](https://github.com/ryzy) |[sfabriece](https://github.com/sfabriece) |

[<img alt="pgrzeszczak" src="https://avatars.githubusercontent.com/u/3300099?v=3&s=117" width="117">](https://github.com/pgrzeszczak) |[<img alt="eppsilon" src="https://avatars.githubusercontent.com/u/5643?v=3&s=117" width="117">](https://github.com/eppsilon) |[<img alt="e-oz" src="https://avatars.githubusercontent.com/u/526352?v=3&s=117" width="117">](https://github.com/e-oz) |[<img alt="natarajanmca11" src="https://avatars.githubusercontent.com/u/9244766?v=3&s=117" width="117">](https://github.com/natarajanmca11) |[<img alt="jerryorta-dev" src="https://avatars.githubusercontent.com/u/341155?v=3&s=117" width="117">](https://github.com/jerryorta-dev) |[<img alt="JayKan" src="https://avatars.githubusercontent.com/u/1400300?v=3&s=117" width="117">](https://github.com/JayKan) |
:---: |:---: |:---: |:---: |:---: |:---: |
[pgrzeszczak](https://github.com/pgrzeszczak) |[eppsilon](https://github.com/eppsilon) |[e-oz](https://github.com/e-oz) |[natarajanmca11](https://github.com/natarajanmca11) |[jerryorta-dev](https://github.com/jerryorta-dev) |[JayKan](https://github.com/JayKan) |

[<img alt="larsthorup" src="https://avatars.githubusercontent.com/u/1202959?v=3&s=117" width="117">](https://github.com/larsthorup) |[<img alt="domfarolino" src="https://avatars.githubusercontent.com/u/9669289?v=3&s=117" width="117">](https://github.com/domfarolino) |[<img alt="JakePartusch" src="https://avatars.githubusercontent.com/u/6424140?v=3&s=117" width="117">](https://github.com/JakePartusch) |[<img alt="LuxDie" src="https://avatars.githubusercontent.com/u/12536671?v=3&s=117" width="117">](https://github.com/LuxDie) |[<img alt="tsm91" src="https://avatars.githubusercontent.com/u/4459551?v=3&s=117" width="117">](https://github.com/tsm91) |[<img alt="juristr" src="https://avatars.githubusercontent.com/u/542458?v=3&s=117" width="117">](https://github.com/juristr) |
:---: |:---: |:---: |:---: |:---: |:---: |
[larsthorup](https://github.com/larsthorup) |[domfarolino](https://github.com/domfarolino) |[JakePartusch](https://github.com/JakePartusch) |[LuxDie](https://github.com/LuxDie) |[tsm91](https://github.com/tsm91) |[juristr](https://github.com/juristr) |

[<img alt="JohnCashmore" src="https://avatars.githubusercontent.com/u/2050794?v=3&s=117" width="117">](https://github.com/JohnCashmore) |[<img alt="ouq77" src="https://avatars.githubusercontent.com/u/1796191?v=3&s=117" width="117">](https://github.com/ouq77) |[<img alt="gotenxds" src="https://avatars.githubusercontent.com/u/3519520?v=3&s=117" width="117">](https://github.com/gotenxds) |[<img alt="gvsdan" src="https://avatars.githubusercontent.com/u/9144571?v=3&s=117" width="117">](https://github.com/gvsdan) |[<img alt="evanplaice" src="https://avatars.githubusercontent.com/u/303159?v=3&s=117" width="117">](https://github.com/evanplaice) |[<img alt="hAWKdv" src="https://avatars.githubusercontent.com/u/4449497?v=3&s=117" width="117">](https://github.com/hAWKdv) |
:---: |:---: |:---: |:---: |:---: |:---: |
[JohnCashmore](https://github.com/JohnCashmore) |[ouq77](https://github.com/ouq77) |[gotenxds](https://github.com/gotenxds) |[gvsdan](https://github.com/gvsdan) |[evanplaice](https://github.com/evanplaice) |[hAWKdv](https://github.com/hAWKdv) |

[<img alt="c-ice" src="https://avatars.githubusercontent.com/u/347238?v=3&s=117" width="117">](https://github.com/c-ice) |[<img alt="markharding" src="https://avatars.githubusercontent.com/u/851436?v=3&s=117" width="117">](https://github.com/markharding) |[<img alt="ojacquemart" src="https://avatars.githubusercontent.com/u/1189345?v=3&s=117" width="117">](https://github.com/ojacquemart) |[<img alt="tiagomapmarques" src="https://avatars.githubusercontent.com/u/704002?v=3&s=117" width="117">](https://github.com/tiagomapmarques) |[<img alt="devanp92" src="https://avatars.githubusercontent.com/u/4533277?v=3&s=117" width="117">](https://github.com/devanp92) |[<img alt="turbohappy" src="https://avatars.githubusercontent.com/u/437299?v=3&s=117" width="117">](https://github.com/turbohappy) |
:---: |:---: |:---: |:---: |:---: |:---: |
[c-ice](https://github.com/c-ice) |[markharding](https://github.com/markharding) |[ojacquemart](https://github.com/ojacquemart) |[tiagomapmarques](https://github.com/tiagomapmarques) |[devanp92](https://github.com/devanp92) |[turbohappy](https://github.com/turbohappy) |

[<img alt="jvitor83" src="https://avatars.githubusercontent.com/u/3493339?v=3&s=117" width="117">](https://github.com/jvitor83) |[<img alt="troyanskiy" src="https://avatars.githubusercontent.com/u/1538862?v=3&s=117" width="117">](https://github.com/troyanskiy) |[<img alt="Bigous" src="https://avatars.githubusercontent.com/u/6886560?v=3&s=117" width="117">](https://github.com/Bigous) |[<img alt="ip512" src="https://avatars.githubusercontent.com/u/1699735?v=3&s=117" width="117">](https://github.com/ip512) |[<img alt="Green-Cat" src="https://avatars.githubusercontent.com/u/3328823?v=3&s=117" width="117">](https://github.com/Green-Cat) |[<img alt="Yonet" src="https://avatars.githubusercontent.com/u/3523671?v=3&s=117" width="117">](https://github.com/Yonet) |
:---: |:---: |:---: |:---: |:---: |:---: |
[jvitor83](https://github.com/jvitor83) |[troyanskiy](https://github.com/troyanskiy) |[Bigous](https://github.com/Bigous) |[ip512](https://github.com/ip512) |[Green-Cat](https://github.com/Green-Cat) |[Yonet](https://github.com/Yonet) |

[<img alt="TuiKiken" src="https://avatars.githubusercontent.com/u/959821?v=3&s=117" width="117">](https://github.com/TuiKiken) |[<img alt="yassirh" src="https://avatars.githubusercontent.com/u/4649139?v=3&s=117" width="117">](https://github.com/yassirh) |[<img alt="amaltsev" src="https://avatars.githubusercontent.com/u/2480962?v=3&s=117" width="117">](https://github.com/amaltsev) |[<img alt="taguan" src="https://avatars.githubusercontent.com/u/1026937?v=3&s=117" width="117">](https://github.com/taguan) |[<img alt="sonicparke" src="https://avatars.githubusercontent.com/u/1139721?v=3&s=117" width="117">](https://github.com/sonicparke) |[<img alt="brendanbenson" src="https://avatars.githubusercontent.com/u/866866?v=3&s=117" width="117">](https://github.com/brendanbenson) |
:---: |:---: |:---: |:---: |:---: |:---: |
[TuiKiken](https://github.com/TuiKiken) |[yassirh](https://github.com/yassirh) |[amaltsev](https://github.com/amaltsev) |[taguan](https://github.com/taguan) |[sonicparke](https://github.com/sonicparke) |[brendanbenson](https://github.com/brendanbenson) |

[<img alt="brian428" src="https://avatars.githubusercontent.com/u/140338?v=3&s=117" width="117">](https://github.com/brian428) |[<img alt="briantopping" src="https://avatars.githubusercontent.com/u/158115?v=3&s=117" width="117">](https://github.com/briantopping) |[<img alt="ckapilla" src="https://avatars.githubusercontent.com/u/451875?v=3&s=117" width="117">](https://github.com/ckapilla) |[<img alt="cadriel" src="https://avatars.githubusercontent.com/u/205520?v=3&s=117" width="117">](https://github.com/cadriel) |[<img alt="dszymczuk" src="https://avatars.githubusercontent.com/u/539352?v=3&s=117" width="117">](https://github.com/dszymczuk) |[<img alt="dstockhammer" src="https://avatars.githubusercontent.com/u/1156637?v=3&s=117" width="117">](https://github.com/dstockhammer) |
:---: |:---: |:---: |:---: |:---: |:---: |
[brian428](https://github.com/brian428) |[briantopping](https://github.com/briantopping) |[ckapilla](https://github.com/ckapilla) |[cadriel](https://github.com/cadriel) |[dszymczuk](https://github.com/dszymczuk) |[dstockhammer](https://github.com/dstockhammer) |

[<img alt="dwido" src="https://avatars.githubusercontent.com/u/154235?v=3&s=117" width="117">](https://github.com/dwido) |[<img alt="totev" src="https://avatars.githubusercontent.com/u/4454638?v=3&s=117" width="117">](https://github.com/totev) |[<img alt="nosachamos" src="https://avatars.githubusercontent.com/u/1261686?v=3&s=117" width="117">](https://github.com/nosachamos) |[<img alt="koodikindral" src="https://avatars.githubusercontent.com/u/6285484?v=3&s=117" width="117">](https://github.com/koodikindral) |[<img alt="Falinor" src="https://avatars.githubusercontent.com/u/9626158?v=3&s=117" width="117">](https://github.com/Falinor) |[<img alt="allenhwkim" src="https://avatars.githubusercontent.com/u/1437734?v=3&s=117" width="117">](https://github.com/allenhwkim) |
:---: |:---: |:---: |:---: |:---: |:---: |
[dwido](https://github.com/dwido) |[totev](https://github.com/totev) |[nosachamos](https://github.com/nosachamos) |[koodikindral](https://github.com/koodikindral) |[Falinor](https://github.com/Falinor) |[allenhwkim](https://github.com/allenhwkim) |

[<img alt="hpinsley" src="https://avatars.githubusercontent.com/u/750098?v=3&s=117" width="117">](https://github.com/hpinsley) |[<img alt="jeffbcross" src="https://avatars.githubusercontent.com/u/463703?v=3&s=117" width="117">](https://github.com/jeffbcross) |[<img alt="johnjelinek" src="https://avatars.githubusercontent.com/u/873610?v=3&s=117" width="117">](https://github.com/johnjelinek) |[<img alt="justindujardin" src="https://avatars.githubusercontent.com/u/101493?v=3&s=117" width="117">](https://github.com/justindujardin) |[<img alt="lihaibh" src="https://avatars.githubusercontent.com/u/4681233?v=3&s=117" width="117">](https://github.com/lihaibh) |[<img alt="Brooooooklyn" src="https://avatars.githubusercontent.com/u/3468483?v=3&s=117" width="117">](https://github.com/Brooooooklyn) |
:---: |:---: |:---: |:---: |:---: |:---: |
[hpinsley](https://github.com/hpinsley) |[jeffbcross](https://github.com/jeffbcross) |[johnjelinek](https://github.com/johnjelinek) |[justindujardin](https://github.com/justindujardin) |[lihaibh](https://github.com/lihaibh) |[Brooooooklyn](https://github.com/Brooooooklyn) |

[<img alt="tandu" src="https://avatars.githubusercontent.com/u/273313?v=3&s=117" width="117">](https://github.com/tandu) |[<img alt="nulldev07" src="https://avatars.githubusercontent.com/u/2115712?v=3&s=117" width="117">](https://github.com/nulldev07) |[<img alt="daixtrose" src="https://avatars.githubusercontent.com/u/5588692?v=3&s=117" width="117">](https://github.com/daixtrose) |[<img alt="mjwwit" src="https://avatars.githubusercontent.com/u/4455124?v=3&s=117" width="117">](https://github.com/mjwwit) |[<img alt="ocombe" src="https://avatars.githubusercontent.com/u/265378?v=3&s=117" width="117">](https://github.com/ocombe) |[<img alt="gdi2290" src="https://avatars.githubusercontent.com/u/1016365?v=3&s=117" width="117">](https://github.com/gdi2290) |
:---: |:---: |:---: |:---: |:---: |:---: |
[tandu](https://github.com/tandu) |[nulldev07](https://github.com/nulldev07) |[daixtrose](https://github.com/daixtrose) |[mjwwit](https://github.com/mjwwit) |[ocombe](https://github.com/ocombe) |[gdi2290](https://github.com/gdi2290) |

[<img alt="typekpb" src="https://avatars.githubusercontent.com/u/499820?v=3&s=117" width="117">](https://github.com/typekpb) |[<img alt="philipooo" src="https://avatars.githubusercontent.com/u/1702399?v=3&s=117" width="117">](https://github.com/philipooo) |[<img alt="redian" src="https://avatars.githubusercontent.com/u/816941?v=3&s=117" width="117">](https://github.com/redian) |[<img alt="alexweber" src="https://avatars.githubusercontent.com/u/14409?v=3&s=117" width="117">](https://github.com/alexweber) |[<img alt="robbatt" src="https://avatars.githubusercontent.com/u/1379424?v=3&s=117" width="117">](https://github.com/robbatt) |[<img alt="robertpenner" src="https://avatars.githubusercontent.com/u/79827?v=3&s=117" width="117">](https://github.com/robertpenner) |
:---: |:---: |:---: |:---: |:---: |:---: |
[typekpb](https://github.com/typekpb) |[philipooo](https://github.com/philipooo) |[redian](https://github.com/redian) |[alexweber](https://github.com/alexweber) |[robbatt](https://github.com/robbatt) |[robertpenner](https://github.com/robertpenner) |

[<img alt="sclausen" src="https://avatars.githubusercontent.com/u/916076?v=3&s=117" width="117">](https://github.com/sclausen) |[<img alt="heavymery" src="https://avatars.githubusercontent.com/u/3417123?v=3&s=117" width="117">](https://github.com/heavymery) |[<img alt="tapas4java" src="https://avatars.githubusercontent.com/u/2254963?v=3&s=117" width="117">](https://github.com/tapas4java) |[<img alt="vincentpalita" src="https://avatars.githubusercontent.com/u/2738822?v=3&s=117" width="117">](https://github.com/vincentpalita) |[<img alt="Yalrafih" src="https://avatars.githubusercontent.com/u/7460011?v=3&s=117" width="117">](https://github.com/Yalrafih) |[<img alt="billsworld" src="https://avatars.githubusercontent.com/u/16911647?v=3&s=117" width="117">](https://github.com/billsworld) |
:---: |:---: |:---: |:---: |:---: |:---: |
[sclausen](https://github.com/sclausen) |[heavymery](https://github.com/heavymery) |[tapas4java](https://github.com/tapas4java) |[vincentpalita](https://github.com/vincentpalita) |[Yalrafih](https://github.com/Yalrafih) |[billsworld](https://github.com/billsworld) |

[<img alt="blackheart01" src="https://avatars.githubusercontent.com/u/1414277?v=3&s=117" width="117">](https://github.com/blackheart01) |[<img alt="butterfieldcons" src="https://avatars.githubusercontent.com/u/12204784?v=3&s=117" width="117">](https://github.com/butterfieldcons) |[<img alt="danielcrisp" src="https://avatars.githubusercontent.com/u/1104814?v=3&s=117" width="117">](https://github.com/danielcrisp) |[<img alt="edud69" src="https://avatars.githubusercontent.com/u/1514745?v=3&s=117" width="117">](https://github.com/edud69) |[<img alt="jgolla" src="https://avatars.githubusercontent.com/u/1542447?v=3&s=117" width="117">](https://github.com/jgolla) |[<img alt="rossedfort" src="https://avatars.githubusercontent.com/u/11775628?v=3&s=117" width="117">](https://github.com/rossedfort) |
:---: |:---: |:---: |:---: |:---: |:---: |
[blackheart01](https://github.com/blackheart01) |[butterfieldcons](https://github.com/butterfieldcons) |[danielcrisp](https://github.com/danielcrisp) |[edud69](https://github.com/edud69) |[jgolla](https://github.com/jgolla) |[rossedfort](https://github.com/rossedfort) |

[<img alt="ultrasonicsoft" src="https://avatars.githubusercontent.com/u/4145169?v=3&s=117" width="117">](https://github.com/ultrasonicsoft) |[<img alt="inkidotcom" src="https://avatars.githubusercontent.com/u/100466?v=3&s=117" width="117">](https://github.com/inkidotcom) |
:---: |:---: |
[ultrasonicsoft](https://github.com/ultrasonicsoft) |[inkidotcom](https://github.com/inkidotcom) |


# Change Log

You can follow the [Angular 2 change log here](https://github.com/angular/angular/blob/master/CHANGELOG.md).

# License

MIT

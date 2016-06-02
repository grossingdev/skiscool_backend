Skiscool react-native mobile app react-js webapp, webapi guide.

##1. npm install in both mobileapp/web directory.

##2. update react-native-mapbox-gl library as following:

    update removePack in RCTMapboxGL.m

    if ([userInfo[@"name"] isEqualToString:packName]) {
        tempPack = pack;
        break;
    }


    from
    if (userInfo[@"name"] == packName) {
       tempPack = pack;
       break;
    }

##3. install mongo db on localhost(staging)/production server.
    Recommended mongodb client is robomongo;

    after install mongoose service, you have to create account using below commands.
    #mongo
    #show dbs //it will shows database;
    #select skiscool
    #db.createUser({user:"admin_simon", pwd:"SimonAdmin123$",roles:["readWrite","dbAdmin"]})

    once you setup user authenticate for mongodb, you should set connect parameter correctly on robomongo, mongo_db_url in webapi/config.js.

    To run mongo service in background mode on startup, you should refer
    https://alicoding.com/how-to-start-mongodb-automatically-when-starting-your-mac-os-x/

    ...
    <array>
        <string>/usr/local/bin/mongod</string>
        <string>--dbpath</string>
        <string>/usr/local/var/mongodb</string>
        <string>--logpath</string>
        <string>/usr/local/var/log/mongodb/mongo.log</string>
        <string>--auth</string> //this is important,  this will enable user authentication feature on mongodb
    </array>

##4. install babel-cli node package globally (npm install babel-cli -g)

##5. compile web/webapi using babel
     ./build_api.sh or npm run build-api

##6. Run webapp & webapi using
     webapp: npm run start-dev
     webapi: node web/dist/api/api.js

##7  Testing webapp & mobile app
    1) run webapi
       once webapi is started empty mongo db schemas(collections) will be initialized.
       you don't need to create collections(like as create tables on mysql for initialize)

    2) create account using webapp/mobile app
       To create admin user:

        1st you have to create Instructor user
        2nd update flagAdmin as true from mongodb (refer screenshots/1.png)





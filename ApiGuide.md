##Skiscool API document

# User API

    1. checkToken
       urlSchema: localhost:3700/api/account/checkToken
       method: 'POST',
       requestParam: token

       it will check token is valid or not

    2. login/logout
       urlSchema: localhost:3700/api/account/login
       method: 'POST',
       requestParam: email, password, userType, fromSocial, facebook-token

       userType will be one of 'player or instructor';
       fromSocial will be one of 'fb or default'
          facebook login does not require email nor password, but require facebook-token

       if login success api will return token with simple user profile (including email, userType, flagAdmin)
       if not, please refer statusCodeMessages in api.js

    3. signIn
       urlSchema: localhost:3700/api/account/signIn
       method: 'POST',
       requestParam: email, password, userType, fromSocial, name, gender, age, languages, facebook-token
         facebook singup does not require all other information, but require facebook-token, userType

       if signIn success for 'default' social type case, verification email will sent to register user, and user will verify his account

    4. verify
       urlSchema: localhost:3700/api/account/verify/:token
       method: 'GET, POST',

       To verify account from email signup
# Map API
    All Map API require tokens, and only works for instructor & admin user

    1. addPlaceMarker
       urlSchema: localhost:3700/api/map/addPlaceMarker
       method: 'POST',
       requestParam: {
         marker: {
            overlay_uuid: marker uuid
            overlay_type: marker type (hotel: 1, chalet: 2, restaurant: 3),
            location: [lat, lng]
         },
         token
       }
    2. removePlaceMarker
       urlSchema: localhost:3700/api/map/removePlaceMarker
       method: 'POST',
       requestParam: {
         uuid, //target marker uuid which will be removed
         token
       }
    3. updatePlaceMarker
       urlSchema: localhost:3700/api/map/updatePlaceMarker
       method: 'POST',
       requestParam: {
         uuid, //marker uuid which will be updated
         location,  //new position for marker
         token
       }
    4. saveBoundary
       urlSchema: localhost:3700/api/map/saveBoundary
       method: 'POST',
       requestParam: {
         base64Data, //mapbox offline package content in base64-encoding
         name, //offline package name, it will be one of ski resort name or userEmail_custom,
         boundary, //[ne_lat, ne_lon, se_lat, se_lon]
         token
       }

       this api will save package content into server, parse package content using sqlite3 module, and extract tiles from database;
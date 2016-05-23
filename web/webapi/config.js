/**
 * Created by BaeBae on 5/6/16.
 */
export default {
  "jwt": {
    "secret":"skiscool_token_secret"
  },
  app_name: 'Skiscool',
  mongo_db_url: 'mongodb://admin_simon:SimonAdmin123$@localhost:27017/skiscool',
  facebook_app_id: '562112907171338',
  facebook_app_secret: 'f3750cc751c48b20d895003a173d6f0f',

  mailer: {
    from: 'MAILER_FROM',
    options: {
      service: 'Mailgun',
      auth: {
        user: 'postmaster@test.skiscool.com',
        pass: '9f9d05c95a57623ed14cbd490222dc6c'
      }
    }
  }
};
import FacebookTokenStrategy from 'passport-facebook-token';
import config from '../../config';
import passport from 'passport';

passport.use(new FacebookTokenStrategy({
    clientID: config.facebook_app_id,
    clientSecret: config.facebook_app_secret
  }, function(accessToken, refreshToken, profile, done) {
    return done(profile);
  }
));

export default function checkFacebookToken(req) {
  return new Promise((resolve) => {
    passport.authenticate('facebook-token', function(profile) {
      // do stuff with user
      resolve(profile);
    })(req);
  });
}

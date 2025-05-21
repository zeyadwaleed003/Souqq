import passport from 'passport';
import google from 'passport-google-oauth20';

import env from './env';
import { User } from '../models/user.model';
import APIError from '../utils/APIError';

passport.use(
  new google.Strategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile._json.email });

          if (user) {
            user.googleId = profile._json.sub;
            user.save();
          } else {
            user = await User.create({
              name: profile._json.name,
              googleId: profile._json.sub,
              email: profile._json.email,
              photo: profile._json.picture,
              emailVerified: true,
            });
          }
        }

        done(null, user);
      } catch (err: any) {
        throw new APIError(err.message, 500);
      }
    }
  )
);

export default passport;

import passport from 'passport';
import passportLocal from 'passport-local';
import userService from "./../../services/userService";

let LocalStrategy = passportLocal.Strategy;

let initPassportLocal = () => {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                await userService.findUserByEmail(email).then(async (user) => {
                    return done(null, user, null);
                });
            } catch (err) {
                console.log(err);
                return done(null, false, { message: err });
            }
        }));
};

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userService.findUserById(id).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
});

module.exports = {
    initPassportLocal: initPassportLocal
};

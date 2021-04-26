import { UserService } from '../services/userservice';
import bcrypt from 'bcrypt';
import { AUTHTYPE, AuthTypeUser, User } from '../models/user/user';
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
import facebook from 'passport-facebook-token'

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;

export class OAuth {
    static Local = (): any => {
        return new LocalStrategy({ usernameField: "email", passwordField: "password" },
            async (email, password, done) => {
                try {
                    let auth = await new UserService().getUserByAuthType(email, AUTHTYPE.PASSWORD);
                    if (auth) {
                        const isMatch = await bcrypt.compare(password, auth.Password || "")
                        if (isMatch) {
                            let user = await new UserService().findById(auth.UserId || 0);
                            return done(null, user);
                        }
                    }
                    return done(null, false, { message: "Usuário ou Senha inválido" });
                } catch (error) {
                    done(error, false, { message: `Mensagem Original: ${error}` });
                }
            });
    }

    static JWT = (): any => {
        return new JWTStrategy({
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET || "",
            passReqToCallback: true
        }, async (req: any, payload: any, done: any) => {
            try {
                let user = await new UserService().findById(payload.id);
                if (!user) {
                    return done(null, false, { message: "Usuário não encontrado" });
                }
                req.user = user;
                done(null, user);
            } catch (error) {
                done(null, error, { message: `Mensagem Original: ${error}` });
            }
        })
    }

    static Facebook = (): any => {
        return new facebook({
            clientID: process.env.CLIENTID_FACEBOOK || "",
            clientSecret: process.env.SECRETKEY_FACEBOOK || "",
            passReqToCallback: true
        }, async (req, accessToken, refreshToken, profile, done) => {
            try {
                let email = profile.emails[0].value;
                let user = await new UserService().findByEmail(email);
                //se não encontrou crio um usuario novo
                if (!user) {
                    let newUser = new User();
                    newUser.Name = profile.displayName;
                    let auth = new AuthTypeUser(AUTHTYPE.FACEBOOK, "", profile.id, email);
                    newUser.AuthType.push(auth);

                    let id = await new UserService().create(newUser);
                    newUser.Id = id || 0;

                    req.user = newUser || undefined;
                    return done(null, user, { addUser: true })
                }
                else {
                    const auth = user.AuthType.find(f => f.Type == AUTHTYPE.FACEBOOK);
                    if (!auth) {
                        let authNew = new AuthTypeUser(AUTHTYPE.FACEBOOK, "", profile.id, email, user.Id);
                        user.AuthType.push(authNew);
                        await new UserService().updateAuthType(user.Id, user.AuthType, false);

                        req.user = user || undefined;
                        return done(null, user, { addUser: true })
                    }
                }
                req.user = user;
                done(null, user);
            } catch (error) {
                done(error, false, { message: `Mensagem Original: ${error}` });
            }
        })
    }
}


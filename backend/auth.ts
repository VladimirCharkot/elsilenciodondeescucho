import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import conf from './config';
import {Request, Response, NextFunction} from 'express';

type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const el_user = {user: 'esde', id: 'esde'};

const loginStrategy = new LocalStrategy(
  (username: string, password: string, done: any) => {
    if (password.trim() == conf.editor.password.trim()) {

      return done(null, {user: 'esde', username: 'esde', id: 'esde'})
    }
    return done(null, false)
  }
)

const login: Middleware = async (req, res, next) => {
    const autenticar = passport.authenticate('local',
      {
        successRedirect: '/editor',
        failureRedirect: '/hogar'
      },
      () => req.login(el_user, () => res.json({ok: true}))
    )

    autenticar(req,res,next);

  }

const is_admin: Middleware = async (req, res, next) => {
  if(req.user) { next(); } else { console.log(`Blocking non-admin request to ${req.path}`); res.redirect('/hogar'); }
}


passport.use(loginStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, el_user);
});

const logout: Middleware = async (req,res) => {
  req.logout(() => res.redirect('/'));
}


export {passport, login, logout, is_admin}

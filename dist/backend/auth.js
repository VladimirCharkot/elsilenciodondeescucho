"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_admin = exports.logout = exports.login = exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_local_1 = require("passport-local");
const config_1 = __importDefault(require("./config"));
const el_user = { user: 'esde', id: 'esde' };
const loginStrategy = new passport_local_1.Strategy((username, password, done) => {
    if (password.trim() == config_1.default.editor.password.trim()) {
        return done(null, { user: 'esde', username: 'esde', id: 'esde' });
    }
    return done(null, false);
});
const login = async (req, res, next) => {
    const autenticar = passport_1.default.authenticate('local', {
        successRedirect: '/editor',
        failureRedirect: '/hogar'
    }, () => req.login(el_user, () => res.json({ ok: true })));
    autenticar(req, res, next);
};
exports.login = login;
const is_admin = async (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        console.log(`Blocking non-admin request to ${req.path}`);
        res.redirect('/hogar');
    }
};
exports.is_admin = is_admin;
passport_1.default.use(loginStrategy);
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    done(null, el_user);
});
const logout = async (req, res) => {
    req.logout(() => res.redirect('/'));
};
exports.logout = logout;
//# sourceMappingURL=auth.js.map
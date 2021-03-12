const pass = require('passport');
const LocalStrategy = require('passport-local').Strategy

const pool = require('../database');
const helpers = require('../lib/helpers');

//SIGNIN: check username and password
pass.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: 'true'
},
async (request, username, password, done) => {
    const users = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if(users.length > 0){
        if(await helpers.matchPassword(password, users[0].password)){
            done(null, users[0], request.flash('success', 'Welcome ' + users[0].username + '!'));
        }
        else{ done(null, false, request.flash('message', 'Incorrect Password')); }
    }
    else{ return done(null, false, request.flash('message', 'The username does not exists')); }
}));


//SIGNUP: Create own autentications
pass.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true     //recibe el objeto request dentro de la funcion que ejecute LocalStrategy
}, 
async(request, username, password, done) => {
    const { fullname } = request.body;  //only recibe the fullname of user
    const newUser = {
        username,
        password,
        fullname
    }; 
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

pass.serializeUser((user, done) => {
    done(null, user.id);
});

pass.deserializeUser( async (id, done) => {
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, users[0]);
});


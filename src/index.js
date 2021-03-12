const path = require('path');
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const pass = require('passport');

const { keys } = require('./keys');

//Inicialization
const app = express();
require('./lib/passport');

//Settings
app.set('view engine', '.hbs');
app.set('port', process.env.PORT || 4000);

app.set('views', path.join(__dirname, 'views'));     //show where 'views' archive is

app.engine('.hbs', exphbs({ 
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: require('./lib/handlebars')
 }));

 app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'acer1234',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(keys)
}));

app.use(flash()) //allows us to display messages on the screen under certain conditions
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));   //now, client only can send simple text
app.use(express.json()) //now, app work with json
app.use(pass.initialize());
app.use(pass.session());

//Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Starting: show by console the port
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
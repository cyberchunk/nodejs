var express = require('express');
var http = require('http');
var port = 8080;
var app  = express();
const flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var server = http.createServer(app);

function checkAuth(req,res,next){
    console.log('checkAuth' + req.url);
    
    //dont serve / secure to those logged in
    if(req.url === '/secure' && (!req.session || !req.session.authenticated)){
        res.render('unauthorised', {status:403});
        return;
    }
    next();
}
    app.use(flash());
    app.use(cookieParser());
    app.use(express.session({secret:'example'}));
    app.use(checkAuth);
    app.use(app.router);
    app.set('view engine', 'jade');
    app.set('view options',{layout: false});
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true }
    }));

require('./lib/routes.js')(app);
app.listen(port);
console.log('Node listening on port %s', port);
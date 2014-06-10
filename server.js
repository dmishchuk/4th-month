/**
 * Created by dima on 26.05.2014.
 */
var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var http = require('http');
var config = require("nconf");
var express = require('express');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var users = [];
var username = {};
var mongoose = require('mongoose');
//var User = mongoose.model('user');
var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var util = require('util');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser()); // required before session.
app.use(session({
    secret: 'secret'
    //proxy: true // if you do SSL outside of node.
}));

app.use(passport.initialize());
app.use(passport.session());
//app.use(app.router);



passport.use(new VKontakteStrategy({
        clientID:     4399146, // VK.com docs call it 'API ID'
        clientSecret: 'S0mZdZroSsz2ShGYkWob',
        callbackURL:  "http://localhost:1000/auth/vkontakte/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile.displayName);
        /*User.findOrCreate({ vkontakteId: profile.id }, function (err, user) {
            return done(err, user);
        });*/
    }
));
app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user));
});


passport.deserializeUser(function (data, done) {
    try {
        done(null, JSON.parse(data));
    } catch (e) {
        done(err)
    }
});

app.get('/auth/vkontakte',
    passport.authenticate('vkontakte'),
    function(req, res){
        console.log(req, res);
        // The request will be redirected to vk.com for authentication, so
        // this function will not be called.
    });












server.listen(1000, function () {
    console.log('Server listening at port 1000');
});
app.use(express.static(__dirname + '/public'));



io.on('connection', function (socket) {

    socket.on('login entered', function (data) {
        username['username'] = data;
        users.push(data);
        console.log(users);
        socket.emit('login send', username);
        socket.broadcast.emit('username online', data);
        //socket.emit('you online', username);
        //socket.broadcast.emit('username online', username);
    });

    socket.on('new message', function (data) {
        socket.emit('message send', {
            mes: data['mes'],
            user: data['user']
        });
        socket.broadcast.emit('message send', {
            mes: data['mes'],
            user: data['user']
        });
    });



});


module.exports = function (app) {
};


/*
var server = new http.Server();
server.listen(1223, '127.0.0.1');
server.on('request', function (req, res) {
    res.end('go');
});

http.createServer(function (req, res) {
    console.log(req);
    fs.readFile(__dirname + '/html/index.html', function (err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });

}).listen(1300);
*/
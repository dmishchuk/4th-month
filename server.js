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
var log = {};
//var socketIo = io;
var addedUser;
var mongoose = require('mongoose');
var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var util = require('util');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser()); // required before session.
app.use(session({
    secret: 'secret'
}));
var vkName;
app.use(passport.initialize());
app.use(passport.session());
var randtoken = require('rand-token');
//выдать не только инфу о пользователе, но и уникальный id. при отправке сообщения отправляю и id,
//когда отправляю сообщения на сервер, отправляю

passport.use(new VKontakteStrategy({
        clientID:     4399146, // VK.com docs call it 'API ID'
        clientSecret: 'S0mZdZroSsz2ShGYkWob',
        callbackURL:  "http://localhost:1000/auth/vk/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile.displayName);

        //vkName = profile.displayName;
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

app.get('/auth/vk/callback',
    passport.authenticate('vkontakte'),
    function(req, res){
        //res.end(200);
    });



server.listen(1000, function () {
    console.log('Server listening at port 1000');
});
app.use(express.static(__dirname + '/public'));



io.on('connection', function (socket) {


    socket.on('vkPress', function(){
        console.log('vk', vkName);
    });

    socket.on('login entered', function (login) {
        var unique = true;
        for(var i in username) {
            if(username[i] === login){
                var tempToken = i;
                unique = false;
            }
        }
        if(unique){
            var token = randtoken.generate(16);
            username[token] = login;
            socket.emit('login send', username);
            socket.emit('successful login');
            socket.broadcast.emit('username online', login);
            addedUser = true;
            socket.username = login;
        } else {
            socket.emit('if token valid', tempToken);
            socket.on('token not valid', function(){
                socket.emit('wrong login');
            });
            socket.on('token valid', function(){
                socket.emit('successful login');
                socket.broadcast.emit('username online', login);
                addedUser = true;
                socket.username = login;
            });
        }

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



    socket.on('disconnect', function () {
        if(socket.username !== undefined){
            socket.broadcast.emit('username offline', socket.username);
        }

    });


});


module.exports = function (app) {
};

/**
 * Created by dima on 26.05.2014.
 */
var passport = require('passport');
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var http = require('http');
var config = require("nconf");
var crypto = require("crypto");
var express = require('express.io');
var fs = require('fs');
var app = express();
var md5 = require('md5');
var server = http.createServer(app);
var io = require('socket.io')(server);
var users = [];
var username = {};
var log = {};
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
var vkName = '';
app.use(passport.initialize());
app.use(passport.session());
var randtoken = require('rand-token');
var frondFilePath = '';

app.use(express.bodyParser());
//app.use(express.multipart());
passport.use(new VKontakteStrategy({
        clientID:     4399146, // VK.com docs call it 'API ID'
        clientSecret: 'S0mZdZroSsz2ShGYkWob',
        callbackURL:  "http://localhost:1000/auth/vk/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        vkName = profile.displayName;
    }
));
app.get('/auth/vkontakte', passport.authenticate('vkontakte'));


app.post('/fileupload', function (req, res) {
    var uploadFilePath = req.files.file.path;
    var uploadFileName = uploadFilePath.split("\\");
    uploadFileName = uploadFileName[uploadFileName.length-1];
    var filePath = 'public/uploads/' + uploadFileName;
    frondFilePath = '/uploads/' + uploadFileName;
    fs.readFile(uploadFilePath, function (err, data) {
        fs.writeFile(filePath, data, function (err) {
            res.redirect("back");
        });
    });
});

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
    vkName = '';
    socket.on('vk-pressed', function(){
        function temp(){
            if(vkName !== ''){
                socket.emit('vk-successful', vkName);
            }
        }
        setTimeout(temp, 1000);
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
            users.push(login);
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
                users.push(login);
            });
        }

    });

    socket.on('file loading', function(username){
        var imMessage = {
            'user': username,
            'fileSource': frondFilePath
        };
        socket.emit('loading successful', imMessage);
        socket.broadcast.emit('loading successful', imMessage);
    });

    socket.on('new message', function (data) {
        socket.broadcast.emit('message send', {
            message: data['mes'],
            user: data['user']
        });
    });

    socket.on('get users', function(){
        socket.emit('provide users', users);
    });

    socket.on('disconnect', function () {
        if(socket.username !== undefined){
            socket.broadcast.emit('username offline', socket.username);
        }
        for (var i in users) {
            if(users[i] === socket.username){
                users.splice(i,1);
            }
        }
    });

});

module.exports = function (app) {};

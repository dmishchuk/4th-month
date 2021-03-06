/**
 * Created by dima on 26.05.2014.
 */

var http = require('http');
var crypto = require('crypto');
var express = require('express.io');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var users = [];
var username = {};
var addedUser;
var passport = require('passport');
var passportAuth = require('./vk-auth');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({
    secret: 'secret'
}));
app.use(passport.initialize());
app.use(passport.session());
var randtoken = require('rand-token');
var frondFilePath = '';
app.use(express.bodyParser());

app.get('/auth/vkontakte', passportAuth.auth());

app.post('/fileupload', function (req, res) {
    var uploadFilePath = req.files.file.path;
    var uploadFileName = uploadFilePath.split("\\");
    uploadFileName = uploadFileName[uploadFileName.length-1];
    var filePath = 'public/uploads/' + uploadFileName;
    frondFilePath = '/uploads/' + uploadFileName;
    fs.readFile(uploadFilePath, function (err, data) {
        fs.writeFile(filePath, data, function (err) {
            res.redirect('back');
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
    function (req, res) {
        console.log(req.user);
    });

server.listen(1000, function () {
    console.log('Server listening at port 1000');
});
app.use(express.static(__dirname + '/public'));


io.on('connection', function (socket) {

    socket.on('token exist', function (data) {
        var exist = false;
        for(var i in username)
        {
            if(i === data['token']) {
                if(username[i] = data['username']) {
                    users.push(username[i]);
                    exist = true;

                    socket.emit('user exist true', {
                        'user': username[i],
                        'token': i
                    });
                    socket.emit('successful login');
                    socket.broadcast.emit('username online', username[i]);
                }
            }
        }
        if(!exist) {
            socket.emit('user exist false');
        }
    });

    socket.on('logout', function (logoutToken) {
        for(var i in username) {
            if(i === logoutToken) {
                for(k in users) {
                    if(users[k] === username[i]) {
                        users.splice(k,1);
                    }
                }
                socket.broadcast.emit('provide users', users);
                delete username[i];
            }
        }
    });

    socket.on('vk-pressed', function () {
        function temp () {
            var vkName = passportAuth.getVkName();
            if(vkName !== ''){
                socket.emit('vk-successful', vkName);
            }
        }
        setTimeout(temp, 1000);
    });

    socket.on('login entered', function (login) {
        var unique = true;
        for(var i in username) {
            if(username[i] === login) {
                var tempToken = i;
                unique = false;
            }
        }
        if(unique) {
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
            socket.on('token not valid', function () {
                socket.emit('wrong login');
            });
            socket.on('token valid', function () {
                socket.emit('successful login');
                socket.broadcast.emit('username online', login);
                addedUser = true;
                socket.username = login;
                users.push(login);
            });
        }
        socket.emit('provide users', users);
    });

    socket.on('file loading', function (username) {
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
            user: data['user'],
            type: 'text',
            current: 'that'
        });
    });

    socket.on('get users', function () {
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

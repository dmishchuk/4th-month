/**
 * Created by dmishchuk on 26/06/2014.
 */
angular.module('myChat').controller('LoginController', function ($scope, Data, $timeout, socket){


    //var socket = io.connect();
    $scope['data'] = {};

    if(window.localStorage.token !== '' && window.localStorage.token !== undefined){
        var tempToken = window.localStorage.token;
        var user = window.localStorage.username;
        socket.emit('token exist', {
            'token': tempToken,
            'username': user
        });
    }

    $scope.addLogin = function(expr){
        if(expr !== '' && expr !== undefined){
            Data.username = expr;
            socket.emit('login entered', expr);
        }
    };


    $scope.addVkLogin = function(event){
        socket.emit('vk-pressed');
        socket.on('vk-successful', function (login) {
            Data.username = login;
            socket.emit('login entered', login);
        });
    };

    socket.on('user exist true', function(data){
        Data.username = data.user;
        Data.token = data.token;
        window.localStorage['token'] = data.token;
        window.localStorage['username'] = data.user;
    });

    socket.on('user exist false', function(){
        delete window.localStorage['token'];
        delete window.localStorage['username'];
    });

    socket.on('login send', function (login) {
        for(var i in login){
            Data.token = i;
            Data.username = login[i];
        }
        window.localStorage['username'] = Data.username;
        window.localStorage['token'] = Data.token;
    });

    socket.on('successful login', function(){
        document.location.href = '/#/chat';
    });

    socket.on('if token valid', function(data){
        if (window.localStorage['token'] === data){
            socket.emit('token valid');
        } else {
            socket.emit("token not valid");
        }
    });

    socket.on('wrong login', function(){
        $timeout(function(){
            $scope.data.login = 'enter another username';
        })
    });

});
/**
 * Created by dmishchuk on 26/06/2014.
 */
var $main = $('.main');
var $login = $('.login-position');
var socket = io();
var username;


myUser.controller('LoginController', function ($scope, Data){
    $scope.addLogin = function(expr) {
        if(expr !== ''){
            var login = expr;
            username = login;
            console.log($scope);
            socket.emit('login entered', login);
            socket.on('successful login', function () {
                $main.removeClass('unvisible');
                $login.addClass('unvisible');
            });
        }
    };
    $scope.data = Data;
});
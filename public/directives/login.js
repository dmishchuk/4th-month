/**
 * Created by dmishchuk on 26/06/2014.
 */
var $main = $('.main');
var $login = $('.login-position');
var socket = io();
var username;

angular.module('myUser').directive("enter", function() {
    return function(scope, element) {
        element.bind("keypress", function(event) {
            if(event.which === 13 && element.val() !== ''){
                var login = element.val();
                username = login;
                element.val('');
                socket.emit('login entered', login);
                socket.on('successful login', function () {
                    $main.removeClass('unvisible');
                    $login.addClass('unvisible');
                });
            }
        })
    }
});
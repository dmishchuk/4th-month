/**
 * Created by dmishchuk on 11/06/2014.
 */

var $window = $(window);
var $inputMessage = $('.inputMessage');
var $usernameInput = $('.usernameInput1');
var $outputMessage = $('#mainText');
var $main = $('.main');
var $login = $('.login-position');
var socket = io();
var username;
var connected = false;
var token;

var myUser = angular.module('myUser',[]);
myUser.factory('Data',function(){
   return {login: ''}
});

function LoginController($scope, Data){
    $scope.hideLogin=false;
    $scope.data = Data;
}


myUser.directive("enter", function() {
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


myUser.directive("send", function() {
    return function(scope, element) {
        element.bind("keypress", function(event) {
            console.log(username);
            /*if(event.which === 13 && element.val() !== ''){
                console.log(element.val());
                var data = {
                    'mes': element.val(),
                    'user': username
                };
                element.val('');
                socket.emit('new message', data);
                //console.log(data);
            }*/
        });

    }
});





function MessageController($scope){
    var messages = $scope.messages = [];
    $scope.addMessage = function(expr) {
        messages.push(expr);
        $('.inputMessage').val('');
    };
    $scope.onKeyDown = function(){
        console.log(4);
    }
}


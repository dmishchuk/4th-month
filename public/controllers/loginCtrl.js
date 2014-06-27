/**
 * Created by dmishchuk on 26/06/2014.
 */
angular.module('myUser').controller('LoginController', function ($scope, Data, $timeout){

    var socket = io.connect();

    $scope.addLogin = function(expr) {
        if(expr !== ''){
            Data.username = expr;
            socket.emit('login entered', expr);
        }
    };

    $scope.addLoginByKey = function(event, login){
        if(event.which === 13){
            //$scope.addLogin(login);
        }
    };

    socket.on('login send', function (login) {
        for(var i in login){
            Data.token = i;
            Data.username = login[i];
        }
        window.localStorage[Data.username] = Data.token;
    });

    socket.on('successful login', function(){
        document.location.href = "/#/chat";
    });

    socket.on('if token valid', function(data){
        if (window.localStorage[Data.username] === data){
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
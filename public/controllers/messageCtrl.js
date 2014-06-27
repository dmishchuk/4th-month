/**
 * Created by dmishchuk on 26/06/2014.
 */
angular.module('myUser').controller('MessageController', function ($scope, Data, $timeout){

    var socket = io.connect();
    var messages = $scope.messages = [];
    var users = $scope.users = [];
    $scope.thatUser = '';
    $scope.username = Data.username;

    socket.emit('get users');

    socket.on('provide users', function(names){
        console.log(names);
        $timeout(function(){
            names.pop();
            for(var i in names){
                users.push(names[i]);
            }
        })

        //users = names;
    });

    $scope.addMessage = function(expr) {
        if(expr !== ''){
            var tempMessage = {
                'user': $scope.username,
                'message': expr
            }
            messages.push(tempMessage);
            var letter = {
                'mes': expr,
                'user': Data.username
            };
            socket.emit('new message', letter);
        }

        $scope.mes = '';
    };

    $scope.addMessageByKey = function(event, message) {
        if(event.which === 13){
            $scope.addMessage(message);
        }
    };

    socket.on('username online', function(data){
        $timeout(function(){
            users.push(data);
        })
    });

    socket.on('username offline', function(data){
        $timeout(function(){
            for (var i in users) {
                if(users[i] === data){
                    users.splice(i,1);
                }
            }
        })
    });

    socket.on('message send', function(thatMessage){
        $timeout(function(){
            messages.push(thatMessage);
        })
    });

});
/**
 * Created by dmishchuk on 26/06/2014.
 */
angular.module('myUser').controller('MessageController', function ($scope, Data, $timeout, $upload){

    var socket = io.connect();
    var messages = $scope.messages = [];
    var images = $scope.images = [];
    var users = $scope.users = [];
    $scope.thatUser = '';
    $scope.username = Data.username;

    socket.emit('get users');

    socket.on('provide users', function(names){
        $timeout(function(){
            names.pop();
            for(var i in names){
                users.push(names[i]);
            }
        });
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

    $scope.addImage = function ($files) {
        $scope.upload = $upload.upload({
            url: '/fileupload',
            file: $files[0]
        }).success(function(data, status, headers, config) {
           socket.emit('file loading', Data.username);
        });
    };

    socket.on('loading successful', function (data) {
        var url = document.URL;
        url = url.split('#')[0];
        $scope.imUser = data.user;
        $timeout(function(){
            images.push(url + data.fileSource);
        })
    });

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
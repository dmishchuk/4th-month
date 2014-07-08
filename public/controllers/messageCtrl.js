/**
 * Created by dmishchuk on 26/06/2014.
 */
angular.module('myChat').controller('MessageController', function ($scope, Data, $timeout, $upload, socket){

    //var socket = io.connect();
    var messages = $scope.messages = [];
    var images = $scope.images = [];
    var users = $scope.users = [];
    $scope.thatUser = '';
    $scope.username = Data.username;

    if(Data.username === '' || Data.username === undefined){
        document.location.href = "/#/";
    }
    socket.emit('get users');

    $scope.logout = function(){
        socket.emit('logout', window.localStorage['token']);
        delete window.localStorage['token'];
        delete window.localStorage['username'];
    };

    $scope.addMessage = function(expr) {
        if(expr !== '' && expr !== undefined){
            var tempMessage = {
                'user': $scope.username,
                'message': expr,
                'type': 'text',
                'current': 'this'
            };

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
        url = url + data.fileSource;
        var tempStorage = {
            'user': data.user,
            'type': 'image',
            'im': url
        };
        if(data.user === Data.username){
            tempStorage['current'] = 'this';
        } else {
            tempStorage['current'] = 'that';
        }
        $timeout(function(){
            messages.push(tempStorage);
        })
    });

    socket.on('username online', function(data){
        $timeout(function(){
            $scope.users.push(data);
        })
    });

    socket.on('username offline', function(data){
        $timeout(function(){
            for (var i in $scope.users) {
                if($scope.users[i] === data){
                    $scope.users.splice(i,1);
                }
            }
        })
    });

    socket.on('message send', function(thatMessage){
        $timeout(function(){
            messages.push(thatMessage);
        })
    });

    socket.on('provide users', function(names){
        $timeout(function(){
            $scope.users = [];
            for(var i in names){
                if (names[i] !== Data.username){
                    $scope.users.push(names[i]);
                }

            }
        });
    });
});
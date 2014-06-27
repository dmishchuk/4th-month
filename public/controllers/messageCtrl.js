/**
 * Created by dmishchuk on 26/06/2014.
 */
angular.module('myUser').controller('MessageController', function ($scope, Data){
    var messages = $scope.messages = [];
    $scope.login = Data.login;
    $scope.addMessage = function(expr) {
        if(expr !== ''){
            messages.push(expr);
        }
        $scope.mes = '';
    };
    $scope.addMessageByKey = function(event, message) {
        if(event.which === 13){
            $scope.addMessage(message);
        }
    };
});
/**
 * Created by dmishchuk on 26/06/2014.
 */
angular.module('myUser').controller('LoginController', function ($scope, Data){
    $scope.addLogin = function(expr) {
        if(expr !== ''){
            Data.login = expr;
            document.location.href = "/#/chat";
        }
    };
    $scope.addLoginByKey = function(event, login){
        if(event.which === 13){
            $scope.addLogin(login);
        }
    };
});
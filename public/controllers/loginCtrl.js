/**
 * Created by dmishchuk on 26/06/2014.
 */
angular.module('myUser').controller('LoginController', function ($scope){
    $scope.addLogin = function(expr) {
        if(expr !== ''){
            document.location.href = "/#/chat/" + expr;
        }
    };
    $scope.addLoginByKey = function(event, login){
        if(event.which === 13){
            $scope.addLogin(login);
        }
    };
});
//href="#/chat/{{data.login}}"
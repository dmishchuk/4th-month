/**
 * Created by dmishchuk on 26/06/2014.
 */
angular.module('myUser').controller('MessageController', function ($scope){
    var messages = $scope.messages = [];
    $scope.addMessage = function(expr) {
        if($('.inputMessage').val() !== ''){
            messages.push(expr);
        }
        $('.inputMessage').val('');
    };
    $scope.addMessageByKey = function(event, message) {
        if(event.which === 13){
            $scope.addMessage(message);
        }
    };
});
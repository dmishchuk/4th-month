/**
 * Created by dmishchuk on 26/06/2014.
 */
function MessageController($scope){
    var messages = $scope.messages = [];
    $scope.addMessage = function(expr) {
        if($('.inputMessage').val() !== ''){
            console.log('message');
            messages.push(expr);
        }
        $('.inputMessage').val('');
    };
}
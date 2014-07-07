/**
 * Created by dmishchuk on 07/07/2014.
 */
angular.module('myUser').directive('autogrow', function(){
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.bind('keyup', function(){
                var userCols = element[0].scrollHeight;
                var browserCols = element[0].clientHeight;
                if(userCols > browserCols && userCols < 120){
                    element[0].rows++;
                    element.css('clientHeight', 120);
                }
                console.log(userCols);
                console.log(browserCols);
            });

        }
    }
});
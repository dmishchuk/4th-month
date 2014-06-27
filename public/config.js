angular.module('myUser').config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/chat', {
            templateUrl: 'views/chat.html',
            controller: 'MessageController'
        })
        .otherwise({
            redirectTo: '/'
        })
}]);
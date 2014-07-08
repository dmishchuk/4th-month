/**
 * Created by dmishchuk on 08/07/2014.
 */
angular.module('myChat').factory('socket', function (socketFactory) {
    //var myIoSocket = io.connect();
    return socketFactory();
});
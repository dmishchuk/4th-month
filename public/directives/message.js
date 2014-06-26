/**
 * Created by dmishchuk on 26/06/2014.
 */
myUser.directive("send", function() {
    return function(scope, element) {
        element.bind("keypress", function(event) {
            console.log(username);
            /*if(event.which === 13 && element.val() !== ''){
             console.log(element.val());
             var data = {
             'mes': element.val(),
             'user': username
             };
             messages.push(element.val());
             element.val('');
             socket.emit('new message', data);
             }*/
        });

    }
});
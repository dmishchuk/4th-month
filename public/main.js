/**
 * Created by dima on 04.06.2014.
 */
$(function() {

    var $window = $(window);
    var $inputMessage = $('.inputMessage');
    var $usernameInput = $('.usernameInput');
    var $outputMessage = $('#mainText');
    var $main = $('.main');
    var $login = $('.login');
    var socket = io();
    var username = {};

    function addMessageToChat(data){
        var newMessage = data.mes;
        var mesWriter = data.user;
        var tempMessagesValue = $outputMessage.html();
        var thisTemplate = "<li><strong class='thisUser'>" + mesWriter + ': </strong>' +newMessage + "</li>";
        var thatTemplate = "<li><strong class='thatUser'>" + mesWriter + ': </strong>' +newMessage + "</li>";
        if(mesWriter === username['username']){
            tempMessagesValue += thisTemplate;
        } else {
            tempMessagesValue += thatTemplate;
        }

        $outputMessage.html(tempMessagesValue);
    }

    function addThisUserToChat(data){
        username = data;
    }


    $inputMessage.keydown(function (event) {
        if (event.which === 13 &&  $inputMessage.val() !== '') {
            var data = {
                'mes': $inputMessage.val(),
                'user': username['username']
            }
            $inputMessage.val('');
            socket.emit('new message', data);
        }
    });

    $usernameInput.keydown(function (event) {
        if (event.which === 13 && $usernameInput.val()!== '') {
            var login = $usernameInput.val();
            $usernameInput.val('');
            $main.removeClass('unvisible');
            $login.addClass('unvisible');
            socket.emit('login entered', login);
        }
    });

    socket.on('message send', function (data) {
        addMessageToChat(data);
    });

    socket.on('login send', function (login) {
        addThisUserToChat(login);
    });

    socket.on('username online', function(data){
        var thatUser = data;
        var template = $outputMessage.html() + "<li>" + data + " online</li>";
        $outputMessage.html(template);

    });
});
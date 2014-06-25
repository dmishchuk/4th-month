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
    var username;
    var connected = false;
    var token;

    $('#VK-enter').click(event, function(){
        //event.preventDefault();
        //alert(event);
    });



    function addMessageToChat(data){
        var newMessage = data.mes;
        var mesWriter = data.user;
        var tempMessagesValue = $outputMessage.html();
        var thisTemplate = "<li><strong class='thisUser'>" + mesWriter + ': </strong>' +newMessage + "</li>";
        var thatTemplate = "<li><strong class='thatUser'>" + mesWriter + ': </strong>' +newMessage + "</li>";
        if(mesWriter === username){
            tempMessagesValue += thisTemplate;
        } else {
            tempMessagesValue += thatTemplate;
        }

        //$outputMessage.html(tempMessagesValue);
    }


    $inputMessage.keydown(function (event) {
        if (event.which === 13 &&  $inputMessage.val() !== '') {
            var data = {
                'mes': $inputMessage.val(),
                'user': username
            }
            $inputMessage.val('');
            socket.emit('new message', data);
        }
    });


    $usernameInput.keydown(function (event) {
        if (event.which === 13 && $usernameInput.val()!== '') {
            var login = $usernameInput.val();
            username = login;
            $usernameInput.val('');
            socket.emit('login entered', login);
            socket.on('successful login', function () {
                $main.removeClass('unvisible');
                $login.addClass('unvisible');
            });
        }
    });

    socket.on('if token valid', function(data){
        if (window.localStorage[username] === data){
            socket.emit('token valid');
        } else {
            socket.emit("token not valid");
        }
    });

    socket.on('message send', function (data) {
        addMessageToChat(data);
    });

    socket.on('login send', function (login) {
        for(var i in login){
            token = i;
            username = login[i];
        }
        window.localStorage[username] = token;
    });

    socket.on('username online', function(data){
        var thatUser = data;
        var template = $outputMessage.html() + "<li>" + data + " online</li>";
        $outputMessage.html(template);
    });

    socket.on('wrong login', function(){
        alert('login is busy');
    });

    socket.on('username offline', function(data){
        var template = $outputMessage.html() + "<li>" + data + " offline</li>";
        $outputMessage.html(template);
    });

});
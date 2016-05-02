// YOUR CODE HERE:
var url = 'https://api.parse.com/1/classes/messages';
var users;
var app = {
  init: function () {
    $.get(url, function(data) { 
      users = data.results.reverse();
      _.each(users, function(messageObj) {
        app.addMessage(messageObj);
      });


    });
  },

  send: function(message) {
    $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(message),
      success: function(data, response) {
        console.log(data);
        app.addMessage(message);
      }
    });
  },

  fetch: function() {
    $.ajax({
      type: 'GET'

    });
  },

  addMessage: function(message) {
    if (message.username) {
      $('#chats').append(`<div class='username' data-username=${message.username}>${message.username}:
        ${message.text}</div>`);
    }
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  addRoom: function(roomName) {
    $('#roomSelect').append(`<div>${roomName}</div>`);
  },

  addFriend: function(username) {
    if (!_.contains(app.friends, username)) {
      app.friends.push(username);
    }
  },
  
  friends: []
};

app.init();


$(document).ready(function() {

  $('#chats').on('click', '.username', function() {
    var friend = ($(this).data('username'));
    app.addFriend(friend);
  });
  
 



});
//button on click(this, addFreind())

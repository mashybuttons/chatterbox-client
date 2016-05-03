// YOUR CODE HERE:
var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

var escapeHtml = string => String(string).replace(/[&<>"'\/]/g, s => entityMap[s]);

var url = 'https://api.parse.com/1/classes/messages';
var users;
var app =  {
  init: function () {
    app.fetch();
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
    app.clearMessages();
    $.get(url, function(data) { 
      users = data.results.reverse();
      _.each(users, function(messageObj) {
        app.addMessage(messageObj);
      });

    });
  },
 
  addMessage: function(message) {
    if (message.username) {
      $('#chats').append(`<div class='username' data-username=${escapeHtml(message.username)}>${escapeHtml(message.username)}:
        ${JSON.parse(JSON.stringify(escapeHtml(message.text)))}</div>`);
    }
  },

  clearMessages: function() {
    console.log('cleared!');
    $('#chats').empty();
  },

  addRoom: function(roomName) {
    $('#roomSelect').append(`<div>${escapeHtml(roomName)}</div>`);
  },

  addFriend: function(username) {
    if (!_.contains(app.friends, username)) {
      app.friends.push(username);
    }
  },
  handleSubmit: function() {
    var message = $('#message').val();
    var userName = $('#user').val();

    var userObject = {
      username: userName,
      text: message
    };
    app.send(userObject);

    $('#message').val('');
  
    return false;
  },
  
  friends: []
};

app.init();




$(document).ready(function() {

  $('#chats').on('click', '.username', function() {
    var friend = ($(this).data('username'));
    app.addFriend(friend);
  });
  
  $('#send').on('click', app.handleSubmit);
  

  setInterval(function() {
    app.fetch();
  }, 4000);

});
//button on click(this, addFreind())

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
var startIndex;
var users;
var rooms = {};
var app = {

  init: function () {
    app.fetch(app.initialize);
  },



  send: function(message, callback) {
    $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(message),
      success: function(data, response) {
        var selectedRoom = $('#roomSelect :selected').val();

        //app.fetch(app.refresj_)
        app.fetch(callback, selectedRoom);
      },
    });
  },



  fetch: function(callback, optionalStr) {
    $.ajax({
      type: "GET",
      url: url,
      data: {order: '-createdAt'},
      dataType: "json",
      success: function(response) {
        callback(response.results, optionalStr);
      }
    });
  },


  initialize: function(chatObj) {
    for (var i = 100; i > 80; i--) {
      app.addMessage(chatObj[chatObj.length - i]);
    }

    _.each(chatObj, function(messageObj) {
      if (rooms[messageObj.roomname]) {
        rooms[messageObj.roomname].push(messageObj);
      } else {
        rooms[messageObj.roomname] = [];
      }
    });

    _.each(rooms, (room, key, collection) => app.addRoom(key));

  },


  refresh: function(co) {
    //co is chatObject
    app.clearMessages();

    var i = co.length;
    var len = co.length - 20 < 0 ? 0 : co.length - 20;

    for (; i > len; i--) {
      app.addMessage(co[co.length - i]);
    }

  },

  handleSubmit: function() {
    var message = $('#message').val();
    var userName = $('#user').val();
    var roomname = $('#roomSelect :selected').val();

    var userObject = {
      username: userName,
      text: message,
      roomname: roomname
    };

    app.send(userObject, app.filterRoom);

    $('#message').val('');
  
    return false;
  },
  
  filterRoom: function(co, roomName) {
    //co is chatObject
    app.clearMessages();

    var filteredRoom = _.filter(co, (object) =>  object.roomname === roomName);

    app.refresh(filteredRoom);
  },
   

  addRoom: function(roomName) {
    if ($(`#roomSelect option[value="${roomName}"]`).length <= 0) {
      $('#roomSelect').append(`<option value="${roomName}" id='${roomName}'>${escapeHtml(roomName)}</option>`); 
    }
    
  },

  addFriend: function(username) {
    if (!_.contains(app.friends, username)) {
      app.friends.push(username);
    }
  },


  handleNewRoom: function() {
    var roomname = $('#newRoom').val();
    app.addRoom(roomname);
  },



  addMessage: function(message) {
    // console.log(JSON.stringify(message));
    if (message.username) {
      $('#chats').prepend(`<div class='username' data-username=${escapeHtml(message.username)}>${escapeHtml(message.username)}:
        ${JSON.parse(JSON.stringify(escapeHtml(message.text)))}</div>`);
    }
  },

  clearMessages: function() {
    $('#chats').empty();
  },


  clearRooms: function() {
    $('#roomSelect').empty();
  },

  friends: [],


  server: url

//End app object
};

app.init();



$(document).ready(function() {

  $('#chats').on('click', '.username', function() {
    var friend = ($(this).data('username'));
    app.addFriend(friend);
  });
  
  $('#send').on('click', app.handleSubmit);

  $('#roomSend').on('click', app.handleNewRoom);
  
  $('#roomSelect').on('change', function(room) {
    var selectedRoom = $('#roomSelect :selected').val();

    app.fetch(app.filterRoom, selectedRoom);

  });


  setInterval(function() {
    console.log('Refresh!');
    var selectedRoom = $('#roomSelect :selected').val();
    app.fetch(app.filterRoom, selectedRoom);
  }, 2000);

});
//button on click(this, addFreind())

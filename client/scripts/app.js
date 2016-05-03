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
    $.get(url, function(data) {
      users = data.results.reverse();

      _.each(users, function(messageObj) {
        app.addMessage(messageObj);
        if(rooms[messageObj.roomname]) {
          rooms[messageObj.roomname].push(messageObj);
        } else {
          rooms[messageObj.roomname] = [];
        }
      });

      _.each(rooms, (room, key, collection) => app.addRoom(key));

    });


    // app.clearMessages();
    // $.get(url, function(data) { 
    //   users = data.results.reverse();
    //   _.each(users, function(messageObj) {
    //     app.addMessage(messageObj);
    //   });

    // });
  },
 
  addMessage: function(message) {
    if (message.username) {
      $('#chats').last().append(`<div class='username' data-username=${escapeHtml(message.username)}>${escapeHtml(message.username)}:
        ${JSON.parse(JSON.stringify(escapeHtml(message.text)))}</div>`);
    }
  },

  clearMessages: function() {
    console.log('cleared!');
    $('#chats').empty();
  },

  addRoom: function(roomName) {
    $('#roomSelect').append(`<option value="${roomName}" id='${roomName}'>${escapeHtml(roomName)}</option>`);
  },

  addFriend: function(username) {
    if (!_.contains(app.friends, username)) {
      app.friends.push(username);
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
    app.send(userObject);

    $('#message').val('');
  
    return false;
  },
  
  friends: [],
  server: url,

  filterRoom: function(room) {
    // app.fetch()
    app.clearMessages();
    _.each(rooms[room], (object) => app.addMessage(object));
  },
  handleNewRoom: function() {
    var roomname = $('#newRoom').val();
    app.addRoom(roomname);
  }
};

app.init();


// function loadLog(){   
//     var oldscrollHeight = $("#chats").attr("scrollHeight") - 20;
//      //Scroll height before the request
//     $.ajax({
//       url: url,
//       cache: false,
//       success: function(html){    
//         $("#chats").html(html); //Insert chat log into the #chats div 
        
//         //Auto-scroll     
//         var newscrollHeight = $("#chats").attr("scrollHeight") - 20; //Scroll height after the request
//         if(newscrollHeight > oldscrollHeight){
//           $("#chats").animate({ scrollTop: newscrollHeight }, 'normal'); //Autoscroll to bottom of div
//         }       
//         },
//     });
//   }


$(document).ready(function() {

  $('#chats').on('click', '.username', function() {
    var friend = ($(this).data('username'));
    app.addFriend(friend);
  });
  
  $('#send').on('click', app.handleSubmit);
  $('#roomSend').on('click', app.handleNewRoom);
  
  $('#roomSelect').on('change', function(room) {
    var selectedRoom = $('#roomSelect :selected').val();

    app.filterRoom(selectedRoom);
  });


  // setInterval(function() {
  //   app.clearMessages();
  //   app.fetch();
  // }, 10000);

});
//button on click(this, addFreind())

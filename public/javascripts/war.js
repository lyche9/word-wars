function wordCount( val ){
    return val.match(/\S+/g).length
}

function setWordCountDisplay( myscore ) {
  $('#result').html(
      "<br>Words: "+ myscore 
  );
}

var scores = {};

$(document).ready(function(){
  var socket = io();

  console.log('Connected');
  socket.emit('add_user', "default");

  //Join room, get the current scoreboard
  socket.on('join_room', function(scoreboard, id) {
    updateScoreboard(scoreboard);
    setWordCountDisplay(0);
  });

  //Be alerted that a new user has joined
  socket.on('add_user', function(id, scoreboard) {
    updateScoreboard(scoreboard);
    console.log('Client: Added user ' + id);
  });

  //Send updated score to server
  var curr = 0;
  $("#text").on('input', function(){
    var c = wordCount( this.value );
    if (c != curr) {
      setWordCountDisplay(c);
      socket.emit('update_count', c);
      curr = c;
    }
  });

  //Receive updated scoreboard from server
  socket.on('update_count', function(scoreboard) {
    updateScoreboard(scoreboard)
    // for (user in scoreboard["Users"]) {
    //   console.log(user + " has written " + scoreboard["Users"][user] + " words.");  
    // } 
    listScores(scoreboard);
  });

//Update scoreboard
  function updateScoreboard(scoreboard) {
    scores = scoreboard;
  }
//List users
//List scores  
  function listScores(scoreboard) {
    result = "<br><br>Scoreboard: <br>"
    for (user in scoreboard["Users"]) {
      result += "<br>" + user + ": " + scoreboard["Users"][user] + " words";
    } 
    $('#serverresult').html(result);
  }

});

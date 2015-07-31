function wordCount( val ){
    return val.match(/\S+/g).length
}

function setWordCountDisplay( myscore ) {
  $('#result').html(
      "<br>Words: "+ myscore 
  );
}

var scores = {};

//Update scoreboard
function updateScoreboard(scoreboard) {
  scores = scoreboard;
}

//List scores  
function listScores() {
  result = "<br><br>Scoreboard: <br>"
  for (user in scores["Users"]) {
    result += "<br>" + user + ": " + scores["Users"][user] + " words";
  } 
  $('#serverresult').html(result);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
      color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

//format scores for chartjs
function formatScores() {
  var data = [];
  for (user in scores["Users"]) {
    var obj = {};
    obj["value"] = scores["Users"][user] + 1;
    obj["color"] = getRandomColor();
    data.push(obj);
  }
  return data; 
}

$(document).ready(function(){
  var socket = io();

  console.log('Connected');
  socket.emit('add_user', "default");

  //Join room, get the current scoreboard
  socket.on('join_room', function(scoreboard, id) {
    updateScoreboard(scoreboard);
    setWordCountDisplay(0);
    listScores();

    var scoreData = formatScores();
    renderChart(scoreData);
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
    updateScoreboard(scoreboard);
    listScores();
    var scoreData = formatScores();
    renderChart(scoreData);
  });
});

function renderChart( data ) {
  $("#canvas-wrapper").html("").html('<canvas id="chart" width = "400" height = "400"></canvas>');
  var chartData = data;
  var ctx = document.getElementById("chart").getContext("2d");
  var chart = new Chart(ctx)
  chart.Pie(chartData, {animation : false});
}

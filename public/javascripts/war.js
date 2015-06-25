function wordCount( val ){
    return val.match(/\S+/g).length
}

$(document).ready(function(){
  var socket = io();
  var curr = 0;
  $("#text").on('input', function(){
    
    var c = wordCount( this.value );

    if (c != curr) {
      $('#result').html(
          "<br>Words: "+ c 
      );
      
      socket.emit('msg', c);
      curr = c;
    }
      
  });

  socket.on('msg', function(msg) {
    $('#serverresult').html(
      "<br>Words according to server: " + msg
    );
  });

});


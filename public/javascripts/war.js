function wordCount( val ){
    return {
        charactersNoSpaces : val.replace(/\s+/g, '').length,
        characters         : val.length,
        words              : val.match(/\S+/g).length,
        lines              : val.split(/\r*\n/).length
    }
}


$(document).ready(function(){
  $("#text").on('input', function(){
      
    var c = wordCount( this.value );
      
    $('#result').html(
        "<br>Words: "+ c.words 
    );
      
  });
});
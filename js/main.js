var size = 10;
var life = new Array(size);
var pieces = new Array(size);
var startID;
var firstBlockX;
var firstBlockY;
var mode;
var dragging;
var play;

$(function(){
	MIDI.loadPlugin({
		soundfontUrl: "bower_components/midi/soundfont/",
		instrument: "acoustic_grand_piano",
		callback: function() {
      play = true;
		}
	});
  var canvas = $('.game-board');
  var spacing = 10;
  var smaller_dim = canvas.width();
  if (canvas.height() < smaller_dim) {
    smaller_dim = canvas.height();
  }

  var paper = Raphael(canvas[0],smaller_dim, smaller_dim);

  var square = smaller_dim/size; 
  paper.rect(0,0,smaller_dim,smaller_dim).attr({fill: 'black'});

  for(var i = 0; i < size; i++){
    life[i] = new Array(size);
    pieces[i] = new Array(size);
  }

  for(var i = 0; i < size; i++){
    for(var j = 0; j < size; j++){
      //life[i][j] = false;
      life[i][j] = false;
      var color = life[i][j] ? 'black' : 'white';
      pieces[i][j] = paper.rect(
        i*square+spacing/2,
        j*square+spacing/2,
        square-spacing,
        square-spacing)
        .attr({fill: color})
        .data('x',i)
        .data('y',j)
        .drag(function(){
        },function(){
          dragging = true
          var x = this.data('x');
          var y = this.data('y');
          firstBlockX = x;
          firstBlockY = y;
          mode = !life[x][y];
          life[x][y] = mode;
          if(life[x][y]){
            this.animate({fill: 'black'},100);
          }else{
            this.animate({fill: 'white'},100);
          }
        },
        function(){
          dragging = false;
          firstBlockX = -1;
          firstBlockY = -1;
        })
      .mouseover(function(){
        if (dragging) {
          var x = this.data('x');
          var y = this.data('y');

          life[x][y] = mode;
          if(life[x][y]){
            this.animate({fill: 'black'},100);
          }else{
            this.animate({fill: 'white'},100);
          }
        }
      });
    }
  }

  $('.start').click(function(){
    startID = setInterval(updateBoard,150);
  });

  $('.stop').click(function(){
    clearInterval(startID);
  })

  $('.clear').click(function(){
    clearInterval(startID);
    for(var i = 0; i < size; i++){
      for(var j = 0; j < size; j++){
        life[i][j] = false
        pieces[i][j].animate({fill: 'white'},100);
      }
    }
  });
});

function countSurrounding(i,j){
  var coor = [0,1,size-1];
  var count = 0;
  for(var x = 0; x < 3; x++){
    for(var y = 0; y < 3; y++){
      if(x != 0 || y != 0){
        if(life[(i+coor[x]) % size][(j+coor[y]) % size]){
          count++;
        }
      }
    }
  }
  return count;
}

function setPiece(i,j){
  var isOn = life[i][j];
  var surrounding = countSurrounding(i,j);
  if(isOn){
    if(surrounding < 2 || surrounding > 3){
      return false;
    }else{
      return true;
    }
  }else{
    if(surrounding == 3){
      if (play) {
        var delay = 0; // play one note every quarter second
        var note = j*10; // the MIDI note
        var velocity = 127; // how hard the note hits
        // play the note
        MIDI.setVolume(0, 127);
        MIDI.noteOn(0, note, velocity, delay);
        MIDI.noteOff(0, note, delay + 0.75);
      }
      return true;
    }else{
      return false;
    }
  }
}

function updateBoard(){
  var temp = $.extend(true,{},life);
  for(var i = 0; i < size; i++){
    for(var j = 0; j < size; j++){
      temp[i][j] = setPiece(i,j);
      if(temp[i][j]){
        pieces[i][j].animate({fill: 'black'},100);
      }else{
        pieces[i][j].animate({fill: 'white'},100);
      }
    }
  }
  life = temp;
}

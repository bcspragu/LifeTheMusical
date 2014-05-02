var size = 20;
var life = new Array(size);
var pieces = new Array(size);
var startID;

$(function(){
  var canvas = $('.game-board');
  var paper = Raphael(canvas[0],canvas.width(),canvas.width());
  var spacing = 10;
  var square = canvas.width()/size;
  paper.rect(0,0,canvas.width(),canvas.width()).attr({fill: 'black'});

  for(var i = 0; i < size; i++){
    life[i] = new Array(size);
    pieces[i] = new Array(size);
  }

  for(var i = 0; i < size; i++){
    for(var j = 0; j < size; j++){
      //life[i][j] = false;
      life[i][j] = Math.random() > 0.5;
      var color = life[i][j] ? 'black' : 'white';
      pieces[i][j] = paper.rect(
        i*square+spacing/2,
        j*square+spacing/2,
        square-spacing,
        square-spacing)
        .attr({fill: color})
        .data('x',i)
        .data('y',j)
        .click(function(){
          var x = this.data('x');
          var y = this.data('y');

          life[x][y] = !life[x][y];
          if(life[x][y]){
            this.animate({fill: 'black'},100);
          }else{
            this.animate({fill: 'white'},100);
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

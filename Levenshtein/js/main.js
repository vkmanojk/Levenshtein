(function () {
var orgString;
var newString;
var actionsequence = [];
var positionsequence1 = [];
var positionsequence2 = [];
var insno;
var delno;
var subno;

var resetValues = function() {
  orgString = '';
  newString = '';
  actionsequence = [];
  positionsequence1 = [];
  positionsequence2 = [];
  $('#delno').text('Deletions: 0');
  $('#insno').text('Insertions: 0');
  $('#subno').text('Substitution: 0');
  insno = 0;
  delno = 0;
  subno = 0;
};

$( '#firstword' ).on('input',function() {
  $('#textchange').text($('#firstword').val());
});

$('#go').click(function() {
  resetValues();
  $('#textchange').text($('#firstword').val());
  orgString = $('#firstword').val();
  newString = $('#secondword').val();
  $('#textchange').blast(false);
  $('#textchange').blast();
  var matrix = new Levenshtein(orgString, newString);
  console.log(matrix.toString());
  change(matrix._matrix);
  actionsequence.map(function (i, action) {
    animatechar(action, i);
  });
});

var animatechar = function(i, action) {
  setTimeout(function () {
    if(action === 'r') {
      console.log('remove' + i);
      $('#delno').text('Deletions: '+(++delno));
      $('.blast:nth-child(' + positionsequence1[i] + ')').css('background-color', '#ffb74d');
      $('.blast:nth-child(' + positionsequence1[i] + ')').animate({top: 30}, 250, function() {
        $('.blast:nth-child(' + positionsequence1[i] + ')').fadeOut(250);
      });
      setTimeout(function(){
        $('.blast:nth-child(' + positionsequence1[i] + ')').remove();
      },500);
    }
    if(action === 'i') {
      console.log('insert at '+ i);
      $('#insno').text('Insertions: '+(++insno));
      if(positionsequence1[i] !== 0) {
        // $('<span class="blast new">' + newString.charAt(positionsequence2[i]-1) + '</span>').insertAfter($('.blast:nth-child(' + positionsequence1[i] + ')'));
        $('<span class="blast new"> </span>').insertAfter($('.blast:nth-child(' + positionsequence1[i] + ')')).fadeOut(1).animate({top: -30}, 1);
      }
      else {
        // $('<span class="blast">' + newString.charAt(positionsequence2[i]-1) + '</span>').insertBefore($('.blast:nth-child(1)'));
        $('<span class="blast new"> </span>').insertBefore($('.blast:nth-child(1)')).fadeOut(1).animate({top: -30}, 1);
      }
      $('.new:first').text(newString.charAt(positionsequence2[i]-1)).fadeIn(249).animate({top: 0}, 249, function(){
        $(this).removeClass('new');
      });
    }
    if(action === 's') {
      console.log('Substitute' + i);
      $('#subno').text('Substitutions: '+(++subno));
      $('.blast:nth-child(' + positionsequence1[i] + ')').css('background-color', '#69f0ae');
      $('.blast:nth-child(' + positionsequence1[i] + ')').animate({top: 30}, 124, function() {
        $('.blast:nth-child(' + positionsequence1[i] + ')').fadeOut(124);
      });
      setTimeout(function(){
        $('.blast:nth-child(' + positionsequence1[i] + ')').text(newString.charAt(positionsequence2[i]-1)).animate({top: -30}, 1, function(){
          $('.blast:nth-child(' + positionsequence1[i] + ')').fadeIn(100).animate({top: 0}, 124);
        });        
      },250);
      setTimeout(function(){
         $('.blast:nth-child(' + positionsequence1[i] + ')').css('background-color', 'transparent');
      },450);
    }
  }, i*500);
};

var display = function (twoDarray) {
  var i = 0, j = 0; var row = '';
  for (i = 0;i < twoDarray.length;i++) {
    for (j = 0; j < twoDarray[i].length; j++) {
      row = row + twoDarray[i][j] + ','
    };
    console.log(row);
    row = '';
  }
};

var Remove = function(pos1, pos2) {
  actionsequence.push('r');
  positionsequence1.push(pos1);
  positionsequence2.push(pos2);
};

var Insert = function(pos1, pos2) {
  actionsequence.push('i');
  positionsequence1.push(pos1);
  positionsequence2.push(pos2);
};

var Substitute = function(pos1, pos2) {
  actionsequence.push('s');
  positionsequence1.push(pos1);
  positionsequence2.push(pos2);
};

var change = function (arr) {
  var y = orgString.length, x = newString.length;
  while(true){
      if( x===0 && y === 0) {
        break;
      }
      if(x===0) {
        Remove(y,x);       
        y = y - 1;
        continue;
      }
      if(y===0) {
        Insert(y,x);
        x = x - 1;
        continue;
      }
      if((arr[x-1][y-1] <= arr[x-1][y]) && (arr[x-1][y-1] <= arr[x][y-1]) && (arr[x-1][y-1] <= arr[x][y])) {
          if(arr[x-1][y-1] < arr[x][y]) {
            Substitute(y,x);
          }
        x = x - 1;
        y = y - 1;
        continue;  
      }
      if(arr[x][y-1] < arr[x-1][y-1] && arr[x][y-1] <= arr[x-1][y]) {
        Remove(y,x);
        y = y - 1;
      }
      else {
        Insert(y,x);
        x = x - 1;
      }            
  }
};

})();

$(window).load(function () {
  $('#firstword').val('Tom marvolo riddle');
  $('#secondword').val('I am Lord Voldemort');
  $('#textchange').text($('#firstword').val());
});


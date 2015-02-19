var CAVE_ARROWS = [
{x : '0', y : '-1'},
{x : '+1', y : '-1'},
{x : '-1', y : '0'},
{x : '+1', y : '0'},
{x : '-1', y : '+1'},
{x : '0', y : '+1'},
{x : '+1', y : '+1'},
{x : '-1', y : '-1'},
]

PUZZLE_DIV = '<div class="maze">';

var getPuzzle = function(i){}

var generateTiles = function(){
	
	var aimerContent = "";
	var TEMP = '<div @ph-style></div>';
	for(var i=0; i < 7; i++){
		for(var j=0; j<7; j++){
			var styles = generateStyles();
			var subdiv = TEMP.replace('@ph-style', styles[0]) + TEMP.replace('@ph-style', styles[1]);
			var STR_MAIN = '<div class="cave-aimer-tile" id="' + j + '-' + i + '">' + subdiv + '</div>';
			aimerContent += STR_MAIN;
		}
	}
	aimerContent += '<div class="cover" id="cave-aimer-cover" tile-number></div>';
	return aimerContent;
}

var generateStyles = function(){
	var POS = [
			{'style' : 'style="top: @px-style@px; left: -50px"', 'styleNext' : 'style="top: @px-style@px; left: 50px"'},
			{'style' : 'style="left: @px-style@px; top: -50px"', 'styleNext' : 'style="left: @px-style@px; top: 50px"'}
		]
	var temp = POS[randomIntFromInterval(0, 1)];
	var result = [];
	result.push(temp.style.replace('@px-style@', randomIntFromInterval(-50, 50)));
	result.push(temp.styleNext.replace('@px-style@', randomIntFromInterval(-50, 50)));
	return result;
}
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
function disableCaveElements(){
	console.log('Elements Disabled');
	$('#cave-aimer-cover').fadeIn(300);
	$('.cave-aimer-tile').removeClass('active');
	$('.cave-aimer-tile').removeClass('success');
	$('.cave-aimer-tile').removeClass('fail');
	$('.throw').fadeOut(200);
}
function enableCaveElements(){
	console.log('Elements Enabled');
	$('#cave-aimer-cover').fadeOut(300);
}
var throwMaul = function(){
	var getRandomKoef = function(num){
			return Math.floor(Math.random()*10) < num? 1 : 0;
		
	}
	var numberLeft = parseInt($('#cave-task-tail-number-left').html());
	var numberRight = parseInt($('#cave-task-tail-number-right').html());
	var numberLeftMod = numberLeft/10>>0;
	var numberRightMod = numberRight/10>>0;
	var leftRandom = getRandomKoef(numberLeft % 10);
	var rightRandom = getRandomKoef(numberRight % 10);
	return {'leftNum' : numberLeftMod + leftRandom, 'rightNum' : numberRightMod + rightRandom};
}

$(function() {
	// var puzzleDiv = '';
	// for(var i = 0; i < MAZE_PUZZLES.length; i++){
	// 	puzzleDiv += getPuzzle(i);
	// }
	// $('.forest-builder').append();
	$('#cave-aimer').html(generateTiles());
	$('.cave-aimer-tile').on('click', function(){
		$('.cave-aimer-tile').removeClass('active');
		$(this).addClass('active');
		if($('.throw').css('display') == 'none')
			$('.throw').fadeIn(200);
	});
	$('#cave-task-throw').on('click', function(){
		$('.throw').fadeOut(200);
		//throwMaul();
		// var zlp;
		// var l1 = 0;
		// var l2 = 0;
		// var r1 = 0;
		// var r2 = 0;
		// for(var i = 0; i < 1000000; i++){
		// 	zlp = throwMaul();
		// 	zlp.leftNum == 1 ? l1++ : l2++;
		// 	zlp.rightNum == 1 ? r1++ : r2++;
		// }
		// console.log(l1, l2, r1, r2);
		var newX, newY;
		var countNewCoordinate = function(oldCoord, powerLeft, koefLeft, powerRight, koefRight){
			return oldCoord + powerLeft*koefLeft + powerRight*koefRight; 
		}
		var power = throwMaul();
		var coords = $('.cave-aimer-tile.active').attr('id').split('-');
		var coordX = parseInt(coords[0]);
		var coordY = parseInt(coords[1]);

		var activeLeftTileId = $('.spinner.left .tile.active').attr('id').split('-')[3];
		var tileLeftParams = CAVE_ARROWS[activeLeftTileId];
		var activeRightTileId = $('.spinner.right .tile.active').attr('id').split('-')[3];
		var tileRightParams = CAVE_ARROWS[activeRightTileId];

		newX = countNewCoordinate(coordX, power.leftNum, tileLeftParams.x, power.rightNum, tileRightParams.x);
		newY = countNewCoordinate(coordY, power.leftNum, tileLeftParams.y, power.rightNum, tileRightParams.y);
		// newY = countNewCoordinate(coordY, power.leftNum, );

		console.log(power);
		console.log('oldX', coordX, 'newX', newX);
		console.log('oldY', coordY, 'newY', newY);

		$('.cave-aimer-tile#' + newX + '-' + newY  + '').addClass('success');

	});
	$('.cave-task-button.generate').on('click', function(){
		disableCaveElements();
		 $('.spinner .tile').removeClass('active');

		var stepsCount = randomIntFromInterval(3, 6);
		var currStep = 0;
		var stepsInt;
		var stepsNumbersInt;
		stepsNumbersInt = setInterval(function(){
			$('#cave-task-tail-number-left').html(randomIntFromInterval(5, 20));
			setTimeout(function(){
				$('#cave-task-tail-number-right').html(randomIntFromInterval(5, 20));
			}, 50);
		}, 100);  
		stepsInt = setInterval(function(){
			var leftTileNum = randomIntFromInterval(0,7);
			var rightTileNum = randomIntFromInterval(0,7);
			var currLeftTile = $('.spinner.left .tile.t' + leftTileNum);
			var currRightTile = $('.spinner.right .tile.t' + rightTileNum);
			currLeftTile.addClass('active');
			
			setTimeout(function(){
				currRightTile.addClass('active');
				if(currStep < stepsCount){
					currStep++;
					currLeftTile.removeClass('active');
					setTimeout(function(){
						currRightTile.removeClass('active');
					}, 200);
					}else{
						clearInterval(stepsInt);
						clearInterval(stepsNumbersInt);
						enableCaveElements();
					}
			}, 200);
		}, 300);
	});
});
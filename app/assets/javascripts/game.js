window.onload = function(){

    if ($(".game").is("*")){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	//Lets save the cell width in a variable for easy control
	var cw = 5;
	var dir;
	var prevDir;
	var food;
	var score;

	//Debug
	var debugText;

	//Touch areas
	var leftArea, rightArea, upArea, downArea;

	var gameOver;

	//Object for touch areas
	function Rectangle(x, y, width, height) {
	    this.left = x;
	    this.top = y;
	    this.width = width;
	    this.height = height;
	    this.right = x + width;
	    this.bottom = y + height;
	}

	function createTouchAreas() {
	    leftArea = new Rectangle(0, 0, w/4, h);
	    rightArea = new Rectangle(3*w/4, 0, w/4, h);
	    upArea = new Rectangle(w/4, 0, w/2, h/2);
	    downArea = new Rectangle(w/4, w/2, w/2, h/2);
	}
	
	//Lets create the snake now
	var snake_array; //an array of cells to make up the snake

	$("#start").on("click", function(){
	    playGame();
	    $("#start").addClass("hidden"); //so user cannot reset game
	});

	function playGame()
	{
	    dir = "right"; //default direction
	    prevDir = "right";
	    create_snake();
	    create_food(); //Now we can see the food particle
	    createTouchAreas();
	    //finally lets display the score
	    score = 0;

	    gameOver = false;

	    //Lets move the snake now using a timer which will trigger the paint function
	    //every 60ms
	    if(typeof game_loop != "undefined") clearInterval(game_loop);
	    game_loop = setInterval(paint, 60);
	}

	function create_snake()
	{
	    var length = 5; //Length of the snake
	    snake_array = []; //Empty array to start with
	    for(var i = length-1; i>=0; i--)
	    {
		//This will create a horizontal snake starting from the top left
		snake_array.push({x: i, y:0});
	    }
	}

	function create_food()
	{
	    food = {
		x: Math.round(Math.random()*(w-cw)/cw), 
		y: Math.round(Math.random()*(h-cw)/cw), 
	    };
	    //This will create a cell with x/y between 0-44
	    //Because there are 45(450/10) positions accross the rows and columns
	}

	function paint()
	{
	    if (!gameOver) {
		//To avoid the snake trail we need to paint the BG on every frame
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		//Touch areas
		ctx.strokeStyle = "#eee";
		ctx.strokeRect(leftArea.left, leftArea.top, leftArea.width, leftArea.height);
		ctx.strokeStyle = "#eee";
		ctx.strokeRect(rightArea.left, rightArea.top, rightArea.width, rightArea.height);
		ctx.strokeStyle = "#eee";
		ctx.strokeRect(upArea.left, upArea.top, upArea.width, upArea.height);
		ctx.strokeStyle = "#eee";
		ctx.strokeRect(downArea.left, downArea.top, downArea.width, downArea.height);
		//The movement code for the snake to come here.
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(dir == "right") nx++;
		else if(dir == "left") nx--;
		else if(dir == "up") ny--;
		else if(dir == "down") ny++;

		prevDir = dir;

		//Lets add the game over clauses now
		//This will end the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will end
		if(nx < 0 || nx >= w/cw || ny < 0 || ny >= h/cw || check_collision(nx, ny, snake_array))
		{
		    gameOver = true;
		    endGame();
		}

		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		if(nx == food.x && ny == food.y)
		{
		    var tail = {x: nx, y: ny};
		    score++;
		    //Create new food
		    create_food();
		}
		else
		{
		    var tail = snake_array.pop(); //pops out the last cell
		    tail.x = nx; tail.y = ny;
		}
		//The snake can now eat the food.

		snake_array.unshift(tail); //puts back the tail as the first cell

		for(var i = 0; i < snake_array.length; i++)
		{
		    var c = snake_array[i];
		    //Lets paint 10px wide cells
		    paint_cell(c.x, c.y);
		}

		//Lets paint the food
		paint_cell(food.x, food.y);
		//Lets paint the score
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
		//ctx.fillText(debugText, 5, h-16);
	    }
	}

	//Lets first create a generic function to paint cells
	function paint_cell(x, y)
	{
	    ctx.fillStyle = "blue";
	    ctx.fillRect(x*cw, y*cw, cw, cw);
	    ctx.strokeStyle = "white";
	    ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function check_collision(x, y, array)
	{
	    //This function will check if the provided x/y coordinates exist
	    //in an array of cells or not
	    for(var i = 0; i < array.length; i++)
	    {
		if(array[i].x == x && array[i].y == y)
		    return true;
	    }
	    return false;
	}

	function endGame(){
	    $('#game_score').val(score);
	    $('#new_game').submit();
	}

	$(document).keydown(function(e){
	    var key = e.which;
	    //We will add another clause to prevent reverse gear
	    if(key == "37") changeDirLeft();
	    else if(key == "38") changeDirUp();
	    else if(key == "39") changeDirRight();
	    else if(key == "40") changeDirDown();
	})

	$("#left").on("click", function(){
	    changeDirLeft();
	});

	$("#right").on("click", function(){
	    changeDirRight();
	});

	$("#up").on("click", function(){
	    changeDirUp();
	});

	$("#down").on("click", function(){
	    changeDirDown();
	});

	canvas.addEventListener('touchstart', function(e){
	    var rect = canvas.getBoundingClientRect();
	    var touchobj = e.changedTouches[0];
	    var x = touchobj.pageX - rect.left;
	    var y = touchobj.pageY - rect.top;
	    debugText = x + ", " + y;
	    handleTouch(x, y);
	}, false);

	function handleTouch(x, y) {
	    if (checkTouchArea(x, y, leftArea)) changeDirLeft();
	    else if (checkTouchArea(x, y, rightArea)) changeDirRight();
	    else if (checkTouchArea(x, y, upArea)) changeDirUp();
	    else if (checkTouchArea(x, y, downArea)) changeDirDown();
	}

	function checkTouchArea(x, y, rect) {
	    if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) return true;
	}

	function changeDirLeft() {
	    if (prevDir != "right") dir = "left";
	}

	function changeDirRight() {
	    if (prevDir != "left") dir = "right";
	}

	function changeDirUp() {
	    if (prevDir != "down") dir = "up";
	}

	function changeDirDown() {
	    if (prevDir != "up") dir = "down";
	}
    }

}


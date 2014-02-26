window.onload = function(){

    if ($(".game").is("*")){
	//Debug
	var debugText;

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");

	//Lets save the cell width in a variable for easy control
	var cw = 5;

	//Game dimensions
	var gridWidth = 45;
	var gridHeight = 45;
	var w = gridWidth * cw;
	var h = gridHeight * cw;
	var widthToHeight = w/h;

	var canvasWidth, canvasHeight, scaleX, scaleY;

	function resizeGame() {
	    resizeCanvas();
	    createTouchAreas();
	}

	function resizeCanvas() {
	    //Canvas element dimensions
	    canvasWidth = $("#canvas").width();
	    canvasHeight = canvasWidth/widthToHeight;
	    $("#canvas").css('height', canvasHeight);
	    debugText = canvasWidth + ", " + canvasHeight;

	    //Set the canvas width and height equal to CSS width and height
	    canvas.setAttribute('width', canvasWidth);
	    canvas.setAttribute('height', canvasHeight);

	    scaleX = canvasWidth/w;
	    scaleY = canvasHeight/h;
	}

	var dir;
	var prevDir;
	var food;
	var score;
	var gameDuration = 180; // duration of the game in seconds
	var startPoint;
	var currentTime;

	//Touch areas
	var leftArea, rightArea, upArea, downArea;

	var gameOver;
	var gameStarted = false;

	//Object for touch areas
	function Rectangle(x, y, width, height) {
	    this.left = x;
	    this.top = y;
	    this.width = width;
	    this.height = height;
	    this.right = x + width;
	    this.bottom = y + height;
	    this.active = false;
	}

	function createTouchAreas() {
	    leftArea = new Rectangle(0, 0, canvasWidth/2, canvasHeight);
	    rightArea = new Rectangle(canvasWidth/2, 0, canvasWidth/2, canvasHeight);
	    upArea = new Rectangle(0, 0, canvasWidth, canvasHeight/2);
	    downArea = new Rectangle(0, canvasHeight/2, canvasWidth, canvasHeight/2);
	}

	function setTouchAreas() {
	    if (prevDir == "left" || prevDir == "right") {
		leftArea.active = false;
		rightArea.active = false;
		upArea.active = true;
		downArea.active = true;
	    } else {
		leftArea.active = true;
		rightArea.active = true;
		upArea.active = false;
		downArea.active = false;
	    }
	}
	
	//Lets create the snake now
	var snake_array; //an array of cells to make up the snake

	$("#start").on("click", function(){
	    playGame();
	    //$("#start").addClass("hidden"); //so user cannot reset game
	    $("#start").remove();
	    $(".navbar").remove();
	});

	function playGame()
	{
	    dir = "right"; //default direction
	    prevDir = "right";
	    create_snake();
	    create_food(); //Now we can see the food particle
	    resizeGame();
	    setTouchAreas();
	    //finally lets display the score
	    score = 0;
	    startPoint = (new Date).getTime(); // in milliseconds
	    currentTime = 0;

	    gameOver = false;
	    window.scrollTo(0, 1); //Position screen
	    gameStarted = true;

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
		x: Math.round(Math.random()*(w-3*cw)/cw) + 1, 
		y: Math.round(Math.random()*(h-3*cw)/cw) + 1, 
	    };
	    //This will create a cell with x/y between 1-43
	    //The cell will never lie on the border (positions 0 and 44)
	}

	function paint()
	{
	    if (!gameOver) {
		//To avoid the snake trail we need to paint the BG on every frame
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		//Touch areas
		paintTouchAreas();

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
		setTouchAreas();

		//Timing
		currentTime = Math.floor(((new Date).getTime() - startPoint)/1000);

		//Lets add the game over clauses now
		//This will end the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will end
		if(nx < 0 || nx >= w/cw || ny < 0 || ny >= h/cw || check_collision(nx, ny, snake_array) || currentTime >= gameDuration)
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

		//Border
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

		//Lets paint the score
		var score_text = "Score: " + score;
		var fontSize = 12*scaleX;
		ctx.font = "normal " + fontSize + "px monospace";
		ctx.fillStyle = "black";
		//ctx.fillText(score_text, 8*scaleX, canvasHeight - 8*scaleY);
		//ctx.fillText(debugText, 5, canvasHeight-16);

		//Paint the time
		var timeText = displayTime();

		//Outside the canvas
		$("#score").text(score_text);
		$("#time").text(timeText);
	    }
	}

	//Lets first create a generic function to paint cells
	function paint_cell(x, y)
	{
	    ctx.fillStyle = "#0c9";
	    ctx.fillRect(x*cw*scaleX, y*cw*scaleY, cw*scaleX, cw*scaleY);
	    ctx.strokeStyle = "white";
	    ctx.strokeRect(x*cw*scaleX, y*cw*scaleY, cw*scaleX, cw*scaleY);
	}

	function paintTouchAreas() {
	    paintTouchArea(leftArea);
	    paintTouchArea(rightArea);
	    paintTouchArea(upArea);
	    paintTouchArea(downArea);
	}

	function paintTouchArea(rect) {
	    if (rect.active) {
		ctx.strokeStyle = "#eee";
		ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
	    }
	}

	function displayTime() {
	    var timeLeft = gameDuration - currentTime;
	    var minutes = Math.floor(timeLeft / 60);
	    var seconds = timeLeft % 60;
	    if (seconds < 10) seconds = "0" + seconds;
	    var timeText = minutes + ":" + seconds;
	    var fontSize = 12*scaleX;
	    ctx.font = "normal " + fontSize + "px monospace";
	    ctx.fillStyle = "black";
	    //ctx.fillText(timeText, 5*canvasWidth/6, canvasHeight - 8*scaleY);

	    return timeText;
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

	window.addEventListener('resize', resizeGame, false);

	window.addEventListener('touchmove', function(e) {
	    if (gameStarted) e.preventDefault(); //To prevent swipe scrolling once game has begun
	}, false);

	canvas.addEventListener('touchstart', function(e){
	    if (gameStarted) e.preventDefault(); //To prevent long taps on canvas bringing up context menu
	    var rect = canvas.getBoundingClientRect();
	    var touchobj = e.changedTouches[0];
	    var x = touchobj.pageX - rect.left;
	    var y = touchobj.pageY - rect.top;
	    //debugText = x + ", " + y;
	    handleTouch(x, y);
	}, false);

	function handleTouch(x, y) {
	    if (checkTouchArea(x, y, leftArea)) changeDirLeft();
	    else if (checkTouchArea(x, y, rightArea)) changeDirRight();
	    else if (checkTouchArea(x, y, upArea)) changeDirUp();
	    else if (checkTouchArea(x, y, downArea)) changeDirDown();
	}

	function checkTouchArea(x, y, rect) {
	    if (rect.active && x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
		return true;
	    }
	    return false;
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

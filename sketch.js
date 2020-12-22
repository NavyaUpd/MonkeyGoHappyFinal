var monkey, monkeyAnimation, monkeyStopped, ground;
var banana, bananaImage, obstacle, obstacleImage;
var bananaGroup, obstacleGroup;
var backgroundImage, backgroundSprite, restart;
var score = 0;
var monkeyTouchedObstacleOnce = false;
var PLAY = 0;
var END = 1;
var gamestate = PLAY;

function preload() {

  monkeyAnimation = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");
  monkeyStopped = loadAnimation("Monkey_01.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("stone.png");
  backgroundImage = loadImage("jungle.jpg");

}

function setup() {

  createCanvas(400, 400);

  backgroundSprite = createSprite(width / 2, 200, 400, 400);
  backgroundSprite.addImage("bg", backgroundImage);

  ground = createSprite(400, 390, 800, 20);
  ground.visible = false;

  monkey = createSprite(75, 325, 10, 10);
  monkey.addAnimation("stopped", monkeyStopped);
  monkey.addAnimation("monkey_running", monkeyAnimation);
  monkey.scale = 0.12;
  monkey.y = 325;
  //monkey.debug = true;
  monkey.setCollider("circle", 0, 10, 300);

  fill("green")
  restart = createSprite(200, 150, 175, 30);
  restart.visible = false;

  bananaGroup = new Group();
  obstacleGroup = new Group();

}

function draw() {

  background(220);
  drawSprites();

  //managing gamestates
  if (gamestate === PLAY) {
    
    monkey.changeAnimation("monkey_running", monkeyAnimation);

    //ground scrolling effect
    backgroundSprite.velocityX = -5;
    if (backgroundSprite.x < 0) {
      backgroundSprite.x = width / 2;
    }

    //monkey jumps when space is pressed
    if (keyWentDown("SPACE") && monkey.y > 250) {
      monkey.velocityY = -5;
    }

    //gravity for monkey
    monkey.velocityY = monkey.velocityY + 0.2;
    monkey.collide(ground);

    //draws bananas and rocks
    drawBanana();
    drawObstacle();

    //calculates score when banana is collected
    if (monkey.isTouching(bananaGroup)) {
      score = score + 2;
      bananaGroup.destroyEach();
    }
    //changes size of monkey on reaching certain checkpoints
    switch (score) {
      case 10: monkey.scale = 0.16; break;
      case 20: monkey.scale = 0.20; break;
      case 30: monkey.scale = 0.24; break;
      case 40: monkey.scale = 0.26; break;
      case 50: monkey.scale = 0.28; break;
      default:
        break;
    }
    
    //reduces size to normal when monkey touches obstacle
    if (monkey.isTouching(obstacleGroup) && monkeyTouchedObstacleOnce === false) {
      monkey.scale = 0.12;
      obstacleGroup.destroyEach();
      monkeyTouchedObstacleOnce = true;
    } else if (monkey.isTouching(obstacleGroup) && monkeyTouchedObstacleOnce === true) {
      gamestate = END;
    }
    
  } else if (gamestate === END) {
    backgroundSprite.velocityX = 0;

    obstacleGroup.setLifetimeEach(-1);
    obstacleGroup.setVelocityXEach(0);

    bananaGroup.setLifetimeEach(-1);
    bananaGroup.setVelocityXEach(0);
    
    monkey.velocityY = 0;
    monkey.changeAnimation("stopped", monkeyStopped);

    fill("red");
    textSize(40);
    strokeWeight(5);
    stroke("white");
    text("GAMEOVER", 75, 120);

    restart.visible = true;
    fill("grey");
    textSize(15);
    strokeWeight(3);
    stroke("white");
    text("PRESS TO RESTART", 130, 155);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  //displays score
  fill("black");
  textSize(20);
  noStroke();
  text("Score: " + score, 10, 20);

}

function reset() {
  score = 0;
  restart.visible = false;
  monkeyTouchedObstacleOnce = false;
  monkey.scale = 0.12;
  obstacleGroup.destroyEach();
  bananaGroup.destroyEach();
  gamestate = PLAY;
}

function drawBanana() {
  if (frameCount % 80 === 0) {
    banana = createSprite(400, 200, 10, 10);
    banana.addAnimation("banana", bananaImage);
    banana.scale = 0.08;
    banana.y = random(150, 230);
    banana.velocityX = -3;
    banana.lifetime = 130;
    banana.setCollider("circle", 0, 10, 400);

    bananaGroup.add(banana);
    ///banana.debug = true;
  }
}

function drawObstacle() {
  if (frameCount % 100 === 0) {
    obstacle = createSprite(400, 360, 10, 10);
    obstacle.addAnimation("obstacle", obstacleImage);
    obstacle.scale = 0.15;
    obstacle.velocityX = -5;
    obstacle.lifetime = 130;
    obstacle.setCollider("circle", 0, 10, 200);
    obstacle.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    obstacleGroup.add(obstacle);
    //obstacle.debug = true;
  }
}
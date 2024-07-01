let invaders = []
let invaderImg
let player
let bullets = []

let invaderBullets = []
let invaderShootingFrequency = 0.05;
let maxInvaderBullets = 5

let gameOver = false
let gameWon = false
let message = ""


function preload() {
    // Code to run before the rest of the sketch.
    invaderImg = loadImage('invader.gif')
}

function setup() {
    createCanvas(700,500)
    textFont('Press Start 2P');
    // Code to run once at the start of the sketch.
    player =  createPlayer()
    for ( let j = 0; j < 3; j++){
        for(let i = 0; i < 6; i++){
            invaders.push(createInvader(i * 70, j * 70))
        }
    }
}

function draw() {
    //game over or win
    if (gameOver || gameWon) {
        background(0);

        if (gameOver) {
          fill(255, 0, 0);
          message = "GAME OVER";
        } else {
          fill(118, 240, 19);
          message = "¡WINNER!";
        }

        textSize(32);
        textAlign(CENTER, CENTER);
        text(message, width / 2, height / 2);
        return;
      }

    // Code to run repeatedly.
    background(0)
    movePlayer(player)
    showPlayer(player)



    //show and move player bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        showBullet(bullets[i]);
        moveBullet(bullets[i]);
        for (let j = invaders.length - 1; j >= 0; j--) {
            if(bulletHitsInvader(bullets[i], invaders[j])){
                invaders.splice(j, 1)
                bullets.splice(i, 1)
                if(invaders.length === 0){
                    gameWon = true
                }
                break
            }
        }
        
      }

    //show and move invaders
    let limit = false
    for(let i = 0; i < invaders.length; i++){
        showInvaders(invaders[i])
        moveInvaders(invaders[i])
        if(invaders[i].x > width || invaders[i].x < 0){
            limit = true
        }

        //conditions for invaders fire
        if(random(1) < invaderShootingFrequency && invaderBullets.length < maxInvaderBullets){
            let invaderBullet = createBullet(invaders[i].x, invaders[i].y)
            invaderBullets.push(invaderBullet)
        }
    }

    //show and move invaders Bullets
    for(let i = invaderBullets.length - 1; i >= 0; i--){
        showBullet(invaderBullets[i])
        moveInvaderBullet(invaderBullets[i])
        if(bulletHitsPlayer(invaderBullets[i], player)){
            //game over
            gameOver = true
        }

        if (invaderBullets[i].y > height){
            invaderBullets.splice(i, 1)
        }  
    }

    if(limit){
        for(let i = 0; i < invaders.length; i++){
            shiftInvaderDown(invaders[i])
        }
    }

}

//PLAYER
function createPlayer(){
    return {x: width / 2 , y: height - 20, w: 60, h:20, dir: 0}
}

function showPlayer(player){
    fill(255)
    rect(player.x, player.y, player.w, player.h)
}

function movePlayer (player){
    player.x += player.dir * 5
    player.x = constrain(player.x, 0, width - player.w)   
}

function keyPressed() { 
    if (keyCode === 32){
        let bullet = createBullet(player.x + player.w / 2, player.y)
        bullets.push(bullet)
    }
    if (keyCode === RIGHT_ARROW){
        player.dir = 1
    } else if (keyCode === LEFT_ARROW){
        player.dir = -1
    }
 }

function keyReleased() {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
        player.dir = 0
    }
  }

function createBullet(x, y){  
    return {x: x, y: y, r: 8}
} 

function showBullet(bullet) {
    if(invaderBullets.includes(bullet)){
        fill(118, 240, 19)
    }else{
        fill(255)
    }
    ellipse(bullet.x, bullet.y, bullet.r * 2, bullet.r * 2);
  }

function moveBullet(bullet){
    bullet.y -= 5 
}

function bulletHitsPlayer(invaderBullet, player) {
    let d = dist(invaderBullet.x, invaderBullet.y, player.x + player.w / 2, player.y + player.h / 2);
    return d < invaderBullet.r + player.w / 2;
  }

//INVADER 
function createInvader(x, y){
    return {x: x , y: y, r: 60, xdir: 1}
}
    
function showInvaders(invader){
    image(invaderImg, invader.x, invader.y, invader.r, invader.r);
}

function moveInvaders(invader){
    invader.x += invader.xdir
}

function shiftInvaderDown(invader){
    invader.xdir *= -1
    invader.y += invader.r
}

function moveInvaderBullet(bullet) {
    bullet.y += 5;
}

function bulletHitsInvader(bullet, invader) {
    let d = dist(bullet.x, bullet.y, invader.x, invader.y)
    return d < bullet.r + invader.r
}

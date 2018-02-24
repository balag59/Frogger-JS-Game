// Setup THREE//
width = window.innerWidth / 16;
height = window.innerHeight / 16;

var div = document.querySelector("#game");
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(-width, width, height, -height, -30, 30);
//var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true //set to false if game is slow
});
renderer.setSize(window.innerWidth, window.innerHeight);
div.appendChild(renderer.domElement);

//camera.position.set(0, 10.5, -7);
camera.position.set(-1, 2.8, -2.9); // Change -1 to -.02
camera.zoom = 8; // for birds eye view
camera.updateProjectionMatrix();

//camera.position.set(0, 10.5, -7);// use this with perspective camera, disable camera.zoom also

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  width = window.innerWidth / 16;
  height = window.innerHeight / 16;
  renderer.setSize(width * 16, height * 16);
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
}

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enabled = false;

////////////////////////////////////////////////////
////////////////////////////////////////////////////
var pause = false;
var score = 0;
var scoreDiv = document.querySelector("#score");
var resetDiv = document.querySelector("#reset");

function endScore() {
  scoreDiv.style.transition = "top 2s, width 2s, left 2s, font-size 2s";
  scoreDiv.style.top = "50%";
  scoreDiv.style.width = "100%";
  scoreDiv.style.left = "0px";
  scoreDiv.style.fontSize = "300px";
  resetDiv.style.visibility = "visible";
}

function newScore() {
  scoreDiv.style.transition = "top 2s, width 2s,left 2s, font-size 2s";
  scoreDiv.style.top = "40px";
  scoreDiv.style.width = "0px";
  scoreDiv.style.left = "10px";
  scoreDiv.style.fontSize = "80px";
  resetDiv.style.visibility = "hidden";
  pause = false;
  init();
}
//
/////////////////////////////////////////////////////
////////////////////////////////////////////////////
var pause = false;
document.addEventListener("keyup", keyUp);
LEFT = 37;
UP = 38; // Key   //
RIGHT = 39; // Codes //
DOWN = 40;

function keyUp(e) {
  e.preventDefault();
  onLog = false;
  if (!pause) {
    switch (e.keyCode) {
      case UP:
        hero.position.x = Math.round(hero.position.x);
        if (!treeCollision("up")) {
          hero.position.z++;
        }
        break;
      case DOWN:
        hero.position.x = Math.round(hero.position.x);
        if (!treeCollision("down")) {
          hero.position.z--;
        }
        break;

      case LEFT:
        if (!treeCollision("left")) {
          if (hero.position.x !== 4) {
            hero.position.x++;
          }
        }
        break;

      case RIGHT:
        if (!treeCollision("right")) {
          if (hero.position.x !== -4) {
            hero.position.x--;
          }
        }
        break;
    }
  } else {
    if (e.keyCode == 13) {

      newScore();
    }
  }
}

////////////////////////////////////////////////////
////////////////////////////////////////////////////

// Variables
var grass = [],
  grassCount = 0; //
var water = [],
  waterCount = 0; // Terrain tiles
var road = [],
  roadCount = 0; //

var deadTrees = [],
  deadCount = 0; //
var trees = [],
  treeCount = 0; //
var logs = [],
  logCount = 0; // Terrain objects
var cars = [],
  carCount = 0; //
var logSpeed = [],
  carSpeed = []; //
var onLog = true;

var rowCount = 0;
var camCount = 0,
  camSpeed = .02;

// Widths used also in carCollision()
var heroWidth = .7,
  carWidth = 1.5,
  logWidth = 2;
var cCollide = heroWidth / 2 + carWidth / 2 - .1;
var lCollide = (heroWidth / 4 + logWidth / 4) + .5;

// Geometry, material
heroGeo = new THREE.BoxGeometry(heroWidth, .69, heroWidth);
heroMat = new THREE.MeshBasicMaterial({
  vertexColors: THREE.VertexColors,
  side: THREE.FrontSide
});
heroGeo.faces[2].color = new THREE.Color(0xCC6C78);
heroGeo.faces[3].color = new THREE.Color(0xCC6C78);
heroGeo.faces[4].color = new THREE.Color(0xDD7C89);
heroGeo.faces[5].color = new THREE.Color(0xDD7C89);
heroGeo.faces[10].color = new THREE.Color(0xee8C99);
heroGeo.faces[11].color = new THREE.Color(0xee8C99);

terrainGeo = new THREE.PlaneGeometry(19, 1);
grassMat = new THREE.MeshBasicMaterial({
  color: 0x55cc5f
});
waterMat = new THREE.MeshBasicMaterial({
  color: 0x2Fe0e9
});
roadMat = new THREE.MeshBasicMaterial({
  color: 0x777777
});

shadeGeo = new THREE.PlaneGeometry(5, 500);
shadeMat = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: .3
});
blindMat = new THREE.MeshBasicMaterial({
  color: 0xADD8E6
});

treeGeo = new THREE.BoxGeometry(.6, 1, .6);
treeMat = new THREE.MeshBasicMaterial({
  vertexColors: THREE.VertexColors,
  side: THREE.FrontSide
});
treeGeo.faces[2].color = new THREE.Color(0x006400);
treeGeo.faces[3].color = new THREE.Color(0x006400);
treeGeo.faces[4].color = new THREE.Color(0x008800);
treeGeo.faces[5].color = new THREE.Color(0x008800);
treeGeo.faces[10].color = new THREE.Color(0x009900);
treeGeo.faces[11].color = new THREE.Color(0x009900);

carGeo = new THREE.BoxGeometry(carWidth, .5, .7);
carMat = new THREE.MeshBasicMaterial({
  vertexColors: THREE.VertexColors,
  side: THREE.FrontSide
});
carGeo.faces[2].color = new THREE.Color(0x0077FF);
carGeo.faces[3].color = new THREE.Color(0x1177FF);
carGeo.faces[4].color = new THREE.Color(0x3388FF);
carGeo.faces[5].color = new THREE.Color(0x3388FF);
carGeo.faces[10].color = new THREE.Color(0x5599FF);
carGeo.faces[11].color = new THREE.Color(0x5599FF);

logGeo = new THREE.BoxGeometry(logWidth, .25, .6);
logMat = new THREE.MeshBasicMaterial({
  vertexColors: THREE.VertexColors,
  side: THREE.FrontSide
});
logGeo.faces[2].color = new THREE.Color(0x7F4D48);
logGeo.faces[3].color = new THREE.Color(0x7F4D48);
logGeo.faces[4].color = new THREE.Color(0x8F5C59);
logGeo.faces[5].color = new THREE.Color(0x8F5C59);
logGeo.faces[10].color = new THREE.Color(0x9F6D6A);
logGeo.faces[11].color = new THREE.Color(0x9F6D6A);

// Mesh
hero = new THREE.Mesh(heroGeo, heroMat);
hero.position.y = .25;
scene.add(hero);

leftShade = new THREE.Mesh(shadeGeo, shadeMat);
rightShade = new THREE.Mesh(shadeGeo, shadeMat);
leftBlind = new THREE.Mesh(shadeGeo, blindMat);
rightBlind = new THREE.Mesh(shadeGeo, blindMat);

grass[0] = new THREE.Mesh(terrainGeo, grassMat);
water[0] = new THREE.Mesh(terrainGeo, waterMat);
road[0] = new THREE.Mesh(terrainGeo, roadMat);

trees[0] = new THREE.Mesh(treeGeo, treeMat);
cars[0] = new THREE.Mesh(carGeo, carMat);
logs[0] = new THREE.Mesh(logGeo, logMat);

// Mesh orientation
leftShade.rotation.x = 270 * Math.PI / 180;
leftShade.position.set(6.65, 1, 248.47);
rightShade.rotation.x = 270 * Math.PI / 180;
rightShade.position.set(-7.35, 1, 248.47);
leftBlind.rotation.x = 270 * Math.PI / 180;
leftBlind.position.set(11.8, .6, 248.9);
rightBlind.rotation.x = 270 * Math.PI / 180;
rightBlind.position.set(-12.2, .6, 248.9);
scene.add(leftShade);
scene.add(rightShade);
scene.add(leftBlind);
scene.add(rightBlind);

grass[0].rotation.x = 270 * Math.PI / 180;
water[0].rotation.x = 270 * Math.PI / 180;
road[0].rotation.x = 270 * Math.PI / 180;

grass[0].position.z = -30;
water[0].position.z = -30;
road[0].position.z = -30;

trees[0].position.set(0, .5, -30);
cars[0].position.set(0, .25, -30);
logs[0].position.set(0, 0, -30);

// Assign mesh to corresponding array
// and add mesh to scene
for (i = 0; i < 15; i++) {
  grass[i] = grass[0].clone();
  water[i] = water[0].clone();
  road[i] = road[0].clone();

  scene.add(grass[i]);
  scene.add(water[i]);
  scene.add(road[i]);
}

// Repeat above for terrain objects
for (i = 0; i < 55; i++) {
  trees[i] = trees[0].clone();
  scene.add(trees[i]);
}

//Build dead trees
deadTreeGeo = new THREE.Geometry();
for (x = 0; x < 5; x++) {
  trees[0].position.set(x + 5, .4, 0);
  THREE.GeometryUtils.merge(deadTreeGeo, trees[0]);
  trees[0].position.set(-(x + 5), .4, 0);
  THREE.GeometryUtils.merge(deadTreeGeo, trees[0]);
}

deadTrees[0] = new THREE.Mesh(deadTreeGeo, treeMat);

for (x = 0; x < 15; x++) {
  deadTrees[x] = deadTrees[0].clone();
  scene.add(deadTrees[x]);
}

for (i = 0; i < 40; i++) {
  cars[i] = cars[0].clone();
  scene.add(cars[i]);
}
for (i = 0; i < 40; i++) {
  logs[i] = logs[0].clone();
  scene.add(logs[i]);
}

// Setup initial scene
function init() {
  score = 0;
  camera.position.z = -2.9;
  hero.position.set(0, .25, 0);
  hero.scale.y = 1;
  grassCount = 0;
  waterCount = 0;
  roadCount = 0;

  deadCount = 0;
  treeCount = 0;
  roadCount = 0;
  rowCount = 0;

  for (i = 0; i < 15; i++) {
    grass[i].position.z = -30;
    water[i].position.z = -30;
    road[i].position.z = -30;
    deadTrees[i].position.z = -30;
  }
  for (i = 0; i < 55; i++) {
    trees[i].position.z = -30;
  }
  for (i = 0; i < 40; i++) {
    cars[i].position.z = -30;
    carSpeed[i] = 0;

    logs[i].position.z = -30;
    logSpeed[i] = 0;
  }

  treeGen();
  grass[grassCount].position.z = rowCount;
  deadTrees[grassCount].position.z = rowCount;
  grassCount++;
  rowCount++;
  for (i = 1; i < 15; i++) {
    newRow();
  }
}

// Scene generators
function newRow() {
  if (grassCount == 15) {
    grassCount = 0;
  }
  if (roadCount == 15) {
    roadCount = 0;
  }
  if (waterCount == 15) {
    waterCount = 0;
  }

  switch (Math.floor(Math.random() * (4 - 1)) + 1) {
    case 1:
      treeGen();
      grass[grassCount].position.z = rowCount;
      deadTrees[grassCount].position.z = rowCount;
      grassCount++;
      break;

    case 2:
      carGen();
      road[roadCount].position.z = rowCount;
      roadCount++;
      break;

    case 3:
      logGen();
      water[waterCount].position.z = rowCount;
      waterCount++;
      break;
  }
  rowCount++;

}

function treeGen() {
  for (x = 0; x < 9; x++) {
    if (x !== 4 && Math.random() > .6) {
      if (treeCount < 54) {
        treeCount++;
      } else {
        treeCount = 0;
      }
      trees[treeCount].position.set(x - 4, .4, rowCount);
    }
  }
}

function carGen() {
  // Speeds: .01 through .08
  // Number of cars: 1 through 3
  speed = (Math.floor(Math.random() * (5 - 1)) + 1) / 80;
  numCars = Math.floor(Math.random() * (4 - 2)) + 2;
  xDir = 1;

  if (Math.random() > .5) {
    xDir = -1;
  }

  xPos = -6 * xDir;

  for (x = 0; x < numCars; x++) {
    if (carCount < 39) {
      carCount++;
    } else {
      carCount = 0;
    }

    cars[carCount].position.set(xPos, .25, rowCount);
    carSpeed[carCount] = speed * xDir;

    xPos -= 5 * xDir;
  }
}

function logGen() {
  // Speeds: .01 through .08
  // Number of cars: 1 through 3
  speed = (Math.floor(Math.random() * (3 - 1)) + 1) / 70;
  numLogs = Math.floor(Math.random() * (4 - 3)) + 3;
  xDir = 1;

  if (Math.random() > .5) {
    xDir = -1;
  }
  if (logSpeed[logCount] == speed * xDir) {
    speed /= 1.5;
  }

  xPos = -6 * xDir;

  for (x = 0; x < numLogs; x++) {
    if (logCount < 39) {
      logCount++;
    } else {
      logCount = 0;
    }

    logs[logCount].position.set(xPos, 0, rowCount);
    logSpeed[logCount] = speed * xDir;

    xPos -= 5 * xDir;
  }
}

// Animate cars/logs
function drive() {
  for (d = 0; d < cars.length; d++) {
    cars[d].position.x += carSpeed[d];
    logs[d].position.x += logSpeed[d];

    if (cars[d].position.x > 11 && carSpeed[d] > 0) {
      cars[d].position.x = -11;
    } else if (cars[d].position.x < -11 && carSpeed[d] < 0) {
      cars[d].position.x = 11;
    }
    if (logs[d].position.x > 11 && logSpeed[d] > 0) {
      logs[d].position.x = -10;
    } else if (logs[d].position.x < -11 && logSpeed[d] < 0) {
      logs[d].position.x = 10;
    }
  }
}

// Detect collisions with trees/cars
function treeCollision(dir) {
  var zPos = 0;
  var xPos = 0;
  if (dir == "up") {
    zPos = 1;
  } else if (dir == "down") {
    zPos = -1;
  } else if (dir == "left") {
    xPos = 1;
  } else if (dir == "right") {
    xPos = -1;
  }

  for (x = 0; x < trees.length; x++) {
    if (hero.position.z + zPos == trees[x].position.z) {
      if (hero.position.x + xPos == trees[x].position.x) {
        return true;
      }
    }
  }
}

function carCollision() {
  for (c = 0; c < cars.length; c++) {
    if (hero.position.z == cars[c].position.z) {
      if (hero.position.x < cars[c].position.x + cCollide &&
        hero.position.x > cars[c].position.x - cCollide) {
        hero.scale.y = 0;
        hero.position.y = .1;
        gameOver();
      }
    }
  }
}

function logCollision() {
  for (l = 0; l < logs.length; l++) {
    if (hero.position.z == logs[l].position.z) {
      if (hero.position.x < logs[l].position.x + lCollide &&
        hero.position.x > logs[l].position.x - lCollide) {
        onLog = true;
        if (hero.position.x > logs[l].position.x) {
          hero.position.x = logs[l].position.x + .5;
        } else {
          hero.position.x = logs[l].position.x - .5;
        }
        if (hero.position.x > 5 || hero.position.x < -5) {
          gameOver();
        }
      }
    }
  }
}

function waterCollision() {
  if (onLog == false) {
    for (w = 0; w < water.length; w++) {
      if (hero.position.z == water[w].position.z) {
        gameOver();

         y = Math.sin( sineCount ) * .08-.2;
         sineCount += sineInc;
        hero.position.y = y;
        for (w = 0; w < logSpeed.length; w++) {
          if (hero.position.z == logs[w].position.z) {
            hero.position.x += logSpeed[w] / 3;
          }
        }
      }
    }
  }
}

// Move scene forward
function forwardScene() {
  if (!pause) {
    if (Math.floor(camera.position.z) < hero.position.z - 4) {
      // speed up camera to follow player
      camera.position.z += .033;
      if (camCount > 1.8) {
        camCount = 0;
        newRow();
        newRow();
        newRow();
      } else {
        camCount += camSpeed;
      }

    } else {
      camera.position.z += .011;
      // normal camera speed
      if (camCount > 1.8) {
        camCount = 0;
        newRow();
      } else {
        camCount += camSpeed;
      }
    }

  }
}

// Reset variables, restart game
function gameOver() {
  pause = true;
  endScore();
}

 var sineCount = 0;
 var sineInc = Math.PI / 50;

function render() {
  requestAnimationFrame(render);
  drive();
  carCollision();
  logCollision();
  waterCollision();
  forwardScene();

  if (score < hero.position.z) {
    score = hero.position.z;
  }
  scoreDiv.innerHTML = score;
  renderer.render(scene, camera);
}
init();
render();

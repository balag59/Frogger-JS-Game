var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 50;
var frog,lake_plane;
var logs1 = [];
var logs2 = [];
var cars1 = [];
var cars2 = [];
var num_lives = 3;
var score = 0;
var collision_true,log1_true,log2_true,frog_width,log_width,log_height,frog_height,on_lake;
LEFT = 37;
UP = 38;
RIGHT = 39;
DOWN = 40;
//var camera = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16,window.innerHeight / 16, window.innerHeight / - 16, -200, 500 );
//camera.position.x = 2;
//camera.position.y = 1;
//camera.position.z = 3;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var audio = document.createElement('audio');
var source = document.createElement('source');
source.src = 'start.wav';
audio.appendChild(source);
audio.play();
function scene_setup () {
	start_scene();
	road_scene();
	path_scene();
	lake_scene();
	finish_scene();
	frog_scene();
	car_scene();
	log_scene();
};
function start_scene(){
var start_geometry = new THREE.PlaneGeometry( window.innerWidth, 10 );
var start_material = new THREE.MeshBasicMaterial( {color: 0x179767, side: THREE.FrontSide} );
var start_plane = new THREE.Mesh( start_geometry, start_material );
scene.add( start_plane);
start_plane.position.y = -20;
};

function road_scene(){
var road_geometry = new THREE.PlaneGeometry( window.innerWidth, 15 );
var road_material = new THREE.MeshBasicMaterial( {color: 0x60606B, side: THREE.FrontSide} );
var road_plane = new THREE.Mesh( road_geometry, road_material );
scene.add(road_plane);
road_plane.position.y = -10;
};

function path_scene(){
var path_geometry = new THREE.PlaneGeometry( window.innerWidth, 5 );
var path_material = new THREE.MeshBasicMaterial( {color: 0x8E2C16, side: THREE.FrontSide} );
var path_plane = new THREE.Mesh( path_geometry, path_material );
scene.add( path_plane);
path_plane.position.y = 0;
};

function lake_scene(){
var lake_geometry = new THREE.PlaneGeometry( window.innerWidth, 16 );
var lake_material = new THREE.MeshBasicMaterial( {color: 0x1FF0EC,side: THREE.FrontSide} );
lake_plane = new THREE.Mesh( lake_geometry, lake_material );
scene.add( lake_plane);
lake_plane.position.y = 5;
};

function finish_scene(){
var finish_geometry = new THREE.PlaneGeometry( window.innerWidth, 12 );
var finish_material = new THREE.MeshBasicMaterial( {color: 0x179767, side: THREE.FrontSide} );
var finish_plane = new THREE.Mesh( finish_geometry, finish_material );
scene.add( finish_plane);
finish_plane.position.y = 15;
};

function frog_scene(){
//var frog_texture = new THREE.TextureLoader().load( 'lake.jpg' );
var frog_geometry = new THREE.BoxGeometry( 3, 3, 3 );
frog_width = 3;
frog_height = 3;
var frog_material = new THREE.MeshBasicMaterial( {color: 0x0A4F35,side: THREE.FrontSide} );
//var frog_material = new THREE.MeshBasicMaterial( { map: frog_texture, side: THREE.FrontSide} );
frog = new THREE.Mesh( frog_geometry, frog_material );
scene.add( frog);
frog.position.y = -17
}


function car_scene(){
carGeo = new THREE.BoxGeometry(8, 2, 2);
carMat = new THREE.MeshBasicMaterial({
  color: 0xD62D20,
  side: THREE.FrontSide
});
cars1[0] = new THREE.Mesh(carGeo, carMat);
cars1[0].position.x = -30;
cars1[0].position.y = -13;
scene.add(cars1[0]);
for(i=1;i<4;i++){
cars1[i] = new THREE.Mesh(carGeo, carMat);
cars1[i].position.y = -13;
cars1[i].position.x = -30 + (i*10 + 15)
scene.add(cars1[i])
}
for(i=0;i<4;i++){
cars2[i] = new THREE.Mesh(carGeo, carMat);
cars2[i].position.y = -5;
cars2[i].position.x = -30 + (i*15 + 15)
scene.add(cars2[i])
}
}


function log_scene(){
logGeo = new THREE.BoxGeometry(8, 4, 2);
log_width = 8;
log_height = 4;
logMat = new THREE.MeshBasicMaterial({
  color: 0x4B3832,
  side: THREE.FrontSide
});
logs1[0] = new THREE.Mesh(logGeo, logMat);
logs1[0].position.x = -30;
logs1[0].position.y = 10;
scene.add(logs1[0]);
for(i=1;i<4;i++){
logs1[i] = new THREE.Mesh(logGeo, logMat);
logs1[i].position.y = 10;
logs1[i].position.x = -30 + (i*10 + 15)
scene.add(logs1[i])
}
for(i=0;i<4;i++){
logs2[i] = new THREE.Mesh(logGeo, logMat);
logs2[i].position.y = 5;
logs2[i].position.x = -30 + (i*15 + 15)
scene.add(logs2[i])
}
}

function keydownAction(e) {
  switch (e.keyCode) {
      case UP:
			      if(frog.position.y>=0) {
						frog.position.y += 5;
						}
						else frog.position.y++;
						break;
      case DOWN:
            if(frog.position.y>=0)
						{
						frog.position.y -= 5;
						}
						else frog.position.y--;
						break;
      case LEFT:
            frog.position.x--;
						break;
      case RIGHT:
            frog.position.x++;
						break;
    }
  }


function collision(){
for(i=0;i<cars1.length;i++){
	firstBox = new THREE.Box3().setFromObject(frog);
  secondBox = new THREE.Box3().setFromObject(cars1[i]);
	collision_true = firstBox.isIntersectionBox(secondBox);
	if(collision_true) death();

}
for(i=0;i<cars2.length;i++){
 firstBox = new THREE.Box3().setFromObject(frog);
 secondBox = new THREE.Box3().setFromObject(cars2[i]);
 collision_true = firstBox.isIntersectionBox(secondBox);
 if(collision_true) death();
}
}

function lake(){
log1_true = false;
log2_true = false;
 if(frog.position.y == 10){
	 for(i=0;i<logs1.length;i++){
 			if((Math.abs(frog.position.x - logs1[i].position.x) <3)){
 			 log1_true = true;
 		}

 	}
 if(!log1_true) death();
 }

 if(frog.position.y == 5){
		for(i=0;i<logs2.length;i++){
				if((Math.abs(frog.position.x - logs2[i].position.x) <3)){
				 log2_true = true;
			}

		}
  if(!log2_true) death();
	}
	}


function death(){
	if(num_lives >1){
	num_lives--;
	source.src = 'win.mp3';
	audio.appendChild(source);
	audio.play();
	alert('Oops!You lost a life!You have '+num_lives+' lives left');
	frog.position.set(0,-17,0);
	}
else {
	alert('Sorry!You have no more lives left!\nYou lose!\nGame Over\nPlease close this page now')
}
}

function win(){
	if(frog.position.y >= 24){
		source.src = 'win.mp3';
		audio.appendChild(source);
		audio.play();
		score++;
		alert('Congrats!You won!Your current score is ' +score);

		frog.position.set(0,-17,0);
	}
}


function move_objects(){
for(i=0;i<cars1.length;i++){
		if(cars1[i].position.x <= 40 )	cars1[i].position.x += 0.25;
		else cars1[i].position.x = -40;
}
for(i=0;i<cars2.length;i++){
if(cars2[i].position.x >= -40 ) cars2[i].position.x -= 0.5;
else cars2[i].position.x = 40;
}
for(i=0;i<logs1.length;i++){
if(logs1[i].position.x <= 40 ) logs1[i].position.x += 0.1;
else logs1[i].position.x = -40;
}
for(i=0;i<logs2.length;i++){
if(logs2[i].position.x >= -40 )
{
	logs2[i].position.x -= 0.1;
}
else logs2[i].position.x = 40;
}
if(log2_true) frog.position.x -= 0.1;
if(log1_true) frog.position.x += 0.1;
}

function render() {
        requestAnimationFrame( render );
			  move_objects();
				window.addEventListener("keydown", keydownAction, false);
				collision();
				lake();
				win();
				renderer.render(scene, camera);
			};

scene_setup();
render();

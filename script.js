/*
	- Dejar el teclado funcionando
	- Traducir todo al inglés Y QUE SIGA FUNCIONANDO TODO
	- HAZ PRUEBAS EN: https://www.w3schools.com/tags/canvas_getimagedata.asp
		- Entiende la función
		- Y consigue sacar el color en hexadecimal o RGBA
*/

class game{

	constructor(width, height){
		
		//console.log("width", width, "height", height);

		// That the <canvas> measure, we put through for the arguments.
			document.getElementById("game").width = width;
			document.getElementById("game").height = height;

			document.getElementById("gameoculto").width = width;
			document.getElementById("gameoculto").height = height;

		// We create the canvas and the context
			this.canvas = document.getElementById("game");
			this.ctx = this.canvas.getContext("2d");

			this.canvasOculto = document.getElementById("gameoculto");
			this.ctxOculto = this.canvasOculto.getContext("2d");

		// We create the atributte 'config' that will be a objet with date
			this.config = {
				image_to_load: 3,
				width: width,
				height: height,
				position_car: { x: (-1870 + (width/2)), y: -1880 + (height/2) },
				direction: "top",
				count_km: 0,
				speed: 3,
				obstaculos : {
					circuitoRed: {r:237,g:28, b:36},
					pegamentoWhite: {r:255,g:255, b:255},
					aceiteBlack: {r:0,g:0, b:0},
					piezaBlue: {r:63,g:72, b:204},
					fueraCircuitoBlue: {r:237,g:72, b:204},
					metaGreen: {r:63,g:210, b:0}
				},
				obstaculos_str : {
					circuitoRed: "237,28,36",
					pegamentoWhite: "255,255,255",
					aceiteBlack: "0,0,0",
					piezaBlue: "63,72,204",
					fueraCircuitoBlue: "237,72,204",
					metaGreen: "63,210,0"
				},
			};
			//console.log(this.config);
			
		// WE MAKE THE CAR´S SPRITE 
			this.sprite = {
				top :          { x: 0,    y: 0,  width:300,   height:300 },
				topRight :     { x: 300,  y: 0,  width:310,   height:295 },
				right :        { x: 595,  y: 0,  width:300,   height:300 },
				bottomRight:   { x: 900,  y: 0,  width:300,   height:330 },
				bottom :       { x: 1200, y: 0,  width:292,   height:300 },
				bottomLeft :   { x: 1500, y: 0,  width:300,   height:300 },
				left :         { x: 1900, y: 0,  width:300,   height:300 },
				topLeft :      { x: 2210, y: 0,  width:300,   height:300 }
			};
	
	
		// LOADING (.src) THE MAP

			this.map = new Image();
			this.map.src = "media/circuitotornillos.png";
			this.map.addEventListener("load", ()=>{this.loaded_image()} );

		// LOADING (.src) CIRCUIT

			this.race_fondo = new Image();
			this.race_fondo.src = "media/map_circuitotornillos.png";
			this.race_fondo.addEventListener("load", ()=>{this.loaded_image()} );

		// LOADING (.src) THE CAR
			this.car = new Image();
			this.car.src = "media/verde.png";	
			this.car.addEventListener("load", ()=>{this.loaded_image()} );
	}

	loaded_image(){
		console.log("LOADED IMAGE");
		//this.config.image_to_load = image_to_load - 1;
		this.config.image_to_load--;

		if(this.config.image_to_load === 0){
			this.init_game();
		}

	}

	init_game(){
		setInterval( () => {
			this.check_game();
		}, 30 );

	}

	// LOADING MAPA AND CIRCUIT
	load_race(){

		// https://www.w3schools.com/tags/canvas_drawimage.asp
			this.ctx.drawImage(
				this.map,
				this.config.position_car.x,
				this.config.position_car.y
			);
			this.ctxOculto.drawImage(
				this.race_fondo,
				this.config.position_car.x,
				this.config.position_car.y
			);
		// position_car
	}

	check_game(){
		

		// XXX CAMBIA LA VELOCIDAD DEPENDIENDO EL COLOR

		const obstacles = this.next_step();
		console.log(obstacles);
		
		if( obstacles == "circuit"){		this.config.speed =  3;	}
		if( obstacles == "glue"){			this.config.speed =  1;	}
		if( obstacles == "oil"){			this.config.speed =  9;	}
		if( obstacles == "pieces"){			this.config.speed =  1;	}
		if( obstacles == "outcircuit"){		this.config.speed =  0;	}
		if( obstacles == "goal"){			this.config.speed =  3;	}
		
	
		const direction = this.config.direction;
		const position = this.config.position_car;
		const speed = this.config.speed;

		//									POSITION Y				POSITION X		
		if ( direction == "top" ){			position.y += speed;							}
		if ( direction == "bottom"){		position.y -= speed;							}
		if ( direction == "right"){									position.x -= speed;	}
		if ( direction == "left"){									position.x += speed;	}
		if ( direction == "topRight"){		position.y += speed;	position.x -= speed;	}
		if ( direction == "bottomRight"){	position.y -= speed;	position.x -= speed;	}
		if ( direction == "bottomLeft"){	position.y -= speed;	position.x += speed;	}
		if ( direction == "topLeft"){		position.y += speed;	position.x += speed;	}

		this.load_race();
		this.load_car();
	}

	// DETECTA EL SIGUIENTE PUNTO DÓNDE IREMOS
	next_step(){

		/// XXX: MODIFICA X/Y PARA QUE SE PONGA EL PUNTERO DELANTE DEL COCHE

		const x = (this.config.width/2) ;
		const y = (this.config.height/2)-25;
		//console.log(x);
		//console.log(y);

		const datos = this.ctxOculto.getImageData (x, y, 1, 1) ;

		

		// XXX POR COMPARACIÓN TIENES QUE SACAR QUE COLOR ES ESTE STRING
			// Que se muestre la palabra del color por consola (console.log)
			//console.log("R", datos.data[0], "G", datos.data[1], "B", datos.data[2]);

			const concat_rgb = datos.data[0] + ","+ datos.data[1]+ "," + datos.data[2];
			//console.log(concat_rgb);
			const obstacles = this.config.obstaculos_str;

			let color ="circuit";

			if( obstacles.circuitoRed == concat_rgb){			color = "circuit";		}
			if( obstacles.pegamentoWhite == concat_rgb){		color = "glue";			}
			if( obstacles.aceiteBlack == concat_rgb){			color = "oil";			}
			if( obstacles.piezaBlue == concat_rgb){				color = "pieces";		}
			if( obstacles.fueraCircuitoBlue == concat_rgb){		color = "outcircuit";	}
			if( obstacles.metaGreen == concat_rgb){				color = "goal";			}
			
			return color;
			

		// XXX RETURN: Devolver el color

	}


	//  POSITION THE CAR IN THE MIDDLE OF THE MAP IN THE CORRECT POSITION
	load_car(){

		// console.log("DIRECCIÓN", this.config.direction);
		// console.log("SPRITE FOR THIS DIRECTION", this.sprite[this.config.direction]);
		const info_sprite = this.sprite[this.config.direction];
		
		this.ctx.drawImage(
			// Image to show
				this.car,
			// [op] Coordinates X  where we started cut the image.
				info_sprite.x,
			// [op] Coordinates Y where we started cut the image.
				info_sprite.y,
			// [op] The width of the image to cut.
				300,
			// [op] The height of the image to cut.
				300,
			// The coordinate X where will it stick to the image in the canvas.
				( (this.config.width/2)-25 ),
				// 0,
			// The coordinate Y where will it stick to the image in the canvas.
				( (this.config.height/2)-25 ),
			// [op] The width to modify of the image piece will it stick.
				50,
			// [op] The height to modify of the image piece will it stick.
				50
		);

	}

}

// STRUCTURE THAT WILL DETECTED KEYS


class input{

	constructor(){
	
		// EVENTS onkeydown, onkeyup... entre otros
		document.addEventListener("keydown", this.pressKey);
		document.addEventListener("keyup",  this.releaseKey);

		this.keys = {
			ArrowUp : false,
			ArrowDown : false,
			ArrowLeft : false,
			ArrowRight : false
		};

	}

	pressKey(key){

		keyboard.keys[key.code] = true;

		keyboard.changeDirection();

	}

	releaseKey(key){

		keyboard.keys[key.code] = false;

		keyboard.changeDirection();

	}

	changeDirection(){

		const kk = keyboard.keys;
		
		if( kk.ArrowUp ){						videoGame.config.direction = "top";			}
		if( kk.ArrowDown ){						videoGame.config.direction = "bottom";		}
		if( kk.ArrowRight ){					videoGame.config.direction = "right";		}
		if( kk.ArrowLeft ){						videoGame.config.direction = "left";		}
		if( kk.ArrowUp && kk.ArrowRight ){		videoGame.config.direction = "topRight";	}
		if( kk.ArrowUp && kk.ArrowLeft ){		videoGame.config.direction = "topLeft";		}
		if( kk.ArrowDown && kk.ArrowRight ){	videoGame.config.direction = "bottomRight";	}
		if( kk.ArrowDown && kk.ArrowLeft ){		videoGame.config.direction = "bottomLeft";	}

	}

}

window.onload = function(){
	videoGame = new game(800,500);
	keyboard = new input();
}


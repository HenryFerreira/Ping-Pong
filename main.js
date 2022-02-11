(function(){//Función BOARD
    //Constructor con los Atributos de la Función BOARD/TABLERO
    self.Board = function(width, height){//Alto y Ancho
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    //Metodos de la Función BOARD/TABLERO
    self.Board.prototype = {
        get elements(){//Devuelve las barras y la pelota que estan en el tablero
            var elements = this.bars.map(
                function(bar){
                    return bar;
                }
            );
            elements.push(this.ball);
            return elements;
        }
    }
})();//Cierre de la Función BOARD


(function(){//Función BALL
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }

    //Metodos de la Función BALL
    self.Ball.prototype = {
        move: function(){//Mueve la pelota dentro del canvas
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision: function(bar){//Reacciona a una colisión con la barra recibida como parámetro
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
            
            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width / 2)) {
                this.direction = -1;
            } else {
                this.direction = 1;
            }
        }
    }
})();//Fin de la función BALL

(function(){//Función BAR - Crea las Barras del juego
    //Constructor con los Atributos de la Función BAR
    self.Bar = function(x, y, width, height, board){// Coordenadas X/Y, Alto, Ancho y Board
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;        
        this.board.bars.push(this);//Acceder al board, a atributo barras y le agrega esta barra
        this.kind = "rectangle";//Dibuja un rectangulo en el BOARD
        this.speed = 10;//Velocidad de desplazamiento de las barras
    }

    //Metodos de la Función BAR
    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){//Mostrar las cordenadas de las barras como un String
            return "x: " + this.x + " y: " + this.y;
        }
    }
})();//Fin de la Función BAR

(function(){//Función BOARD_VIEW - Vista del BOARD/TABLERO
    //Constructor con los Atributos de la Función BOARD_VIEW
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width//Alto
        this.canvas.height = board.height//Ancho
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    //Metodos de la Función BOARD_VIEW
    self.BoardView.prototype = {
        clean: function(){//Actualiza el canvas
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function () {//Dibuja en el canvas
			for (var i = this.board.elements.length - 1; i >= 0; i--) {
				var element = this.board.elements[i];
				draw(this.ctx, element);
			}
		},
        check_collisions: function(){
            for(var i = this.board.bars.length - 1; i >= 0; i--){
                var bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            };
        },
        play: function(){//Ejecuta los metodos
            if(this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    //Helpers
    function hit(a,b){//Verifica las colisiones
        var hit = false;
        if(b.x + b.width >= a.x && b.x < a.x + a.width){//Colisiones en horizontal
            if(b.y + b.height >= a.y && b.y < a.y + a.height){//Colisiones en vertical
                hit = true;
            }
        }

        //Verifica si a colisiona con b
        if(b.x + b.width <= a.x && b.x >= a.x + a.width){//Colisiones en horizontal
            if(b.y + b.height <= a.y && b.y >= a.y + a.height){//Colisiones en vertical
                hit = true;
            }
        }

        //Verifica si b colisiona con a
        if(a.x + a.width <= b.x && a.x >= b.x + b.width){//Colisiones en horizontal
            if(a.y + a.height <= b.y && a.y >= b.y + b.height){//Colisiones en vertical
                hit = true;
            }
        }
        return hit;
    }

    function draw(ctx, element) {
            switch (element.kind) {
                case "rectangle":{//Dibuja el RECTANGULO en el canvas
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                }
                case "circle":{//Dibuja el CIRCULO en el canvas
                    ctx.beginPath();
                    ctx.arc(element.x, element.y, element.radius, 0, 7);
                    ctx.fill();
                    ctx.closePath();
                    break;
                }
            }
	}
})();//Fin de la Función BOARD_VIEW

//------------------------------------------------//
//Variables
var board = new Board(800,400);
var bar_l = new Bar(20,100,40,100,board);
var bar_r = new Bar(735,100,40,100,board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);
//------------------------------------------------//

//Actualiza los frames de la ventana
board_view.draw();
window.requestAnimationFrame(controller);

//Controla que tecla fue presionada, en este casp la tecla Up y Down
document.addEventListener("keydown",function(ev){    
    if(ev.keyCode == 38){//Up
        ev.preventDefault();
        bar_l.up();
    } else if (ev.keyCode == 40){//Down
        ev.preventDefault();
        bar_l.down();
    } else if (ev.keyCode == 87){//W
        ev.preventDefault();
        bar_r.up();
    } else if (ev.keyCode == 83){//S
        ev.preventDefault();
        bar_r.down();
    } else if(ev.keyCode == 32){//SPACE
        ev.preventDefault();
        board.playing = !board.playing;
    }
    console.log(bar_l.toString());
    console.log(bar_r.toString());
});

function controller(){//Función CONTROLLER
    board_view.play();
    //Actualiza los frames de la ventana
    window.requestAnimationFrame(controller);

};//Cierre de la función CONTROLLER
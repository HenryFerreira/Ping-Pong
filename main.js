(function(){//Objeto BOARD
    //Constructor con los Atributos del objeto BOARD/TABLERO
    self.Board = function(width, height){//Alto y Ancho
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    //Metodos del objeto BOARD/TABLERO
    self.Board.prototype = {
        get elements(){//Devuelve las barras y la pelota que estan en el tablero
            var elements = this.bars;
            elements.push(this.ball);
            return elements;
        }
    }
})();//Cierre de la Objeto BOARD

(function(){//Objeto BAR - Crea las Barras del juego
    //Constructor con los Atributos del objeto BAR
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
    //Metodos del objeto BAR
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
})();//Fin de la Objeto BAR

(function(){//Objeto BOARD_VIEW - Vista del BOARD/TABLERO
    //Constructor con los Atributos del objeto BOARD_VIEW
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width//Alto
        this.canvas.height = board.height//Ancho
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    //Metodos del objeto BOARD_VIEW
    self.BoardView.prototype = {
        draw: function () {
			for (var i = this.board.elements.length - 1; i >= 0; i--) {
				var element = this.board.elements[i];
				draw(this.ctx, element);
			}
		}
    }

    //Helpers
    function draw(ctx, element) {
        if(element !== null && element.hasOwnProperty("kind")){
            switch (element.kind) {
                case 'rectangle':{
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
                }
            }
        }		
	}
})();//Fin de la Objeto BOARD_VIEW

//------------------------------------------------//
//Variables
var board = new Board(800,400);
var bar = new Bar(20,100,40,100,board);
var bar = new Bar(735,100,40,100,board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
//------------------------------------------------//


//Controla que tecla fue presionada, en este casp la tecla Up y Down
document.addEventListener("keydown",function(ev){
    if(ev.keyCode == 38){
        bar.up();
    } else if (ev.keyCode == 40){
        bar.down();
    }

    console.log(bar.toString());
});


//Mostrar temporalmente en la ventana
window.addEventListener("load",main);

function main(){//Función MAIN
    
    board_view.draw();

};//Cierre de la función MAIN
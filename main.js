(function(){//Función BOARD
    //Atributos del objeto BOARD/TABLERO
    self.Board = function(width, height){//Alto y Ancho
        this.width = width;
        this.height = height;
        this.jugando = false;
        this.fin_del_juego = false;
        this.barras = [];
        this.pelota = null;
    }

    //Metodos del objeto BOARD/TABLERO
    self.Board.prototype = {
        get getElementos(){//Devuelve las barras y la pelota que estan en el tablero
            var elementos = this.barras;
            elementos.push(pelota);
            return elementos;
        }
    }
})();//Cierre de la función BOARD

(function(){//Función BOARD_VIEW
    //Atributos del objeto BOARD_VIEW
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width//Alto
        this.canvas.height = board.height//Ancho
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }
})();//Fin de la función BOARD_VIEW

//Mostrar temporalmente en la ventana
window.addEventListener("load",main);

function main(){//Función MAIN
    var board = new Board(800,400);
    var canvas = document.getElementById("canvas");
    var board_view = new BoardView(canvas, board);

};//Cierre de la función MAIN
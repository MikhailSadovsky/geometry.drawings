var PaintPanel = {

    board : null,
    showGrid : true,

    createBoard : function() {
        this.board = JXG.JSXGraph.initBoard('board', {boundingbox: [-20, 20, 20, -20], showCopyright : false, grid : this.showGrid});
    },

    getUsrCoordinatesOfMouse : function(event) {
        var pointInBoard = this.board.getUsrCoordsOfMouse(event);
        var result = [pointInBoard[0], pointInBoard[1]];
        return result;
    },

    containsPoint : function(event) {
        var contains = false;
        var elements = this.board.getAllUnderMouse(event);
        if(elements.length > 1) {
            contains = true;
        }
        return contains;
    },

    getExistPointName : function(event) {
        var pointName = null;
        var elements = this.board.getAllUnderMouse(event);
        var element = elements[0];
        if(element instanceof JXG.Point) {
            pointName = element.getName();
        }
        if(pointName == null) throw TypeError();
        return pointName;
    },

    clear : function() {
        var zoomX = this.board.applyZoom().zoomX;
        var zoomY = this.board.applyZoom().zoomY;
        this.board = JXG.JSXGraph.initBoard('board', {boundingbox: [-20, 20, 20, -20], showCopyright : false, grid : this.showGrid,
            zoomX : zoomX, zoomY : zoomY });
        app.controller.clearPoints();
        app.clearHistory();
        Model.clear();
        this.elements.length = 0;
    },

    grid : function() {
        if(this.showGrid == true) {
            this.board.removeGrids();
            this.showGrid = false;
        }  else {
            this.board.create('grid', []);
            this.showGrid = true;
        }
    }
}


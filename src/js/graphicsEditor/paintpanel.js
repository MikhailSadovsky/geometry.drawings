function PaintPanel (parpaintpanel,parmodel) {

    this.board = null;
    this.showGrid = true;
    this.model = parmodel;
}

PaintPanel.prototype.createBoard = function() {
    this.board = JXG.JSXGraph.initBoard('board', {boundingbox: [-20, 20, 20, -20], showCopyright : false, grid : this.showGrid});
    this.showGrid = true;
    this.model = null;
};

PaintPanel.prototype.getUsrCoordinatesOfMouse = function(event) {
    var pointInBoard = this.board.getUsrCoordsOfMouse(event);
    var result = [pointInBoard[0], pointInBoard[1]];
    return result;
};

PaintPanel.prototype.containsPoint = function(event) {
    var contains = false;
    var elements = this.board.getAllUnderMouse(event);
    if(elements.length > 1) {
        contains = true;
    }
    return contains;
};

PaintPanel.prototype.getExistPointName = function(event) {
    var pointName = null;
    var elements = this.board.getAllUnderMouse(event);
    var element = elements[0];
    if(element instanceof JXG.Point) {
        pointName = element.getName();
    }
    if(pointName == null) throw TypeError();
    return pointName;
};

PaintPanel.prototype.clear = function() {
    var zoomX = this.board.applyZoom().zoomX;
    var zoomY = this.board.applyZoom().zoomY;
    this.board = JXG.JSXGraph.initBoard('board', {boundingbox: [-20, 20, 20, -20], showCopyright : false, grid : this.showGrid,
        zoomX : zoomX, zoomY : zoomY });
    app.controller.clearPoints();
    app.clearHistory();
    this.model.clear();
    app.model.clear();
    this.elements.length = 0;
};

PaintPanel.prototype.grid = function() {
    if(this.showGrid == true) {
        this.board.removeGrids();
        this.showGrid = false;
    }  else {
        this.board.create('grid', []);
        this.showGrid = true;
    }
}
PaintPanel.prototype.initialize = function() {
    this.clear();

}
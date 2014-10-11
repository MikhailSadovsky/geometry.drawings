Drawings.PaintPanel = function (parpaintpanel, parmodel) {
    this.board = null;
    this.showGrid = true;
    this.model = parmodel;
};

Drawings.PaintPanel.prototype.createBoard = function () {
    this.board = JXG.JSXGraph.initBoard('board', {boundingbox: [-20, 20, 20, -20], showCopyright: false, grid: this.showGrid, axis: []});
};

Drawings.PaintPanel.prototype.getUsrCoordinatesOfMouse = function (event) {
    var pointInBoard = this.board.getUsrCoordsOfMouse(event);
    var result = [pointInBoard[0], pointInBoard[1]];
    return result;
};

Drawings.PaintPanel.prototype.containsPoint = function (event) {
    var contains = false;
    var elements = this.board.getAllUnderMouse(event);
    if (elements.length > 1) {
        contains = true;
    }
    return contains;
};

Drawings.PaintPanel.prototype.getExistPointName = function (event) {
    var pointName = null;
    var elements = this.board.getAllUnderMouse(event);
    var element = elements[0];
    if (element instanceof JXG.Point) {
        pointName = element.getName();
    }
    if (pointName == null) throw TypeError();
    return pointName;
};

Drawings.PaintPanel.prototype.clear = function () {
    var zoomX = this.board.applyZoom().zoomX;
    var zoomY = this.board.applyZoom().zoomY;
    this.board = JXG.JSXGraph.initBoard('board', {boundingbox: [-20, 20, 20, -20], showCopyright: false, grid: this.showGrid,
        zoomX: zoomX, zoomY: zoomY, axis: []});
    Drawings.app.model = Drawings.cloneModel.cloneModel(app.paintPanel.model);
    Drawings.app.clearHistory();
    Drawings.app.paintPanel.model.clear();
};

Drawings.PaintPanel.prototype.Initialize = function () {
    Drawings.app.paintPanel.model.Initialize(Drawings.app.model);
};

Drawings.cloneModel = function (model) {
    var model2 = {};
    for (var key in model) model2[key] = model[key];
    return model2;
};
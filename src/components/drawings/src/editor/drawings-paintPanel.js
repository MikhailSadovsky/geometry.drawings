Drawings.PaintPanel = function (containerId, model) {
    this.containerId = containerId;

    this.model = model;

    this.controller = null;

    this.board = null;
};

Drawings.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);

        this.board = this._createBoard();

        this._configureModel();

        this.controller = new Drawings.Controller(this, this.model);

        this.mouseMoved = false;

        this.mouseDownEvent = null;
    },

    getJxgPoint: function (event) {
        var jxgPoints = this._getJxgPoints(event);
        return jxgPoints.length > 0 ? jxgPoints[0] : null;
    },

    getMouseCoordinates: function (event) {
        var coordinates = this.board.getUsrCoordsOfMouse(event);
        return [coordinates[0], coordinates[1]];
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);
        var paintPanel = this;

        // root element
        container.append('<div id="geometryEditor" class="geometryEditor"></div>');
        var editor = $('#geometryEditor');

        // initialize toolbar markup
        editor.append('<div id="toolbar" class="toolbar"></div>');

        var toolbar = $('#toolbar');
        toolbar.append('<div id="pointButton" class="button point"></div>');
        toolbar.append('<div id="lineButton" class="button line"></div>');
        toolbar.append('<div id="segmentButton" class="button segment"></div>');
        toolbar.append('<div id="clearButton" class="button clear"></div>');
        toolbar.append('<div id="saveToFile" class="button save"></div>');

        $('#pointButton').click(function () {
            paintPanel._setPointMode();
        });

        $('#lineButton').click(function () {
            paintPanel._setLineMode();
        });

        $('#segmentButton').click(function () {
            paintPanel._setSegmentMode();
        });

        $('#clearButton').click(function () {
            paintPanel._clear();
        });

        $('#saveToFile').click(function () {
            paintPanel._saveToFile();
        });

        // initialize board
        editor.append('<div id="board" class="board jxgbox"></div>');
        var board = $('#board');

        board.mousedown(function (event) {
            paintPanel._handleMouseDownEvent(event);
        });

        board.mouseup(function (event) {
            paintPanel._handleMouseUpEvent(event);
        });

        board.mousemove(function (event) {
            paintPanel._handleMouseMoveEvent(event);
        });
    },

    _setPointMode: function () {
        this.controller.setDrawingMode(Drawings.DrawingMode.POINT);
    },

    _setLineMode: function () {
        this.controller.setDrawingMode(Drawings.DrawingMode.LINE);
    },

    _setSegmentMode: function () {
        this.controller.setDrawingMode(Drawings.DrawingMode.SEGMENT);
    },

    _clear: function () {
        this._clearBoard();
        this.controller.clearModel();
    },

    _clearBoard: function () {
        var zoomX = this.board.applyZoom().zoomX;
        var zoomY = this.board.applyZoom().zoomY;

        JXG.JSXGraph.freeBoard(this.board);

        this.board = this._createBoard();
        this.board.setZoom(zoomX, zoomY);
    },

    _saveToFile: function() {
        var json = Drawings.Translator.toJson(this.model);
        this._download("model.js", json);
    },

    _download: function(filename, content) {
        var downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content));
        downloadLink.setAttribute('download', filename);
        downloadLink.click();
    },

    _handleMouseDownEvent: function (event) {
        this.controller.handleMouseDownEvent(event);
    },

    _handleMouseUpEvent: function (event) {
        this.controller.handleMouseUpEvent(event);
    },

    _handleMouseMoveEvent: function (event) {
        this.controller.handleMouseMoveEvent(event);
    },

    _createBoard: function () {
        return JXG.JSXGraph.initBoard('board', {boundingbox: [-20, 20, 20, -20], showCopyright: false, grid: true});
    },

    _configureModel: function () {
        var paintPanel = this;

        paintPanel._drawModel(paintPanel.model);

        paintPanel.model.onUpdate(function (updatedObjects) {
            paintPanel._erase(updatedObjects);
            paintPanel._draw(updatedObjects);
        });
    },

    _drawModel: function (model) {
        var objectsToDraw = [];
        objectsToDraw.push(model.getPoints());
        objectsToDraw.push(model.getShapes());
        this._draw(objectsToDraw);
    },

    _erase: function (objects) {
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            var jxgObject = this.board.select(object.getName());
            this.board.removeObject(jxgObject);
        }
    },

    _draw: function (objects) {
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];

            if (object instanceof Drawings.Point) {
                this._drawPoint(object);
            }
            else if (object instanceof Drawings.Line) {
                this._drawLine(object);
            }
            else if (object instanceof Drawings.Segment) {
                this._drawSegment(object);
            }
        }
    },

    _drawPoint: function (point) {
        var jxgPoint;

        if (point.getName()) {
            jxgPoint = this.board.create('point', [point.getX(), point.getY()], {name: point.getName()});
        }
        else {
            jxgPoint = this.board.create('point', [point.getX(), point.getY()]);
            point.name = jxgPoint.getName();
        }

        jxgPoint.setAttribute({
            fixed: true
        });
    },

    _drawLine: function (line) {
        var point1 = line.point1();
        var point2 = line.point2();

        var jxgLine = this.board.create('line', [point1.getName(), point2.getName()], {name: line.getName()});

        jxgLine.setAttribute({
            fixed: true
        });
    },

    _drawSegment: function (segment) {
        var point1 = segment.point1();
        var point2 = segment.point2();

        var jxgSegment = this.board.create('line', [point1.getName(), point2.getName()],
            {name: segment.getName(), straightFirst: false, straightLast: false});

        jxgSegment.setAttribute({
            fixed: true
        });
    },

    _getJxgPoints: function (event) {
        return this.board.getAllObjectsUnderMouse(event).filter(function (element) {
            return element instanceof JXG.Point;
        });
    }
};
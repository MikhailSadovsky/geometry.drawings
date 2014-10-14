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

        // initialize toolbar markup
        container.append('<div id="toolbar" class="toolbar"></div>');

        var toolbar = $('#toolbar');
        toolbar.append('<div id="pointButton" class="button point"></div>');
        toolbar.append('<div id="lineButton" class="button line"></div>');
        toolbar.append('<div id="segmentButton" class="button segment"></div>');
        toolbar.append('<div id="clearButton" class="button clear"></div>');

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

        // initialize board
        container.append('<div id="board" class="jxgbox"></div>');

        $('#board').mousedown(function (event) {
            paintPanel._handleMouseDownEvent(event);
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

    _handleMouseDownEvent: function (event) {
        this.controller.handleMouseDownEvent(event);
    },

    _createBoard: function () {
        return JXG.JSXGraph.initBoard(
            'board', {boundingbox: [-20, 20, 20, -20], showCopyright: false, grid: true, axis: []});
    },

    _configureModel: function () {
        var paintPanel = this;

        paintPanel._drawModel(paintPanel.model);

        paintPanel.model.onUpdate(function () {
            paintPanel._clearBoard();
            paintPanel._drawModel(paintPanel.model);
        });
    },

    _drawModel: function (model) {
        var points = model.getPoints();
        for (var i = 0; i < points.length; i++) {
            this._drawPoint(points[i]);
        }

        var shapes = model.getShapes();
        for (i = 0; i < shapes.length; i++) {
            var shape = shapes[i];

            if (shape instanceof Drawings.Line) {
                this._drawLine(shape);
            }
            else if (shape instanceof Drawings.Segment) {
                this._drawSegment(shape);
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

        var jxgLine = this.board.create('line', [[point1.getX(), point1.getY()], [point2.getX(), point2.getY()]]);

        jxgLine.setAttribute({
            fixed: true
        });
    },

    _drawSegment: function (segment) {
        var point1 = segment.point1();
        var point2 = segment.point2();

        var jxgSegment = this.board.create('line', [[point1.getX(), point1.getY()], [point2.getX(), point2.getY()]],
            {straightFirst: false, straightLast: false});

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
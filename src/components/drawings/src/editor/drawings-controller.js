/**
 * Controller.
 */

Drawings.Controller = function (paintPanel, model) {
    this.paintPanel = paintPanel;
    this.model = model;
};

Drawings.Controller.prototype = {

    drawingMode: Drawings.DrawingMode.POINT,

    points: [],

    mouseDownEvent: {},

    setDrawingMode: function(drawingMode) {
        this.drawingMode = drawingMode;
    },

    clearModel: function() {
        this.model.clear();
    },

    handleEvent: function(event) {
        var LEFT_MOUSE_BUTTON = 1;
        if (event.type == 'mousedown' && event.which == LEFT_MOUSE_BUTTON) {
            this._handleLeftMouseDownEvent(event);
        }
        else if (event.type == 'mouseup' && event.which == LEFT_MOUSE_BUTTON) {
            this._handleLeftMouseUpEvent(event);
        }
    },

    _handleLeftMouseDownEvent: function(event) {
        this.mouseDownEvent = event;
    },

    _handleLeftMouseUpEvent: function(event) {
        var mouseDownCoordinates = this.paintPanel.getMouseCoordinates(this.mouseDownEvent);
        var mouseUpCoordinates = this.paintPanel.getMouseCoordinates(event);

        var x1 = mouseDownCoordinates[0];
        var y1 = mouseDownCoordinates[1];
        var x2 = mouseUpCoordinates[0];
        var y2 = mouseUpCoordinates[1];

        var distance = Math.sqrt((x1 - x2)^2 + (y1 - y2)^2);

        if (distance < 0.25) {
            this._handleLeftMouseClickEvent(event);
        }
    },

    _handleLeftMouseClickEvent: function(event) {
        var point = this._getOrCreatePoint(event);
        this._addPoint(point);
    },

    _getOrCreatePoint: function(event) {
        var point;

        var jxgPoint = this.paintPanel.getJxgPoint(event);

        if (jxgPoint) {
            point = this.model.getPoint(jxgPoint.getName());
        }
        else {
            var coordinates = this.paintPanel.getMouseCoordinates(event);
            point = this._createPoint(coordinates);
        }

        return point;
    },

    _createPoint: function(coordinates) {
        var point = new Drawings.Point(coordinates[0], coordinates[1]);
        this.model.addPoint(point);
        return point;
    },

    _addPoint: function (point) {
        this.points.push(point);

        if (this.drawingMode == Drawings.DrawingMode.POINT) {
            this.points.length = 0;
        }
        else if (this.drawingMode == Drawings.DrawingMode.LINE) {
            this._createLineIfPossible();
        }
        else if (this.drawingMode == Drawings.DrawingMode.SEGMENT) {
            this._createSegmentIfPossible();
        }
        else if (this.drawingMode == Drawings.DrawingMode.TRIANGLE) {
            this._createTriangleIfPossible();
        }
    },

    _createLineIfPossible: function() {
        if (this.points.length == 2) {
            var line = new Drawings.Line(this.points[0], this.points[1]);
            this.model.addShape(line);
            this.points.length = 0;
        }
    },

    _createSegmentIfPossible: function() {
        if (this.points.length == 2) {
            var segment = new Drawings.Segment(this.points[0], this.points[1]);
            this.model.addShape(segment);
            this.points.length = 0;
        }
    },

    _createTriangleIfPossible: function() {
        if (this.points.length == 3) {
            var triangle = new Drawings.Triangle(this.points[0], this.points[1], this.points[2]);
            this.model.addShape(triangle);
            this.points.length = 0;
        }
    }
};
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

    setDrawingMode: function(drawingMode) {
        this.drawingMode = drawingMode;
    },

    clearModel: function() {
        this.model.clear();
    },

    handleMouseDownEvent: function(event) {
        var LEFT_MOUSE_BUTTON = 1;
        if (event.which == LEFT_MOUSE_BUTTON) {
            this._handleLeftMouseDownEvent(event);
            this.paintPanel.mouseMoved = false;
        }
    },

    handleMouseUpEvent: function(event) {
        var LEFT_MOUSE_BUTTON = 1;
        if (event.which == LEFT_MOUSE_BUTTON) {
            this._handleLeftMouseUpEvent(event);
            this.paintPanel.mouseMoved = false;
        }
    },

    handleMouseMoveEvent: function(event) {
        this.paintPanel.mouseMoved = true;
    },

    _handleLeftMouseDownEvent: function(event) {
        this.paintPanel.mouseDownEvent = event;
    },

    _handleLeftMouseUpEvent: function(event) {
        this._validateClick(this.paintPanel.mouseDownEvent, event);
    },

    _handleLeftMouseClickEvent: function(event) {
        var point = this._getPoint(event);
        this._addPoint(point);
    },

    _validateClick: function(mouseDownEvent, mouseUpEvent) {
        var mouseDownCoordinates = this.paintPanel.getMouseCoordinates(mouseDownEvent);
        var mouseUpCoordinates = this.paintPanel.getMouseCoordinates(mouseUpEvent);
        if (Math.sqrt(Math.pow(mouseDownCoordinates[0] - mouseUpCoordinates[0], 2) + Math.pow(mouseDownCoordinates[1] - mouseUpCoordinates[1], 2)) < 0.25) {
            this._handleLeftMouseClickEvent(mouseUpEvent);
        }
    },

    _getPoint: function(event) {
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
        if (this.drawingMode == Drawings.DrawingMode.LINE) {
            this._createLineIfPossible();
        }
        else if (this.drawingMode == Drawings.DrawingMode.SEGMENT) {
            this._createSegmentIfPossible()
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
    }
};
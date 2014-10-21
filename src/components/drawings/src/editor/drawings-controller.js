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
        this._doEvent(this.paintPanel.mouseDownEvent, event);
    },

    _handleLeftMouseClickEvent: function(event) {
        var point = this._getPoint(event);
        this._addPoint(point);
    },

    _doEvent: function(mouseDownEvent, mouseUpEvent) {
        var mouseDownCoordinates = this.paintPanel.getMouseCoordinates(mouseDownEvent);
        var mouseUpCoordinates = this.paintPanel.getMouseCoordinates(mouseUpEvent);
        if (Math.sqrt(Math.pow(mouseDownCoordinates[0] - mouseUpCoordinates[0], 2) + Math.pow(mouseDownCoordinates[1] - mouseUpCoordinates[1], 2)) < 0.25) {
            this._handleLeftMouseClickEvent(mouseUpEvent);
        } else {
            this._handleLeftMouseMoveEvent(mouseUpEvent);
        }
    },

    _handleLeftMouseMoveEvent: function(event) {
        var element = this.paintPanel._getJxgElement(event);
        if (element != undefined) {
            if (element instanceof JXG.Point){
                var point = this.model.getPoint(element.name);
                var coordinates = this.paintPanel.getMouseCoordinates(event);
                point.x = coordinates[0];
                point.y = coordinates[1];
            } else if (element instanceof JXG.Line) {
                var line = this.model.getShape(element.name);
                line.points[0].x = element.point1.X();
                line.points[0].y = element.point1.Y();
                line.points[1].x = element.point2.X();
                line.points[1].y = element.point2.Y();
            } else if (element instanceof JXG.Segment) {
                var segment = paintPanel.model.getShape(element.name);
                segment.points[0].x = element.point1.X();
                segment.points[0].y = element.point1.Y();
                segment.points[1].x = element.point2.X();
                segment.points[1].y = element.point2.Y();
            }
        } else {
            alert("Слишком резкие движения");
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
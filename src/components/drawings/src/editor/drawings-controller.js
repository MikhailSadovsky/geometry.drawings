/**
 * Controller.
 */

Drawings.Controller = function (paintPanel, model) {
    this.paintPanel = paintPanel;
    model.paintPanel = paintPanel;
    this.model = model;
    this.modify = false;
};

Drawings.Controller.prototype = {

    drawingMode: Drawings.DrawingMode.POINT,

    points: [],

    mouseDownEvent: {},

    setDrawingMode: function (drawingMode) {
        this.drawingMode = drawingMode;
        this.points.length = 0;
    },

    handleEvent: function (event) {
        var LEFT_MOUSE_BUTTON = 1;

        if (event.type == 'mousedown' && event.which == LEFT_MOUSE_BUTTON) {
            this._handleLeftMouseDownEvent(event);
        }
        else if (event.type == 'mouseup' && event.which == LEFT_MOUSE_BUTTON) {
            this._handleLeftMouseUpEvent(event);
        }
    },

    _handleLeftMouseDownEvent: function (event) {
        this.mouseDownEvent = event;
    },

    _handleLeftMouseUpEvent: function (event) {
        var mouseDownCoordinates = this.paintPanel.getMouseCoordinates(this.mouseDownEvent);
        var mouseUpCoordinates = this.paintPanel.getMouseCoordinates(event);

        var x1 = mouseDownCoordinates[0];
        var y1 = mouseDownCoordinates[1];
        var x2 = mouseUpCoordinates[0];
        var y2 = mouseUpCoordinates[1];

        var distance = Math.sqrt((x1 - x2) ^ 2 + (y1 - y2) ^ 2);

        if (distance < 0.25) {
            this._handleLeftMouseClickEvent(event);
        }
    },

    _handleLeftMouseClickEvent: function (event) {
        if (this.modify == false) {
            var point = this._getOrCreatePoint(event);
            this._addPoint(point);
        }
        else {
            this._setupSettings(event);
        }
    },

    _getOrCreatePoint: function (event) {
        var point;
        var jxgPoint = this.paintPanel.getJxgPoint(event);

        if (jxgPoint) {
            point = this.model.getPoint(jxgPoint.id);
        }
        else {
            var coordinates = this.paintPanel.getMouseCoordinates(event);
            point = this._createPoint(coordinates);
        }

        return point;
    },

    _createPoint: function (coordinates) {
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
        else if (this.drawingMode == Drawings.DrawingMode.CIRCLE) {
            this._createCircleIfPossible();
        }
    },

    _createLineIfPossible: function () {
        if (this.points.length == 2) {
            var line = new Drawings.Line(this.points[0], this.points[1]);
            line.setName(this._generateLineName(line));

            this.model.addShape(line);

            this.points.length = 0;
        }
    },

    _generateLineName: function (line) {
        var point1Name = line.point1().getName();
        var point2Name = line.point2().getName();
        return point1Name && point2Name ? 'Прямая(' + point1Name + ';' + point2Name + ')' : '';
    },

    _createSegmentIfPossible: function () {
        if (this.points.length == 2) {
            var segment = new Drawings.Segment(this.points[0], this.points[1]);
            segment.setName(this._generateSegmentName(segment));

            this.model.addShape(segment);

            this.points.length = 0;
        }
    },

    _createCircleIfPossible: function () {
        if (this.points.length == 2) {
            var circle = new Drawings.Circle(this.points[0], this.points[1]);
            circle.setName(this._generateCircleName(circle));
            this.model.addShape(circle);
            this.points.length = 0;
        }
    },

    _generateCircleName: function (circle) {
        var point1Name = circle.point1().getName();
        var point2Name = circle.point2().getName();
        return point1Name && point2Name ? 'Окр(' + point1Name + ';' + point2Name + ')' : '';
    },

    _generateSegmentName: function (segment) {
        var point1Name = segment.point1().getName();
        var point2Name = segment.point2().getName();
        return point1Name && point2Name ? 'Отр(' + point1Name + ';' + point2Name + ')' : '';
    },

    _createTriangleIfPossible: function () {
        if (this.points.length == 3) {
            var triangle = new Drawings.Triangle(this.points[0], this.points[1], this.points[2]);
            triangle.setName(this._generateTriangleName(triangle));

            this.model.addShape(triangle);

            this.points.length = 0;
        }
    },

    _generateTriangleName: function (triangle) {
        var point1Name = triangle.point1().getName();
        var point2Name = triangle.point2().getName();
        var point3Name = triangle.point3().getName();
        return point1Name && point2Name && point3Name ?
        'Треугк(' + point1Name + ';' + point2Name + ';' + point3Name + ')' : '';
    },

    _setupSettings: function (event) {
        var jxgObjects = this.paintPanel.getJxgObject(event);

        var objects = [];
        for (var i = 0; i < jxgObjects.length; i++) {
            objects[i] = this.model.getModelObject(jxgObjects[i].id)
        }

        this._showDialog(objects);
    },

    _showDialog: function (objects) {
        var points = Drawings.Utils.selectPoints(objects);
        var segments = Drawings.Utils.selectSegments(objects);
        var triangles = Drawings.Utils.selectTriangles(objects);

        if (points.length > 0) {
            this._setPointName(points[0]);
        }
        else if (segments.length > 0) {
            this._setSegmentLength(segments[0]);
        }
        else if (triangles.length > 0) {
            this._setTriangleSquare(triangles[0]);
        }
    },

    _setPointName: function (point) {
        var name = prompt("Введите имя точки");

        if (name) {
            point.setName(name);
            this.model.updated(point);
        }
    },

    _setSegmentLength: function (segment) {
        var length = prompt("Введите длину отрезка");

        if (isNaN(parseInt(length)) || !isFinite(length)) {
            alert("Введите число!!")
        }
        else {
            segment.setLength(length);
            this.model.updated(segment);
        }
    },

    _setTriangleSquare: function (triangle) {
        var square = prompt("Введите площадь");

        if (isNaN(parseInt(square)) || !isFinite(square)) {
            alert("Введите число!!")
        }
        else {
            triangle.setSquare(square);
            this.model.updated(triangle);
        }
    }
};
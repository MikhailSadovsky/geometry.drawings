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

    getJxgElements: function (event) {
        return this.board.getAllObjectsUnderMouse(event);
    },

    getJxgElement: function (event) {
        return this.board.getAllObjectsUnderMouse(event)[0];
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
        toolbar.append('<div id="pointButton" class="button point" title="Точка"></div>');
        toolbar.append('<div id="lineButton" class="button line" title="Прямая"></div>');
        toolbar.append('<div id="segmentButton" class="button segment" title="Отрезок"></div>');
        toolbar.append('<div id="triangleButton" class="button triangle" title="Треугольник"></div>');
        toolbar.append('<div id="circleButton" class="button circle" title="Окружность"></div>');
        toolbar.append('<div id="clearButton" class="button clear" title="Очистить"></div>');
        toolbar.append('<div id="saveToFile" class="button save" title="Сохранить"></div>');

        toolbar.append('<div id="load" class="button load" title="Загрузить"></div>');
        toolbar.append('<input id="fileInput" type="file">');
        toolbar.append('<div id="editButton" class="button edit" title="Редактировать"></div>');
        toolbar.append('<div id="pushButton" class="button push" title="Синхронизация"></div>');

        $('#pointButton').click(function () {
            paintPanel.controller.modify = false;
            paintPanel._setMode(Drawings.DrawingMode.POINT);
        });

        $('#lineButton').click(function () {
            paintPanel.controller.modify = false;
            paintPanel._setMode(Drawings.DrawingMode.LINE);
        });

        $('#segmentButton').click(function () {
            paintPanel.controller.modify = false;
            paintPanel._setMode(Drawings.DrawingMode.SEGMENT);
        });

        $('#triangleButton').click(function () {
            paintPanel.controller.modify = false;
            paintPanel._setMode(Drawings.DrawingMode.TRIANGLE);
        });

        $('#circleButton').click(function () {
            paintPanel.controller.modify = false;
            paintPanel._setMode(Drawings.DrawingMode.CIRCLE);
        });

        $('#clearButton').click(function () {
            paintPanel.controller.modify = false;
            paintPanel._clear();
        });

        $('#saveToFile').click(function () {
            paintPanel.controller.modify = false;
            paintPanel._saveToFile();
        });

        $('#load').click(function () {
            paintPanel.controller.modify = false;
            $("#fileInput").click();
        });

        $('#fileInput').change(function () {
            paintPanel.controller.modify = false;
            paintPanel._loadFromFile();
        });

        $('#editButton').click(function () {
            paintPanel.controller.modify = true;
        });

        $('#pushButton').click(function () {
            paintPanel._push();
        });

        // initialize board
        editor.append('<div id="board" class="board jxgbox"></div>');
    },

    _setMode: function (mode) {
        this.controller.setDrawingMode(mode);
    },

    _clear: function () {
        this.model.clear();
    },

    _push: function () {
        Drawings.ScTranslator.putModel(this.model);
        // Redraw all (only translated ?) shapes after translation
        //this._redraw(this.model.getModelObjects());
    },

    _saveToFile: function () {
        var json = Drawings.JsonTranslator.toJson(this.model);
        this._download("model.js", json);
    },

    _download: function (filename, content) {
        var downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    },

    _loadFromFile: function () {
        var file = $('#fileInput')[0].files[0];
        var reader = new FileReader();

        var paintPanel = this;
        reader.onload = function () {
            var result = Drawings.JsonTranslator.fromJson(reader.result);

            paintPanel.model.clear();

            paintPanel.model.addPoints(result.points);
            paintPanel.model.addShapes(result.shapes);
        };

        if (file) {
            reader.readAsText(file);
        }
    },

    _createBoard: function () {
        var properties = {
            boundingbox: [-20, 20, 20, -20],
            showCopyright: false,
            grid: true,
            unitX: 20,
            unitY: 20
        };

        var board = JXG.JSXGraph.initBoard('board', properties);

        var paintPanel = this;

        board.on('mousedown', function (event) {
            paintPanel.controller.handleEvent(event);
        });

        board.on('mouseup', function (event) {
            paintPanel.controller.handleEvent(event);
        });

        return board;
    },

    _configureModel: function () {
        var paintPanel = this;

        paintPanel._drawModel(paintPanel.model);

        paintPanel.model.onUpdate(function (objectsToRemove, objectsToAdd, objectsToUpdate) {
            paintPanel._erase(objectsToRemove);

            paintPanel._draw(objectsToAdd);

            paintPanel._redraw(objectsToUpdate);
        });
    },

    _drawModel: function (model) {
        var objectsToDraw = [];
        objectsToDraw = objectsToDraw.concat(model.getPoints());
        objectsToDraw = objectsToDraw.concat(model.getShapes());
        this._draw(objectsToDraw);
    },

    _erase: function (modelObjects) {
        var jxgElement;
        for (var i = 0; i < modelObjects.length; i++) {
            jxgElement = this._getJxgObjectById(modelObjects[i].getId());
            if (jxgElement.textLabel) {
                this.board.removeObject(jxgElement.textLabel);
            }
            this.board.removeObject(jxgElement);
        }
    },

    _draw: function (modelObjects) {
        for (var i = 0; i < modelObjects.length; i++) {
            var modelObject = modelObjects[i];

            if (modelObject instanceof Drawings.Point) {
                this._drawPoint(modelObject);
            }
            else if (modelObject instanceof Drawings.Line) {
                this._drawLine(modelObject);
            }
            else if (modelObject instanceof Drawings.Segment) {
                this._drawSegment(modelObject);
            }
            else if (modelObject instanceof Drawings.Triangle) {
                this._drawTriangle(modelObject);
            }
            else if (modelObject instanceof Drawings.Circle) {
                this._drawCircle(modelObject);
            }
        }
    },

    _redraw: function (modelObjects) {
        this._erase(modelObjects);
        this._draw(modelObjects);
    },

    _drawPoint: function (point) {
        var strokeColor = this._getStrokeColor(point);
        var fillColor = this._getFillColor(point);

        var properties = {
            id: point.getId(),
            name: point.getName(),
            showInfobox: false,
            strokeColor: strokeColor,
            fillColor: fillColor
        };

        var jxgPoint = this.board.create('point', [point.getX(), point.getY()], properties);

        var paintPanel = this;

        jxgPoint.coords.on('update', function () {
            var point = paintPanel.model.getPoint(this.id);
            point.setXY(this.X(), this.Y());
        }, jxgPoint);
    },

    _drawLine: function (line) {
        var jxgPoint1 = this._getJxgObjectById(line.point1().getId());
        var jxgPoint2 = this._getJxgObjectById(line.point2().getId());

        var strokeColor = this._getStrokeColor(line);

        var properties = {
            id: line.getId(),
            name: line.getName(),
            strokeColor: strokeColor
        };

        this.board.create('line', [jxgPoint1, jxgPoint2], properties);
    },

    _drawSegment: function (segment) {
        var jxgPoint1 = this._getJxgObjectById(segment.point1().getId());
        var jxgPoint2 = this._getJxgObjectById(segment.point2().getId());

        var strokeColor = this._getStrokeColor(segment);

        var properties = {
            id: segment.getId(),
            name: segment.getName(),
            straightFirst: false,
            straightLast: false,
            strokeColor: strokeColor
        };

        var jxgSegment = this.board.create('line', [jxgPoint1, jxgPoint2], properties);

        if (segment.length != null) {
            this._drawSegmentLength(jxgSegment, segment);
        }
    },

    _drawSegmentLength: function (jxgSegment, segment) {
        var point1 = segment.point1();
        var point2 = segment.point2();

        var labelX = function () {
            return (point1.getX() + point2.getX()) / 1.95 + 0.5;
        };

        var labelY = function () {
            return (point1.getY() + point2.getY()) / 1.95 + 0.6;
        };

        var properties = {
            fontSize: 16
        };

        jxgSegment.textLabel = this.board.create('text', [labelX, labelY, segment.getLength()], properties);
    },

    _drawCircle: function (circle) {
        var jxgPoint1 = this._getJxgObjectById(circle.point1().getId());
        var jxgPoint2 = this._getJxgObjectById(circle.point2().getId());

        var strokeColor = this._getStrokeColor(circle);

        var properties = {
            id: circle.getId(),
            name: circle.getName(),
            straightFirst: false,
            straightLast: false,
            strokeColor: strokeColor
        };

        this.board.create('circle', [jxgPoint1, jxgPoint2], properties);
    },

    _drawTriangle: function (triangle) {
        var jxgPoint1 = this._getJxgObjectById(triangle.point1().getId());
        var jxgPoint2 = this._getJxgObjectById(triangle.point2().getId());
        var jxgPoint3 = this._getJxgObjectById(triangle.point3().getId());

        var strokeColor = this._getStrokeColor(triangle);
        var fillColor = this._getFillColor(triangle);

        var properties = {
            id: triangle.getId(),
            name: triangle.getName(),
            straightFirst: false,
            straightLast: false,
            hasInnerPoints: true,
            strokeColor: strokeColor,
            fillColor: fillColor
        };

        var jxgTriangle = this.board.create('polygon', [jxgPoint1, jxgPoint2, jxgPoint3], properties);

        if (triangle.square != null) {
            this._drawTriangleSquare(jxgTriangle, triangle);
        }
    },

    _drawTriangleSquare: function (jxgTriangle, triangle) {
        var point1 = triangle.point1();
        var point2 = triangle.point2();
        var point3 = triangle.point3();

        var labelX = function () {
            return (point1.getX() + point2.getX() + point3.getX()) / 3;
        };

        var labelY = function () {
            return (point1.getY() + point2.getY() + point3.getY()) / 3;
        };

        var properties = {
            fontSize: 16
        };

        jxgTriangle.textLabel = this.board.create('text', [labelX, labelY, triangle.square], properties);
    },

    _getStrokeColor: function (shape) {
        return shape.sc_addr == null ? Drawings.STOKE_COLOR : Drawings.TRANSLATED_STROKE_COLOR;
    },

    _getFillColor: function (shape) {
        return shape.sc_addr == null ? Drawings.FILL_COLOR : Drawings.TRANSLATED_FILL_COLOR;
    },

    _getJxgPoints: function (event) {
        return this.board.getAllObjectsUnderMouse(event).filter(function (element) {
            return element instanceof JXG.Point;
        });
    },

    _getJxgObjectById: function (id) {
        return this.board.select(function (jxgObject) {
            return jxgObject.id == id;
        }).objectsList[0];
    }
};
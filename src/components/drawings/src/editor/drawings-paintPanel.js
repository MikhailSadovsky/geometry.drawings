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
        toolbar.append('<div id="clearButton" class="button clear" title="Очистить"></div>');
        toolbar.append('<div id="saveToFile" class="button save" title="Сохранить"></div>');

        toolbar.append('<div id="load" class="button load" title="Загрузить"></div>');
        toolbar.append('<input id="fileInput" type="file">');

        $('#pointButton').click(function () {
            paintPanel._setMode(Drawings.DrawingMode.POINT);
        });

        $('#lineButton').click(function () {
            paintPanel._setMode(Drawings.DrawingMode.LINE);
        });

        $('#segmentButton').click(function () {
            paintPanel._setMode(Drawings.DrawingMode.SEGMENT);
        });

        $('#triangleButton').click(function () {
            paintPanel._setMode(Drawings.DrawingMode.TRIANGLE);
        });

        $('#clearButton').click(function () {
            paintPanel._clear();
        });

        $('#saveToFile').click(function () {
            paintPanel._saveToFile();
        });

        $('#load').click(function () {
            $("#fileInput").click();
        });

        $('#fileInput').change(function () {
            paintPanel._loadFromFile();
        });

        // initialize board
        editor.append('<div id="board" class="board jxgbox"></div>');
    },

    _setMode: function (mode) {
        this.controller.setDrawingMode(mode);
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
        var board = JXG.JSXGraph.initBoard('board', {boundingbox: [-20, 20, 20, -20], showCopyright: false, grid: true});

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

            paintPanel._erase(objectsToUpdate);
            paintPanel._draw(objectsToUpdate);
        });
    },

    _drawModel: function (model) {
        var objectsToDraw = [];
        objectsToDraw = objectsToDraw.concat(model.getPoints());
        objectsToDraw = objectsToDraw.concat(model.getShapes());
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
            else if (object instanceof Drawings.Triangle) {
                this._drawTriangle(object);
            }
        }
    },

    _drawPoint: function (point) {
        var jxgPoint;

        if (point.getName()) {
            jxgPoint = this.board.create(
                'point', [point.getX(), point.getY()], {name: point.getName(), showInfobox: false});
        }
        else {
            jxgPoint = this.board.create('point', [point.getX(), point.getY()], {showInfobox: false});
            point.name = jxgPoint.getName();
        }

        var paintPanel = this;

        jxgPoint.on('mousedrag', function () {
            var point = paintPanel.model.getPoint(this.name);
            point.setXY(this.X(), this.Y());
        });
    },

    _drawLine: function (line) {
        var point1 = line.point1();
        var point2 = line.point2();

        var jxgLine = this.board.create('line', [point1.getName(), point2.getName()], {name: line.getName()});

        jxgLine.on('mousedrag', function () {
            var line = paintPanel.model.getShape(this.name);
            line.point1().setXY(this.point1.X(), this.point1.Y());
            line.point2().setXY(this.point2.X(), this.point2.Y());
        });
    },

    _drawSegment: function (segment) {
        var point1 = segment.point1();
        var point2 = segment.point2();

        var jxgSegment = this.board.create('line', [point1.getName(), point2.getName()],
            {name: segment.getName(), straightFirst: false, straightLast: false});

        jxgSegment.on('mousedrag', function () {
            var line = paintPanel.model.getShape(this.name);
            line.point1().setXY(this.point1.X(), this.point1.Y());
            line.point2().setXY(this.point2.X(), this.point2.Y());
        });
    },

    _drawTriangle: function (triangle) {
        var point1 = triangle.point1();
        var point2 = triangle.point2();
        var point3 = triangle.point3();

        var jxgTriangle = this.board.create('polygon', [point1.getName(), point2.getName(), point3.getName()],
            {name: triangle.getName(), straightFirst: false, straightLast: false});

        jxgTriangle.borders.forEach(function (jxgSegment) {
            jxgSegment.on('mousedrag', function () {
                var point1 = paintPanel.model.getPoint(this.point1.name);
                var point2 = paintPanel.model.getPoint(this.point2.name);
                point1.setXY(this.point1.X(), this.point1.Y());
                point2.setXY(this.point2.X(), this.point2.Y());
            });
        });
    },

    _getJxgPoints: function (event) {
        return this.board.getAllObjectsUnderMouse(event).filter(function (element) {
            return element instanceof JXG.Point;
        });
    }
};
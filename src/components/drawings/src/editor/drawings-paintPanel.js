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

    getJxgElement: function(event) {
        var element = this.board.getAllObjectsUnderMouse(event)[0];
        return element;
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
        toolbar.append('<div id="editButton" class="button edit" title="Редактировать"></div>');

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

        // initialize board
        editor.append('<div id="board" class="board jxgbox"></div>');
    },

    _setMode: function (mode) {
        this.controller.setDrawingMode(mode);
    },

    _clear: function () {
        this.model.clear();
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

    _createSegmentLabel: function(segment, length){
        var point1 = segment.point1;
        var point2 = segment.point2;
        var segmentLabel = this.board.create('text',[
            function(){return (point1.X() + point2.X()) / 1.95 + 0.5;},
            function(){return (point1.Y() + point2.Y()) / 1.95 + 0.6;},
        length],{fontSize: 16});
        if(segment.textLabel) {
            segment.textLabel.setText("");
        }
        segment.textLabel = segmentLabel;
    },

    createTextLabel: function(jxgObject, text) {
        if(jxgObject instanceof  JXG.Line) {
            this._createSegmentLabel(jxgObject, text);
        } else if(jxgObject instanceof JXG.Polygon) {
            this._createPolygonLabel(jxgObject, text);
        }
    },

    _createPolygonLabel: function(triangle, square){
        var point1 = triangle.vertices[0];
        var point2 = triangle.vertices[1];
        var point3 = triangle.vertices[2];
        var textLabel = this.board.create('text',[
            function(){return (point1.X() + point2.X() + point3.X()) / 3;},
            function(){return (point1.Y() + point2.Y() + point3.Y()) / 3;},
            square],{fontSize: 16});
        if(triangle.textLabel) {
            triangle.textLabel.setText("");
        }
        triangle.textLabel = textLabel;
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

    _erase: function (modelObjects) {
        var jxgElement;
        for (var i = 0; i < modelObjects.length; i++) {
            jxgElement = this._getJxgObjectById(modelObjects[i].getId());
            if(jxgElement.textLabel) {
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
        }
    },

    _drawPoint: function (point) {
        var jxgPoint = this.board.create('point', [point.getX(), point.getY()],
            {id: point.getId(), name: point.getName(), showInfobox: false});

        var paintPanel = this;

        jxgPoint.coords.on('update', function () {
            var point = paintPanel.model.getPoint(this.id);
            point.setXY(this.X(), this.Y());
        }, jxgPoint);
    },

    _drawLine: function (line) {
        var jxgPoint1 = this._getJxgObjectById(line.point1().getId());
        var jxgPoint2 = this._getJxgObjectById(line.point2().getId());

        this.board.create('line', [jxgPoint1, jxgPoint2],
            {id: line.getId(), name: line.getName()});
    },

    _drawSegment: function (segment) {
        var jxgPoint1 = this._getJxgObjectById(segment.point1().getId());
        var jxgPoint2 = this._getJxgObjectById(segment.point2().getId());

        var jxgSegment = this.board.create('line', [jxgPoint1, jxgPoint2],
            {id: segment.getId(), name: segment.getName(), straightFirst: false, straightLast: false, strokeOpacity: 0.4});
        if(segment.length != "") {
            this._createSegmentLabel(jxgSegment, segment.length);
        }
    },

    _drawTriangle: function (triangle) {
        var jxgPoint1 = this._getJxgObjectById(triangle.point1().getId());
        var jxgPoint2 = this._getJxgObjectById(triangle.point2().getId());
        var jxgPoint3 = this._getJxgObjectById(triangle.point3().getId());

        var polygon = this.board.create('polygon', [jxgPoint1, jxgPoint2, jxgPoint3],
            {id: triangle.getId(), name: triangle.getName(), straightFirst: false, straightLast: false, hasInnerPoints: true});
        if(triangle.square != "") {
            this._createPolygonLabel(polygon, triangle.square);
        }
    },

    _getJxgPoints: function (event) {
        return this.board.getAllObjectsUnderMouse(event).filter(function (element) {
            return element instanceof JXG.Point;
        });
    },

    _getJxgObjectById: function (id) {
        return this.board.select(function(jxgObject) {
            return jxgObject.id == id;
        }).objectsList[0];
    },

    _getPolygons: function(event){
        var elements =  this.board.select(function(jxgObject) {
            if(jxgObject instanceof  JXG.Polygon && jxgObject.hasPoint(event.layerX, event.layerY)) {
                return jxgObject;
            }
        }).objectsList;
        return elements;
    }
};
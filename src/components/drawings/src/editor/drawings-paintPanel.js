/**
 * Paint panel.
 */

Drawings.PaintPanel = function (containerId, model) {
    this.containerId = containerId;

    this.model = model;

    this.controller = null;

    this.board = null;

    this.rendererMap = {};
};

Drawings.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);

        this.board = this._createBoard();

        this._configureModel();

        this.controller = new Drawings.Controller(this, this.model);

        this.rendererMap["Point"] = new Drawings.PointRenderer(this.board);
        this.rendererMap["Line"] = new Drawings.LineRenderer(this.board);
        this.rendererMap["Segment"] = new Drawings.SegmentRenderer(this.board);
        this.rendererMap["Triangle"] = new Drawings.TriangleRenderer(this.board);
        this.rendererMap["Circle"] = new Drawings.CircleRenderer(this.board);
        this.rendererMap["Angle"] = new Drawings.AngleRenderer(this.board);
    },

    getBoard: function () {
        return this.board;
    },

    getJxgObjects: function (event) {
        return this.board.getAllObjectsUnderMouse(event);
    },

    getJxgPoint: function (event) {
        var jxgObjects = this.getJxgObjects(event);

        var jxgPoints = jxgObjects.filter(function (jxgObject) {
            return jxgObject instanceof JXG.Point;
        });

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
        container.append('<div id="geometryEditor" class="sc-no-default-cmd geometryEditor"></div>');
        var editor = $('#geometryEditor');

        SCWeb.core.Server.resolveScAddr(['ui_geometry_editor',
        ], function (keynodes) {
            editor.attr("sc_addr", keynodes['ui_geometry_editor']);
        });
            // initialize toolbar markup
        editor.append('<div id="toolbar" class="toolbar"></div>');
        // initialize board
        editor.append('<div id="board" class="board jxgbox"></div>');

        var toolbar = $('#toolbar');

        /*      toolbar.append('<div id="saveToFile" class="sc-no-default-cmd button save" title="Сохранить"></div>');
         toolbar.append('<div id="load" class="sc-no-default-cmd button load" title="Загрузить"></div>');
         toolbar.append('<input id="fileInput" type="file">');*/

        toolbar.append('<div id="shapesButton" class="sc-no-default-cmd button triangle">' +
        '<button data-toggle="clickover" data-title="" title="Выбор фигуры" data-placement="right" class="sc-no-default-cmd button triangle"></button></div>');
        toolbar.append('<div id="clearButton" class="sc-no-default-cmd button clear" title="Очистить"></div>');
        toolbar.append('<div id="solveButton" class="sc-no-default-cmd button solve" title="Вычислить"></div>');
        toolbar.append('<div id="viewButton" class="sc-no-default-cmd button view" title="Просмотр"></div>');
        toolbar.append('<div id="translateButton" class="sc-no-default-cmd button translate" title="Синхронизация"></div>');

        var allDrawButtons ='<div id="pointButton" class="sc-no-default-cmd button point" title="Точка"></div>' +
            '<div id="lineButton" class="sc-no-default-cmd button line" title="Прямая"></div>' +
            '<div id="segmentButton" class="sc-no-default-cmd button segment" title="Отрезок"></div>' +
            '<div id="triangleButton" class="sc-no-default-cmd button triangle" title="Треугольник"></div>' +
            '<div id="circleButton" class="sc-no-default-cmd button circle" title="Окружность"></div>' +
            '<div id="angleButton" class="button angle" title="Угол"></div>';

        $('#shapesButton').popover({animation:true, content:allDrawButtons, html:true});

        // Resolving
        SCWeb.core.Server.resolveScAddr(['ui_control_clear_button',
        ], function (keynodes) {
            $('#clearButton').attr("sc_addr", keynodes['ui_control_clear_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_draw_circle_button',
        ], function (keynodes) {
            $('#circleButton').attr("sc_addr", keynodes['ui_control_draw_circle_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_draw_line_button',
        ], function (keynodes) {
            $('#lineButton').attr("sc_addr", keynodes['ui_control_draw_line_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_draw_point_button',
        ], function (keynodes) {
            $('#pointButton').attr("sc_addr", keynodes['ui_control_draw_point_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_draw_segment_button',
        ], function (keynodes) {
            $('#segmentButton').attr("sc_addr", keynodes['ui_control_draw_segment_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_draw_triangle_button',
        ], function (keynodes) {
            $('#triangleButton').attr("sc_addr", keynodes['ui_control_draw_triangle_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_geometry_calculation_button',
        ], function (keynodes) {
            $('#solveButton').attr("sc_addr", keynodes['ui_control_geometry_calculation_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_load_button',
        ], function (keynodes) {
            $('#load').attr("sc_addr", keynodes['ui_control_load_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_save_button',
        ], function (keynodes) {
            $('#saveToFile').attr("sc_addr", keynodes['ui_control_save_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_synchronization_button',
        ], function (keynodes) {
            $('#translateButton').attr("sc_addr", keynodes['ui_control_synchronization_button']);
        });
        SCWeb.core.Server.resolveScAddr(['ui_control_view_chart_arguments_button',
        ], function (keynodes) {
            $('#viewButton').attr("sc_addr", keynodes['ui_control_view_chart_arguments_button']);
        });

        $('#toolbar').on('click', '#pointButton', function(event) {
                if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                    return;
                }
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.POINT);
                        break;
                    case 3:
                        paintPanel.controller.pointController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );

        $("#solveButton").bind("contextmenu", function(e) {
            e.preventDefault();
        });

        $('#solveButton').mousedown(function(event) {
                if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                    return;
                }
                switch (event.which) {
                    case 1:
                        break;
                    case 3:
                        paintPanel.controller._handleContextMenuSolverEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );



        $('#toolbar').on('click', '#lineButton', function(event) {
                event.preventDefault();
                if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                    return;
                }
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.LINE);
                        break;
                    case 3:
                        paintPanel.controller.lineController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );

        $('#toolbar').on('click', '#segmentButton', function(event) {
                if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                    return;
                }
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.SEGMENT);
                        break;
                    case 3:
                        paintPanel.controller.segmentController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );

        $('#toolbar').on('click', '#triangleButton', function(event) {
                if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                    return;
                }
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.TRIANGLE);
                        break;
                    case 3:
                        paintPanel.controller.triangleController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );

        $('#toolbar').on('click', '#angleButton', function(event) {
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.ANGLE);
                        break;
                    case 3:
                        console.log('todo definition');
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );

        $('#toolbar').on('click', '#circleButton', function(event) {
                if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                    return;
                }
                switch (event.which) {
                    case 1:
                        paintPanel.controller.setDrawingMode(Drawings.DrawingMode.CIRCLE);
                        break;
                    case 3:
                        paintPanel.controller.circleController.handleContextDefinitionMenuEvent(event);
                        break;
                    default:
                        alert('You have a strange Mouse!');
                }
            }
        );

        $('#clearButton').click(function () {
            if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                return;
            }
            paintPanel.model.clear();
        });

        $('#saveToFile').click(function () {
            if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                return;
            }
            paintPanel._saveToFile();
        });

        $('#load').click(function () {
            if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                return;
            }
            $("#fileInput").click();
        });

        $('#fileInput').change(function () {
            paintPanel._loadFromFile();
        });

        $('#translateButton').click(function () {
            if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                return;
            }
            paintPanel._translate();
        });

        $('#viewButton').click(function () {
            if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                return;
            }
            paintPanel._viewBasedKeyNode();
        });

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

    _translate: function () {
        Drawings.ScTranslator.putModel(this.model);
        // Redraw all (only translated ?) shapes after translation
        //this._redraw(this.model.getModelObjects());
    },

    _viewBasedKeyNode: function () {
        Drawings.ScTranslator.viewBasedKeyNode();
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

        board.create('text',[5, 6, 'Задача'],
            {strokeColor:'blue',id:'task_txt', fontSize:'25'});
        board.create('line',[[24,6],[24,-8]], {straightFirst:false, straightLast:false, strokeWidth:2});
        board.create('text',[25, 5, 'Дано:'],
            {strokeColor:'blue',id:'conditions_txt', fontSize:'20'});
        board.create('line',[[24,-3],[42,-3]], {straightFirst:false, straightLast:false, strokeWidth:2});
        board.create('text',[25, -4, 'Найти:'],
            {strokeColor:'blue',id:'question_txt', fontSize:'20'});

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
            paintPanel._update(objectsToUpdate);
        });
    },

    _drawModel: function (model) {
        var objectsToDraw = [];
        objectsToDraw = objectsToDraw.concat(model.getPoints());
        objectsToDraw = objectsToDraw.concat(model.getShapes());
        this._draw(objectsToDraw);
    },

    _draw: function (modelObjects) {
        for (var i = 0; i < modelObjects.length; i++) {
            var renderer = this.rendererMap[modelObjects[i].className];
            renderer.render(modelObjects[i]);
        }
    },

    _erase: function (modelObjects) {
        for (var i = 0; i < modelObjects.length; i++) {
            var renderer = this.rendererMap[modelObjects[i].className];
            renderer.erase(modelObjects[i]);
        }
    },

    _redraw: function (modelObjects) {
        this._erase(modelObjects);
        this._draw(modelObjects);
    },

    _update: function (modelObjects) {
        var points = Drawings.Utils.selectPoints(modelObjects);
        var shapes = Drawings.Utils.selectShapes(modelObjects);

        this._updatePoints(points);
        this._updateShapes(shapes);
    },

    _updatePoints: function (points) {
        for (var i = 0; i < points.length; i++) {
            var point = points[i];

            var connectedShapes = this._getConnectedShapes(point);

            this._erase(connectedShapes);
            this._redraw([point]);
            this._draw(connectedShapes);
        }
    },

    _getConnectedShapes: function (point) {
        var shapes = this.model.getShapes();
        var connectedShapes = [];

        for (var i = 0; i < shapes.length; i++) {
            var pointIndex = shapes[i].getPoints().indexOf(point);

            if (pointIndex >= 0) {
                connectedShapes.push(shapes[i]);
            }
        }

        return connectedShapes;
    },

    _updateShapes: function (shapes) {
        this._redraw(shapes);
    },

    _getJxgObjectById: function (id) {
        console.log('This function is deprecated. Use instead: Drawings.Utils.getJxgObjectById(board, id).');

        return this.board.select(function (jxgObject) {
            return jxgObject.id == id;
        }).objectsList[0];
    }
};
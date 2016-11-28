/**
 * Paint panel.
 */

Drawings.PaintPanel = function(containerId, model) {
    this.containerId = containerId;

    this.model = model;

    this.controller = null;

    this.board = null;

    this.rendererMap = {};
};
Drawings.PaintPanel.paintObjects = [];
Drawings.PaintPanel.paintPoints = [];
Drawings.PaintPanel.prototype = {

    init: function() {
        this._initMarkup(this.containerId);

        this.controller = new Drawings.Controller(this, this.model);

        this.rendererMap["Point"] = new Drawings.PointRenderer(this.board);
        this.rendererMap["Line"] = new Drawings.LineRenderer(this.board);
        this.rendererMap["Segment"] = new Drawings.SegmentRenderer(this.board);
        this.rendererMap["Triangle"] = new Drawings.TriangleRenderer(this.board);
        this.rendererMap["Circle"] = new Drawings.CircleRenderer(this.board);
        this.rendererMap["Angle"] = new Drawings.AngleRenderer(this.board);
    },

    getBoard: function() {
        return this.board;
    },

    getJxgObjects: function(event) {
        return this.board.getAllObjectsUnderMouse(event);
    },

    getJxgPoint: function(event) {
        var jxgObjects = this.getJxgObjects(event);

        var jxgPoints = jxgObjects.filter(function(jxgObject) {
            return jxgObject instanceof JXG.Point;
        });

        return jxgPoints.length > 0 ? jxgPoints[0] : null;
    },

    getMouseCoordinates: function(event) {
        var coordinates = this.board.getUsrCoordsOfMouse(event);
        return [coordinates[0], coordinates[1]];
    },

    _initMarkup: function(containerId) {
        var container = $('#' + containerId);
        var paintPanel = this;

        // root element
        container.append('<div id="geometryEditor" class="sc-no-default-cmd geometryEditor"></div>');
        var editor = $('#geometryEditor');

        SCWeb.core.Server.resolveScAddr(['ui_geometry_editor', ], function(keynodes) {
            editor.attr("sc_addr", keynodes['ui_geometry_editor']);
        });
        editor.append("<div id='objects_button'></div>");
        editor.append("<div id='geometry_editor_container'></div>");
        var geometry_editor_container = $('#geometry_editor_container');
        geometry_editor_container.append("<button type='button' id='applet2d' class='btn btn-success sc-no-default-cmd'>2D</button>");
        var applet2d = $('#applet2d');
        SCWeb.core.Server.resolveScAddr(['ui_applet2d', ], function(keynodes) {
            applet2d.attr("sc_addr", keynodes['ui_applet2d']);
        });
        geometry_editor_container.append("<button type='button' id='applet3d' class='btn btn-success sc-no-default-cmd'>3D</button>");
        var applet3d = $('#applet3d');
        SCWeb.core.Server.resolveScAddr(['ui_applet3d', ], function(keynodes) {
            applet3d.attr("sc_addr", keynodes['ui_applet3d']);
        });
        geometry_editor_container.append("<button type='button' id='synchronize' class='btn btn-success sc-no-default-cmd'>синхронизация</button>");
        var synchronize = $('#synchronize');
        SCWeb.core.Server.resolveScAddr(['ui_control_synchronization_button', ], function(keynodes) {
            synchronize.attr("sc_addr", keynodes['ui_control_synchronization_button']);
        });
        geometry_editor_container.append("<div id='applet_container'></div>");

        Drawings.Applet.initApplet();
        var names = [];
        setTimeout(function() {
            Drawings.Applet.addListeners();
        }, 6000);

        $('#synchronize').click(function() {
            if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                return;
            }
            paintPanel._translate();
        });
    },
    _translate: function() {
        var objects = Drawings.PaintPanel.paintPoints;
        var paintPanel = this;
        objects.forEach(function(item, i, objects) {
            if (item.type === 'point') {
                var point = new Drawings.Point(item.xCoord, item.yCoord);
                point.setName('Point_' + item.name);
                paintPanel.model.addPoint(point);
            }
        });
        objects = Drawings.PaintPanel.paintObjects;
        objects.forEach(function(item, i, objects) {
            switch (item.type) {
                case 'segment':
                    {
                        var pointOneName = "Point_" + item.definition.substring(item.definition.indexOf("[") + 1, item.definition.indexOf(", "));
                        var pointOne = paintPanel.model.getPointByName(pointOneName);
                        if (pointOne == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointOneName) {
                                    pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointOne.setName(item.name);
                                    paintPanel.model.addPoint(pointOne);
                                }
                            });
                        var pointTwoName = "Point_" + item.definition.substring(item.definition.indexOf(", ") + 2, item.definition.indexOf("]"));
                        var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                        if (pointTwo == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointTwoName) {
                                    pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointTwo.setName(item.name);
                                    paintPanel.model.addPoint(pointTwo);
                                }
                            });
                        var segment = new Drawings.Segment(pointOne, pointTwo);
                        segment.setLength(item.value.substring(item.value.indexOf("= ") + 2, item.value.length));
                        segment.name = Drawings.Utils.generateSegmentName(segment);
                        $('#' + item.name).attr('id', segment.name);
                        paintPanel.model.addShape(segment);
                        break;
                    }
                case 'line':
                    {
                        var pos1 = 0;
                        var pointOneName = "Point_" + item.definition.substring(13, pos1 = item.definition.indexOf(" ", 14));
                        var pointOne = paintPanel.model.getPointByName(pointOneName);
                        if (pointOne == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointOneName) {
                                    pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointOne.setName(item.name);
                                    paintPanel.model.addPoint(pointOne);
                                }
                            });
                        var pointTwoName = "Point_" + item.definition.substring(pos1 + 3, item.definition.length);
                        var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                        if (pointTwo == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointTwoName) {
                                    pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointTwo.setName(item.name);
                                    paintPanel.model.addPoint(pointTwo);
                                }
                            });
                        var line = new Drawings.Line(pointOne, pointTwo);
                        line.name = Drawings.Utils.generateLineName(line);
                        $('#' + item.name).attr('id', line.name);
                        paintPanel.model.addShape(line);
                        break;
                    }
                case 'angle':
                    {
                        var pos = 0;
                        var pointOneName = "Point_" + item.definition.substring(15, pos = item.definition.indexOf(", ", 16));
                        var pointOne = paintPanel.model.getPointByName(pointOneName);
                        if (pointOne == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointOneName) {
                                    pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointOne.setName(item.name);
                                    paintPanel.model.addPoint(pointOne);
                                }
                            });
                        var pointTwoName = "Point_" + item.definition.substring(pos + 2, pos = item.definition.indexOf(", ", pos + 1));
                        var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                        if (pointTwo == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointTwoName) {
                                    pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointTwo.setName(item.name);
                                    paintPanel.model.addPoint(pointTwo);
                                }
                            });
                        var pointThreeName = "Point_" + item.definition.substring(pos + 2, pos = item.definition.length);
                        var pointThree = paintPanel.model.getPointByName(pointThreeName);
                        if (pointThree == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointThreeName) {
                                    pointThree = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointThree.setName(item.name);
                                    paintPanel.model.addPoint(pointThree);
                                }
                            });
                        var angle = new Drawings.Angle(pointOne, pointTwo, pointThree);
                        angle.name = Drawings.Utils.generateAngleName(angle);
                        angle.setValue(item.value.substring(item.value.indexOf("= ") + 2, pos = item.value.length - 1));
                        angle.vertex = pointTwo;

                        var segmentOne = paintPanel.model.getShapeByName('Segment(' + pointOneName + ';' + pointTwoName + ')');
                        if (segmentOne == null) {
                            segmentOne = paintPanel.model.getShapeByName('Segment(' + pointTwoName + ';' + pointOneName + ')');
                            if (segmentOne == null)
                                objects.forEach(function(item, i, objects) {
                                    var pOne = item.definition.substring(item.definition.indexOf("[") + 1, item.definition.indexOf(", "));
                                    var pTwo = item.definition.substring(item.definition.indexOf(", ") + 2, item.definition.indexOf("]"));
                                    var pOneName = pointOneName.substring(pointOneName.indexOf("_") + 1, pointOneName.length);
                                    var pTwoName = pointTwoName.substring(pointTwoName.indexOf("_") + 1, pointTwoName.length);
                                    if ((pOne ==  pOneName && pTwo ==  pTwoName)  ||  (pOne ==  pTwoName && pTwo ==  pOneName)) {
                                        segmentOne = new Drawings.Segment(pointOne, pointTwo);
                                        segmentOne.setLength(item.value.substring(item.value.indexOf("= ") + 2, item.value.length));
                                        segmentOne.name = Drawings.Utils.generateSegmentName(segmentOne);
                                        paintPanel.model.addShape(segmentOne);
                                    }
                                });
                        }

                        angle.segment1 = segmentOne;

                        var segmentTwo = paintPanel.model.getShapeByName('Segment(' + pointTwoName + ';' + pointThreeName + ')');
                        if (segmentTwo == null) {
                            segmentTwo = paintPanel.model.getShapeByName('Segment(' + pointThreeName + ';' + pointTwoName + ')');
                            if (segmentTwo == null)
                                objects.forEach(function(item, i, objects) {
                                    var pOne = item.definition.substring(item.definition.indexOf("[") + 1, item.definition.indexOf(", "));
                                    var pTwo = item.definition.substring(item.definition.indexOf(", ") + 2, item.definition.indexOf("]"));
                                    var pOneName = pointTwoName.substring(pointTwoName.indexOf("_") + 1, pointTwoName.length);
                                    var pTwoName = pointThreeName.substring(pointThreeName.indexOf("_") + 1, pointThreeName.length);
                                    if ((pOne ==  pOneName && pTwo ==  pTwoName)  ||  (pOne ==  pTwoName && pTwo ==  pOneName)) {
                                        segmentTwo = new Drawings.Segment(pointTwo, pointThree);
                                        segmentTwo.setLength(item.value.substring(item.value.indexOf("= ") + 2, item.value.length));
                                        segmentTwo.name = Drawings.Utils.generateSegmentName(segmentTwo);
                                        paintPanel.model.addShape(segmentTwo);
                                    }
                                });
                        }
                        angle.segment2 = segmentTwo;
                        $('#' + item.name).attr('id', angle.name);
                        paintPanel.model.addShape(angle);
                        break;
                    }
                case 'circle':
                    {
                        var pos = 0;
                        var pointOneName = "Point_" + item.definition.substring(29, pos = item.definition.indexOf(" ", 30));
                        var pointOne = paintPanel.model.getPointByName(pointOneName);
                        if (pointOne == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointOneName) {
                                    pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointOne.setName(item.name);
                                    paintPanel.model.addPoint(pointOne);
                                }
                            });
                        var pointTwoName = "Point_" + item.definition.substring(item.definition.indexOf("в ") + 2, item.definition.length);
                        var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                        if (pointTwo == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointTwoName) {
                                    pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointTwo.setName(item.name);
                                    paintPanel.model.addPoint(pointTwo);
                                }
                            });
                        var circle = new Drawings.Circle(pointTwo, pointOne);
                        circle.setCenter(pointTwo);
                        circle.setRadius(Math.sqrt(Math.pow(pointOne.x - pointTwo.x, 2) + Math.pow(pointOne.y - pointTwo.y, 2)) + ""); //radius
                        circle.setLength(circle.getRadius() * Math.PI * 2 + "");
                        circle.name = Drawings.Utils.generateCircleName(circle);
                        $('#' + item.name).attr('id', circle.name);
                        paintPanel.model.addShape(circle);
                        break;
                    }
                case 'triangle':
                    {
                        var pos2 = 0;
                        var pointOneName = "Point_" + item.definition.substring(8, pos2 = item.definition.indexOf(",", 8));
                        var pointOne = paintPanel.model.getPointByName(pointOneName);
                        if (pointOne == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointOneName) {
                                    pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointOne.setName(item.name);
                                    paintPanel.model.addPoint(pointOne);
                                }
                            });
                        var pointTwoName = "Point_" + item.definition.substring(pos2 + 2, pos2 = item.definition.indexOf(",", pos2 + 3));
                        var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                        if (pointTwo == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointTwoName) {
                                    pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointTwo.setName(item.name);
                                    paintPanel.model.addPoint(pointTwo);
                                }
                            });
                        var pointThreeName = "Point_" + item.definition.substring(pos2 + 2, item.definition.length);
                        var pointThree = paintPanel.model.getPointByName(pointThreeName);
                        if (pointThree == null)
                            objects.forEach(function(item, i, objects) {
                                if (item.name == pointThreeName) {
                                    pointThree = new Drawings.Point(item.xCoord, item.yCoord);
                                    pointThree.setName(item.name);
                                    paintPanel.model.addPoint(pointThree);
                                }
                            });
                        var segmentOneName1 = "Segment(" + pointOneName + ";" + pointTwoName + ")";
                        var segmentOneName2 = "Segment(" + pointTwoName + ";" + pointOneName + ")";
                        var segmentOne = paintPanel.model.getShapeByName(segmentOneName1);
                        if (segmentOne == null) {
                            segmentOne = paintPanel.model.getShapeByName(segmentOneName2);
                            if (segmentOne == null)
                                objects.forEach(function(item, i, objects) {
                                    if (item.name == segmentOneName1) {
                                        segmentOne = new Drawings.Segment(pointOne, pointTwo);
                                        segmentOne.setName(item.name);
                                        paintPanel.model.addShape(segmentOne);
                                    }
                                });
                        }
                        var segmentTwoName1 = "Segment(" + pointOneName + ";" + pointThreeName + ")";
                        var segmentTwoName2 = "Segment(" + pointThreeName + ";" + pointOneName + ")";
                        var segmentTwo = paintPanel.model.getShapeByName(segmentTwoName1);
                        if (segmentTwo == null) {
                            segmentTwo = paintPanel.model.getShapeByName(segmentTwoName2);
                            if (segmentTwo == null)
                                objects.forEach(function(item, i, objects) {
                                    if (item.name == segmentTwoName1) {
                                        segmentTwo = new Drawings.Segment(pointOne, pointTwo);
                                        segmentTwo.setName(item.name);
                                        paintPanel.model.addShape(segmentTwo);
                                    }
                                });
                        }
                        var segmentThreeName1 = "Segment(" + pointTwoName + ";" + pointThreeName + ")";
                        var segmentThreeName2 = "Segment(" + pointThreeName + ";" + pointTwoName + ")";
                        var segmentThree = paintPanel.model.getShapeByName(segmentThreeName1);
                        if (segmentThree == null) {
                            segmentThree = paintPanel.model.getShapeByName(segmentThreeName2);
                            if (segmentThree == null)
                                objects.forEach(function(item, i, objects) {
                                    if (item.name == segmentThreeName1) {
                                        segmentThree = new Drawings.Segment(pointOne, pointTwo);
                                        segmentThree.setName(item.name);
                                        paintPanel.model.addShape(segmentThree);
                                    }
                                });
                        }
                        var triangle = new Drawings.Triangle(pointOne, pointTwo, pointThree);
                        triangle.name = Drawings.Utils.generateTriangleName(triangle);
                        triangle.segment1 = segmentOne;
                        triangle.segment2 = segmentTwo;
                        triangle.segment3 = segmentThree;
                        paintPanel.model.addShape(triangle);
                        $('#' + item.name).attr('id', triangle.name);
                        break;
                    }
                case 'square': {
                    var pointOneName = "Point_" + item.definition.substr(14, 1);
                    console.log(pointOneName);
                    var pointOne = paintPanel.model.getPointByName(pointOneName);
                    if (pointOne == null)
                        objects.forEach(function(item, i, objects) {
                            if (item.name == pointOneName) {
                                pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                                pointOne.setName(item.name);
                                paintPanel.model.addPoint(pointOne);
                            }
                        });
                    console.log("POINT ONE", pointOne);
                    var pointTwoName = "Point_" + item.definition.substr(17, 1);
                    var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                    if (pointTwo == null)
                        objects.forEach(function(item, i, objects) {
                            if (item.name == pointTwoName) {
                                pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                                pointTwo.setName(item.name);
                                paintPanel.model.addPoint(pointTwo);
                            }
                        });
                    console.log('PONT TWO', pointTwo);
                    var segmentName1 = "Segment(" + pointOneName + ";" + pointTwoName + ")";
                        var segmentName2 = "Segment(" + pointTwoName + ";" + pointOneName + ")";
                        var segment = paintPanel.model.getShapeByName(segmentName1);
                        if (segment == null) {
                            segment = paintPanel.model.getShapeByName(segmentName2);
                            if (segment == null)
                                objects.forEach(function(item, i, objects) {
                                    if (item.name == segmentName1) {
                                        segment = new Drawings.Segment(pointOne, pointTwo);
                                        segment.setName(item.name);
                                        paintPanel.model.addShape(segment);
                                    }
                                });
                        }
                        console.log('SEGMENT', segment);
                        var square = new Drawings.Polygon(pointOne, pointTwo);
                        square.type = 'square';
                        square.name = Drawings.Utils.generatePolygonName(square);
                        square.setSquare(segment.getLength() * segment.getLength() + "");
                        square.setPerimeter(segment.getLength() * 4 + "");
                        paintPanel.model.addShape(square);
                        $('#' + item.name).attr('id', square.name);
                        console.log(square);
                        break;
                }
            }
        });
        Drawings.ScTranslator.putModel(paintPanel.model);
    }
};

function translateObjTypesToSc(type) {
    switch (type) {
        case 'point':
            {
                return 'concept_geometric_point';
                break;
            }
        case 'line':
            {
                return 'concept_straight_line';
                break;
            }
        case 'segment':
            {
                return 'concept_segment';
                break;
            }
        case 'triangle':
            {
                return 'concept_triangle';
                break;
            }
        case 'circle':
            {
                return 'concept_circle';
                break;
            }
        case 'angle':
            {
                return 'concept_angle';
                break;
            }
        case 'polygon':
            {
                return 'concept_polygon';
                break;
            }
        case 'square':
            {
                return 'concept_square';
                break;
            }
        default:
            {
                return 'concept_geometric_figure';
            }
    }
}

function correctGeogebraStyles(objName) {
    var elemNumber = $('.elem').length - 1;
    var elem = $('.elem')[elemNumber];
    var margin = ($(elem).outerHeight(true) - 20);
    $('#' + objName).css('margin', margin + 'px 0px');
    $('.marblePanel').css('display', 'none');
}

//у правильных многоугольников type poligon и definition состоит из 
//"Многоугольник[вершины, количество]"
//у неправильных четырехугольников type quadrilateral
//параллелограмм, ромб, прямоугольник, трапеция

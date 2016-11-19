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
Drawings.PaintPanel.paintObjects = [];
Drawings.PaintPanel.paintPoints = [];
Drawings.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);

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
        editor.append("<div id='objects_button'></div>");
        editor.append("<div id='geometry_editor_container'></div>");
        var geometry_editor_container = $('#geometry_editor_container');
        geometry_editor_container.append("<button type='button' id='applet2d' class='btn btn-success sc-no-default-cmd'>2D</button>");
        var applet2d = $('#applet2d');
        SCWeb.core.Server.resolveScAddr(['ui_applet2d',
            ], function (keynodes) {
                applet2d.attr("sc_addr", keynodes['ui_applet2d']);
        });
        geometry_editor_container.append("<button type='button' id='applet3d' class='btn btn-success sc-no-default-cmd'>3D</button>");
        var applet3d = $('#applet3d');
        SCWeb.core.Server.resolveScAddr(['ui_applet3d',
            ], function (keynodes) {
                applet3d.attr("sc_addr", keynodes['ui_applet3d']);
        });
        geometry_editor_container.append("<button type='button' id='synchronize' class='btn btn-success sc-no-default-cmd'>синхронизация</button>");
        var synchronize = $('#synchronize');
        SCWeb.core.Server.resolveScAddr(['ui_control_synchronization_button',
            ], function (keynodes) {
                synchronize.attr("sc_addr", keynodes['ui_control_synchronization_button']);
        });
        geometry_editor_container.append("<div id='applet_container'></div>");
        this._initGeometryApplet();
        var names = [];
        setTimeout(function() {
            var applet = document.ggbApplet;
            applet.registerAddListener('addObjectListener');
            applet.registerRemoveListener('removeObjectListener');
            applet.registerRenameListener('renameObjectListener');
            applet.registerUpdateListener('updateObjectListener');
        }, 6000);

       $('#synchronize').click(function () {
            if ($('#arguments_add_button').hasClass('btn btn-success argument-wait')) {
                return;
            }
            paintPanel._translate();
	   });
    },

    _initGeometryApplet: function() {
        var parameters = {
            "id":"ggbApplet",
            "showToolBar":true,
            "borderColor":null,
            "showMenuBar":false,
            "showAlgebraInput":false,
            "showResetIcon":true,
            "showTutorialLink": false,
            "showLogging":true,
            "enableLabelDrags":true,
            "enableShiftDragZoom":true,
            "enableRightClick":true,
            "enableDialogActive":true,
            "capturingThreshold":null,
            "showToolBarHelp":false,
            "errorDialogsActive":true,
            "useBrowserForJS":true,
            "allowStyleBar":false};
        var applet = new GGBApplet(parameters, '5.0');

        applet.inject('applet_container');
        $('#applet2d').click(function(event) {
            ggbApplet.setPerspective('2');
        });
        $('#applet3d').click(function() {
            ggbApplet.setPerspective('5');
        });
    },

    _translate: function () {
        var objects = Drawings.PaintPanel.paintPoints;
    	var paintPanel = this;
    	objects.forEach(function(item, i, objects) {
    		if (item.type === 'point') { 
    			var point = new Drawings.Point(item.xCoord, item.yCoord);
    			point.setName(item.name);
    			paintPanel.model.addPoint(point);
    		}
        });
        objects = Drawings.PaintPanel.paintObjects;
        objects.forEach(function(item,i, objects){
            if (item.type === 'segment') {
                var pointOneName = item.definition.substring(item.definition.indexOf("[")+1, item.definition.indexOf(", "));
                var pointOne = paintPanel.model.getPointByName(pointOneName);
                if (pointOne == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointOneName){
                            pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                            pointOne.setName(item.name);
                            paintPanel.model.addPoint(pointOne);
                        }
                    });
                var pointTwoName = item.definition.substring(item.definition.indexOf(", ")+2, item.definition.indexOf("]"));
                var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                if (pointTwo == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointTwoName){
                            pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                            pointTwo.setName(item.name);
                            paintPanel.model.addPoint(pointTwo);
                        }
                    });
                var segment = new Drawings.Segment(pointOne, pointTwo);
                segment.setLength(item.value.substring(item.value.indexOf("= ")+2, item.value.length));
                segment.name = Drawings.Utils.generateSegmentName(segment);
                paintPanel.model.addShape(segment);
            }
            else if (item.type === 'line') {
            	var pos1 = 0;
                var pointOneName = item.definition.substring(13, pos1 = item.definition.indexOf(" ", 14));
                var pointOne = paintPanel.model.getPointByName(pointOneName);
                if (pointOne == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointOneName){
                            pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                            pointOne.setName(item.name);
                            paintPanel.model.addPoint(pointOne);
                        }
                    });
                var pointTwoName = item.definition.substring(pos1 + 3, item.definition.length);
                var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                if (pointTwo == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointTwoName){
                            pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                            pointTwo.setName(item.name);
                            paintPanel.model.addPoint(pointTwo);
                        }
                    });
                var line = new Drawings.Line(pointOne, pointTwo);
                line.name = Drawings.Utils.generateLineName(line);
                paintPanel.model.addShape(line);
            }
            else 
            if (item.type === 'angle') {
                var pos = 0;
                var pointOneName = item.definition.substring(15, pos = item.definition.indexOf(", ", 16));
                var pointOne = paintPanel.model.getPointByName(pointOneName);
                if (pointOne == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointOneName){
                            pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                            pointOne.setName(item.name);
                            paintPanel.model.addPoint(pointOne);
                        }
                    });
                var pointTwoName = item.definition.substring(pos + 2, pos = item.definition.indexOf(", ", pos + 1));
                var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                if (pointTwo == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointTwoName){
                            pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                            pointTwo.setName(item.name);
                            paintPanel.model.addPoint(pointTwo);
                        }
                    });
                var pointThreeName = item.definition.substring(pos + 2, pos = item.definition.length);
                var pointThree = paintPanel.model.getPointByName(pointThreeName);
                if (pointThree == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointThreeName){
                            pointThree = new Drawings.Point(item.xCoord, item.yCoord);
                            pointThree.setName(item.name);
                            paintPanel.model.addPoint(pointThree);
                        }
                    });
                var angle = new Drawings.Angle(pointOne, pointTwo, pointThree);
                angle.name = Drawings.Utils.generateAngleName(angle);
                angle.setValue(item.value.substring(item.value.indexOf("= ")+2, pos = item.value.length-1));
                paintPanel.model.addShape(angle);
            }
            else
            if (item.type === 'circle') {
                var pos = 0;
                var pointOneName = item.definition.substring(29, pos = item.definition.indexOf(" ", 30));
                var pointOne = paintPanel.model.getPointByName(pointOneName);
                if (pointOne == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointOneName){
                            pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                            pointOne.setName(item.name);
                            paintPanel.model.addPoint(pointOne);
                        }
                    });
                var pointTwoName = item.definition.substring(item.definition.indexOf("в ")+2, item.definition.length);
                var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                if (pointTwo == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointTwoName){
                            pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                            pointTwo.setName(item.name);
                            paintPanel.model.addPoint(pointTwo);
                        }
                    });
                var circle = new Drawings.Circle(pointTwo, pointOne);
                circle.setCenter(pointTwo);
                circle.setRadius(Math.sqrt(Math.pow(pointOne.x-pointTwo.x,2)+Math.pow(pointOne.y-pointTwo.y,2)));                                                                     //radius
                circle.setLength(circle.getRadius()*Math.PI*2);
                circle.name = Drawings.Utils.generateCircleName(circle);
                paintPanel.model.addShape(circle);
            }
            else 
            if (item.type === 'triangle') {
                var pos2 = 0;
                var pointOneName = item.definition.substring(8, pos2 = item.definition.indexOf(",", 8));
                var pointOne = paintPanel.model.getPointByName(pointOneName);
                if (pointOne == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointOneName){
                            pointOne = new Drawings.Point(item.xCoord, item.yCoord);
                            pointOne.setName(item.name);
                            paintPanel.model.addPoint(pointOne);
                        }
                    });
                var pointTwoName = item.definition.substring(pos2 + 2, pos2 = item.definition.indexOf(",", pos2 + 3));
                var pointTwo = paintPanel.model.getPointByName(pointTwoName);
                if (pointTwo == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointTwoName){
                            pointTwo = new Drawings.Point(item.xCoord, item.yCoord);
                            pointTwo.setName(item.name);
                            paintPanel.model.addPoint(pointTwo);
                        }
                    });
                var pointThreeName = item.definition.substring(pos2 + 2, item.definition.length);
                var pointThree = paintPanel.model.getPointByName(pointThreeName);
                if (pointThree == null)
                    objects.forEach(function(item, i, objects) {
                        if (item.name == pointThreeName){
                            pointThree = new Drawings.Point(item.xCoord, item.yCoord);
                            pointThree.setName(item.name);
                            paintPanel.model.addPoint(pointThree);
                        }
                    });
                var segmentOneName1 = "Segment(" + pointOneName + ";" + pointTwoName + ")";
                var segmentOneName2 = "Segment(" + pointTwoName + ";" + pointOneName + ")";
                var segmentOne = paintPanel.model.getShapeByName(segmentOneName1);
                if (segmentOne == null)
                {
                    segmentOne = paintPanel.model.getShapeByName(segmentOneName2);
                    if(segmentOne == null)
                        objects.forEach(function(item, i, objects) {
                            if (item.name == segmentOneName1){
                                segmentOne = new Drawings.Segment(pointOne, pointTwo);
                                segmentOne.setName(item.name);
                                paintPanel.model.addShape(segmentOne);
                            }
                        });
                }
                var segmentTwoName1 = "Segment(" + pointOneName + ";" + pointThreeName + ")";
                var segmentTwoName2 = "Segment(" + pointThreeName + ";" + pointOneName + ")";
                var segmentTwo = paintPanel.model.getShapeByName(segmentTwoName1);
                if (segmentTwo == null)
                {
                    segmentTwo = paintPanel.model.getShapeByName(segmentTwoName2);
                    if(segmentTwo == null)
                        objects.forEach(function(item, i, objects) {
                            if (item.name == segmentTwoName1){
                                segmentTwo = new Drawings.Segment(pointOne, pointTwo);
                                segmentTwo.setName(item.name);
                                paintPanel.model.addShape(segmentTwo);
                            }
                        });
                }  
                var segmentThreeName1 = "Segment(" + pointTwoName + ";" + pointThreeName + ")";
                var segmentThreeName2 = "Segment(" + pointThreeName + ";" + pointTwoName + ")";
                var segmentThree = paintPanel.model.getShapeByName(segmentThreeName1);
                if (segmentThree == null)
                {
                    segmentThree = paintPanel.model.getShapeByName(segmentThreeName2);
                    if(segmentThree == null)
                        objects.forEach(function(item, i, objects) {
                            if (item.name == segmentThreeName1){
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
            }
     	});
        Drawings.ScTranslator.putModel(paintPanel.model);
    } 
};

function translateObjTypesToSc(type) {
    switch (type) {
        case 'point': {
            return 'concept_geometric_point';
            break;
        }
        case 'line': {
            return 'concept_straight_line';
            break;
        }
        case 'segment': {
            return 'concept_segment';
            break;
        }
        case 'triangle': {
            return 'concept_triangle';
            break;
        }
        case 'circle': {
            return 'concept_circle';
            break;
        }
        case 'angle': {
            return 'concept_angle';
        }
        case 'polygon': {
            return 'concept_polygon';
        }
        default: {
            return 'concept_geometric_figure';
        }
    }
}

function addObjectListener(objName) {
    var objects = ggbApplet.getObjectType(objName) === 'point'
        ? this.Drawings.PaintPanel.paintPoints
        : this.Drawings.PaintPanel.paintObjects;
    var object = ggbApplet.getObjectType(objName) === 'point' ?
    {
        'name': objName,
        'type': ggbApplet.getObjectType(objName),
        'xCoord': ggbApplet.getXcoord(objName),
        'yCoord': ggbApplet.getYcoord(objName),
        'zCoord': ggbApplet.getZcoord(objName),
        'value': ggbApplet.getValueString(objName),
        'definition': ggbApplet.getDefinitionString(objName)
    }
    : {
        'name': objName,
        'type': ggbApplet.getObjectType(objName),
        'value': ggbApplet.getValueString(objName),
        'definition': ggbApplet.getDefinitionString(objName)
    };
    objects.splice(objects, 0, object);
    console.log(objects);
    $('#objects_button').append("<button type='button' id='" + objName + "' class='obj_button sc-no-default-cmd'></button>");
    var type = object.type;
-   var scNode = translateObjTypesToSc(type);
    var nodes;
    SCWeb.core.Server.resolveScAddr([scNode], function (keynodes) {
            nodes = keynodes;
            nodes[type] = keynodes[scNode];
-            $('#' + objName).attr('sc_addr', nodes[type]);
        }
    );
    $('#' + objName).attr('sc_addr', nodes.point);
    setTimeout(function(){
        var number;
        objects.forEach(function(item, i) {
            if (item.name == objName) {
                number = objects.length - (i + 1);
            }
        });
        var elem = $('.elem')[number];
        var margin = ($(elem).outerHeight(true) - 20);
        $('#' + objName).css('margin', margin + 'px 0px');
        $('.marblePanel').css('display', 'none');
    }, 200);
};
function removeObjectListener(objName) {
    var objects = ggbApplet.getObjectType(objName) === 'point'
        ? this.Drawings.PaintPanel.paintPoints
        : this.Drawings.PaintPanel.paintObjects;
    objects.forEach(function(item, i, objects) {
        if (item.name === objName) {
            objects.splice(i, 1);
        }
    });
    console.log('objName', objects);
    $('#' + objName).remove();
}
function renameObjectListener(oldObjName, newObjName) {
    var objects = ggbApplet.getObjectType(objName) === 'point'
        ? this.Drawings.PaintPanel.paintPoints
        : this.Drawings.PaintPanel.paintObjects;
    objects.forEach(function(item, i, objects) {
        if (item.name === oldObjName) {
            item.name = newObjName;
        }
    });
    console.log('objName', objects);
    $('#' + oldObjName).text(nexObjName);
}
function updateObjectListener(objName) {
    var objects = ggbApplet.getObjectType(objName) === 'point'
        ? this.Drawings.PaintPanel.paintPoints
        : this.Drawings.PaintPanel.paintObjects;
    objects.forEach(function(item, i, objects) {
        if (item.name === objName) {
            item.type = ggbApplet.getObjectType(objName);
            item.xCoord = ggbApplet.getXcoord(objName);
            item.yCoord = ggbApplet.getYcoord(objName);
            item.zCoord = ggbApplet.getZcoord(objName);
            item.value = ggbApplet.getValueString(objName);
            item.definition = ggbApplet.getDefinitionString(objName);
        }
    });
    console.log('objName', objects);
}

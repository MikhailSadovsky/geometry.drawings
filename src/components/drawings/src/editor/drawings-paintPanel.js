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

        //this.board = this._createBoard();

        //this._configureModel();

        this.controller = new Drawings.Controller(this, this.model);

        this.rendererMap["Point"] = new Drawings.PointRenderer(this.board);
        this.rendererMap["Line"] = new Drawings.LineRenderer(this.board);
        this.rendererMap["Segment"] = new Drawings.SegmentRenderer(this.board);
        this.rendererMap["Triangle"] = new Drawings.TriangleRenderer(this.board);
        this.rendererMap["Polygon"] = new Drawings.PolygonRenderer(this.board);
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
        editor.append("<button type='button' id='applet2d' class='btn btn-success sc-no-default-cmd'>2D</button>");
        var applet2d = $('#applet2d');
        SCWeb.core.Server.resolveScAddr(['ui_applet2d',
            ], function (keynodes) {
                applet2d.attr("sc_addr", keynodes['ui_applet2d']);
        });
        editor.append("<button type='button' id='applet3d' class='btn btn-success sc-no-default-cmd'>3D</button>");
        var applet3d = $('#applet3d');
        SCWeb.core.Server.resolveScAddr(['ui_applet3d',
            ], function (keynodes) {
                applet3d.attr("sc_addr", keynodes['ui_applet3d']);
        });
        editor.append("<div id='applet_container'></div>");
        this._initGeometryApplet();       
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
            "useBrowserForJS":false,
            "allowStyleBar":false};
        var applet = new GGBApplet(parameters, '5.0', 'applet_container');
        applet.inject('applet_container');
        $('#applet2d').click(function(event) {
            ggbApplet.setPerspective('2');
            ggbApplet.setLogging('true');
        });
        $('#applet3d').click(function() {
            ggbApplet.setPerspective('5');
        })
    }
};

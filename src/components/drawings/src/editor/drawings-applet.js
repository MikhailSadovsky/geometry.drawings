/**
 * sc applet.
 */
Drawings.Applet = {
    initApplet: function() {
        var parameters = {
            "id": "ggbApplet",
            "showToolBar": true,
            "borderColor": null,
            "showMenuBar": false,
            "showAlgebraInput": false,
            "showResetIcon": true,
            "showTutorialLink": false,
            "showLogging": true,
            "enableLabelDrags": true,
            "enableShiftDragZoom": true,
            "enableRightClick": true,
            "enableDialogActive": true,
            "capturingThreshold": null,
            "showToolBarHelp": false,
            "errorDialogsActive": true,
            "useBrowserForJS": true,
            "allowStyleBar": false
        };
        var applet = new GGBApplet(parameters, '5.0');

        applet.inject('applet_container');
        $('#applet2d').click(function(event) {
            ggbApplet.setPerspective('2');
        });
        $('#applet3d').click(function() {
            ggbApplet.setPerspective('5');
        });
    },
    addListeners: function() {
        var applet = document.ggbApplet;
        applet.registerAddListener('addObjectListener');
        applet.registerRemoveListener('removeObjectListener');
        applet.registerRenameListener('renameObjectListener');
        applet.registerUpdateListener('updateObjectListener');
    }
}
Drawings.Applet.drawFigures = [];
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
    if (object.type === 'polygon' && +object.definition.substr(20, 1) == 4) {
        object.type = 'square';
    }
    objects.splice(objects, 0, object);
    Drawings.Applet.drawFigures.splice(Drawings.Applet.drawFigures, 0, object);
    $('#objects_button').append("<button type='button' id='" + objName + "' class='obj_button sc-no-default-cmd'></button>");
    var type = object.type;
    var scNode = translateObjTypesToSc(type);
    var nodes;
    SCWeb.core.Server.resolveScAddr([scNode], function (keynodes) {
            nodes = keynodes;
            nodes[type] = keynodes[scNode];
            $('#' + objName).attr('sc_addr', nodes[type]);
        }
    );
    if (object.type === 'circle') {
        document.ggbApplet.evalCommand('Segment[' + object.definition.substr(29,1) + ',' + object.definition.substr(45,1) + ']')
    }
    setTimeout(function() {correctGeogebraStyles(objName)}, 10);
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
            if (item.type !== 'square') {
                item.type = ggbApplet.getObjectType(objName);
            }
            item.xCoord = ggbApplet.getXcoord(objName);
            item.yCoord = ggbApplet.getYcoord(objName);
            item.zCoord = ggbApplet.getZcoord(objName);
            item.value = ggbApplet.getValueString(objName);
            item.definition = ggbApplet.getDefinitionString(objName);
        }
    });
    console.log('objName', objects);
}
function correctGeogebraStyles(objName) {
    var number;
    Drawings.Applet.drawFigures.forEach(function(item, i) {
        if (item.name == objName) {
            number = Drawings.Applet.drawFigures.length - (i + 1);
        }
    });
    var elem = $('.elem')[number];
    var margin = ($(elem).outerHeight(true) - 20);
    $('#' + objName).css('margin', margin - 2 + 'px 0px ' + margin / 2 + 'px');
    $('.marblePanel').css('display', 'none');
}
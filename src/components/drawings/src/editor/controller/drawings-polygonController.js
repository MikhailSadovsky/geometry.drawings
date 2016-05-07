/**
 * Polygon controller.
 */

Drawings.PolygonController = function (model) {
    this.model = model;
};

Drawings.PolygonController.prototype = {

    handleContextMenuEvent: function (jxgPolygon, event) {
        var polygon = this.model.getShape(jxgPolygon.id);
        var controller = this;
        var contextMenu = new Drawings.ContextMenu('#' + jxgPolygon.rendNode.id, event);

        var setNameMenuItem = {
            text: 'Задать имя',
            action: function () {
                controller._setNameAction(polygon);
            }
        };

        var setPerimeterMenuItem = {
            text: 'Задать периметр',
            action: function () {
                controller._setPerimeterAction(polygon);
            }
        };

// 
//
// 
        var setAsMamkuMenuItem = {
            text: 'Отделать как твою мамку',
            action: function () {
            }
        };

        contextMenu.show([setNameMenuItem, setPerimeterMenuItem, setAsMamkuMenuItem]);
    },

    handleContextDefinitionMenuEvent: function (event){
        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'polygonDefinition', event);
        var setDefinitionMenuItem = {
            text: 'Просмотр определения',
            action: function(){
                var addr;
                var attr;
                SCWeb.core.Server.resolveScAddr(['rrel_finding_definition'], function (keynodes) {
                    attr = keynodes['rrel_finding_definition'];
                });
                SCWeb.core.Server.resolveScAddr(['concept_triangle'], function (keynodes) {
                    addr = keynodes['concept_polygon'];
                    SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_definitions"],
                        function (data) {
                            var cmd = data["ui_menu_file_for_finding_definitions"];
                            SCWeb.core.Server.doCommand(cmd,
                                [addr], function (result) {
                                    if (result.question != undefined) {
                                        var date = new Date();
                                        var curDate = null;
                                        do {curDate = new Date();}
                                        while (curDate-date < 3000);
                                        window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
                                            addr,
                                            sc_type_arc_pos_const_perm,
                                            sc_type_link,
                                            sc_type_arc_pos_const_perm,
                                            attr]).
                                            done(function(linkNode){
                                                window.sctpClient.get_link_content(linkNode[0][2], 'string').done(function(content)
                                                {
                                                    $('#textArea').val(content);
                                                });
                                            });
                                    }
                                });
                        });
                });
            }

        }
        contextDefinitionMenu.show([setDefinitionMenuItem]);
    },

    _setNameAction: function (polygon) {
        var name = prompt('Введите имя многоугольника:');

        if (name != null) {
            polygon.setName(name);
            this.model.updated([polygon]);
        }
    },

    _setPerimeterAction: function (polygon) {
        var perimeter = prompt('Введите периметр многоугольника:');

        if (perimeter != null) {
            polygon.setPerimeter(perimeter);
            this.model.updated([polygon]);
        }
    },

    _setSquareAction: function (polygon) {
        var square = prompt('Введите площадь многоугольника:');

        if (square != null) {
            polygon.setSquare(square);
            this.model.updated([polygon]);
        }
    }
};
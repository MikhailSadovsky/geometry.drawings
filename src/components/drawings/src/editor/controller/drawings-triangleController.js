/**
 * Triangle controller.
 */

Drawings.TriangleController = function (model) {
    this.model = model;
};

Drawings.TriangleController.prototype = {

    handleContextMenuEvent: function (jxgTriangle, event) {
        var triangle = this.model.getShape(jxgTriangle.id);

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + jxgTriangle.rendNode.id, event);

        var setSquareMenuItem = {
            text: 'Задать площадь',
            action: function () {
                controller._setSquareAction(triangle);
            }
        };

        var setPerimeterMenuItem = {
            text: 'Задать периметр',
            action: function () {
                controller._setPerimeterAction(triangle);
            }
        };

        contextMenu.show([setSquareMenuItem, setPerimeterMenuItem]);
    },

    handleContextDefinitionMenuEvent: function (event){

        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'triangleDefinition', event);
        var setDefinitionMenuItem = {
            text: 'Просмотр определения',
            action: function(){
                window.sctpClient.get_link_content(4237623297,'string').done(function(content)
                {

                    $('#textArea').val(content);
                });
            }
        }
        contextDefinitionMenu.show([setDefinitionMenuItem]);
    },

    _setPerimeterAction: function (triangle) {
        var perimeter = prompt('Введите периметр треугольника:');

        if (perimeter != null) {
            triangle.setPerimeter(perimeter);
            this.model.updated([triangle]);
        }
    },

    _setSquareAction: function (triangle) {
        var square = prompt('Введите площадь треугольника:');

        if (square != null) {
            triangle.setSquare(square);
            this.model.updated([triangle]);
        }
    }
};
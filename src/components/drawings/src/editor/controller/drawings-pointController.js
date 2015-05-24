/**
 * Point controller.
 */

Drawings.PointController = function (model) {
    this.model = model;
};

Drawings.PointController.prototype = {

    handleContextMenuEvent: function (jxgPoint, event) {
        var point = this.model.getPoint(jxgPoint.id);

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + jxgPoint.rendNode.id, event);


        var setNameMenuItem = {
            text: 'Задать имя точки',
            action: function () {
                controller._setNameAction(point);
            }
        };

        contextMenu.show([setNameMenuItem]);
    },

    handleContextDefinitionMenuEvent: function (event){

        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'pointDefinition', event);
        var setDefinitionMenuItem = {
            text: 'Просмотр определения',
            action: function(){
                window.sctpClient.get_link_content(1620377601,'string').done(function(content)
                {

                    $('#textArea').val(content);
                });
            }
        }
        contextDefinitionMenu.show([setDefinitionMenuItem]);
    },

    _setNameAction: function (point) {
        var name = prompt('Введите имя точки:');

        if (name != null) {
            point.setName(name);
            this.model.updated([point]);
        }
    }
};
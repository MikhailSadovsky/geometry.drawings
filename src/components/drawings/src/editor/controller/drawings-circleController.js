Drawings.CircleController = function(model) {
    this.model = model;
};

Drawings.CircleController.prototype = {

    handleContextMenuEvent: function (jxgCircle, event) {
        var circle = this.model.getShape(jxgCircle.id);

        var controller = this;

        var contextMenu = new Drawings.ContextMenu('#' + jxgCircle.rendNode.id, event);

        var setRadiusMenuItem = {
            text: 'Задать радиус',
            action: function () {
                controller._setRadiusAction(circle);
            }
        };
        var setLengthMenuItem = {
            text: 'Задать длину окружости',
            action: function () {
                controller._setLengthAction(circle);
            }
        };
        contextMenu.show([setRadiusMenuItem, setLengthMenuItem]);
    },

    handleContextDefinitionMenuEvent: function (event){

        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'circleDefinition', event);
        var setDefinitionMenuItem = {
            text: 'Просмотр определения',
            action: function(){
                window.sctpClient.get_link_content(565510145,'string').done(function(content)
                {

                    $('#textArea').val(content);
                });
            }
        }
        contextDefinitionMenu.show([setDefinitionMenuItem]);
    },

    _setRadiusAction: function (circle) {
        var radiusLength = prompt('Введите длину радиуса');

        if (radiusLength != null) {
            circle.setRadius(radiusLength);
            this.model.updated([circle]);
        }
    },
    _setLengthAction: function (circle) {
        var length = prompt('Введите длину окружности:');
        if (length != null) {
            circle.setLength(length);
            this.model.updated([circle]);
        }
    }
}
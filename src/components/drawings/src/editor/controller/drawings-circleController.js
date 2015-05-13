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

        contextMenu.show([setRadiusMenuItem]);
    },

    _setRadiusAction: function (circle) {
        var radiusLength = prompt('Введите длину радиуса');
        
        if (radiusLength != null) {
            //todo checking points
            this.model.updated([circle]);
        }
    }
};
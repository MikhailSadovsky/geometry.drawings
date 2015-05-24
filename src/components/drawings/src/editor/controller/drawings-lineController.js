/**
 * Created by qosmio on 24.05.15.
 */
Drawings.LineController = function(model) {
    this.model = model;
};

Drawings.LineController.prototype = {

    handleContextDefinitionMenuEvent: function (event){

        var contextDefinitionMenu = new Drawings.ContextMenu('#' + 'lineDefinition', event);
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
    }

}

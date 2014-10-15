/**
 * Drawings component.
 */
 
 GeomDrawComponent = {
    ext_lang: 'geometry_code',
    formats: ['format_geometry_json'],
    factory: function(sandbox) {
        return new geomDrawWindow(sandbox);
    }
};

var geomDrawWindow = function(sandbox) {

    this.domContainer = sandbox.container;
    this.sandbox = sandbox;
    
    this.model = new Drawings.Model();
    this.paintPanel = new Drawings.PaintPanel(this.domContainer, this.model);
    this.paintPanel.init();

    this.recieveData = function(data) {
        /// @todo Process data - json file data
    };
    
    this.eventStructUpdate = function(added, element, arc) {
        window.sctpClient.get_arc(arc).done(function (r) {
            /// @todo Process r.result[1] - element in contour
        });
    };

    // delegate event handlers
    this.sandbox.eventDataAppend = $.proxy(this.receiveData, this);
    this.sandbox.eventStructUpdate = $.proxy(this.eventStructUpdate, this);

    this.sandbox.updateContent();
};



SCWeb.core.ComponentManager.appendComponentInitialize(GeomDrawComponent);


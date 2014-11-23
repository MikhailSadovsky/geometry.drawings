/**
 * sc translator.
 */

Drawings.ScTranslator = {

    // temporary solution for keeping KB clean
    wipeOld: function() {
        //find 'big_red_node' that contains all new data and wipe out contents
	var addr = 0;
	window.sctpClient.find_element_by_system_identifier("big_red_node").done(function(r){
		if(r.resCode != SctpResultCode.SCTP_RESULT_OK)
		{
			alert("can't resolve big_red_node");
			throw "Can't resolve node";
		}	
		
		alert("resolved: " + r.result);
		this.addr = r.result;
	});

    //var dfd = new jQuery.Deferred();
    
    this.sctp_client.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A,
                                      [
                                          addr,
                                          sc_type_arc_pos_const_perm,
                                          sc_type_node | sc_type_const
                                      ])
    .done(function (res) {
        var langs = [];
        
        for (r in res.result) {
            langs.push(res.result[r][2]);
        }
        
        dfd.resolve(langs);
        
    }).fail(function () {
        dfd.reject();
    });
    
    return dfd.promise();


	alert("wipeOld completed");
	    
    },

    putPoint: function (point) {
	//	if (point.hasOwnProperty("sc_addr") && point.sc_addr != 'null')
	//TODO: add existence check if needed	
	if (point.sc_addr) 
	{
		return point.sc_addr;
	}
        //else
	//{
	//	window.sctpClient.create_node(scg-type-node-const).done(function (r) 
	//	{
        //            point.setScAddr(r.result);
        //        //    point.setObjectState(SCgObjectState.NewInMemory);//not used yet
        //            
        //        });
	//	return point.sc_addr;
        //}
        return "sc_addr";
    },

    putShape: function (shape) {
        return "sc_addr";
    },

    putModel: function (model) {
	//cleanup
	this.wipeOld();

	//foreach point create sc-node and add sc_addr
	//foreach shape add shape-defined nodes and arcs
	alert("started");
	for (var i = 0; i < model.points.length; i++) 
	{
		var el = model.points[i];
        	this.putPoint(el);
	}
	
	alert("completed");
        
    }    

};

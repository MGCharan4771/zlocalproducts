sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("zlocalproducts.controller.Detail", {
        
        onInit() {

        },
        onPressNavBack : function(){
            var oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("RouteHomeView")
        }
    });
});
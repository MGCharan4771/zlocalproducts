sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("zlocalproducts.controller.Detail", {
        onInit() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this.onRouteMatched, this);

            var DetailModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(DetailModel, "DetailModel");
        },
        onRouteMatched: function (oEvent) {
            var matno = oEvent.getParameter("arguments").matnumber;
            var oModel = this.getView().getModel();
            var DetailModel = this.getView().getModel("DetailModel")
            sap.ui.core.BusyIndicator.show()
            oModel.read("/Material_DetSet('" + matno + "')", {
                urlParameters: {
                    "$expand": "mattransportdetnav"
                },
                success: function (response) {
                    console.log(response);
                    DetailModel.setProperty("/", response);
                    DetailModel.updateBindings(true)
                    sap.ui.core.BusyIndicator.hide()
                },
                error: function (error) {
                    console.log(error)
                    sap.ui.core.BusyIndicator.hide()
                }
            })
        },
        onPressNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("RouteHomeView")
        },
        onPressUpdate: function () {
            var DetailModel = this.getView().getModel("DetailModel");
            var DetailModelData = DetailModel.getData();
            var oModel = this.getView().getModel();

            var payload = {
                Mat_No: DetailModelData.Mat_No,
                Mat_Des: DetailModelData.Mat_Des,
                Industry: DetailModelData.Industry,
                Mat_Group: DetailModelData.Mat_Group
            }
            sap.ui.core.BusyIndicator.show()
            oModel.update("/Material_DetSet('" + payload.Mat_No + "')", payload, {
                success: function (response) {
                    console.log(response);
                    sap.ui.core.BusyIndicator.hide()
                    MessageBox.success("This Record is Updated Successfully")
                },
                error: function (error) {
                    console.log(error)
                    sap.ui.core.BusyIndicator.hide()
                }
            })
        }
    });
});
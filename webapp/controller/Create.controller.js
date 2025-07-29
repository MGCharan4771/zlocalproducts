sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("zlocalproducts.controller.Create", {
        onInit() {
            var CreateModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(CreateModel, "CreateModel")
            var oLineitem = {
                aLineitems: [
                    {
                        Mfg_No: "",
                        Net_Content: "",
                        Packag_Mat: "",
                        Trans_Group: "",
                        Supply_Source: "",
                        Strg_Condition: ""
                    }
                ]
            }

            var LineitemModel = new sap.ui.model.json.JSONModel(oLineitem);
            this.getView().setModel(LineitemModel, "LineitemModel")
        },
        onPressAdd: function () {
            var LineitemModel = this.getView().getModel("LineitemModel");
            var LineitemModelData = LineitemModel.getData();

            var obj = {
                Mfg_No: "",
                Net_Content: "",
                Packag_Mat: "",
                Trans_Group: "",
                Supply_Source: "",
                Strg_Condition: ""
            }
            LineitemModelData.aLineitems.push(obj);
            LineitemModel.updateBindings(true)
        },
        onPressDelete: function (oEvent) {
            var LineitemModel = this.getView().getModel("LineitemModel");
            var LineitemModelData = LineitemModel.getData().aLineitems;
            var selected = oEvent.getSource().sId.split("-")[2];
            var index = Number(selected);
            LineitemModelData.splice(index, 1);
            LineitemModel.updateBindings(true)
        }
    });
});
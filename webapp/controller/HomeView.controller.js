sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "zlocalproducts/model/formatter"
], (Controller, MessageBox, MessageToast, Filter, FilterOperator, Sorter, formatter) => {
    "use strict";

    return Controller.extend("zlocalproducts.controller.HomeView", {
        format: formatter,
        onInit() {

            let MaterialModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(MaterialModel, "MaterialModel");

        },
        onBeforeRendering() {
            // MessageBox.success("Before")
        },
        onAfterRendering() {
            // MessageBox.success("After")
        },
        onExit() {

        },
        onPressValidate: function (oEvent) {
            let FirstnameInput = this.getView().byId("idFirstName"),
                FirstNameValue = FirstnameInput.getValue(),
                LastNameValue = this.getView().byId("idLastName").getValue(),
                BranchValue = this.getView().byId('idBranch')._getSelectedItemText();

            let i18nModel = this.getView().getModel("i18n");
            let validatedText = i18nModel.getResourceBundle().getText("validated");

            if (FirstNameValue && LastNameValue && BranchValue) {
                MessageBox.success(validatedText)
            } else {
                if (FirstNameValue !== '') {
                    FirstnameInput.setValueState("Success")
                } else {
                    FirstnameInput.setValueState("Error")
                    FirstnameInput.setValueStateText("This is Mandatory Field Please Provide Value")
                }
                if (LastNameValue !== '') {
                    this.getView().byId("idLastName").setValueState("Information")
                } else {
                    this.getView().byId("idLastName").setValueState("Warning")
                }
            }
        },
        onSearch: function () {
            let oModel = this.getView().getModel(),
                MaterialModel = this.getView().getModel("MaterialModel"),
                matno = this.getView().byId("idmatno").getValue(),
                matdesc = this.getView().byId("idmatdesc").getValue(),
                type = this.getView().byId("idType")._getSelectedItemText(),
                aFilters = [];

            if (matno) {
                var prdidFilterValue = new Filter("Mat_No", FilterOperator.EQ, matno);
                aFilters.push(prdidFilterValue)
            }
            if (matdesc) {
                var prdnameFilterValue = new Filter("Mat_Des", FilterOperator.Contains, matdesc);
                aFilters.push(prdnameFilterValue)
            }
            if (type) {
                aFilters.push(new Filter("Mat_Type", FilterOperator.EQ, type))
            }

            // let table = this.getView().byId("idTable");
            // table.getBinding("items").filter(aFilters);

            sap.ui.core.BusyIndicator.show()
            oModel.read("/Material_DetSet", {
                filters: aFilters,
                success: function (response) {
                    console.log(response);
                    MaterialModel.setProperty("/", response);
                    MaterialModel.updateBindings(true);
                    sap.ui.core.BusyIndicator.hide()
                },
                error: function (error) {
                    console.log(error);
                    sap.ui.core.BusyIndicator.hide()
                }
            });

        },
        onPrdidVH: function () {
            if (!this.Dialog) {
                this.Dialog = sap.ui.xmlfragment("zlocalproducts.fragments.prdidVH", this);
                this.getView().addDependent(this.Dialog);
            }
            this.Dialog.open();
        },
        onprdnameVH: function () {
            if (!this.PrdNameDialog) {
                this.PrdNameDialog = sap.ui.xmlfragment("zlocalproducts.fragments.prdnameVH", this);
                this.getView().addDependent(this.PrdNameDialog);
            }
            this.PrdNameDialog.open();
        },
        onCloseDialog: function () {
            if (this.Dialog) {
                this.Dialog.close();
            }
            if (this.PrdNameDialog) {
                this.PrdNameDialog.close();
            }
        },
        onSelectRow: function (oEvent) {
            let selobj = oEvent.getSource().getBindingContext().getObject();
            // let selPrdId = selobj.prdid;
            // let selPrdname = selobj.prdname;

            const { prdid, prdname } = selobj;

            this.getView().byId("idprdid").setValue(prdid);
            this.getView().byId("idprdname").setValue(prdname)
            this.onCloseDialog();
        },
        onPressRow: function (oEvent) {
            var selobj = oEvent.getSource().getBindingContext("MaterialModel").getObject();

            var oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("RouteDetail", {
                matnumber: selobj.Mat_No
            })
        },
        onPressCreate: function () {
            var oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("RouteCreate")
        },
        onPressDelete: function (oEvent) {
            var selobj = oEvent.getSource().getBindingContext("MaterialModel").getObject();
            var matnumber = selobj.Mat_No;
            var oModel = this.getView().getModel();
            // oModel.remove("/Material_DetSet('" + matnumber + "')", {
            //     success: function (response) {
            //         console.log(response);
            //         this.onSearch();
            //     }.bind(this),
            //     error: function (error) {
            //         console.log(error)
            //     }
            // });

            MessageBox.confirm("Are you sure want to delete?", {
                title: 'Deletion Confirmation',
                onClose: function (Action) {
                    if (Action === 'OK') {
                        oModel.remove("/Material_DetSet('" + matnumber + "')", {
                            success: function (response) {
                                console.log(response);
                                this.onSearch();
                            }.bind(this),
                            error: function (error) {
                                console.log(error)
                            }
                        });
                    }
                },
                actions: [sap.m.MessageBox.Action.OK,sap.m.MessageBox.Action.CANCEL],         
                emphasizedAction: sap.m.MessageBox.Action.OK
            })
        }
    });
});
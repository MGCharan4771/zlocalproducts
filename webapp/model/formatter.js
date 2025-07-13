sap.ui.define([
],
    function () {
        "use strict";

        return {
            formatprdprice: function (Status) {
                if (Status == 'Available') {
                    return "Success"
                } else if (Status == 'Not Available') {
                    return "Error"
                } else if (Status == 'Shipping') {
                    return "Warning"
                } else if (Status == 'Delivered') {
                    return "Information"
                }
            },
            formatprdname: function(Name){
                return Name.toUpperCase();
            }
        };
    });
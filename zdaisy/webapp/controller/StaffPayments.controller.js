sap.ui.define (
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    '../model/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    Filter,
    FilterOperator,
    Fragment,
    Sorter
  ) {
    'use strict';
    return BaseController.extend (
      'sap.com.sapport.zdaisy.controller.StaffPayments',
      {
        formatter: formatter,

        onInit: async function () {
          const result = await this._getProfile ();

          const oViewModel = new JSONModel (result.results);
          this.getView ().setModel (oViewModel, 'StaffPaymentsView');
        },

        _getProfile: async function () {
          try {
            return await this.getOModel ('read', '/StaffPaymentsSet', {}, null);
          } catch (e) {
            MessageBox.error (JSON.parse (e.responseText).error.message.value);
          }
        },

        onFilterButtonPressed () {
          //Load and display the filter dialog
          if (!this._oFilterDialog) {
            Fragment.load ({
              id: this.getView ().getId (),
              name: 'sap.com.sapport.zdaisy.view.fragments.FilterStaffPaymentsDialog',
              controller: this,
            }).then (oDialog => {
              this._oFilterDialog = oDialog;
              this.getView ().addDependent (this._oFilterDialog);
              oDialog.open ();
            });
          } else {
            this._oFilterDialog.open ();
          }
        },

        onLiveSearchPersonalTable: function (oEvent) {
          var aFilter = [];
          var sValue = oEvent.getParameter ('newValue'),
            oList = this.getView ().byId ('idStaffPaymentsList'),
            oBinding = oList.getBinding ('items');

          if (sValue) {
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Fullname',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );

            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Pernr',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Title',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Unit',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Persatxt',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Btrtltxt',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );

            var oFinalFilter = new sap.ui.model.Filter ({
              filters: aFilter,
              and: false,
            });

            this.getView ()
              .byId ('idStaffPaymentsList')
              .getBinding ('items')
              .filter (oFinalFilter);
          }
        },
        onExcelButtonPressed: function () {
          var rows = [];

          var oList = this.getView ().byId ('idStaffPaymentsList');
          var aItems = oList.getItems ();

          aItems.forEach (item => {
            var oBindingContext = item.getBindingContext ('StaffPaymentsView');
            var oObject = oBindingContext.getObject ();
            rows.push (oObject);
          });

          const worksheet = XLSX.utils.json_to_sheet (rows);
          const workbook = XLSX.utils.book_new ();
          XLSX.utils.book_append_sheet (workbook, worksheet, 'Personel Sheet');
          XLSX.writeFile (workbook, 'Personel_Data.xlsx', {compression: true});
        },

        onConfirmFilter: function (oEvent) {
          var oModel = this.getView ().getModel ();
          var oEntitySet = '/StaffPaymentsSet';

          const aFilter = [];

          const sBegDate = this.getView ().byId ('idBegDatePicker').getValue ();
          const sEndDate = this.getView ()
            .byId ('idPeriodSelect')
            .getSelectedKey ();

          if (sBegDate) {
            aFilter.push (
              new Filter ('Begda', sap.ui.model.FilterOperator.GE, sBegDate)
            );
          }

          if (sEndDate) {
            aFilter.push (
              new Filter ('Endda', sap.ui.model.FilterOperator.GE, sEndDate)
            );
          }

          oModel.read (oEntitySet, {
            filters: aFilter,
            success: async function (oData) {
              const oViewModel = await new JSONModel (oData.results);
              this.getView ().setModel (oViewModel, 'StaffPaymentsView');
            }.bind (this),
            error: function (oError) {},
          });
        },
      }
    );
  }
);

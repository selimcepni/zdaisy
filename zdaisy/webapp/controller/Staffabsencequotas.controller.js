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
      'sap.com.sapport.zdaisy.controller.Staffabsencequotas',
      {
        formatter: formatter,

        onInit: async function () {
          debugger;
          const result = await this._getProfile ();

          const oViewModel = new JSONModel (result.results);
          this.getView ().setModel (oViewModel, 'StaffabsencequotasView');
        },

        _getProfile: async function () {
          try {
            return await this.getOModel (
              'read',
              '/StaffabsencequotasSet',
              {},
              null
            );
          } catch (e) {
            MessageBox.error (JSON.parse (e.responseText).error.message.value);
          }
        },

        onFilterButtonPressed () {
          //Load and display the filter dialog
          if (!this._oFilterDialog) {
            Fragment.load ({
              id: this.getView ().getId (),
              name: 'sap.com.sapport.zdaisy.view.fragments.FilterAbsencesDialog',
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
            oList = this.getView ().byId ('idAbsencequotasList'),
            oBinding = oList.getBinding ('items');

          if (sValue) {
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Firstname',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Lastname',
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
                path: 'Substafffield',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Stafffield',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );

            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Ktext',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Ktart',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );

            var oFinalFilter = new sap.ui.model.Filter ({
              filters: aFilter,
              and: false,
            });

            this.getView ()
              .byId ('idAbsencequotasList')
              .getBinding ('items')
              .filter (oFinalFilter);
          }
        },
        onLiveSearchPersonalTable2: function (oEvent) {
          var aFilter = [];
          var sValue = oEvent.getParameter ('newValue'),
            oList = this.getView ().byId ('idAbsencequotasList2'),
            oBinding = oList.getBinding ('items');

          if (sValue) {
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Firstname',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Lastname',
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
                path: 'Substafffield',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Stafffield',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );

            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Ktext',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );
            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Ktart',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );

            var oFinalFilter = new sap.ui.model.Filter ({
              filters: aFilter,
              and: false,
            });

            this.getView ()
              .byId ('idAbsencequotasList2')
              .getBinding ('items')
              .filter (oFinalFilter);
          }
        },
        onExcelButtonPressed: function () {
          var rows = [];

          var oList = this.getView ().byId ('idAbsencequotasList');
          var aItems = oList.getItems ();

          aItems.forEach (item => {
            var oBindingContext = item.getBindingContext (
              'StaffabsencequotasView'
            );
            var oObject = oBindingContext.getObject ();
            rows.push (oObject);
          });

          const worksheet = XLSX.utils.json_to_sheet (rows);
          const workbook = XLSX.utils.book_new ();
          XLSX.utils.book_append_sheet (workbook, worksheet, 'Personel Sheet');
          XLSX.writeFile (workbook, 'Personel_Data.xlsx', {compression: true});
        },

        onConfirmFilter: function (oEvent) {
          // const aFilterItems = oEvent.getParameter('filterItems')
          // const sFilterString = oEvent.getParameter('filterString')
          var oModel = this.getView ().getModel ();
          var oEntitySet = '/StaffabsencequotasSet';

          const aFilter = [];

          // aFilterItems.forEach(item => {
          //   const [sPath, sOperator, sValue1, sValue2] = item.getKey().split('__')
          //   aFilter.push(new Filter(sPath, sOperator, sValue1, sValue2))
          // })

          const oBegDatePicker = this.getView ().byId ('idBegDatePicker');
          const oEndDatePicker = this.getView ().byId ('idEndDatePicker');

          const sBegDate = oBegDatePicker.getValue ();
          const sEndDate = oEndDatePicker.getValue ();

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
          debugger;
          oModel.read (oEntitySet, {
            filters: aFilter,
            success: async function (oData) {
              const oViewModel = await new JSONModel (oData.results);
              this.getView ().setModel (oViewModel, 'StaffabsencequotasView');
            }.bind (this),
            error: function (oError) {},
          });
        },
      }
    );
  }
);

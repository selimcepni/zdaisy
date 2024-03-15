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
      'sap.com.sapport.zdaisy.controller.Absences',
      {
        formatter: formatter,

        onInit: async function () {
          const result = await this._getProfile ();

          const oViewModel = new JSONModel (result.results);
          this.getView ().setModel (oViewModel, 'AbsencesView');
        },

        _getProfile: async function () {
          try {
            return await this.getOModel ('read', '/StaffAbsencesSet', {}, null);
          } catch (e) {
            MessageBox.error (JSON.parse (e.responseText).error.message.value);
          }
        },

        // beghandleChange: function (oEvent) {
        //   var oDP = oEvent.getSource()
        //   var sValue = oEvent.getParameter('value')
        //   var bValid = oEvent.getParameter('valid')

        //   var aFilters = []

        //   if (bValid) {
        //     var oModel = oDP.getModel()
        //     var oEntitySet = '/StaffAbsencesSet'

        //     var aDateFilters = [
        //       new sap.ui.model.Filter(
        //         'Begda',
        //         sap.ui.model.FilterOperator.GE,
        //         sValue
        //       )
        //     ]
        //     oModel.read(oEntitySet, {
        //       filters: aDateFilters,
        //       success: function (oData) {},
        //       error: function (oError) {}
        //     })
        //   }
        // },
        // endhandleChange: function (oEvent) {
        //   debugger
        //   var oDP = oEvent.getSource()
        //   var sValue = oEvent.getParameter('value')
        //   var bValid = oEvent.getParameter('valid')

        //   var aFilters = []

        //   if (bValid) {
        //     var oModel = oDP.getModel()
        //     var oEntitySet = '/StaffAbsencesSet'

        //     var aDateFilters = [
        //       new sap.ui.model.Filter(
        //         'Endda',
        //         sap.ui.model.FilterOperator.GE,
        //         sValue
        //       )
        //     ]
        //     oModel.read(oEntitySet, {
        //       filters: aDateFilters,
        //       success: function (oData) {},
        //       error: function (oError) {}
        //     })
        //   }
        // },

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
            oList = this.getView ().byId ('idAbsencesList'),
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

            aFilter.push (
              new sap.ui.model.Filter ({
                path: 'Awart',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue,
              })
            );

            var oFinalFilter = new sap.ui.model.Filter ({
              filters: aFilter,
              and: false,
            });

            this.getView ()
              .byId ('idAbsencesList')
              .getBinding ('items')
              .filter (oFinalFilter);
          }
        },
        onExcelButtonPressed: function () {
          var rows = [];

          var oList = this.getView ().byId ('idAbsencesList');
          var aItems = oList.getItems ();

          aItems.forEach (item => {
            var oBindingContext = item.getBindingContext ('AbsencesView');
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
          var oEntitySet = '/StaffAbsencesSet';

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
              this.getView ().setModel (oViewModel, 'AbsencesView');
            }.bind (this),
            error: function (oError) {},
          });
        },
      }
    );
  }
);

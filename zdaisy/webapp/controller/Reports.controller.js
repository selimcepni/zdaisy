sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    '../model/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter'
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
    'use strict'
    return BaseController.extend('sap.com.sapport.zdaisy.controller.Reports', {
      formatter: formatter,

      onInit: async function () {
        const result = await this._getReportsData()
        const oViewModel = new JSONModel(result.results)
        this.getView().setModel(oViewModel, 'ReportsView')
      },

      _getReportsData: async function () {
        try {
          let resultModel = await this.getOModel('read', '/ReportsSet', {})
          return JSON.parse(resultModel.results[0].jsonData)
        } catch (e) {
          MessageBox.error(JSON.parse(e.responseText).error.message.value)
        }
      },

      onFilterButtonPressed () {
        //Load and display the filter dialog
        if (!this._oFilterDialog) {
          Fragment.load({
            id: this.getView().getId(),
            name: 'sap.com.sapport.zdaisy.view.fragments.FilterReportsDialog',
            controller: this
          }).then(oDialog => {
            this._oFilterDialog = oDialog
            this.getView().addDependent(this._oFilterDialog)
            oDialog.open()
          })
        } else {
          this._oFilterDialog.open()
        }
      },

      // onLiveSearchPersonalTable: function (oEvent) {
      //   var aFilter = [];
      //   var sValue = oEvent.getParameter ('newValue'),
      //     oList = this.getView ().byId ('idStaffPaymentsList'),
      //     oBinding = oList.getBinding ('items');

      //   if (sValue) {
      //     aFilter.push (
      //       new sap.ui.model.Filter ({
      //         path: 'Fullname',
      //         operator: sap.ui.model.FilterOperator.Contains,
      //         value1: sValue,
      //       })
      //     );

      //     aFilter.push (
      //       new sap.ui.model.Filter ({
      //         path: 'Pernr',
      //         operator: sap.ui.model.FilterOperator.Contains,
      //         value1: sValue,
      //       })
      //     );
      //     aFilter.push (
      //       new sap.ui.model.Filter ({
      //         path: 'Title',
      //         operator: sap.ui.model.FilterOperator.Contains,
      //         value1: sValue,
      //       })
      //     );
      //     aFilter.push (
      //       new sap.ui.model.Filter ({
      //         path: 'Unit',
      //         operator: sap.ui.model.FilterOperator.Contains,
      //         value1: sValue,
      //       })
      //     );
      //     aFilter.push (
      //       new sap.ui.model.Filter ({
      //         path: 'Persatxt',
      //         operator: sap.ui.model.FilterOperator.Contains,
      //         value1: sValue,
      //       })
      //     );
      //     aFilter.push (
      //       new sap.ui.model.Filter ({
      //         path: 'Btrtltxt',
      //         operator: sap.ui.model.FilterOperator.Contains,
      //         value1: sValue,
      //       })
      //     );

      //     var oFinalFilter = new sap.ui.model.Filter ({
      //       filters: aFilter,
      //       and: false,
      //     });

      //     this.getView ()
      //       .byId ('idStaffPaymentsList')
      //       .getBinding ('items')
      //       .filter (oFinalFilter);
      //   }
      // },
      // onExcelButtonPressed: function () {
      //   var rows = [];

      //   var oList = this.getView ().byId ('idStaffPaymentsList');
      //   var aItems = oList.getItems ();

      //   aItems.forEach (item => {
      //     var oBindingContext = item.getBindingContext ('StaffPaymentsView');
      //     var oObject = oBindingContext.getObject ();
      //     rows.push (oObject);
      //   });

      //   const worksheet = XLSX.utils.json_to_sheet (rows);
      //   const workbook = XLSX.utils.book_new ();
      //   XLSX.utils.book_append_sheet (workbook, worksheet, 'Personel Sheet');
      //   XLSX.writeFile (workbook, 'Personel_Data.xlsx', {compression: true});
      // },

      onConfirmFilter: function (oEvent) {
        var oModel = this.getModel()
        var oEntitySet = '/ReportsSet'

        const aFilter = []
        const aFilterItems = oEvent.getParameter('filterItems')
        const sFilterString = oEvent.getParameter('filterString')
        const sBegDate = this.getView().byId('idBegDatePicker').getValue()
        const sEndDate = this.getView().byId('idEndDatePicker').getValue()
        const inputObj = {}

        aFilterItems.forEach(item => {
          const [sPath, sOperator, sValue1, sValue2] = item.getKey().split('__')

          inputObj.reports = sPath
        })

        if (sBegDate) {
          inputObj.Begda = sBegDate
        }

        if (sEndDate) {
          inputObj.Endda = sEndDate
        }

        const filterJson = JSON.stringify(inputObj)

        aFilter.push(
          new sap.ui.model.Filter(
            'jsonData',
            sap.ui.model.FilterOperator.EQ,
            filterJson
          )
        )

        oModel.read(oEntitySet, {
          filters: aFilter,
          success: async function (oData) {
            debugger
            let oViewModel = new JSONModel(
              JSON.parse(oData.results[0].jsonData)
            )

            const columns = oViewModel.getProperty('/column')
            const columname = oViewModel.getProperty('/columname')

            oViewModel = new JSONModel({
              data: JSON.parse(oData.results[0].jsonData).data
            })

            this.getView().setModel(oViewModel, 'dataView')

            columns.forEach((column, index) => {
              debugger
              const columnNameText = columname[index]?.COLUMNAME || ''
              this.getView()
                .byId('idReportsTable')
                .addColumn(
                  new sap.ui.table.Column({
                    label: new sap.m.Text({
                      text: columnNameText
                    }),
                    template: new sap.m.Text({
                      text: { path: 'dataView>' + column.COLUMN.toLowerCase() }
                    }),
                    width: '200px'
                  })
                )
            })
            this.getView()
              .byId('idReportsTable')
              .setModel(oViewModel, 'dataView>/data')
            this.getView().byId('idReportsTable').bindRows('dataView>/data')
          }.bind(this),

          error: function (oError) {
            console.error('Error reading data:', oError)
          }
        })
      }
    })
  }
)

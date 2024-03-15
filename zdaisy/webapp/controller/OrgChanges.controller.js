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

    return BaseController.extend(
      'sap.com.sapport.zdaisy.controller.OrgChanges',
      {
        formatter: formatter,

        onInit: async function () {
          const result = await this._getProfile()

          const oViewModel = new JSONModel(result.results)
          this.getView().setModel(oViewModel, 'OrgChangesView')
        },

        _getProfile: async function () {
          try {
            return await this.getOModel('read', '/OrgChangesSet', {}, null)
          } catch (e) {
            MessageBox.error(JSON.parse(e.responseText).error.message.value)
          }
        },

        onFilterButtonPressed () {
          //Load and display the filter dialog
          if (!this._oFilterDialog) {
            Fragment.load({
              id: this.getView().getId(),
              name: 'sap.com.sapport.zdaisy.view.fragments.FilterOrgChangesDialog',
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
        onSortButtonPressed () {
          //Load and display the sort dialog
          if (!this._oSortDialog) {
            Fragment.load({
              id: this.getView().getId(),
              name: 'sap.com.sapport.zdaisy.view.fragments.SortingOrgChangesDialog',
              controller: this
            }).then(oDialog => {
              this._oSortDialog = oDialog
              this.getView().addDependent(this._oSortDialog)
              oDialog.open()
            })
          } else {
            this._oSortDialog.open()
          }
        },
        onLiveSearchPersonalTable: function (oEvent) {
          var aFilter = []
          var sValue = oEvent.getParameter('newValue'),
            oList = this.getView().byId('idOrgChangesList'),
            oBinding = oList.getBinding('items')

          if (sValue) {
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Massgtxt',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Massntxt',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Orgehtxt',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Exorgehtxt',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Planstxt',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Persatxt',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Btrtltxt',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )

            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Ename',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Pernr',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )

            var oFinalFilter = new sap.ui.model.Filter({
              filters: aFilter,
              and: false
            })

            this.getView()
              .byId('idOrgChangesList')
              .getBinding('items')
              .filter(oFinalFilter)
          }
        },
        onExcelButtonPressed: function () {
          var rows = []

          var oList = this.getView().byId('idOrgChangesList')
          var aItems = oList.getItems()

          aItems.forEach(item => {
            var oBindingContext = item.getBindingContext('OrgChangesView')
            var oObject = oBindingContext.getObject()
            rows.push(oObject)
          })

          const worksheet = XLSX.utils.json_to_sheet(rows)
          const workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Personel Sheet')
          XLSX.writeFile(workbook, 'Personel_Data.xlsx', { compression: true })
        },

        onConfirmSort (oEvent) {
          // Get sort related event parameters
          const oSortItem = oEvent.getParameter('sortItem')
          const bDescending = oEvent.getParameter('sortDescending')

          // If there is a sort item selected, sort the list binding.
          // Else, sort by empty array to reset any existing sorting.
          this.getView()
            .byId('idOrgChangesList')
            .getBinding('items')
            .sort(
              oSortItem ? [new Sorter(oSortItem.getKey(), bDescending)] : []
            )
        },

        onConfirmFilter (oEvent) {
          // Get filter items from the event object
          const aFilterItems = oEvent.getParameter('filterItems')
          const sFilterString = oEvent.getParameter('filterString')

          // Create filters array according to the selected filter items
          const aFilter = []

          aFilterItems.forEach(item => {
            const [sPath, sOperator, sValue1, sValue2] = item
              .getKey()
              .split('__')
            aFilter.push(new Filter(sPath, sOperator, sValue1, sValue2))
          })

          // Filter list binding
          this.getView()
            .byId('idOrgChangesList')
            .getBinding('items')
            .filter(aFilter)

          // Show info header if there are any filters
          this.getView()
            .byId('idFilterInfoToolbar')
            .setVisible(aFilter.length > 0)
          this.getView().byId('idFilterText').setText(sFilterString)
        },
        onConfirmSort (oEvent) {
          // Get sort related event parameters
          const oSortItem = oEvent.getParameter('sortItem')
          const bDescending = oEvent.getParameter('sortDescending')

          // If there is a sort item selected, sort the list binding.
          // Else, sort by empty array to reset any existing sorting.
          this.getView()
            .byId('idOrgChangesList')
            .getBinding('items')
            .sort(
              oSortItem ? [new Sorter(oSortItem.getKey(), bDescending)] : []
            )
        }
      }
    )
  }
)

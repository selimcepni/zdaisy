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
      'sap.com.sapport.zdaisy.controller.PersonalSearch',
      {
        formatter: formatter,

        onInit: async function () {
          const result = await this._getProfile()
          debugger

          const oViewModel = new JSONModel(result.results)
          this.getView().setModel(oViewModel, 'PersonalSearchView')
        },

        _getProfile: async function () {
          try {
            return await this.getOModel('read', '/StaffSearchSet', {}, null)
          } catch (e) {
            MessageBox.error(JSON.parse(e.responseText).error.message.value)
          }
        },
        onExcelButtonPressed: function () {
          var rows = []

          var oList = this.getView().byId('idStaffSearchList')
          var aItems = oList.getItems()

          aItems.forEach(item => {
            var oBindingContext = item.getBindingContext('PersonalSearchView')
            var oObject = oBindingContext.getObject()
            rows.push(oObject)
          })

          const worksheet = XLSX.utils.json_to_sheet(rows)
          const workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Personel Sheet')
          XLSX.writeFile(workbook, 'Personel_Data.xlsx', { compression: true })
        },

        // Handle press sort button press
        onSortButtonPressed () {
          //Load and display the sort dialog
          if (!this._oSortDialog) {
            Fragment.load({
              id: this.getView().getId(),
              name: 'sap.com.sapport.zdaisy.view.fragments.SortingPersonalSearchDialog',
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
        // Handle press group button press
        onGroupButtonPressed () {
          //Load and display the group dialog
          if (!this._oGroupDialog) {
            Fragment.load({
              id: this.getView().getId(),
              name: 'sap.com.sapport.zdaisy.view.fragments.GroupingPersonalSearchDialog',
              controller: this
            }).then(oDialog => {
              this._oGroupDialog = oDialog
              this.getView().addDependent(this._oGroupDialog)
              oDialog.open()
            })
          } else {
            this._oGroupDialog.open()
          }
        },
        onFilterButtonPressed () {
          //Load and display the filter dialog
          if (!this._oFilterDialog) {
            Fragment.load({
              id: this.getView().getId(),
              name: 'sap.com.sapport.zdaisy.view.fragments.FilterPersonalSearchDialog',
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

        onLiveSearchPersonalTable: function (oEvent) {
          var aFilter = []
          var sValue = oEvent.getParameter('newValue'),
            oList = this.getView().byId('idStaffSearchList'),
            oBinding = oList.getBinding('items')

          if (sValue) {
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Pernr',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Name',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Surname',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Merni',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Title',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Unit',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            aFilter.push(
              new sap.ui.model.Filter({
                path: 'Topunit',
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
                path: 'Mail',
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sValue
              })
            )
            var oFinalFilter = new sap.ui.model.Filter({
              filters: aFilter,
              and: false
            })

            this.getView()
              .byId('idStaffSearchList')
              .getBinding('items')
              .filter(oFinalFilter)
          }
        },

        onConfirmSort (oEvent) {
          // Get sort related event parameters
          const oSortItem = oEvent.getParameter('sortItem')
          const bDescending = oEvent.getParameter('sortDescending')

          // If there is a sort item selected, sort the list binding.
          // Else, sort by empty array to reset any existing sorting.
          this.getView()
            .byId('idStaffSearchList')
            .getBinding('items')
            .sort(
              oSortItem ? [new Sorter(oSortItem.getKey(), bDescending)] : []
            )
        },
        // Handle confirm sort
        onConfirmGroup (oEvent) {
          // Get group related event parameters
          const oGroupItem = oEvent.getParameter('groupItem')
          const bDescending = oEvent.getParameter('groupDescending')

          // If there is a group item selected, sort and group the list binding.
          // Else, sort by empty array to reset any existing grouping.
          this.getView()
            .byId('idStaffSearchList')
            .getBinding('items')
            .sort(
              oGroupItem
                ? [
                    new Sorter(
                      oGroupItem.getKey(),
                      bDescending,
                      true /* group */
                    )
                  ]
                : []
            )
        },
        // Handle confirm filter
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
            .byId('idStaffSearchList')
            .getBinding('items')
            .filter(aFilter)

          // Show info header if there are any filters
          this.getView()
            .byId('idFilterInfoToolbar')
            .setVisible(aFilter.length > 0)
          this.getView().byId('idFilterText').setText(sFilterString)
        }
      }
    )
  }
)

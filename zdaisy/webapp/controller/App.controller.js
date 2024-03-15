sap.ui.define(
  [
    'sap/ui/Device',
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/Popover',
    'sap/m/Button',
    'sap/m/library',
    'sap/ui/core/Fragment',
    '../model/formatter'
  ],
  function (
    Device,
    BaseController,
    JSONModel,
    Popover,
    Button,
    mobileLibrary,
    Fragment,
    formatter
  ) {
    'use strict'
    return BaseController.extend('sap.com.sapport.zdaisy.controller.App', {
      formatter: formatter,
      onInit: async function () {
        const result = await this._getProfile()

        const oViewModel = new JSONModel(result.results[0])
        this.getView().setModel(oViewModel, 'appView')

        const result2 = await this._getNoticeSet()
        const count = result2.results.length
        this._setShellBarNotificationsCount(count)
      },
      _setShellBarNotificationsCount: function (count) {
        var oShellBar = this.getView().byId('idAppPageBar')
        oShellBar.setNotificationsNumber(count.toString())
      },
      onMenuButtonPress: function () {
        var toolPage = this.byId('ToolPage')

        toolPage.setSideExpanded(!toolPage.getSideExpanded())
      },

      onItemSelect: function (oEvent) {
        var item = oEvent.getParameters.item.Properties.key

        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('profil', { tabKey: null })
      },

      onAvatarPressed: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('profil', { tabKey: 'permission' })
      },
      onHomeIconPressed: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('Homepage', { tabKey: null })
      },
      onPressProfil: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('profil', { tabKey: null })
      },

      onPressUsers: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('NotFound')
      },
      onOrgChangeSelect: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('OrgChanges')
      },
      onOrgChartSelect: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('OrgChart')
      },
      onReportsSelect: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('Reports')
      },
      onStaffabsencequotasSelect: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('Staffabsencequotas')
      },
      onAbsencesSelect: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('Absences')
      },
      onStaffPaymentsSelect: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('StaffPayments')
      },
      onPressTools: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('ObjectNotFound')
      },
      onStatisticsSelect: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('Statistic')
      },
      onPersonalSearchSelect: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('PersonalSearch')
      },
      onPressDocument: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('')
      },

      onProfileSwitch: function (oEvent) {
        var oButton = oEvent.getSource()

        if (!this._oPopover) {
          Fragment.load({
            id: this.getView().getId(),
            name: 'sap.com.sapport.zdaisy.view.fragments.ProductSwitchPopover',
            controller: this
          }).then(
            function (oPopover) {
              this._oPopover = oPopover
              this.getView().addDependent(this._oPopover)
              this._oPopover.openBy(oButton)
            }.bind(this)
          )
        } else {
          this._oPopover.openBy(oButton)
        }
      },

      _getProfile: async function () {
        try {
          return await this.getOModel('read', '/ProfileSet', {}, null)
        } catch (e) {
          MessageBox.error(JSON.parse(e.responseText).error.message.value)
        }
      },
      _getNoticeSet: async function () {
        try {
          return await this.getOModel('read', '/NoticeSet', {}, null)
        } catch (e) {
          MessageBox.error(JSON.parse(e.responseText).error.message.value)
        }
      },

      onProfileMenuClose: function (oEvent) {
        this._oPopover.close()
      },

      onSelectProfil: function (oEvent) {
        debugger
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('profil', { tabKey: 'permission' })
      },

      onSelectResume: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('profil', { tabKey: 'cv' })
      },
      onPersonelSearchSelect: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('PersonalSearch')
      },

      onSelectPaidTracking: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('profil', { tabKey: 'paidtracking' })
      },

      onSelectPermissionracking: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this)
        oRouter.navTo('PermissionTracking')
      }
    })
  }
)

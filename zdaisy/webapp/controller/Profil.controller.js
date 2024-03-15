sap.ui.define (
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/routing/History',
    '../model/formatter',
  ],
  function (BaseController, JSONModel, History, formatter) {
    'use strict';
    return BaseController.extend ('sap.com.sapport.zdaisy.controller.Profil', {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */

      onInit: function () {
        const oViewModel = new JSONModel ({
          selectedKey: 'permission',
        });
        this.getView ().setModel (oViewModel, 'objectView');

        var oRouter = sap.ui.core.UIComponent.getRouterFor (this);
        oRouter
          .getRoute ('profil')
          .attachPatternMatched (this._onObjectMatched, this);
      },

      _onObjectMatched: function (oEvent) {
        const tabKey = oEvent.getParameter ('arguments').tabKey;
        this.getModel ('objectView').setProperty ('/selectedKey', tabKey);
        var oPanelMenu1 = this.byId ('idIconTabBarNoIcons'); // get icon tab bar
        oPanelMenu1.setSelectedKey (tabKey); //set active filter with predefined key
        // my logic here
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Event handler  for navigating back.
       * It there is a history entry we go one step back in the browser history
       * If not, it will replace the current entry of the browser history with the worklist route.
       * @public
       */

      /* =========================================================== */
      /* internal methods                                            */
      /* =========================================================== */

      /**
       * Binds the view to the object path.
       * @function
       * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
       * @private
       */

      /**
       * Binds the view to the object path.
       * @function
       * @param {string} sObjectPath path to the object to be bound
       * @private
       */
    });
  }
);

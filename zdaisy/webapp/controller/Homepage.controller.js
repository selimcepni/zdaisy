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
      'sap.com.sapport.zdaisy.controller.Homepage',
      {
        formatter: formatter,

        onInit: async function () {
          const result = await this._getProfile ();

          const oViewModel = new JSONModel (result.results);
          this.getView ().setModel (oViewModel, 'NoticeView');
        },

        _getProfile: async function () {
          try {
            return await this.getOModel ('read', '/NoticeSet', {}, null);
          } catch (e) {
            MessageBox.error (JSON.parse (e.responseText).error.message.value);
          }
        },
      }
    );
  }
);

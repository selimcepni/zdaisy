sap.ui.define (
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    '../model/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
    'sap/m/MessageBox',
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    Filter,
    FilterOperator,
    Fragment,
    Sorter,
    MessageBox
  ) {
    'use strict';
    return BaseController.extend (
      'sap.com.sapport.zdaisy.controller.OrgChart',
      {
        formatter: formatter,

        onInit: async function () {
          const result = await this._getProfile ();
          this.createOrgTree (result.results);
          this.searchOrgTree ();
        },

        createOrgTree: function (obj) {
          debugger;
          const convertedData = [];
          obj.map (mapElement => {
            convertedData.push ({
              parent: mapElement.Parent,
              id: mapElement.Id,
              text: mapElement.Text,
              icon: mapElement.Icon,
              types: mapElement.Type,
            });
          });

          $ ('#idjstree').jstree ({
            core: {
              themes: {stripes: true},
              data: convertedData,
            },
            search: {
              case_insensitive: true,
              show_only_matches: true,
            },
            types: {
              default: {
                icon: 'fa fa-university',
              },
              department: {
                icon: 'fa fa-university',
              },
              person: {
                icon: 'fa fa-user-circle-o',
              },
            },
            plugins: ['types', 'search'],
          });
          $ (
            '<input type="text" id="orgTreeSearch" placeholder="Organizasyon ağacında arama yapmak için metin girin..." style="height: 50px; width: 600px;">'
          ).insertBefore ('#idjstree');

          setTimeout (function () {
            $ ('#idjstree').jstree ('open_all');
          }, 1000);
        },
        searchOrgTree: function () {
          $ ('#orgTreeSearch').keyup (function () {
            $ ('#idjstree').jstree ('search', $ (this).val ());
            showOnlyMatches ();
          });
        },

        _getProfile: async function () {
          try {
            return await this.getOModel ('read', '/OrgChartSet', {}, null);
          } catch (e) {
            MessageBox.error (JSON.parse (e.responseText).error.message.value);
          }
        },
      }
    );
  }
);

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
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    Filter,
    FilterOperator,
    Fragment,
    Sorter,
    MessageBox,
    FlattenedDataset,
    ChartFormatter,
    Format
  ) {
    'use strict';
    return BaseController.extend (
      'sap.com.sapport.zdaisy.controller.Statistic',
      {
        formatter: formatter,

        onInit: async function () {
          const result = await this._getProfile ();
          const oViewModel = new JSONModel (result.results);

          const Data = oViewModel.getData ().map (item => {
            const {__metadata, ...rest} = item;
            return rest;
          });
          //////////////////////////////NATİO/////////////////////////////////
          const NatioData = oViewModel.getData ().map (item => {
            const {
              __metadata,
              AgeID,
              Agecount,
              Agetext,
              EducatinID,
              Educatincount,
              Educatintext,
              GenderID,
              Gendercount,
              Gendertext,
              SeniorityID,
              Senioritycount,
              Senioritytext,
              NatioID,

              ...rest
            } = item;
            return rest;
          });

          var filteredNatio = NatioData.filter (function (item) {
            return (
              item.Natiocount !== 0 &&
              item.Natiocount !== null &&
              item.Natiocount !== undefined &&
              item.Natiocount !== ''
            );
          });

          var NatioModel = new sap.ui.model.json.JSONModel (filteredNatio);

          var oVizFrame = (this.oVizFrame = this.getView ().byId (
            'idNatVizFrame'
          ));

          this.oVizFrame.setModel (NatioModel, 'Natio');

          var oPopOver = this.getView ().byId ('idNatPopOver');
          oPopOver.connect (oVizFrame.getVizUid ());

          //////////////////////////////NATİO/////////////////////////////////

          ///////////////////////////////AGE//////////////////////////////////

          var AgeData = oViewModel.getData ().map (item => {
            var {
              __metadata,
              AgeID,
              Natiocount,
              Natiotext,
              EducatinID,
              Educatincount,
              Educatintext,
              GenderID,
              Gendercount,
              Gendertext,
              SeniorityID,
              Senioritycount,
              Senioritytext,
              NatioID,

              ...rest
            } = item;
            return rest;
          });

          var filteredAge = AgeData.filter (function (item) {
            return (
              item.Agecount !== 0 &&
              item.Agecount !== null &&
              item.Agecount !== undefined &&
              item.Agecount !== ''
            );
          });

          filteredAge.sort (function (a, b) {
            return a.Agetext.localeCompare (b.Agetext);
          });

          var AgeModel = new sap.ui.model.json.JSONModel (filteredAge);

          var oVizFrameAge = (this.oVizFrameAge = this.getView ().byId (
            'idAgeVizFrame'
          ));

          this.oVizFrameAge.setModel (AgeModel, 'Age');

          var oPopOver = this.getView ().byId ('idAgePopOver');
          oPopOver.connect (oVizFrameAge.getVizUid ());

          ///////////////////////////////AGE//////////////////////////////////

          //////////////////////////////GENDER/////////////////////////////////

          var GenderData = oViewModel.getData ().map (item => {
            var {
              __metadata,
              AgeID,
              Natiocount,
              Natiotext,
              EducatinID,
              Educatincount,
              Educatintext,
              GenderID,
              Agecount,
              Agetext,
              SeniorityID,
              Senioritycount,
              Senioritytext,
              NatioID,

              ...rest
            } = item;
            return rest;
          });

          var filteredGender = GenderData.filter (function (item) {
            return (
              item.Gendercount !== 0 &&
              item.Gendercount !== null &&
              item.Gendercount !== undefined &&
              item.Gendercount !== ''
            );
          });

          filteredGender.sort (function (a, b) {
            return a.Gendertext.localeCompare (b.Gendertext);
          });

          var GenderModel = new sap.ui.model.json.JSONModel (filteredGender);

          var oVizFrameGender = (this.oVizFrameGender = this.getView ().byId (
            'idGenderVizFrame'
          ));

          this.oVizFrameGender.setModel (GenderModel, 'Gender');

          var oPopOver = this.getView ().byId ('idGenderPopOver');
          oPopOver.connect (oVizFrameGender.getVizUid ());

          //////////////////////////////GENDER/////////////////////////////////

          /////////////////////////////EDUCATİON///////////////////////////////

          var EducationData = oViewModel.getData ().map (item => {
            var {
              __metadata,
              AgeID,
              Natiocount,
              Natiotext,
              EducatinID,
              Gendercount,
              Gendertext,
              GenderID,
              Agecount,
              Agetext,
              SeniorityID,
              Senioritycount,
              Senioritytext,
              NatioID,

              ...rest
            } = item;
            return rest;
          });

          var filteredEducation = EducationData.filter (function (item) {
            return (
              item.Educatincount !== 0 &&
              item.Educatincount !== null &&
              item.Educatincount !== undefined &&
              item.Educatincount !== ''
            );
          });

          filteredEducation.sort (function (a, b) {
            return a.Educatintext.localeCompare (b.Educatintext);
          });

          var EducationModel = new sap.ui.model.json.JSONModel (
            filteredEducation
          );

          var oVizFrameEducation = (this.oVizFrameEducation = this.getView ().byId (
            'idEducationVizFrame'
          ));

          this.oVizFrameEducation.setModel (EducationModel, 'Education');

          var oPopOver = this.getView ().byId ('idEducationPopOver');
          oPopOver.connect (oVizFrameEducation.getVizUid ());

          /////////////////////////////EDUCATİON///////////////////////////////

          /////////////////////////////SENİORİTY///////////////////////////////
          debugger;

          var SeniorityData = oViewModel.getData ().map (item => {
            var {
              __metadata,
              AgeID,
              Natiocount,
              Natiotext,
              EducatinID,
              Gendercount,
              Gendertext,
              GenderID,
              Agecount,
              Agetext,
              SeniorityID,
              Educatincount,
              Educatintext,
              NatioID,

              ...rest
            } = item;
            return rest;
          });

          var filteredSeniority = SeniorityData.filter (function (item) {
            return (
              item.Senioritycount !== 0 &&
              item.Senioritycount !== null &&
              item.Senioritycount !== undefined &&
              item.Senioritycount !== ''
            );
          });

          var SeniorityModel = new sap.ui.model.json.JSONModel (
            filteredSeniority
          );

          var oVizFrameSeniority = (this.oVizFrameSeniority = this.getView ().byId (
            'idSeniorityVizFrame'
          ));

          this.oVizFrameSeniority.setModel (SeniorityModel, 'Seniority');

          var oPopOver = this.getView ().byId ('idSeniorityPopOver');
          oPopOver.connect (oVizFrameSeniority.getVizUid ());

          /////////////////////////////SENİORİTY///////////////////////////////
        },
        _getProfile: async function () {
          try {
            return await this.getOModel ('read', '/StatisticsSet', {}, null);
          } catch (e) {
            MessageBox.error (JSON.parse (e.responseText).error.message.value);
          }
        },
      }
    );
  }
);

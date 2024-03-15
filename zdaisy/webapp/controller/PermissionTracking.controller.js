sap.ui.define(
  [
    './BaseController',
    'sap/ui/model/json/JSONModel',
    '../model/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Fragment',
    'sap/ui/model/Sorter',
    'sap/ui/core/library',
    'sap/m/MessageToast',
    'sap/m/MessageBox',
    'sap/ui/core/syncStyleClass',
    'sap/suite/ui/commons/ProcessFlow',
    'sap/suite/ui/commons/ProcessFlowLaneHeader'
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    Filter,
    FilterOperator,
    Fragment,
    Sorter,
    CoreLibrary,
    MessageToast,
    MessageBox,
    syncStyleClass,
    ProcessFlow,
    ProcessFlowLaneHeader
  ) {
    'use strict'

    var ValueState = CoreLibrary.ValueState,
      oData = {
        perTypeArr: null,
        allpermissionArr: null,
        permissionArr: null,
        completedpermArr: null,
        inprocesspermArr: null,
        signprocessArr: null,
        completedpermArrLength: '',
        inprocesspermArrLength: '',
        permissionArrLength: '',
        allPermissionArrLength: '',
        perType: { title: '', value: '', mintg: '' },
        perBegDate: '',
        perEndDate: '',
        perBeguz: '',
        perEnduz: '',
        perDescription: '',
        selectedProcess: '',
        processSapVisible: false,
        productNameState: ValueState.Error,
        productWeightState: ValueState.Error,
        productType: 'Mobile',
        reviewButton: false,
        backButtonVisible: false,
        availabilityType: 'In store',
        productVAT: false,
        measurement: '',
        productManufacturer: 'N/A',
        size: 'N/A',
        productPrice: 'N/A',
        manufacturingDate: 'N/A',
        discountGroup: ''
      }

    return BaseController.extend(
      'sap.com.sapport.zdaisy.controller.PermissionTracking',
      {
        formatter: formatter,

        onInit: async function () {
          var oModel = new sap.ui.model.json.JSONModel(),
            oInitialModelState = Object.assign({}, oData)
          oModel.setData(oInitialModelState)
          this.getView().setModel(oModel, 'mainView')
          let _allData = await this._getallData()
          let perTypeArr = _allData.permissiontype
          let completedpermArr = _allData.completedperm
          let inprocesspermArr = _allData.inprocessperm
          let permissionArr = _allData.onmeperm

          let allPermissionArr = completedpermArr.concat(
            inprocesspermArr,
            permissionArr
          )
          debugger
          let signprocessArr = _allData.signprocess
          let signProcessData = this.organizeSignProcessData(signprocessArr)

          let perTypeText = this.formatPerTypeArray(perTypeArr)
          this.getModel('mainView').setProperty('/perTypeArr', perTypeText)
          this.getModel('mainView').setProperty(
            '/signprocessArr',
            signProcessData
          )
          this.getModel('mainView').setProperty('/permissionArr', permissionArr)
          this.getModel('mainView').setProperty(
            '/allpermissionArr',
            allPermissionArr
          )
          this.getModel('mainView').setProperty(
            '/completedpermArr',
            completedpermArr
          )
          this.getModel('mainView').setProperty(
            '/inprocesspermArr',
            inprocesspermArr
          )

          // // // // // // count for length

          let completedpermArrLength = _allData.completedperm.length
          let inprocesspermArrLength = _allData.inprocessperm.length
          let permissionArrLength = _allData.onmeperm.length
          let allPermissionArrLength = allPermissionArr.length

          this.getModel('mainView').setProperty(
            '/allPermissionArrLength',
            allPermissionArrLength
          )

          // // // // // // count for length

          var oIconTabBar = this.byId('iconTabBar')
          oIconTabBar.attachSelect(this.onIconTabSelect, this)
          this.updateTableData('all')

          this.getCount()
        },
        _getallData: async function () {
          try {
            let typeModel = await this.getOModel(
              'read',
              '/PermissionTrackSet',
              {}
            )
            return JSON.parse(typeModel.results[0].jsonData)
          } catch (e) {
            MessageBox.error(JSON.parse(e.responseText).error.message.value)
          }
        },
        onIconTabSelect: function (oEvent) {
          var oSelectedTab = oEvent.getParameter('item')
          var sKey = oSelectedTab.getKey()
          this.updateTableData(sKey)
        },

        updateTableData: function (sSelectedTabKey) {
          var oTable = this.byId('table')
          var oBinding = oTable.getBinding('items')

          if (sSelectedTabKey === 'inStock') {
            oBinding.filter(
              [
                new sap.ui.model.Filter(
                  'status',
                  sap.ui.model.FilterOperator.EQ,
                  'O'
                ),
                new sap.ui.model.Filter(
                  'status',
                  sap.ui.model.FilterOperator.EQ,
                  'I'
                )
              ],
              true
            )
          } else if (sSelectedTabKey === 'shortage') {
            oBinding.filter(
              new sap.ui.model.Filter(
                'status',
                sap.ui.model.FilterOperator.EQ,
                'B'
              )
            )
          } else if (sSelectedTabKey === 'outOfStock') {
            oBinding.filter(
              new sap.ui.model.Filter(
                'status',
                sap.ui.model.FilterOperator.EQ,
                'C'
              )
            )
          } else {
            oBinding.filter([])
          }
        },

        formatPerTypeArray: function (perTypeArr) {
          var formattedArray = []
          for (var i = 0; i < perTypeArr.length; i++) {
            var formattedItem = {
              text: perTypeArr[i].text,
              value: perTypeArr[i].id,
              mintg: perTypeArr[i].mintg
            }
            formattedArray.push(formattedItem)
          }
          return formattedArray
        },
        organizeSignProcessData: function (data) {
          data.sort((a, b) => a.order - b.order)

          data.forEach((item, index) => {
            item.id = (index + 1).toString()
            item.lane = index.toString()

            if (index < data.length - 1) {
              item.children = [index + 2]
            } else {
              item.children = []
            }
          })

          return data
        },

        createPerReq: function (oEvent) {
          var oView = this.getView()
          // create Dialog
          if (!this._pDialog) {
            this._pDialog = Fragment.load({
              id: oView.getId(),
              name: 'sap.com.sapport.zdaisy.view.fragments.PerCreateDialog',
              controller: this
            }).then(
              function (oDialog) {
                oDialog.attachAfterOpen(this.onDialogAfterOpen, this)
                oView.addDependent(oDialog)
                oDialog.bindElement('/ProductCollection/0')
                return oDialog
              }.bind(this)
            )
          }
          this._pDialog.then(function (oDialog) {
            oDialog.open()
          })
        },

        onSelectDialogPress: function (oEvent) {
          var oButton = oEvent.getSource()

          if (!this._oPopover) {
            Fragment.load({
              id: this.getView().getId(),
              name: 'sap.com.sapport.zdaisy.view.fragments.PerTrackProcesDialog',
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
        onDialogAfterOpen: function () {
          this._oWizard = this.byId('CreateProductWizard')
          this._iSelectedStepIndex = 0
          this._oSelectedStep =
            this._oWizard.getSteps()[this._iSelectedStepIndex]

          this.handleButtonsVisibility()
        },
        onBegDateChange: function (oEvent) {
          var oDateTimePicker = oEvent.getSource()
          var oModel = this.getModel('mainView')

          if (oDateTimePicker) {
            var oSelectedDate = oDateTimePicker.getDateValue()
            var dateTimeValue = oDateTimePicker.getValue()
            var dateTimeArray = dateTimeValue.split(' ')
            var timeValue = dateTimeArray[1]
            var timeArray =
              timeValue.indexOf(':') !== -1 ? timeValue.split(':') : [0, 0]
            var Beguz = timeArray[0] + timeArray[1]

            oModel.setProperty('/perBegDate', oSelectedDate)
            oModel.setProperty('/perBeguz', Beguz)
          }
        },
        onEndDateChange: function (oEvent) {
          var oDateTimePicker = oEvent.getSource()
          var oModel = this.getModel('mainView')

          if (oDateTimePicker) {
            var oSelectedDate = oDateTimePicker.getDateValue()
            var dateTimeValue = oDateTimePicker.getValue()
            var dateTimeArray = dateTimeValue.split(' ')
            var timeValue = dateTimeArray[1]
            var timeArray =
              timeValue.indexOf(':') !== -1 ? timeValue.split(':') : [0, 0]
            var Enduz = timeArray[0] + timeArray[1]

            oModel.setProperty('/perEndDate', oSelectedDate)
            oModel.setProperty('/perEnduz', Enduz)
          }
        },

        handleButtonsVisibility: function () {
          var oModel = this.getView().getModel()
          switch (this._iSelectedStepIndex) {
            case 0:
              this.getModel('mainView').setProperty('/nextButtonVisible', true)
              this.getModel('mainView').setProperty('/backButtonVisible', false)
              this.getModel('mainView').setProperty(
                '/reviewButtonVisible',
                false
              )
              this.getModel('mainView').setProperty(
                '/finishButtonVisible',
                false
              )
              break
            case 1:
              this.getModel('mainView').setProperty('/nextButtonVisible', true)
              this.getModel('mainView').setProperty('/backButtonVisible', true)
              this.getModel('mainView').setProperty(
                '/reviewButtonVisible',
                false
              )
              this.getModel('mainView').setProperty(
                '/finishButtonVisible',
                false
              )
              break
            case 2:
              this.getModel('mainView').setProperty('/nextButtonVisible', true)
              this.getModel('mainView').setProperty('/backButtonVisible', true)
              this.getModel('mainView').setProperty(
                '/reviewButtonVisible',
                false
              )
              this.getModel('mainView').setProperty(
                '/finishButtonVisible',
                false
              )
              break
            case 3:
              this.getModel('mainView').setProperty('/nextButtonVisible', false)
              this.getModel('mainView').setProperty('/backButtonVisible', true)
              this.getModel('mainView').setProperty(
                '/reviewButtonVisible',
                true
              )
              this.getModel('mainView').setProperty(
                '/finishButtonVisible',
                false
              )
              break

            default:
              break
          }
        },

        handleNavigationChange: function (oEvent) {
          this._oSelectedStep = oEvent.getParameter('step')
          this._iSelectedStepIndex = this._oWizard
            .getSteps()
            .indexOf(this._oSelectedStep)
          this.handleButtonsVisibility()
        },

        editStepOne: function () {
          this._handleNavigationToStep(0)
        },

        editStepTwo: function () {
          this._handleNavigationToStep(1)
        },

        editStepThree: function () {
          this._handleNavigationToStep(2)
        },

        editStepFour: function () {
          this._handleNavigationToStep(3)
        },

        _handleNavigationToStep: function (iStepNumber) {
          this._pDialog.then(
            function (oDialog) {
              oDialog.open()
              this._oWizard.goToStep(
                this._oWizard.getSteps()[iStepNumber],
                true
              )
            }.bind(this)
          )
        },
        _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
          MessageBox[sMessageBoxType](sMessage, {
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function (oAction) {
              if (oAction === MessageBox.Action.YES) {
                this._oWizard.discardProgress(this._oWizard.getSteps()[0])
                this.byId('wizardDialog').close()
                this.getView().getModel().setData(Object.assign({}, oData))
              }
            }.bind(this)
          })
        },

        onDialogNextButton: function () {
          this._iSelectedStepIndex = this._oWizard
            .getSteps()
            .indexOf(this._oSelectedStep)
          var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1]

          if (this._oSelectedStep && !this._oSelectedStep.bLast) {
            this._oWizard.goToStep(oNextStep, true)
          } else {
            this._oWizard.nextStep()
          }

          this._iSelectedStepIndex++
          this._oSelectedStep = oNextStep

          this.handleButtonsVisibility()
        },

        onDialogBackButton: function () {
          this._iSelectedStepIndex = this._oWizard
            .getSteps()
            .indexOf(this._oSelectedStep)
          var oPreviousStep =
            this._oWizard.getSteps()[this._iSelectedStepIndex - 1]

          if (this._oSelectedStep) {
            this._oWizard.goToStep(oPreviousStep, true)
          } else {
            this._oWizard.previousStep()
          }

          this._iSelectedStepIndex--
          this._oSelectedStep = oPreviousStep

          this.handleButtonsVisibility()
        },

        handleWizardCancel: function () {
          this._handleMessageBoxOpen(
            'İzin Talebini İptal Etmek İstediğinizden Emin Misiniz?',
            'warning'
          )
        },

        handleWizardSubmit: function () {
          this._handleMessageBoxOpen(
            'İzin Talebini Onaylamak İstediğinizden Emin Misiniz?',
            'success'
          )
        },
        discardProgress: function () {
          var oModel = this.getView().getModel()
          this._oWizard.discardProgress(this.byId('ProductTypeStep'))

          var clearContent = function (aContent) {
            for (var i = 0; i < aContent.length; i++) {
              if (aContent[i].setValue) {
                aContent[i].setValue('')
              }

              if (aContent[i].getContent) {
                clearContent(aContent[i].getContent())
              }
            }
          }
          this.getModel('mainView').setProperty(
            '/productNameState',
            ValueState.Error
          )
          this.getModel('mainView').setProperty(
            '/productWeightState',
            ValueState.Error
          )
          clearContent(this._oWizard.getSteps())
        },

        onPerTypeArrGridListSelectionChange: function (oEvent) {
          var oSelectedItem = oEvent.getParameter('listItem')
          var oModel = this.getModel('mainView')

          if (oSelectedItem) {
            var sTitle = oSelectedItem
              .getBindingContext('mainView')
              .getProperty('text')
            var sValue = oSelectedItem
              .getBindingContext('mainView')
              .getProperty('value')
            var sMintg = oSelectedItem
              .getBindingContext('mainView')
              .getProperty('mintg')

            oModel.setProperty('/perType', {
              title: sTitle,
              value: sValue,
              mintg: sMintg
            })
          }
        },

        onSelectListSelectionChange: function (oEvent) {
          var oSelectedItem = oEvent.getParameter('selectedItem')
          var sKey = oSelectedItem.getKey()
        },

        onPermissionArrTableSelectionChange: function (oEvent) {
          var oTable = this.byId('table')
          var oSelectedItems = oTable.getSelectedItems()

          this.getModel('mainView').setProperty(
            '/processSapVisible',
            oSelectedItems.length > 0
          )
        },

        onProcessSap: function (oEvent) {
          var that = this

          sap.m.MessageBox.confirm('SAP işlemek istediğinize emin misiniz?', {
            title: 'Onaylama',
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {
                that._processSap()
              } else {
              }
            }
          })
        },
        _processSap: function () {},

        ongetSignProcess: function (oEvent) {
          this.getModel('mainView').setProperty('/finishButtonVisible', true)
          var mainViewModel = this.getModel('mainView')
          var oProcessFlow = this.byId('processFlow')
          oProcessFlow.removeAllNodes()
          oProcessFlow.setZoomLevel('One')
          oProcessFlow.setWheelZoomable(false)

          const data = mainViewModel.getProperty('/signprocessArr')

          data.forEach((node, index) => {
            var oLaneHeader = new sap.suite.ui.commons.ProcessFlowLaneHeader({
              laneId: index.toString(),
              iconSrc: 'sap-icon://employee',
              position: index,
              text: 'İmza ' + (index + 1)
            })
            oProcessFlow.addLane(oLaneHeader)

            var oNode = new sap.suite.ui.commons.ProcessFlowNode({
              laneId: index.toString(),
              nodeId: node.id,
              title: node.ename,
              texts: node.title,
              children: node.children,
              state: node.id === '1' ? 'Positive' : 'Critical'
            })

            oProcessFlow.addNode(oNode)
            if (node.id === '1') {
            }
          })
        },
        getCount: function () {
          let countData = this.getModel('mainView').getData().allpermissionArr
          let groupedByStatus = {}
          countData.forEach(item => {
            const status = item.status

            if (!groupedByStatus[status]) {
              groupedByStatus[status] = []
            }

            groupedByStatus[status].push(item)
          })

          let groupCounts = {}
          for (const status in groupedByStatus) {
            groupCounts[status] = groupedByStatus[status].length
          }
          this.getModel('mainView').setProperty(
            '/completedpermArrLength',
            groupCounts['B']
          )
          this.getModel('mainView').setProperty(
            '/inprocesspermArrLength',
            groupCounts['O'] + groupCounts['I']
          )
          this.getModel('mainView').setProperty(
            '/permissionArrLength',
            groupCounts['C']
          )
          this.getModel('mainView').setProperty(
            '/allPermissionArrLength',
            countData.length
          )
        },
        onConfirmPer: function () {
          debugger
          const fields = {},
            oEntry = {},
            perBegDate = this.getModel('mainView').getProperty('/perBegDate'),
            perEndDate = this.getModel('mainView').getProperty('/perEndDate'),
            perBeguz = this.getModel('mainView').getProperty('/perBeguz'),
            perEnduz = this.getModel('mainView').getProperty('/perEnduz'),
            perDescription =
              this.getModel('mainView').getProperty('/perDescription'),
            perType = this.getModel('mainView').getProperty('/perType'),
            oModel = this.getModel()
          fields.BEGDA = perBegDate
          fields.ENDDA = perEndDate
          fields.BEGUZ = perBeguz
          fields.ENDUZ = perEnduz
          fields.DESCRIPTION = perDescription
          fields.TYPE = perType.value
          fields.TEXT = perType.title
          fields.MINTG = perType.mintg
          oEntry.jsonData = JSON.stringify(fields)

          oModel.create('/PermissionTrackSet', oEntry, {
            success: function (oResult, oResponse) {},
            error: function (oError) {}
          })
        }
      }
    )
  }
)

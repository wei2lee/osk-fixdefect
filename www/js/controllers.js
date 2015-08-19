

angular.module('starter.controllers', ["services"])

.controller('AppCtrl', function () {
})


.controller('CreateDefectProjectsCtrl', function ($scope, u, $state, apiProject) {
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.projects = [];
            u.showProgress();
            apiProject.getAll().then(function(results) {
                $scope.projects = results;  
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('CreateDefectUnitsCtrl', function ($scope, u, $state, apiUnit, $ionicFilterBar) {
    var _this = this;
    $scope.units = [];
    $scope.showHint = true;
    $scope.showFilterBar = function () {
        $scope.showHint = false;
        var filterBarInstance = $ionicFilterBar.show({
            items: $scope.units,
            update: function (filteredItems) {
                
            },
            filter: function(array, expression, comparator) {
                console.log(expression);
                if(!expression.unitNo || expression.unitNo.length == 0) {
                    $scope.filteredUnits = [];
                    return [];   
                }
                var unitNoLowerCase = expression.unitNo.toLowerCase();
                var ret = _.filter(array, function(o){
                    var ind = o.unitNo.toLowerCase().indexOf(unitNoLowerCase);
                    return ind >= 0;
                });
                
                $scope.filteredUnits = ret;
                
                return ret;
            },
            filterProperties:['unitNo']
        });
    };
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        console.log('CreateDefectUnits.beforeEnter');
        if(state.direction != 'back') {
            $scope.units = [];
            $scope.showHint = true;
            $scope.filteredUnits = [];
            
            u.showProgress();
            apiUnit.getByProjectId($state.params.projectId).then(function(results) {
                $scope.units = results;  
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})


.controller('CreateDefectUnitCtrl', function ($scope, u, $state, apiUnit) {
    var _this = this;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.unit = null;
            $scope.owner = null;
            u.showProgress();
            apiUnit.getById($state.params.id).then(function(results) {
                $scope.unit = results;  
                $scope.owner = results.owner;
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('CreateDefectHandoverCtrl', function ($scope, u, $state, apiUnit) {
    var _this = this;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.unit = null;
            u.showProgress();
            apiUnit.getById($state.params.id).then(function(results) {
                $scope.unit = results;  
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('CreateDefectDefectItemsCtrl', function ($scope, u, $state, apiDefectItem, apiUnit, defectForm, $ionicHistory) {
    var _this = this;
    
    $scope.submit = function() {
        u.showProgress();
        apiDefectItem.add(defectForm.defectItems).then(function(results) {
            u.showAlert('Defect Items is successfully submited!<br/>Tap close to return to home page.').then(function() {
                console.log('showAlert End');
                $ionicHistory.goBack(-1000);
            });
            defectForm.defectItems = [];
            $scope.defectItems = [];
        }).catch(function(error) {

        }).finally(function() {
             u.hideProgress();
        });
    }
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            defectForm.unit = null;
            defectForm.project = null;
            defectForm.defectItems = [];
            
            
            $scope.defectItems = [];
            $scope.unit = null;
            $scope.project = null;
            
            u.showProgress();
            apiUnit.getById($state.params.id).then(function(results) {
                $scope.unit = results;  
                $scope.project = results.project;
                $scope.defectItems = []
                
                defectForm.unit = results;
                defectForm.project = results.project;
                defectForm.defectItems = [];
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }else{
            $scope.defectItems = defectForm.defectItems;
        }
    });
})

.controller('CreateDefectDefectItemCtrl', function ($scope, $q, u, $state, apiUnit, defectForm, $ionicHistory,
                                                     apiDefectItemAreaLocation, 
                                                     apiDefectItemReason,
                                                     apiDefectItemStatus,
                                                     apiDefectItemSeverity,
                                                     apiDefectType
                                                    ) {
    var _this = this;
    $scope.done = function() {
        if(!_this.isEdit) {
            defectForm.defectItems.push($scope.defectItem);
        }
        $ionicHistory.goBack();
    }
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            
            _this.isEdit = $state.current.name.indexOf('edit') >= 0;
            
            $scope.defectItem = _this.isEdit ? defectForm.defectItems[$state.params.index] : null;
            
            u.showProgress();
            $q.all ([
                apiDefectItemAreaLocation.getAll(),
                apiDefectItemReason.getAll(),
                apiDefectItemStatus.getAll(),
                apiDefectItemSeverity.getAll(),
                apiDefectType.getAll(),
                apiDefectItemAreaLocation.getAll()
            ]).then(function(results) {

                
                $scope.defectItemAreaLocationOptions = results[0];
                $scope.defectItemReasonOptions = results[1];
                $scope.defectItemStatusOptions = results[2];
                $scope.defectItemSeverityOptions = results[3];
                $scope.defectTypeOptions = results[4];
                $scope.defectItemAreaLocationOptions = results[5];
                
                
                if(!_this.isEdit) {
                
                    $scope.defectItem = {};
                    $scope.defectItem.project = defectForm.project;
                    $scope.defectItem.unit = defectForm.unit;
                    $scope.defectItem.defectLocation = 'img/defect/ceiling-crack-repair.jpg';
                    $scope.defectItem.defectItemSeverity = _.first($scope.defectItemSeverityOptions);
                    $scope.defectItem.defectType = _.first($scope.defectTypeOptions);
                    $scope.defectItem.defectItemReason = _.first($scope.defectItemReasonOptions);
                    $scope.defectItem.defectItemStatus = $scope.defectItemStatusOptions[1];
                    $scope.defectItem.defectItemAreaLocation = $scope.defectItemAreaLocationOptions[0];
                    
                }
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})


.controller('RecordProjectsCtrl', function ($scope, u, $state, apiDefectItem) {
    var _this = this;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.projects = [];
            u.showProgress();
            apiDefectItem.getAll().then(function(results) {
                var defectItems = results;  
                var defectItemsByProjectIds = _.groupBy (defectItems, function(o) { return o.project.id; });
                for(projectId in defectItemsByProjectIds) {
                    var project = defectItemsByProjectIds[projectId][0].project;
                    var defectItemsByUnitIds = _.groupBy (defectItemsByProjectIds[projectId], function(o) { return o.unit.id; });
                    var p = jQuery.extend(true, {}, project);
                    p.noOfUnits = _.size(defectItemsByUnitIds);
                    console.log(p);
                    $scope.projects.push(p);
                }
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})



;
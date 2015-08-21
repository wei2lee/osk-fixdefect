

angular.module('starter.controllers', ["services"])

.controller('AppCtrl', function () {
})


.controller('CreateDefectProjectsCtrl', function ($q, $scope, u, $state, apiProject) {

    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            
            $scope.projects = [];
            u.showProgress();
            $scope.loading = true;
            apiProject.getAll().then(function(results) {
                $scope.projects = results;  
            }).catch(function(error) {
                u.showError(error);
            }).finally(function() {
                $scope.loading = false;
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
                u.showError(error);
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
                u.showError(error);
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
                u.showError(error);
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
        }).catch(function(error) {

        }).finally(function() {
             u.hideProgress();
        });
    }
    
    $scope.edit = function(defectItem) {
        defectForm.defectItem = defectItem;
        $state.go('app.create-defect-defectarealocation');
    }
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.defectForm = defectForm;
            
            defectForm.unit = null;
            defectForm.project = null;
            defectForm.defectItems = [];
            
            u.showProgress();
            apiUnit.getById($state.params.id).then(function(results) {
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

.controller('CreateDefectAreaLocationCtrl',  function ($cordovaImagePicker, 
                                                     $cordovaCamera, 
                                                     $cordovaFile,
                                                     $timeout, $scope, $q, u, $state, apiUnit, defectForm, $ionicHistory,
                                                     apiDefectItemAreaLocation, 
                                                     apiDefectItemReason,
                                                     apiDefectItemStatus,
                                                     apiDefectItemSeverity,
                                                     apiDefectType
                                                        
                                                    ) {
    var _this = this;
    
    $scope.clickAreaLocation = function(areaLocation) {
        $scope.defectForm.defectItem.defectItemAreaLocation = areaLocation;
    }
    
    $scope.goBack = function() {
        console.log('goBack');
        defectForm.defectItem = null;
        $ionicHistory.goBack(-1);
    }
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.defectForm = defectForm;
            u.showProgress();
            $q.all ([
                apiDefectItemAreaLocation.getAll(),
                apiDefectItemReason.getAll(),
                apiDefectItemStatus.getAll(),
                apiDefectItemSeverity.getAll(),
                apiDefectType.getAll(),
            ]).then(function(results) {
                $scope.defectForm.defectItemAreaLocationOptions = results[0];
                $scope.defectForm.defectItemReasonOptions =  results[1];
                $scope.defectForm.defectItemStatusOptions =  results[2];
                $scope.defectForm.defectItemSeverityOptions = results[3];
                $scope.defectForm.defectTypeOptions = results[4];
                if(!$scope.defectForm.defectItem) {
                    $scope.defectForm.defectItem = {};
                    $scope.defectForm.defectItem.project = defectForm.project;
                    $scope.defectForm.defectItem.unit = defectForm.unit;
                    $scope.defectForm.defectItem.defectStartDate = new Date();
                    $scope.defectForm.defectItem.defectLocation = '';
                    $scope.defectForm.defectItem.defectType = _.first($scope.defectForm.defectTypeOptions);
                    $scope.defectForm.defectItem.defectItemSeverity = _.first($scope.defectForm.defectItemSeverityOptions);
                    $scope.defectForm.defectItem.defectItemReason = _.first($scope.defectForm.defectItemReasonOptions);
                    $scope.defectForm.defectItem.defectItemStatus = $scope.defectForm.defectItemStatusOptions[1];
                    $scope.defectForm.defectItem.defectItemAreaLocation = $scope.defectForm.unit.floorplans[0].areas[0].areaLocation;
                }
                
                //its hard to put thing together, maphighlight + responsive map area + ionic
//                $timeout(function() {
//                    $map = $('img[usemap="#auto"]');
//                    console.log($map.length);
//                    $map.maphilight({fade: false});
//                },100);
            }).catch(function(error) {
                u.showError(error);
            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('CreateDefectDefectItemCtrl', function ($cordovaImagePicker, 
                                                     $cordovaCamera, 
                                                     $cordovaFile,
                                                     $ionicActionSheet, $scope, $q, u, $state, apiUnit, defectForm, $ionicHistory,
                                                     apiDefectItemAreaLocation, 
                                                     apiDefectItemReason,
                                                     apiDefectItemStatus,
                                                     apiDefectItemSeverity,
                                                     apiDefectType
                                                    ) {

    var _this = this;
    $scope.pickPhoto = function() { 
        var hideSheet = $ionicActionSheet.show({
           buttons: [
               {
                   text: 'Library'
               },
               {
                   text: 'Camera'
               }
            ],
           titleText: 'Pick image from',
           cancelText: 'Cancel',
           cancel: function () {
               // add cancel code..
           },
           buttonClicked: function (index) {
               if(index==0) {
                   $scope.pickFromLibrary();
               }else if(index==1){
                   $scope.pickFromCamera();
               }
               return true;
           }
        });
    };
    $scope.removePhoto = function() {
        defectForm.defectItem.defectLocation = null;
    }
    $scope.pickFromLibrary = function() {
        try {
            var options = { 
                quality : 50, 
                destinationType : Camera.DestinationType.DATA_URL, 
                sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                defectForm.defectItem.defectLocation = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                u.showError(err);
            });
        }catch(ex) {
            u.showError(ex);
        }
    }
    $scope.pickFromCamera = function() {
        try {
            var options = { 
                quality : 50, 
                destinationType : Camera.DestinationType.DATA_URL, 
                sourceType : Camera.PictureSourceType.CAMERA, 
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                defectForm.defectItem.defectLocation = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                u.showError(err);
            });
        }catch(ex) {
            u.showError(ex);
        }
    }

    $scope.done = function() {
        if(defectForm.defectItem && defectForm.defectItems.indexOf(defectForm.defectItem) < 0) {
            defectForm.defectItems.push(defectForm.defectItem);
            defectForm.defectItem = null;
        }
        $ionicHistory.goBack(-2);
    }
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.hideDefectStartDate = true;
            $scope.hideDefectCompletionDate = true;
            
            $scope.defectForm = defectForm;
            //$scope.defectForm.project = {displayName:'hahaha'};
        }
    });
})


.controller('RecordProjectsCtrl', function ($scope, u, $state, apiDefectItem) {
    var _this = this;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.projects = [];
            u.showProgress();
            $scope.loading = false;
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
                u.showError(error);
            }).finally(function() {
                $scope.loading = true;
                 u.hideProgress();
            });
        }
    });
})

.controller('RecordUnitsCtrl', function ($scope, u, $state, apiDefectItem) {
    var _this = this;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.units = [];
            u.showProgress();
            $scope.loading = false;
            apiDefectItem.getByProjectId($state.params.projectId).then(function(results) {
                var defectItems = results;  
                var defectItemsByUnitIds = _.groupBy(defectItems, function(o) { return o.unit.id; });
                for(k in defectItemsByUnitIds) {
                    defectItemsByUnitIds[k][0].unit.noOfDefectItem = defectItemsByUnitIds[k].length;
                    $scope.units.push(defectItemsByUnitIds[k][0].unit);   
                }
                console.log($scope.units);
            }).catch(function(error) {
                u.showError(error);
            }).finally(function() {
                $scope.loading = true;
                 u.hideProgress();
            });
        }
    });
})

.controller('RecordDefectItemsCtrl', function ($q, $timeout, $ionicModal, $scope, u, $state, 
                                                 apiDefectItemAreaLocation, 
                                                 apiDefectItemReason,
                                                 apiDefectItemStatus,
                                                 apiDefectItemSeverity,
                                                 apiDefectType,
                                                 apiDefectItem
                                                ) {
    var _this = this;
    
    $ionicModal.fromTemplateUrl('templates/modal/defectitems-filter.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
        
        console.log('init modal');
    });
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.openFilter = function () {
        $scope.modal.show();
        var modalHidden = $scope.$on('modal.hidden', function () {
            modalHidden();
        });
    };
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.defectItems = [];
            $scope.filter = {};
            u.showProgress();
            
            $q.all ([
                apiDefectItemAreaLocation.getAll(),
                apiDefectItemReason.getAll(),
                apiDefectItemStatus.getAll(),
                apiDefectItemSeverity.getAll(),
                apiDefectType.getAll(),
                apiDefectItem.getByUnitId($state.params.id)
                
            ]).then(function(results) {
                $scope.filter.defectItemAreaLocationOptions = results[0];
                $scope.filter.defectItemReasonOptions =  results[1];
                $scope.filter.defectItemStatusOptions =  results[2];
                $scope.filter.defectItemSeverityOptions = results[3];
                $scope.filter.defectTypeOptions = results[4];
                
                
                
                $scope.filter.defectType = null;
                $scope.filter.defectItemStatus = null;
                
                $scope.defectItems = results[5]; 
                
            }).catch(function(error) {
                u.showError(error);
            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})


.controller('RecordDefectItemCtrl',  function ($timeout, $scope, $q, u, $state, apiUnit, $ionicHistory,
                                                     apiDefectItemAreaLocation, 
                                                     apiDefectItemReason,
                                                     apiDefectItemStatus,
                                                     apiDefectItemSeverity,
                                                     apiDefectType,
                                                     apiDefectItem
                                                        
                                                    ) {
    var _this = this;
    
    $scope.back = function() {
        $ionicHistory.goBack(-1);
    }
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            u.showProgress();
            $q.all ([
                apiDefectItemAreaLocation.getAll(),
                apiDefectItemReason.getAll(),
                apiDefectItemStatus.getAll(),
                apiDefectItemSeverity.getAll(),
                apiDefectType.getAll(),
                apiDefectItem.getById($state.params.id)
            ]).then(function(results) {
                
                $scope.defectItemAreaLocationOptions = results[0];
                $scope.defectItemReasonOptions =  results[1];
                $scope.defectItemStatusOptions =  results[2];
                $scope.defectItemSeverityOptions = results[3];
                $scope.defectTypeOptions = results[4];
                $scope.defectItem = results[5];
                
                $scope.unit = $scope.defectItem.unit;
                $scope.project = $scope.defectItem.project;
                
            }).catch(function(error) {
                u.showError(error);
            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

;
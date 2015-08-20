

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
                                                     $scope, $q, u, $state, apiUnit, defectForm, $ionicHistory,
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
                    $scope.defectForm.defectItem.defectLocation = 'img/defect/ceiling-crack-repair.jpg';
                    $scope.defectForm.defectItem.defectType = _.first($scope.defectForm.defectTypeOptions);
                    $scope.defectForm.defectItem.defectItemSeverity = _.first($scope.defectForm.defectItemSeverityOptions);
                    $scope.defectForm.defectItem.defectItemReason = _.first($scope.defectForm.defectItemReasonOptions);
                    $scope.defectForm.defectItem.defectItemStatus = $scope.defectForm.defectItemStatusOptions[1];
                    $scope.defectForm.defectItem.defectItemAreaLocation = $scope.defectForm.defectItemAreaLocationOptions[0];
                }
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('CreateDefectDefectItemCtrl', function ($cordovaImagePicker, 
                                                     $cordovaCamera, 
                                                     $cordovaFile,
                                                     $scope, $q, u, $state, apiUnit, defectForm, $ionicHistory,
                                                     apiDefectItemAreaLocation, 
                                                     apiDefectItemReason,
                                                     apiDefectItemStatus,
                                                     apiDefectItemSeverity,
                                                     apiDefectType
                                                    ) {
    var _this = this;

    

    $scope.urlForImage = function (imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return trueOrigin;
    }
    
    $scope.pickImage = function() { 
//        //img/defect/ceiling-crack-repair.jpg   
        var options = {
            maximumImagesCount: 1,
            width: 640,
            height: 640,
            quality: 50
        };
        $cordovaImagePicker.getPictures(options).then(function (results) {
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
                u.showAlert(results[i]);
            }
            if(results.length) {
                $scope.defectItemLocation = results[0];
            }
        }, function (error) {
            // error getting photos
            u.showAlert(error);
        });  
                                   
                                   return;
// 2
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
        };

        // 3
        $cordovaCamera.getPicture(options).then(function (imageData) {

            // 4
            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }

            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

            // 5
            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = makeid() + name;

                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                        fileEntry.copyTo(
                            fileSystem2,
                            newName,
                            onCopySuccess,
                            fail
                        );
                    },
                    fail);
            }

            // 6
            function onCopySuccess(entry) {
                $scope.$apply(function () {
                    //$scope.images.push(entry.nativeURL);
                    $scope.defectItem.defectLocation = entry.nativeURL;
                });
            }

            function fail(error) {
                console.log("fail: " + error.code);
            }

            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }

        }, function (err) {
            console.log(err);
        });
    };
    $scope.done = function() {
        if(defectForm.defectItem && defectForm.defectItems.indexOf(defectForm.defectItem) < 0) {
            defectForm.defectItems.push(defectForm.defectItem);
            defectForm.defectItem = null;
        }
        $ionicHistory.goBack(-2);
    }
    
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.defectForm = defectForm;
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

.controller('RecordUnitsCtrl', function ($scope, u, $state, apiDefectItem) {
    var _this = this;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.units = [];
            u.showProgress();
            apiDefectItem.getByProjectId($state.params.projectId).then(function(results) {
                var defectItems = results;  
                var defectItemsByUnitIds = _.groupBy(defectItems, function(o) { return o.unit.id; });
                for(k in defectItemsByUnitIds) {
                    defectItemsByUnitIds[k][0].unit.noOfDefectItem = defectItemsByUnitIds[k].length;
                    $scope.units.push(defectItemsByUnitIds[k][0].unit);   
                }
                console.log($scope.units);
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

.controller('RecordDefectItemsCtrl', function ($scope, u, $state, apiDefectItem) {
    var _this = this;
    $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        if(state.direction != 'back') {
            $scope.defectItems = [];
            u.showProgress();
            apiDefectItem.getByUnitId($state.params.id).then(function(results) {
                $scope.defectItems = results;  
            }).catch(function(error) {

            }).finally(function() {
                 u.hideProgress();
            });
        }
    });
})

;
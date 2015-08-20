angular.module('route', ['ionic'])

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    .state('app.create-defect-projects', {
        url: '/create-defect-projects',
        views: {
            'menuContent': {
                templateUrl: 'templates/create-defect-projects.html',
                controller: 'CreateDefectProjectsCtrl'
            }
        }
    })
    .state('app.create-defect-units', {
        url: '/create-defect-project/{projectId}',
        views: {
            'menuContent': {
                templateUrl: 'templates/create-defect-units.html',
                controller: 'CreateDefectUnitsCtrl'
            }
        }
    })
    
    .state('app.create-defect-unit', {
        url: '/create-defect-unit/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/create-defect-unit.html',
                controller: 'CreateDefectUnitCtrl'
            }
        }
    })
    
    .state('app.create-defect-handover', {
        url: '/create-defect-handover/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/create-defect-handover.html',
                controller: 'CreateDefectHandoverCtrl'
            }
        }
    })
    
    .state('app.create-defect-defectitems', {
        url: '/create-defect-defectitems/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/create-defect-defectitems.html',
                controller: 'CreateDefectDefectItemsCtrl'
            }
        }
    })
    
    .state('app.create-defect-defectarealocation', {
        url: '/create-defect-defectarealocation',
        views: {
            'menuContent': {
                templateUrl: 'templates/create-defect-defectarealocation.html',
                controller: 'CreateDefectAreaLocationCtrl'
            }
        }
    })
    
    
    .state('app.create-defect-defectitem', {
        url: '/create-defect-defectitem',
        views: {
            'menuContent': {
                templateUrl: 'templates/create-defect-defectitem.html',
                controller: 'CreateDefectDefectItemCtrl'
            }
        }
    })
    

    .state('app.record-projects', {
        url: '/record-projects',
        views: {
            'menuContent': {
                templateUrl: 'templates/record-projects.html',
                controller: 'RecordProjectsCtrl'
            }
        }
    })
    
    .state('app.record-units', {
        url: '/record-units/{projectId}',
        views: {
            'menuContent': {
                templateUrl: 'templates/record-units.html',
                controller: 'RecordUnitsCtrl'
            }
        }
    })
    
    .state('app.record-defectitems', {
        url: '/record-defectitems/{id}',
        views: {
            'menuContent': {
                templateUrl: 'templates/record-defectitems.html',
                controller: 'RecordDefectItemsCtrl'
            }
        }
    })
    

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/create-defect-projects');
    
    
}).run(function($rootScope, u, apiUser, $ionicModal){
    $rootScope.u = u;
    $rootScope.apiUser = apiUser;
});
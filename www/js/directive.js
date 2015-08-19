angular.module('directive', ['ionic'])

.directive('autogrow', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        angular.element(document).ready(function() {
            $(element).autogrow({onInitialize: true});
        });
    }
  }
});
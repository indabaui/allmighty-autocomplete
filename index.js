var app = angular.module('ngAutocomplete', []);

app.directive('autocomplete', function($compile, $timeout) {
  var index = -1, 
      $input,
      ulTemplate = '<ul class="autocomplete-dropdown" ng-show="dropdown">' +
                    '<li class="suggestion" ng-repeat="suggestion in suggestions | filter:searchFilter" '+
                      'index="{{$index}}"' + 
                      'ng-class="{active:($index == selectedIndex)}"'+
                      'ng-click="select(suggestion)"'+
                      'ng-mouseenter="changeIndex($index)"' +  
                      'ng-mouseleave="changeIndex(0)">' +
                        '{{suggestion}}'+
                    '</li>'+
                  '</ul>';

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="autocomplete"></div>',
    scope: {
      suggestions: '=data'
    },
    controller: ['$scope', '$element', '$transclude', controller], 
    link: link,
  };

  function controller($scope, $element, $transclude) {

    $scope.dropdown = false;
    $scope.selectedIndex = -1;
      
    $transclude(function($clone) {
      $clone.attr('ng-change', 'onChange()');
      $element
      .append($compile($clone)($scope))
      .append($compile(ulTemplate)($scope));
      $input = $element.find('input');
    });
  
    $scope.onChange = function() {
      $scope.searchFilter = $input.val();
      $scope.selectedIndex = 0;
      $scope.dropdown = $scope.searchFilter === "" ? false : true;
    };
      
    $scope.changeIndex = function(index) {
      $timeout(function() {
        $scope.setIndex(index);
      });
    };
    
    $scope.setIndex = function(i) {
      $scope.$apply(function() {
        $scope.selectedIndex = parseInt(i);
      });
      $input.focus();
    };

    $scope.select = function(suggestion){
      $scope.searchFilter = suggestion;
      $scope.dropdown = false;
      $input.val(suggestion);
    };
  }

  function link($scope, $element) {

    $element.keydown(function(e) {
      var key = { left: 37, up: 38, right: 39, down: 40 , enter: 13, tab: 9 },
          keycode = e.keyCode || e.which,
          l = $element.find('li').length;

      switch (keycode) {
        case key.up:
          var index = $scope.selectedIndex;
          if (index <= 0 || index >= l) index = l;
          $scope.setIndex(index-1);
          break;
        case key.down:
          var index = $scope.selectedIndex;
          if (index < 0 || index >= l-1) index = -1;
          $scope.setIndex(index+1);
          break;
        case key.left:
          break;
        case key.tab:
        case key.right:  
        case key.enter:  
          index = $scope.selectedIndex;
          if(isInRange(index, l)) $scope.select(valueAt(index));
          $scope.setIndex(-1);
          break;
        default:
          return;
      }

      if (isInRange($scope.selectedIndex, l) || keycode == key.enter) e.preventDefault();
    });

    function isInRange(index, length) {
      return (index >= 0 && index < length);
    }
    function valueAt(index) {
      return $element.find('li')[index].innerText;
    }
  }
});
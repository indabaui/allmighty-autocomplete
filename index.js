var app = angular.module('ngAutocomplete', []);

app.directive('autocomplete', function($compile, $timeout) {
  var index = -1, 
      $input,
      ulTemplate = '<ul class="autocomplete-dropdown" ng-show="dropdown">' +
                    '<li class="suggestion" ng-repeat="suggestion in getSuggestions() | filter:searchFilter" '+
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
    template: '<div></div>',
    controller: ['$scope', '$element', controller], 
    scope: {
        model: '=',
        data: '=',
        type: '@'
    },
    link: link,
  };

  function controller($scope, $element) {
    $scope.dropdown = false;
    $scope.selectedIndex = -1;
    
    var attributes = $element[0].attributes, attrMap = {}, name;
      
    for (var i=0;i<attributes.length;i++) {
      name = attributes[i].name;
      if (name === "type" || name === "model") continue;
      attrMap[name] = attributes[i].nodeValue;
    }

    $input = $('<input ng-model="inputValue" type="'+$scope.type+'" ng-change="onChange()"/>');
    $input.attr(attrMap);
    $element
    .append($compile($input)($scope))
    .append($compile(ulTemplate)($scope));
  
    $scope.onChange = function() {
      $scope.model = $scope.inputValue;
      $scope.searchFilter = $scope.inputValue;
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
        $scope.selectedIndex = parseInt(i, 10);
      });
      $input.focus();
    };

    $scope.select = function(suggestion){
      $scope.searchFilter = suggestion;
      $scope.dropdown = false;
      $input.val(suggestion);
      $scope.model = suggestion;
    };
  }

  function link($scope, $element, $attrs) {

    $scope.getSuggestions = function() {
      return (typeof($scope.data) === 'function') ? $scope.data() : $scope.data;
    };

    $element.keydown(function(e) {
      var key = { left: 37, up: 38, right: 39, down: 40 , enter: 13, tab: 9 },
          keycode = e.keyCode || e.which,
          l = $element.find('li').length,
          index;

      switch (keycode) {
        case key.up:
          index = $scope.selectedIndex;
          if (index <= 0 || index >= l) index = l;
          $scope.setIndex(index-1);
          break;
        case key.down:
          index = $scope.selectedIndex;
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
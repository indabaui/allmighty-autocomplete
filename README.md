allmighty-autocomplete
======================

Simple to use autocomplete directive in a module for AngularJS!
Supports arrow keys to traverse suggestions as well as mouse input. 
You can load the suggestions from a remote REST API, it also supports promises. 

Install:

```
  component install indabaui/allmighty-autocomplete
```

In your main script file you should add it as dependency:

```javascript
require("indabaui-allmighty-autocomplete")

var app = angular.module('app', ['ngAutocomplete']);
```

## Usage

If you now want an autocomplete you can just use the tag `<autocomplete>` tag in your HTML. With the `data` parameter you can pass in an array that will be used for autocompletion. You need to pass there something which is available in the $scope of your controller. 

You can also pass a function that receives changes with the `on-type` attribute. This is useful if you need to load external resources from a REST API, for example, you cna then upload the array you passed into `data` and it will automatically use the changed array.

### Attributes

`data` : Pass an array to the autocomplete directive. Should be accessible in the $scope of your controller.

## Example

HTML: 
```html
    <div ng-controller="MyCtrl">  
      <autocomplete data="movies">
      	<input type="text" ng-model="myModel">
      </autocomplete>
    </div>
```

JavaScript:
```javascript
	var app = angular.module('app', ['ngAutocomplete']);

	app.controller('MyCtrl', function($scope, MovieRetriever){
		$scope.movies = ["Lord of the Rings",
		 				"Drive",
		 				"Science of Sleep",
		 				"Back to the Future",
		 				"Oldboy"];
	});

```



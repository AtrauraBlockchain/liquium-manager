'use strict';

angular.module('liquiumapi')
.controller('CollectionListController', function (APP, $rootScope, $scope, Restangular, $stateParams, $timeout, $http, $state, $location, Pagination, $modal, $log) {

  $scope.organization = '0x30861e0fa53f5d9d3fea736439817047412d1aca';

  $scope.orgInfo = {};

  //var api = Restangular.all('collections');
  var updateCollections = function() {
    liquiumContracts.getOrganizationInfo(web3, $scope.organization, 
      function(err, res) {
        console.log(res); 
        $scope.$apply(function() {
          angular.copy(res, $scope.orgInfo);

          var info = $scope.orgInfo;
        });
        
      })
  }


  updateCollections();

  $scope.submitText = 'Create';
  $scope.newCategoryName = '';
  $scope.waiting = false;
  $scope.animationsEnabled = true;

  $scope.collection = {};

  $scope.pollTitle;
  $scope.pollQuestion;
  $scope.pollCloseDelegateTime;
  $scope.pollCloseTime;
  $scope.pollChoices = [];

  $scope.choices = [{id: 'choice1'}, {id: 'choice2'}];
  
  $scope.addNewChoice = function() {
    var newItemNo = $scope.choices.length+1;
    $scope.choices.push({'id':'choice'+newItemNo});
  };
    
  $scope.removeChoice = function() {
    var lastItem = $scope.choices.length-1;
    $scope.choices.splice(lastItem);
  };


  
  $scope.addDelegate = function () {

    $scope.waiting = true;

    $scope.submitText = 'Processing...';

    if($scope.newCategoryName){
      //$scope.$watch( "waiting" )

      liquiumContracts.addCategory(web3, $scope.organization, this.newCategoryName, 0, 
      function(err, res) {
        console.log(res);
        console.log(err);
        $scope.waiting = false;
        $scope.submitText = 'Create';
      })

      console.log("ara soc aqui");



    }


  }



  $scope.submit = function () {
    var body = $scope.collection
    $scope.submitText = 'Processing...'
    $http.post('/add-data', body, {}).then(function(res) {
      $timeout(function() {
        $scope.submitText = 'Submit'
        $state.go('documents', {name: res.data.name}, {location: 'replace'})
      }, 1000);

      console.log(res);
    }, function(err) {
      $scope.submitText = 'Submit'
      alert(err)
      console.log(err);
    });
  }

  $scope.showMapping = function (name, size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/modals/mapping.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        mapping: function() {
          var metadataApi = Restangular.one(name + '/metadata');
          return metadataApi.get();
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      $scope.testowy = "testowy";
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

  $scope.showItem = function (poll) {
    var modalInstance = $modal.open({
      templateUrl: 'views/modals/pollView.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
      resolve: {
        item: function() {
          console.log(poll);
          return poll;
        }
      }
    });
  };

  $scope.showFormCategory = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/modals/addCategory.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
      resolve: {
        item: function() {
          return $scope.submitText;
        }
      }
    });
  };

  $scope.showFormPoll = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/modals/createPoll.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
      resolve: {
        item: function() {
          return $scope.submitText;
        }
      }
    });
  };



});

angular.module('liquiumapi').controller('ModalInstanceCtrl', function ($scope, $modalInstance, mapping) {

  $scope.item = item;
  $scope.item2 = JSON.stringify(item, null, 4);

  $scope.mapping = mapping;
  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
    console.log(tancant);
  };

  $scope.codemirrorLoaded = function(_editor){
    _editor.focus();
    _editor.refresh();
  };

  $modalInstance.opened.then(function (selectedItem) {
    $timeout(function() {
      $scope.isRefreshed = true;
    }, 10);
  });

});


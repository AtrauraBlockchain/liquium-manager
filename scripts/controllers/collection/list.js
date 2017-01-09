'use strict';

angular.module('liquiumapi')
.controller('CollectionListController', function (APP, $rootScope, $scope, $window, Restangular, $stateParams, $timeout, $http, $state, $location, Pagination, $modal, $log) {

  $scope.organization = $rootScope.org;

  $scope.orgInfo = {};
  var updateCollections = function() {
    liquiumContracts.getOrganizationInfo(web3, $scope.organization, 
      function(err, res) {
        console.log(res);
        $scope.$apply(function() {

          angular.copy(res, $scope.orgInfo);

        });
        
      });
  }


  updateCollections();

  $scope.submitText = 'Create';
  $scope.newCategoryName = '';
  $scope.newDelegateName = '';
  $scope.newDelegateAddr = '';
  $scope.newVoterName = '';
  $scope.newVoterAddr = '';
  $scope.waiting = false;
  $scope.animationsEnabled = true;

  $scope.collection = {};

  $scope.pollTitle;
  $scope.pollQuestion;
  $scope.pollCloseDelegateTime;
  $scope.pollCloseTime;
  $scope.pollCategory;
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


  $scope.addCategory = function () {

    $scope.waiting = true;

    $scope.submitText = 'Processing...';

    if($scope.newCategoryName){

      liquiumContracts.addCategory(web3, $scope.organization, this.newCategoryName, 0,
      function(err, res) {
        if(err){
          console.log(err);
        }
        
        $scope.waiting = false;
        $window.alert('Category added succesfully');
        $scope.submitText = 'Create';
      });

    }

  };

  $scope.deployOrg = function () {

    $scope.waiting = true;

    $scope.submitText = 'Processing...';

    liquiumContracts.deployOrganization(web3, web3.eth.accounts[0], {},
      function(err, organization) {
        console.log(organization);
        if(err){
          console.log(err);
        }
        $scope.waiting = false;
        $window.alert('New organization created with adress: ' + organization.address);
        $scope.$apply(function() {
          $scope.submitText = 'Create';
        });
      });

  }

  $scope.removeCategory = function (id) {

    liquiumContracts.removeCategory(web3, $scope.organization, id,
      function(err) {
        if(!err){
          $window.alert('Category succesfully deleted');
        } else {
          console.log(err);
          $window.alert("Couldn't delete the category");
        }


      })

  };

  $scope.addDelegate = function () {

    $scope.waiting = true;

    $scope.submitText = 'Processing...';

    if($scope.newDelegateName){

      liquiumContracts.addDelegate(web3, $scope.organization, this.newDelegateAddr, this.newDelegateName,
      function(err, res) {
        if(err){
          console.log(err);
        }
        $scope.waiting = false;
        $window.alert('Delegate added succesfully');
        $scope.submitText = 'Create';
      });


    }


  };

  $scope.addPoll = function () {

    $scope.waiting = true;

    if($scope.pollTitle){

    liquiumContracts.deploySingleChoice(
      web3,
      $scope.organization,
      this.pollTitle,
      {
        question: this.pollQuestion,
        options: this.pollChoices,
        closeDelegateTime: Math.floor(this.pollCloseDelegateTime.getTime()/1000),
        closeTime:  Math.floor(this.pollCloseTime.getTime()/1000),
        idCategory: this.pollCategory
      },
      function(err, res) {
        if(err) {
            console.log("Error: "+err);
        } else {
            $window.alert('Poll created succesfully');
        }
      }
    );
  }
  };

  $scope.addVoter = function () {

    $scope.waiting = true;

    $scope.submitText = 'Processing...';

    if($scope.newVoterName){

      liquiumContracts.addVoter(web3, $scope.organization, this.newVoterAddr, this.newVoterName, 1,
      function(err, res) {
        if(err) {
            console.log("Error: "+err);
        } else {
        
        $scope.waiting = false;
        $window.alert('Voter added succesfully');
        $scope.submitText = 'Create';
        }

      });


    }


  };

  $scope.removeDelegate = function (id) {

    liquiumContracts.removeDelegate(web3, $scope.organization, id,
      function(err, res) {
        if(err == null){
          $window.alert('Delegate succesfully deleted');
        } else {
          console.log(err);
          $window.alert("Couldn't delete the delegate");
        }


      });
  };

  $scope.removeVoter = function (id) {

    liquiumContracts.removeVoter(web3, $scope.organization, id,
      function(err, res) {
        if(err == null){
          $window.alert('Voter succesfully deleted');
        } else {
          console.log(err);
          $window.alert("Couldn't delete the voter");
        }


    });



  };

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

  $scope.showFormVoter = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/modals/addVoter.html',
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

  $scope.showFormDelegate = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/modals/addDelegate.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
      resolve: {
        item: function() {
          return $scope.submitText;
        }
      }
    });
  };

  $scope.showFormOrg = function () {
    var modalInstance = $modal.open({
      templateUrl: 'views/modals/createOrg.html',
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
    console.log("ok");
    console.log($scope.mapping);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
    console.log("cancel");
    console.log($scope.mapping);
  };

  $scope.codemirrorLoaded = function(_editor){
    _editor.focus();
    _editor.refresh();
    console.log("codemirrorLoaded");
    console.log($scope.mapping);
  };

  $modalInstance.opened.then(function (selectedItem) {
    $timeout(function() {
      $scope.isRefreshed = true;
      console.log("opened");
      console.log($scope.mapping);
    }, 10);
  });

});

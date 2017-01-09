'use strict';

angular.module('liquiumapi')
.controller('CollectionListController', function (APP, $rootScope, $scope, $window, Restangular, $stateParams, $timeout, $http, $state, $location, Pagination, $modal, $log) {

  $scope.organization = $rootScope.org;

  $scope.orgInfo = {};
  var updateCollections = function() {
    liquiumContracts.getOrganizationInfo(web3, $scope.organization, 
      function(err, res) {
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


    $scope.submitText = 'Processing...';

    if($scope.newCategoryName){

      liquiumContracts.addCategory(web3, $scope.organization, this.newCategoryName, 0,
      function(err, res) {
        if(err){
          console.log(err);
          $window.alert("Couldn't create category");
        }
        
        $window.alert('Category added succesfully');
        $scope.submitText = 'Create';
      });

    }

  };

  $scope.deployOrg = function () {

    $scope.submitText = 'Processing...';

    liquiumContracts.deployOrganization(web3, web3.eth.accounts[0], {},
      function(err, organization) {
        if(err){
          console.log(err);
        }
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


    $scope.submitText = 'Processing...';

    if($scope.newDelegateName){

      liquiumContracts.addDelegate(web3, $scope.organization, this.newDelegateAddr, this.newDelegateName,
      function(err, res) {
        if(err){
          console.log(err);
          $window.alert("Couldn't add delegate");
        }
        $window.alert('Delegate added succesfully');
        $scope.submitText = 'Create';
      });


    }


  };

  $scope.addPoll = function () {


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
            $window.alert("Error creating poll");
        } else {
            $window.alert('Poll created succesfully');
        }
      }
    );
  }
  };

  $scope.addVoter = function () {
    $scope.submitText = 'Processing...';

    if($scope.newVoterName){

      liquiumContracts.addVoter(web3, $scope.organization, this.newVoterAddr, this.newVoterName, 1,
      function(err, res) {
        if(err) {
            console.log("Error: "+err);
            $window.alert("Couldn't add voter");
        } else {
        
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

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

  $scope.showItem = function (poll, category) {
    var modalInstance = $modal.open({
      templateUrl: 'views/modals/pollView.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
      resolve: {
        item: function() {
          var retPoll = {};
          angular.copy(poll, retPoll);
          retPoll.idCategory = category;
          return retPoll;
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

angular.module('liquiumapi')
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, item, $timeout) {

  $scope.item = item;



});

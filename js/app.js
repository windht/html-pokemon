angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','angularTypewrite'])

.run(function($interval,Intervals,keyCode,Function,$rootScope,Transform,$timeout,Player,Device,$ionicPlatform,$rootScope) {
    
    Device.height=$(window).height();
    Device.width=$(window).width();

    Device.mask=true;


    angular.element(window).on('keydown', function(e) {

      if (e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40) {
        keyCode[e.keyCode]=true;
        Player.moving=true;
        if ( angular.isDefined(Intervals.update) ) return;
        Intervals.update = $interval(Function.update, 100);
      }
      else if (e.keyCode==90) {
        Function.checkEvent();
      }
    });

  angular.element(window).on('keyup', function(e) {
    if (e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40) {
      keyCode[e.keyCode]=false;
      $interval.cancel(Intervals.update);
      Intervals.update=undefined;
      Player.moving=false;
    }
  });

    var d=new Date();
    var time=d.getHours();
    if (time<=12) {
      Device.currentTime="am"
    }
    else {
      Device.currentTime="pm"
    }
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.views.transition('none');
  $stateProvider

    .state('main-map', {
    url: "/map/{place}/{direction}/{coorX}/{coorY}",
    templateUrl: "templates/tabs.html",
    controller:'DashCtrl'
  })

  $urlRouterProvider.when('/', '/map/borntown/3/15/39');
  $urlRouterProvider.otherwise('/map/borntown/3/15/39');

});



angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','angularTypewrite'])

.run(function(Pixel,$state,Game,$interval,Intervals,keyCode,Function,$rootScope,Transform,$timeout,Player,Device,$ionicPlatform,$rootScope) {
    Device.height=$(window).height();
    Device.width=$(window).width();
    // Device.mask=true;

    angular.element(window).on('keydown', function(e) {
      // console.log(e.keyCode);

      // 菜单关闭时
      if (Game.menu==false && (e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40) ) {
        keyCode[e.keyCode]=true;
        Player.moving=true;
        if ( angular.isDefined(Intervals.update) ) return;
        Intervals.update = $interval(Function.update, 100);
      }
      if (Game.menu && (e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40) ){
        if (e.keyCode==38) {
          if (Game.menuSelected==0) {
            Game.menuSelected=Game.menuItems.length-1
          }
          else {
            Game.menuSelected-=1
          }        
        }
        if (e.keyCode==40) {
          if (Game.menuSelected==Game.menuItems.length-1) {
            Game.menuSelected=0
          }
          else {
            Game.menuSelected+=1
          } 
        }
      }
      if (Game.menu==false && (e.keyCode==90 || e.keyCode==32)) {
        Function.checkEvent();
      }
      //菜单打开时
      if (Game.menu==true && (e.keyCode==90 || e.keyCode==32)) {
        $state.go(Game.menuItems[Game.menuSelected].state)
      }

      if (e.keyCode==13) {

        Game.menu=!Game.menu;
        //
      }

      $rootScope.$apply()
    });

  angular.element(window).on('keyup', function(e) {
    if (e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40) {
      keyCode[e.keyCode]=false;
      $interval.cancel(Intervals.update);
      Intervals.update=undefined;
      Player.moving=false;
    }
  });

  var baseCanvas,
      baseContext,
      coolCanvas,
      coolContext;

  baseCanvas=document.getElementById('baseCanvas');
  baseContext=baseCanvas.getContext('2d');
  var baseImg=new Image();
  baseImg.src="outdoor.png";
  baseImg.onload=function(){
    baseCanvas.width=baseImg.width;
    baseCanvas.height=baseImg.height;
    baseContext.drawImage(baseImg,0,0);
    var cols=baseImg.width/32;
    var rows=baseImg.height/32;
    for (var i=0;i<rows;i++){
      for (var j=0;j<cols;j++){
        var index=i*cols+j;
        Pixel.outdoor[index]=baseContext.getImageData(j*32,i*32,32,32);
      }
    }
  };





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
  .state('pokemon-dashboard', {
    url: "/pokemon-owning",
    templateUrl: "templates/pokemon-dashboard.html",
    controller:'PokeMonDashCtrl'
  })
  .state('battle', {
    url: "/battle",
    templateUrl: "templates/battle.html",
    controller:'BattleCtrl'
  })

  $urlRouterProvider.when('/', '/map/borntown/3/15/39');
  $urlRouterProvider.otherwise('/map/borntown/3/15/39');

});



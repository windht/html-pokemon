angular.module('starter.controllers', [])

.controller('MainCtrl',function(Events,Device,keyCode,Intervals,Function,Transform,Player,$scope,$interval){
  $scope.Player=Player;
  $scope.Device=Device;

  $scope.onHold=function() {
    
  }

  $scope.releaseKey=function(key) {
    console.log('release')
    keyCode[key]=false;
    Player.moving=false;
    Player.currentPose=1;


    $interval.cancel(Intervals.update);
    Intervals.update=undefined;
  }

  $scope.triggerKey=function(key) {
    keyCode[key]=true;
    if ( angular.isDefined(Intervals.update) ) return;
    Intervals.update = $interval(Function.update, 100);
  }
})


.controller('DashCtrl', function(Enemy,$timeout,Scenarios,Events,NPC,$stateParams,Blocks,Transform,Map,Player,Device,$scope,$http,$interval) {
  $scope.open='';
  $scope.Map=Map;
  $scope.NPC=NPC;
  $scope.Transform=Transform;
  NPC.people=[
    {
      image:'oldman',
      hash:1,
      coorX:22,
      coorY:43,
      direction:1,
      text:"I'm too old to play with you, have fun around the city!",
      talk:false
    },
    {
      image:'nurse',
      hash:2,
      coorX:18,
      coorY:41,
      direction:3,
      text:'we really welcome you to come to our pmCenter!',
      talk:false
    }
  ]
  $scope.compareY=function(y) {
    if (y>=Player.coorY) {
      return 16;
    }
    else {
      return 14;
    }
  }
  $scope.$on('$ionicView.leave',function(){ //换地图就初始化所有的数组
    Events.list=[];
    Events.detail=[];
    Blocks.Npc=[];
    Map.fromMap=$stateParams.place;
    Player.coorX=undefined;
    Player.coorY=undefined;
  })


  $scope.$on('$ionicView.enter',function(){
    Scenarios.interval=$interval(Scenarios.run,200);
    Map.currentMap=$stateParams.place;
    Player.coorX=undefined;
    Player.coorY=undefined;
    $('.map').css('backgroundImage','url(img/'+Map.currentMap+'.png)');
    $('.building').css('backgroundImage','url(img/'+Map.currentMap+'-building.png)');
    $http.get('maps/'+Map.currentMap+'.json').success(function(map){
      var length=map.layers.length-1;
      //地图长度的获取
      Map.height=map.height;
      Map.width=map.width;
      //出生点的获取
      //地图阻断器的放置
      Blocks.Building=map.layers[1].data;
      //NPC的产生
      for (i in NPC.people) {
        Blocks.Npc.push(Transform.coorToArray([NPC.people[i].coorX,NPC.people[i].coorY]));
      }
      for (i in map.layers[length].objects) {
        Events.list.push(Transform.coorToArray([(Math.floor(map.layers[length].objects[i].x/32)),(Math.floor(map.layers[length].objects[i].y/32))]));
        Events.detail.push(map.layers[length].objects[i]);
        if (map.layers[length].objects[i].type=="enemy") {
          Enemy.zone.push({
            cornerLeftUp:Transform.coorToArray([(Math.floor(map.layers[length].objects[i].x/32)),(Math.floor(map.layers[length].objects[i].y/32))]),
            cornerRightBottom:Transform.coorToArray([(Math.floor((map.layers[length].objects[i].x+map.layers[length].objects[i].width)/32)),(Math.floor((map.layers[length].objects[i].y+map.layers[length].objects[i].height)/32))])
          })
        }
      }
      Player.coorX=parseInt($stateParams.coorX);
      Player.coorY=parseInt($stateParams.coorY);
      Player.direction=$stateParams.direction;
      
      $timeout(function(){
        Device.mask=false;
        Device.controller=true;
      },500)
      
     

    })
  })    
})

.controller('EmptyCtrl', function() {

})


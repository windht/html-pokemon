angular.module('starter.services', [])

.factory('NPC',function(){
  return {
    people:[],
    move:function(){

    }
  }
})

.factory('Blocks',function(){
  return {
    Building:[],
    Npc:[]
  }
})

.factory('Enemy',function(){
  return {
    zone:[]
  }
})

.factory('Events',function(){
  return {
    list:[],
    detail:[]
  }
})

.factory('Scenarios',function($interval,NPC){
  var self= {
    list:[{
     peopleIndex:0,
     movements:[],
    },
    {
     peopleIndex:1,
     movements:[],
    }],
    currentList:0,
    currentStep:0,
    interval:undefined,
    run: function(type) {
      var npcIndex=self.list[self.currentList].peopleIndex;
      var direction=self.list[self.currentList].movements[self.currentStep]
      if (NPC.people[npcIndex].direction!=direction) {
        NPC.people[npcIndex].direction=direction;
      }
      else {
        if (direction==1) {NPC.people[npcIndex].coorY-=1}
        if (direction==2) {NPC.people[npcIndex].coorX+=1}
        if (direction==3) {NPC.people[npcIndex].coorY+=1}
        if (direction==4) {NPC.people[npcIndex].coorX-=1}
      }       
      if (self.currentStep<self.list[self.currentList].movements.length-1) {
        self.currentStep+=1;
      }
      else if (self.currentList<self.list.length-1){
        self.currentStep=0;
        self.currentList+=1;
      }
      else {
        self.currentStep=0;
        self.currentList=0;
        $interval.cancel(self.interval);
        self.interval=undefined;
      }
    }
  }

  return self;
})

.factory('Device',function(){
  return {
    width:0,
    height:0,
    currentTime:'',
    mask:false,
    controller:false
  }
})

.factory('Intervals',function(){
  return {
    update:undefined
  }
})

.factory('Transform',function(Device,Map,Blocks){

  return {
    coorToPos:function(axis,coor) {
      var pos;
      if (axis=="X") {
        pos=Device.width/2-16-coor*32;
      }
      if (axis=="Y") {
          pos=Device.height/2-16-coor*32;
      }
      if (pos>64) {
          pos=64;
      }
      return pos;
    },
    peopleCoorToPos:function(axis,coor) {
      var pos;
      if (axis=="X") {
        pos=coor*32;
      }
      if (axis=="Y") {
        pos=coor*32-16;
      }
      return pos;
    },
    coorToArray:function(coor) {
      if (coor[0]>=0 && coor[0]<Map.width && coor[1]>=0 && coor[1]<Map.height) {
        return coor[0]+coor[1]*Map.width;
      }  
    },
    turnAround:function(direction){
      if (direction==1){return 3;}
      if (direction==2){return 4;}
      if (direction==3){return 1;}
      if (direction==4){return 2;}
    }
  }
})

.factory('Helper',function(Transform){
  return {
    getIndex:function(direction,x,y){
      var index;
      if (direction==1) {
        index=Transform.coorToArray([x,y-1]);
      }
      if (direction==2) {
        index=Transform.coorToArray([x+1,y]);
      }
      if (direction==3) {
        index=Transform.coorToArray([x,y+1]);
      }
      if (direction==4) {
        index=Transform.coorToArray([x-1,y]);
      }
      return index;
    },
  }
})

.factory('Function',function(Events,Device,keyCode,$interval,Helper,Blocks,NPC,Player,Transform,Map,$state,$timeout){
  var self={
    checkTouch:function(direction,x,y) {

      var index=Helper.getIndex(direction,x,y);
      var currentIndex=Transform.coorToArray([x,y]);
      //离开事件
      for (i in Events.list) {
        if (Events.list[i]==currentIndex && Events.detail[i].type=='exit') {
          var detail=Events.detail[i].name.split(',');
          if (direction==detail[0]) { //如果目前的方向就是离开的方向
            Device.controller==false;
            Device.mask=true; 
            $timeout(function(){
              $state.go('main-map',{place:detail[1],direction:detail[0],coorX:detail[2],coorY:detail[3]})
            },500); //第二位的就是详细的位置
            return;
          }
        }
      }
      //碰撞事件
      if (Blocks.Building[index]==1 || Blocks.Building[index]==undefined || Blocks.Npc.indexOf(index)!=-1) {
          return false;
      }
      else {
        return true;
      }
      
    },
    checkEvent:function(){
      var index=Helper.getIndex(Player.direction,Player.coorX,Player.coorY);
      if (Blocks.Npc.indexOf(index)!=-1) {
        NPC.people[Blocks.Npc.indexOf(index)].direction=Transform.turnAround(Player.direction);
        NPC.people[Blocks.Npc.indexOf(index)].talk=true;
        $timeout.cancel(NPC.people[Blocks.Npc.indexOf(index)].timeout);
        NPC.people[Blocks.Npc.indexOf(index)].timeout=undefined;
        NPC.people[Blocks.Npc.indexOf(index)].timeout=$timeout(function(){
          NPC.people[Blocks.Npc.indexOf(index)].talk=false;
        },2000)
      }
      else {
        console.log(Blocks.Building[index]);
      }    
    },
    update:function(){
      if (Device.controller==true) {
        if(keyCode[38]) { //up arrow
            if (Player.direction!=1){
              Player.direction=1;
              Player.moving=false;
            }
            else if (self.checkTouch(1,Player.coorX,Player.coorY)){
              Player.moving=true;
              Player.coorY-=1;   
            }   
         }
         if(keyCode[40]) {
            if (Player.direction!=3){
              Player.direction=3;
              Player.moving=false;
            }
            else if (self.checkTouch(3,Player.coorX,Player.coorY)){ //down arrow
              Player.moving=true;
              Player.coorY+=1;
            }
         }
         if(keyCode[39]) { 
            if (Player.direction!=2){
              Player.direction=2;
              Player.moving=false;
            }
            else if (self.checkTouch(2,Player.coorX,Player.coorY)) {// right arrow
              Player.moving=true;
              Player.coorX+=1;
            }
         }
         if(keyCode[37]) {
            if (Player.direction!=4){
              Player.direction=4;
              Player.moving=false;
            }
            else if (self.checkTouch(4,Player.coorX,Player.coorY)) { // left arrow
              Player.moving=true;
              Player.coorX-=1;
            }
         } 
      }
    }
  }
  return self;
})

.factory('keyCode',function(){
  return {
    37:false, //left
    38:false, //up
    39:false, //right
    40:false, // down
    90:false  // z
  }
})

.factory('Player',function(){
  return {
    direction:3,
    moving:false,
    currentPose:1,
    walkPose:[1,1,2,2,1,1,4,4],
    runPose:[1,2,1,4],
    poseIndex:0,
    coorX:0,
    coorY:0
  }
})

.factory('Map',function(){
  return {
    width:0,
    height:0,
    currentMap:'',
    fromMap:'borntown'
  }
})

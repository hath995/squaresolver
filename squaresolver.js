var _ = require('lodash');

function Point(x,y) {
  this.x = x;
  this.y = y;
}

var equal = function(point, another) {
  if(point.x === another.x && point.y === another.y) {
    return true;
  }
  return false;
}


var toString = function(point) {
  return "("+point.x+","+point.y+")";
}

function inBoundingBox(point) {
  if(point.x > 5 || point.x < -5) {
    return false;
  }else if(point.y > 5 || point.y < -5) {
    return false;
  }
  return true;
}

function victory(blocks, conditions) {
  var result = true;
  for(var i = 0; i < conditions.length; i++) {
    result = result && (equal(blocks[i].pos, conditions[i]));
  }
  return result;
}


function Block(name, pos, dir) {
  this.pos = pos;
  this.dir = dir;
  this.name= name;
}

var move = function(b, dir, blocks, arrows) {
  //console.log(b);
  var direction = dir || b.dir;
  //console.log("before ",b.pos)
  //console.log("direction ",direction);
  b.pos.x += direction.x;
  b.pos.y += direction.y;
  //console.log("after ",b.pos)

  for(var i = 0; i<blocks.length; i++) {
    if(blocks[i] != b && equal(b.pos, blocks[i].pos)) {
      move(blocks[i], direction, blocks, arrows);
    }
  }
  var change = arrows[toString(b.pos)];
  if(change) {
    b.dir = change;
  }
}


//blocks.push(new Block("red", new Point(1,0), new Point(-1,0) ) );
//blocks.push(new Block("blue", new Point(-2,1), new Point(0,-1) ) );
//blocks.push(new Block("black", new Point(1,0), new Point(1,0) ) );

function solveMap(blocks, choices, prevchoice, countdown, arrows, victorycs) {
//console.log(choices);
  if(prevchoice) {
    if(!inBoundingBox(blocks[prevchoice].pos)) {
      return null;
    }
  }
  if(countdown == 0) {
    return null;
  }
  var blockCopies = [];
  for(var i=0; i < blocks.length; i++) {
    blockCopies.push(_.cloneDeep(blocks));
  }
  for(var i = 0; i < blocks.length; i++) {
    //console.log("before move");
    //console.log(blockCopies[i][i])
    move(blockCopies[i][i], null, blockCopies[i], arrows);
    //console.log("after move");

    if(!victory(blockCopies[i], victorycs)) {
      var thing = _.cloneDeep(choices);
      thing.push(i);
      //console.log("after cloneDeep");
      solveMap(blockCopies[i], thing, i, countdown-1, arrows, victorycs); 
      //console.log("after solveMap");
    }else{
      choices.push(i);
      console.log("Victory "+choices);
      return null;
    }
  }
}
//solveMap(blocks,[],null,21);
//move(blocks[0]);
//move(blocks[1]);
//move(blocks[2]);
//console.log(blocks);
//console.log(victoryConditions);
//console.log(victory(blocks,victoryConditions));
var UP = new Point(0,1);
var DOWN = new Point(0,-1);
var RIGHT = new Point(1,0);
var LEFT = new Point(-1,0);
var levels = {
  0: {
    blocks: [new Block("red",new Point(0,2), new Point(0,-1))],
    victorycs:[new Point(0,0)],
    arrows:{}
  },
  1: {
    blocks: [new Block("red",new Point(0,-1), new Point(0,1)), new Block("blue", new Point(0,2), new Point(0,-1))],
    victorycs:[new Point(0,0),new Point(0,1)],
    arrows:{}
  },
  2: {
    blocks: [
      new Block("red", new Point(-2,0), new Point(1,0)),
      new Block("blue", new Point(-1,-2), new Point(0,1)),
      new Block("black", new Point(1,-1), new Point(-1,0)),
    ],
    victorycs:[new Point(0,0), new Point(-1,0), new Point(-1,-1)],
    arrows:{}
  },
  3: {
    blocks: [
      new Block("red", new Point(4,1), new Point(-1,0)),
      new Block("blue", new Point(2,3), new Point(0,-1)),
    ],
    victorycs:[new Point(0,0), new Point(2,-2),],
    arrows:{}
  },
  4: {
    blocks: [
      new Block("red", new Point(0,1), new Point(0,-1)),
      new Block("blue", new Point(-1,0), new Point(1,0)),
      new Block("black", new Point(1,0), new Point(0,-1)),
    ],
    victorycs:[new Point(0,0), new Point(2,-2), new Point(1,-1)],
    arrows:{}
  },
  5: {
    blocks: [
      new Block("red", new Point(0,1), new Point(0,-1)),
      new Block("blue", new Point(-1,0), new Point(1,0)),
      new Block("black", new Point(1,0), new Point(0,-1)),
    ],
    victorycs:[new Point(0,0), new Point(1,-1), new Point(2,-2)],
    arrows:{}
  },
  6: {
    blocks: [
      new Block("red", new Point(1,3), DOWN),
      new Block("blue", new Point(2,2), LEFT),
      new Block("black", new Point(0,1), UP),
    ],
    victorycs:[new Point(0,0), new Point(-1,2), new Point(-2,3)],
    arrows:{}
  },
  7: {
    blocks: [
      new Block("blue", new Point(-2,0), DOWN),
    ],
    victorycs:[new Point(0,0)],
    arrows:{"(-2,-2)":RIGHT,"(0,-2)":UP}
  },
  8: {
    blocks: [
      new Block("red", new Point(-2,0), DOWN),
      new Block("black", new Point(-2,-2), RIGHT),
    ],
    victorycs:[new Point(0,0), new Point(1,0)],
    arrows:{"(-2,-2)":RIGHT,"(0,-2)":UP}
  },
  9: {
    blocks: [
      new Block("red", new Point(-1,-1), RIGHT),
      new Block("black", new Point(1,-1), UP),
    ],
    victorycs:[new Point(0,0), new Point(1,0)],
    arrows:{"(-1,-1)":RIGHT,"(1,-1)":UP,"(2,-1)":LEFT}
  },
  10: {
    blocks:[
      new Block("red", new Point(1,2),DOWN ),
      new Block("blue", new Point(3,0), LEFT ),
      new Block("black", new Point(1,-2), UP )
    ],
    victorycs:[
      new Point(0,0),
      new Point(2,0),
      new Point(-1,0)
    ],
    arrows:{
      "(1,0)":RIGHT
    }
  },
  11:{
     blocks:[
      new Block("red", new Point(-1,2), RIGHT ),
      new Block("blue", new Point(3,2), LEFT ),
      new Block("black", new Point(1,-2), UP )
    ],
    victorycs:[
      new Point(0,0),
      new Point(1,0),
      new Point(2,0)
    ],
    arrows:{
      "(1,2)": DOWN
    }
  },
  31: {
    blocks:[
      new Block("red", new Point(1,0), new Point(-1,0) ),
      new Block("blue", new Point(0,2), new Point(0,-1) ),
      new Block("black", new Point(-1,1), new Point(1,0) )
    ],
    victorycs:[
      new Point(0,0),
      new Point(-2,0),
      new Point(2,0)
    ],
    arrows:{
      "(0,2)":{x:0,y:-1},
      "(-1,1)":{x:1,y:0},
      "(1,0)":{x:-1,y:0},
      "(0,-2)":{x:0,y:1}
    }
  }
};
var curlevel=11;
solveMap(levels[curlevel].blocks, [], null, 15, levels[curlevel].arrows, levels[curlevel].victorycs);

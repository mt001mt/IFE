// JavaScript Document

document.addEventListener("DOMContentLoaded", function(){
  //添加click事件
  window.addEventListener("click", function(e) {
    switch (e.target.id) {
      case "excute":
        block.click();
        break;
      case "go":
        block.click("GO");
        break;
      case "turnLeft":
        block.click("TUN LEF");
        break;
      case "turnRight":
        block.click("TUN RIG");
        break;
      case "turnBack":
        block.click("TUN BAC");
        break;
      case "travelLeft":
        block.click("TRA LEF");
        break;
      case "travelTop":
        block.click("TRA TOP");
        break;
      case "travelRight":
        block.click("TRA RIG");
        break;
      case "travelBottom":
        block.click("TRA BOT");
        break;
      case "moveLeft":
        block.click("MOV LEF");
        break;
      case "moveTop":
        block.click("MOV TOP");
        break;
      case "moveRight":
        block.click("MOV RIG");
        break;
      case "moveBottom":
        block.click("MOV BOT");
        break;
    }
    //block.unlock();
  });
  
});

/*********************************************************/
/**********将小方块的指令封装，用全局变量block暴露接口**********/
/*********************************************************/
(function(window) {
  var box = document.querySelector("#rect-box"),
      commandElem = document.querySelector("input"),
      //小方块的位置，初始位置为6行6列，top 199 left 199
      //n行m列的位置为 top (n-1)*40-1，left (n-1)*40-1
      left = 199,
      top = 199,
      towards = 0, //小方块朝向 0上 1右 2下 3左
      //transitionQueue = [], //需要在某个过渡动画结束后加入的过渡动画
      transitionCount = 0, //正在进行或者还未进行的过渡动画个数
      goDelay = false, //go函数是否延迟到过渡动画结束进行
      block = {
        /*
         *主函数，点击事件调用的函数
         *@param1 String 可取值为GO、TUN LEF、TUN RIG、TUN BAC、TRA LEF、TRA TOP、
         *                     TRA RIG、TRA BOT、MOV LEF、MOV TOP、MOV RIG、MOV BOT
         *               可无，默认取值input#command的value
         *@return undefined
         */
        click : click,
        //resetBorderRadius : resetBorderRadius
      };
  
  window.block = block;
  
  //添加一个transitionend事件，当过渡动画完成时，调用transitionQueue中的过渡动画
  window.addEventListener("transitionend", function(e) {
    var target = e.target;
    switch (target.id) {
      case "rect-box":
        transitionCount--; 
        //完成的过渡动画是转动
        if (e.propertyName === "transform") {
          transitionCount += 4;
          box.style.borderRadius = "0";
          return;
        }
        //完成的过渡动画是边界变换以及go函数被延迟
        if (goDelay && box.style.borderTopRightRadius === "0px") {
          goDelay = false;
          go();
        }
        break;
    }
  });
  
  /*
   *主函数，点击执行按钮调用的函数
   *@param1 String 可取值为GO、TUN LEF、TUN RIG、TUN BAC、TRA LEF、TRA TOP、
   *                     TRA RIG、TRA BOT、MOV LEF、MOV TOP、MOV RIG、MOV BOT
   *               可无，默认取值input#command的value
   *@return undefined
   */
  function click(com) {
    //如果还有未完成的过渡动画
    if (transitionCount) {
      return;
    }
    var command = com || commandElem.value;
    switch (command) {
      case "GO":
        go();
        return;
      case "TUN LEF":
        turn(-1);
        return;
      case "TUN RIG":
        turn(1);
        return;
      case "TUN BAC":
        turn(2);
        return;
      case "TRA LEF":
        go(3);
        return;
      case "TRA TOP":
        go(0);
        return;
      case "TRA RIG":
        go(1);
        return;
      case "TRA BOT":
        go(2);
        return;
      case "MOV LEF":
        turnTo(3);
        go();
        return;
      case "MOV TOP":
        turnTo(0);        
        go();
        return;
      case "MOV RIG":
        turnTo(1);        
        go();
        return;
      case "MOV BOT":
        turnTo(2);
        go();
        return;
    }
    alert("请输入合法的命令");
  }
  /*
   *前进，将小方块前进一步，不许出界。
   *@param1 Number 前进方向，0上 1右 2下 3左
                  可无，默认取值小方块的朝向towards
   *@return undefined
   */
  function go(to) {
    //go函数延迟运行
    if (goDelay) {
      return;
    }
    var direction = to !== undefined? to : (towards % 4 + 4) % 4;
    switch (direction) {
      case 0:
        if (top > -1) {
          top -= 40;
          box.style.top = top + "px";
          transitionCount++;
          return;
        }
        break;
      case 1:
        if (left < 359) {
          left += 40;
          box.style.left = left + "px";
          transitionCount++;
          return;
        }
        break;
      case 2:
        if (top < 359) {
          top += 40;
          box.style.top = top + "px";
          transitionCount++;
          return;
        }
        break;
      case 3:
        if (left > -1) {
          left -= 40;
          box.style.left = left + "px";
          transitionCount++;
          return;
        }
        break;
    }
    //如果函数还没有return，表示小方块要出界了
    alert("小方块表示不想走出棋盘~");
  }
  /*
   *调整方向
   *@param1 Number -1朝左转 1朝右转 2反向 -2反向
   *@return undefined
   */
  function turn(num) {
    towards += num;
    //border-radius能触发4个transitionend事件
    transitionCount += 5;
    box.style.transform = "rotate(" + towards*90 + "deg)";
    box.style.borderRadius = "50%";
  }
  /*
   *调整方向到某个指定方向
   *@param1 Number 0转完朝上 1转完朝右 2转完朝下 3转完朝左
   *@return undefined
   */
  function turnTo(num) {
    var direction = (towards % 4 + 4) % 4,
        turnNum = num - direction;
    if (turnNum === 3) {
      turnNum = -1;
    }
    if (turnNum === -3) {
      turnNum = 1;
    }
    //turnNum不为0，需要先转向再移动
    if (turnNum) {
      turn(turnNum);
      goDelay= true;
    }
  }
})(window);




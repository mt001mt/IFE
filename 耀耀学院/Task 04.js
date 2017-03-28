// JavaScript Document

document.addEventListener("DOMContentLoaded", function(){
  document.querySelector("button").addEventListener("click", block.click);
});

//将小方块的指令封装，用全局变量block暴露接口
(function(window) {
  var box = document.querySelector(".rect-box"),
      commandElem = document.querySelector("input"),
      //小方块的位置，初始位置为6行6列，top 199 left 199
      //n行m列的位置为 top (n-1)*40-1，left (n-1)*40-1
      left = 199,
      top = 199,
      toward = 0,//小方块朝向 0上 1右 2下 3左
      block = {
        click : click
      };
  
  window.block = block;
  /*
   *主函数，点击执行按钮调用的函数
   *@param none
   *@return undefined
   */
  function click() {
    var command = commandElem.value;
    switch(command.toLowerCase()){
      case "go":
        go();
        return;
      case "tun lef":
        turn(-1);
        return;
      case "tun rig":
        turn(1);
        return;
      case "tun bac":
        turn(+2);
        return;
    }
    alert("请输入合法的命令");
  }
  /*
   *前进，将小方块前进一步，不许出界。
   *@param none
   *@return undefined
   */
  function go() {
    switch (toward) {
      case 0:
        if (top > -1) {
          top -= 40;
          box.style.top = top + "px";
          return;
        }
        break;
      case 1:
        if (left < 359) {
          left += 40;
          box.style.left = left + "px";
          return;
        }
        break;
      case 2:
        if (top < 359) {
          top += 40;
          box.style.top = top + "px";
          return;
        }
        break;
      case 3:
        if (left > -1) {
          left -= 40;
          box.style.left = left + "px";
          return;
        }
        break;
    }
    //如果函数还没有return，表示小方块要出界了
    alert("小方块表示不想走出棋盘~");
  }
  /*
   *调整方向，将小方块前进一步，不许出界。
   *@param Number -1朝左转 1朝左转 2反向
   *@return undefined
   */
  function turn(num) {
    toward = (toward + num + 4) % 4;
    box.style.transform = "rotate(" + toward*90 + "deg)";
  }
})(window);




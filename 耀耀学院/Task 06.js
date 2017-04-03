// JavaScript Document

var DR = {};
var popover = {};

/********************************************************/
/********************弹出层的弹出与隐藏********************/
/*******************************************************/
(function(interface) {
  interface.setPopover = setPopover;
  /*
   *给元素添加浮出层的功能
   *！！！warning 需要添加该功能的元素的margin会被设置成0，position会被设置为absolute
   *！！！warning 请把需要添加功能的元素写在mask里边
   *param1 obj Element 需要添加浮出层功能的元素
   *param2 mask Element 在浮出层和普通层之间的遮蔽层
   *                    可无
   *param3 display Array[Element] 点击后可以弹出浮出层的元素列表
   *                              可无 若无 调用函数后直接显示浮出层
   *param4 nodisplay Array[Element] 点击后可以关闭浮出层的元素列表
   *                                可无 若无 取默认值 mask（如果存在）或者其他非obj元素
   *param5 wheelable Boolean 浮出层显示后，是否禁用滚动 true不禁用 false禁用 
   *                         可无 取默认值 true不禁用
   *return undefined
   */
  function setPopover(obj, mask, display, noDisplay, wheelable) {
    var style;
    if (mask) {
      style = mask.style;
      style.display = none;
      style.position = fixed;
    } else {
      style = obj.style;
      style.display = none;
    }
    mask = mask || document;
    noDisplay = noDisplay || mask;
    wheelable = wheelable || true;
    
    
    
    
    if (display) {
      document.addEventListener("click",function(e) {
        if (display.indexOf(e.target) !== -1) {
            popoverBlock();
        }
      });
    } else {
      
    }
    
    
   
    //浮出层显示
    function popoverBlock() {
      var style = getComputedStyle(popBox);
      mask.style.display = "block";
      obj.style.marginTop = (window.innerHeight - style.height.slice(0,-2)) / 2 + "px";
      obj.style.marginLeft = (window.innerWidth - style.width.slice(0,-2)) / 2 + "px";
      if (!scrollable) {
        window.addEventListener("wheel", preventScrolling);
      }
    }
  }
})(popover);



/********************************************************/
/*****************拖拽窗口以及改变窗口大小******************/
/*******************************************************/
(function(interface) {
  //设置接口
  /*
   *给元素添加拖动的功能
   *param1 drag Element 需要被拖拽的元素
   *param2 trigger Element 拖拽时鼠标点中的元素（比如 拖动
   *                   对话框中的标题栏才能移动整个对话框）
   *return undefined
   */
  interface.setDragable = setDragable;
  /*
   *给元素添加拖拽边缘缩放的功能
   *！！！warning 需要添加该功能的元素的position必须是relative或者absolute
   *param1 obj Element 需要添加缩放功能的元素
   *param2 minHeight Num 允许的最小高度
   *                     可无
   *param3 minWidth Num 允许的最小宽度
   *                     可无
   *param4 ToB Boolean 如obj以top定位，赋值为true； bottom定位，赋值为false
   *param4 LoR Boolean 如obj以left定位，赋值为true； right，赋值为false
   *return undefined
   */
  interface.setResizable = setResizable;
    /*
     *初始化函数，把事件处理程序添加给相应对象
     *param none
     *return undefined
     */
    /*,
    setWH: setWH,
    setTitle: setTitle,
    setContent: setContent*/
  
  /*
   *给元素添加拖动的功能
   *!!!warning 需要添加该功能的元素的position必须是relative或者absolute
   *param1 obj Element 需要被拖拽的元素
   *param2 trigger Element 拖拽时鼠标点中的元素（比如 拖动
   *                   对话框中的标题栏才能移动整个对话框）
   *param3 
   *return undefined
   */
  function setDragable(obj, trigger) {
    trigger = trigger || obj;
    var deltaX,
        deltaY;
    
    trigger.addEventListener("mousedown", mousedown);
    
    function mousedown(e) {
      var offsetLeft = obj.offsetLeft,
          o
      deltaX = obj.offsetLeft - e.clientX;
      deltaY = obj.offsetTop - e.clientY;
      //强制转化为top、left定位，且margin: 0;
      var 
      
      trigger.addEventListener("mousemove", mousemove);
      trigger.addEventListener("mouseup", mouseup);
    }
    function mousemove(e) {
      obj.style.left = e.clientX + deltaX + "px";
      obj.style.top = e.clientY + deltaY + "px";
    }
    function mouseup() {
      obj.removeEventListener("mousemove", mousemove);
      obj.removeEventListener("mouseup", mouseup);
    }
  }

  /*
   *给元素添加拖拽边缘缩放的功能
   *!!!warning 需要添加该功能的元素的position必须是relative或者absolute
   *param1 obj Element 需要添加缩放功能的元素
   *param2 minHeight Num 允许的最小高度
   *                     可无
   *param3 minWidth Num 允许的最小宽度
   *                     可无
   *param4 ToB Boolean 如obj以top定位，赋值为true； bottom定位，赋值为false
   *                   可无 若无 默认值true
   *param5 LoR Boolean 如obj以left定位，赋值为true； right，赋值为false 默认值true
   *                   可无 若无 默认值true
   *return undefined
   */
    function setResizable(obj, minHeight, minWidth, ToB, LoR) {
      if (!getComputedStyle(obj).position.match(/relative|absolute/)) {
        console.warn("argument of function setResizable should be a HTMLElement with relative position or absolute position");
        return;
      }
      minHeight = minHeight || 0;
      minWidth = minWidth || 0;
      ToB = ToB === undefined ? true : ToB;
      LoR = LoR === undefined ? true : LoR;
      
      //生成并添加产生事件的元素
      var top = document.createElement("div"),
          left = document.createElement("div"),
          bottom = document.createElement("div"),
          right = document.createElement("div"),
          topLeft = document.createElement("div"),
          topRight = document.createElement("div"),
          bottomLeft = document.createElement("div"),
          bottomRight = document.createElement("div"),
          fragment = document.createDocumentFragment(),
          
          oStyle = getComputedStyle(obj), //p is short for obj which is the argument
          width = oStyle.offsetWidth + "px; ",
          height = oStyle.offsetHeight + "px; ",
          posTop = "top: -" + oStyle.borderTopWidth || 0 + "; ", //pos is short for position
          posRight = "rignt: -" + oStyle.borderRightWidth || 0 + "; ",
          posBottom = "bottom: -" + oStyle.borderBottomWidth || 0 + "; ", 
          posLeft = "left: -" + oStyle.borderLeftWidth || 0 + "; ",
          
          initClientX, initClientY, //mousedown时的鼠标坐标
          initHeight, initWidth, //mousedown时obj大小
          initV, initH; //mousedown时obj位置，根据参数，initV为obj的top或bottom，initH为left或right
      
      top.style.cssText = "position: absolute; " + posTop + posLeft + "margin: 0; " + width + "height: 5px; border: none; visibility: hidden; cursor: n-resize;";
      right.style.cssText = "position: absolute; " + posTop + posRight + "margin: 0; " + height + "width: 5px; border: none; visibility: hidden; cursor: e-resize;";
      bottom.style.cssText = "position: absolute; " + posBottom + posLeft + "margin: 0; " + width + "height: 5px; border: none; visibility: hidden; cursor: s-resize;";
      left.style.cssText = "position: absolute; " + posTop + posLeft + "margin: 0; " + height + "width: 5px; border: none; visibility: hidden; cursor: w-resize;";
      topRight.style.cssText = "position: absolute; " + posTop + posRight+ "margin: 0; " + "height: 5px; width: 5px; border: none; visibility: hidden; cursor: ne-resize;";
      topLeft.style.cssText = "position: absolute; " + posTop + posLeft + "margin: 0; " + "height: 5px; width: 5px; border: none; visibility: hidden; cursor: nw-resize;";
      bottomRight.style.cssText = "position: absolute; " + posBottom + posRight + "margin: 0; " + "height: 5px; width: 5px; border: none; visibility: hidden; cursor: sw-resize;";
      bottomLeft.style.cssText = "position: absolute; " + posBottom + posLeft + "margin: 0; " + "height: 5px; width: 5px; border: none; visibility: hidden; cursor: se-resize;";

      fragment.appendChild(top);
      fragment.appendChild(right);
      fragment.appendChild(bottom);
      fragment.appendChild(left);
      fragment.appendChild(topRight);
      fragment.appendChild(topLeft);
      fragment.appendChild(bottomRight);
      fragment.appendChild(bottomLeft);
      obj.appendChild(fragment);
      
      obj.addEventListener("mousedown", mousedown);
      //获取mousedown时的一些参数，并添加mousemove、mouseup事件
      function mousedown(e) {
        var target = e.target;
        
        initV = ToB ? oStyle.top : oStyle.bottom;
        initV = Num(initV.splice(0, -2));
        initH = LoR ? oStyle.left : oStyle.right;
        initH = Num(initH.splice(0, -2));
        initClientX = e.clientX;
        initClientY = e.clientY;
        initHeight = oStyle.height;
        initWidth = oStyle.width;
        
        target.addEventListener("mousemove", mousemove);
        target.addEventListener("mouseup", mouseup);
      }

      function mousemove(e) {
        switch (e.target) {
          case top:
            foo(8);
            break;
          case right:
            foo(4);
            break;
          case bottom:
            foo(2);
            break;
          case left:
            foo(1);
            break;
          case topRight:
            foo(12);
            break;
          case topLeft:
            foo(9);
            break;
          case bottomRight:
            foo(6);
            break;
          case bottomLeft:
            foo(3);
            break;
        }
        //内部调用函数，根据resize的方向 上8 左4 下2 右1，实现obj随着mousemove缩放
        function foo(num) {
          var style = obj.style,
              delta,
              height,
              width;
          
          if (num & 8) {
            delta = e.clientY - initClientY;
            height = initHeight - delta;
            if (height >= minHeight) {
              style.height = height;
              if (ToB) {
                style.top = initV + delta + "px";
              }
            }
          } else if (num & 2) {
            delta = e.clientY - initClientY;
            height = initHeight + delta;
            if (height >= minHeight) {
              style.height = height;
              if (!ToB) {
                style.bottom = initV - delta + "px";
              }
            }
          }
          if (num & 1) {
            delta = e.clientX - initClientX;
            width = initWidth - delta;
            if (width >= minWidth) {
              style.width = width;
              if (LoR) {
                style.left = initV + delta + "px";
              }
            }
          } else if (num & 4) {
            delta = e.clientX - initClientX;
            width = initWidth + delta;
            if (width >= minWidth) {
              style.width = width;
              if (LoR) {
                style.right = initV - delta + "px";
              }
            }
          }
        }
      }
      
      function mouseup() {
        obj.removeEventListener("mousemove", mousemove);
        obj.removeEventListener("mouseup", mouseup);
      }
    }
    
    
}
  //静态变量
  var popBox = document.querySelector(".popover"),
      mask = document.querySelector("#mask"),
      scrollable = true, //显示浮出层后是否可以滚动页面
      minWidth = 250, //浮出层的最小尺寸
      minHeight = 125; //.
  
  /*
   *初始化函数，把事件处理程序添加给相应对象
   *param none
   *return undefined
   */
  function initial() {
    document.addEventListener("click",function(e) {
      var target = e.target;
      switch(target.id) {
        //点击“点我出浮出层”按钮
        case "click0":
        case "click1":
        case "click2":
        case "click3":
          popoverBlock();
          break;
        //点击浮出层确认按钮
        //点击浮出层取消按钮
        //点击浮出层外的遮盖层
        case "popover-confirm":
        case "popover-cancel":
        case "mask":
          popoverNone();
          break;
        //点击禁用滚定按钮
        case "disable-scroll":
          disableScroll();
          break;
      }
    });
    popBox.addEventListener("mousedown", function(e) {
      var target = e.target;
      switch(target.id) {
        //浮出层标题栏 mousedown设置浮出层可拖动
        case "popover-drag":
          console.warn("drag mousedown");
          popoverDrag(e);
          break;
        //浮出层边框 mousedown设置浮出层可变大小
        case "resize-t":
        case "resize-r":
        case "resize-b":
        case "resize-l":
        case "resize-tr":
        case "resize-tl":
        case "resize-br":
        case "resize-bl":
          popoverResize(e);
          break;
      }
      //switch()
    });
    document.addEventListener("mouseup", function(e) {
      //即使移动的时候鼠标出了浏览器窗口，也要把写入mousemove的事件删除
      popoverDrag(e);
      popoverResize(e);
      /*var target = e.target;
      switch(target.id) {
        //浮出层标题栏 mouseup设置浮出层不可拖动
        case "popover-drag":
          popoverDrag(e);
          break;
      }*/
    });
    
  }
  
  /*
   *浮出层显示
   *param none
   *return undefined
   */
  function popoverBlock() {
    var style = getComputedStyle(popBox);
    mask.style.display = "block";
    popBox.style.marginTop = (window.innerHeight - style.height.slice(0,-2)) / 2 + "px";
    popBox.style.marginLeft = (window.innerWidth - style.width.slice(0,-2)) / 2 + "px";
    if (!scrollable) {
      window.addEventListener("wheel", preventScrolling);
    }
  }
  /*
   *浮出层隐藏
   *param none
   *return undefined
   */
  function popoverNone() {
    //mask.style.display = "none";
    if (!scrollable) {
      window.removeEventListener("wheel", preventScrolling);
    }
  }
  /*
   *拖动浮出层
   *mousedown 浮出层变为可拖动，添加mousemove事件处理程序
   *mousemove 浮出层随着鼠标一起动
   *mouseup   浮出层变为不可拖动，删除mousemove事件处理程序
   *param none
   *return undefined
   */
  var popoverDrag = function() {
    var deltaX,
        deltaY;
    function mousemove(e) {
      popBox.style.marginLeft = e.clientX + deltaX + "px";
      popBox.style.marginTop = e.clientY + deltaY + "px";
    }
    return function(e) {
      switch(e.type) {
        case "mousedown":
          deltaX = popBox.offsetLeft - e.clientX;
          deltaY = popBox.offsetTop - e.clientY;
          popBox.addEventListener("mousemove", mousemove);
          break;
        case "mouseup":
          popBox.removeEventListener("mousemove", mousemove);
          break;
      }
    };
  }();
  /*
   *改变浮出层大小
   *mousedown 浮出层变为可改变大小，添加mousemove事件处理程序
   *mousemove 浮出层大小随着鼠标变化
   *mouseup   浮出层变为不可改变大小，删除mousemove事件处理程序
   *param none
   *return undefined
   */
  var popoverResize = function() {
    var initClientX, initClientY, //mousedown时的鼠标坐标
        initHeight, initWidth, //mousedown时浮出层大小
        initMarginTop, initMarginLeft, //mousedown时浮出层位置
        resizeDirection = 0; //resize的方向 上8 左4 下2 右1
    
    return function(e) {
      switch (e.type) {
        case "mousedown":
          initClientX = e.clientX;
          initClientY = e.clientY;
          initHeight = popBox.offsetHeight;
          initWidth = popBox.offsetWidth;
          initMarginTop = Number(popBox.style.marginTop.slice(0, -2));
          initMarginLeft = Number(popBox.style.marginLeft.slice(0, -2));
          
          document.addEventListener("mousemove", mousemove);
          break;
        case "mouseup":
          console.log("mouseup");
          document.removeEventListener("mousemove", mousemove);
          resizeDirection = 0;
          break;
      }
    };
    
    function mousemove(e) {
      var style = popBox.style,
          id = e.target.id,
          deltaX = e.clientX - initClientX,
          deltaY = e.clientY - initClientY,
          height = initHeight - deltaY,
          width = initWidth - deltaX;
      console.log("e.clientY=" + e.clientY, "height=" + height);
      if (height >= minHeight) {
       if (id.match(/resize-.?t/) || 1) {
         style.height = height + "px";
         style.marginTop = initMarginTop + deltaY + "px";
         console.log("height=" + height, "deltaY=" + deltaY, "margin-top=" + style.marginTop);
       }
       /*if (id.match("b")) {
         style.height = height + "px";
         
       }*/
      }
      /*if (width >= minWidth) {
        if (id.match("l")) {
          style.width = width + "px";
          style.marginLeft = Number(comStyle.marginLeft.slice(0, -2)) + deltaX + "px";
        }
        if (id.match("r")) {
          style.width = width + "px";
        }
      }*/
    }
  }();
  
  /*
   *禁用滚动，被wheel事件调用
   *param Event
   *return undefined
   */
  function preventScrolling(e) {
    e.preventDefault();
  }
  /*
   *禁用滚动，点击禁用滚定按钮时调用
   *param none
   *return undefined
   */
  function disableScroll() {
    scrollable = !scrollable;
    var button = document.querySelector("#disable-scroll");
    if (scrollable) {
      button.innerHTML = "点我弹出浮出层后禁用滚动";
      return;
    }
    button.innerHTML = "点我弹出浮出层后可以滚动";
  }
})(DR);

var popover = document.querySelector(".popover");
//console.log(popover);
DR.setDragable(popover);

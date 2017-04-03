// JavaScript Document

var task06 = {};
var popover = {};

var popover = function() {
  return {
    
    initial : initial
    
  }
  // 静态变量
  function initial 
  
  

}();


/********************************************************/

/*******************************************************/
(function(interface) {
  
  
  
  
})(popover);



/*************************模块功能************************/
/********************弹出层的弹出与隐藏********************/
/*****************拖拽窗口以及改变窗口大小******************/
/*******************************************************/
(function(interface) {
  //设置接口
  /*
   *给元素添加浮出层的功能
   *！！！warning 需要添加该功能的元素的margin会被设置成0，position会被设置为absolute或fixed
   *！！！warning 请把需要添加功能的元素写在mask里边
   *param1 obj Element 需要添加浮出层功能的元素
   *param2 mask Element 在浮出层和普通层之间的遮蔽层
   *                    可无
   *param3 display Array[Element] 点击后可以弹出浮出层的元素列表
   *                              可无 若无 调用函数后直接显示浮出层
   *param4 nodisplay Array[Element] 点击后可以关闭浮出层的元素列表
   *                                可无 若无 取默认值 mask（如果存在）
   *param5 scrollable Boolean 浮出层显示后，是否禁用滚动 true不禁用 false禁用 
   *                         可无 取默认值 true不禁用
   *return undefined
   */
  interface.setPopover = setPopover;
  /*
   *给元素添加拖动的功能
   *!!!warning 需要添加该功能的元素的position必须是relative或者absolute或者fixed
   *param1 obj Element 需要被拖拽的元素
   *param2 trigger Element 拖拽时鼠标点中的元素（比如 拖动
   *                   对话框中的标题栏才能移动整个对话框）
   *param3 
   *return undefined
   */
  interface.setDragable = setDragable;
  /*
   *给元素添加拖拽边缘缩放的功能
   *!!!warning 需要添加该功能的元素的position必须是relative或者absolute
   *param1 obj Element 需要添加缩放功能的元素
   *param2 minHeight Num 允许的最小高度
   *                     可无
   *param3 minWidth Num 允许的最小宽度
   *                     可无
   *return undefined
   */
  interface.setResizable = setResizable;
  
  //以下是函数定义
  /*
   *给元素添加浮出层的功能
   *！！！warning 需要添加该功能的元素的margin会被设置成0，position会被设置为absolute或fixed
   *！！！warning 请把需要添加功能的元素写在mask里边
   *param1 obj Element 需要添加浮出层功能的元素
   *param2 mask Element 在浮出层和普通层之间的遮蔽层
   *                    可无
   *param3 display Array[Element] 点击后可以弹出浮出层的元素列表
   *                              可无 若无 调用函数后直接显示浮出层
   *param4 nodisplay Array[Element] 点击后可以关闭浮出层的元素列表
   *                                可无 若无 取默认值 mask（如果存在）
   *param5 scrollable Boolean 浮出层显示后，是否禁用滚动 true不禁用 false禁用 
   *                         可无 取默认值 true不禁用
   *return undefined
   */
  function setPopover(obj, mask, display, noDisplay, scrollable) {
    var style;
    
    noDisplay = noDisplay || mask;
    scrollable = scrollable || true;
    
    if (mask) {
      style = mask.style;
      style.position = "fixed";
      style.top = "0";
      style.right = "0";
      style.bottom = "0";
      style.left = "0";
      obj.style.position = "absolute";
    } else {
      obj.style.position = "fixed";
    }
    
    if (display) {
      document.addEventListener("click",function(e) {
        if (display.indexOf(e.target) !== -1) {
            popoverBlock(obj, mask || obj, scrollable);
        }
      });
    } else {
      popoverBlock(obj, mask || obj,  scrollable);
    }
    
    if (noDisplay) {
      document.addEventListener("click",function(e) {
        if (noDisplay.indexOf(e.target) !== -1) {
            popoverNone(mask || obj, scrollable);
        }
      });
    }
   
    //浮出层显示
    function popoverBlock(obj, mask, scrollable) {
      var style = getComputedStyle(obj);
      mask.style.display = "block";
      obj.style.marginTop = (window.innerHeight - style.height.slice(0,-2)) / 2 + "px";
      obj.style.marginLeft = (window.innerWidth - style.width.slice(0,-2)) / 2 + "px";
      if (!scrollable) {
        window.addEventListener("wheel", preventScrolling);
      }
    }
    
    function popoverNone(mask, scrollable) {
      mask.style.display = "none";
      if (!scrollable) {
        window.removeEventListener("wheel", preventScrolling);
      }
    }
    
    //禁用滚动
    function preventScrolling(e) {
      e.preventDefault();
    }
  }
  
  /*
   *给元素添加拖动的功能
   *!!!warning 需要添加该功能的元素的position必须是relative或者absolute或者fixed
   *param1 obj Element 需要被拖拽的元素
   *param2 trigger Element 拖拽时鼠标点中的元素（比如 拖动
   *                   对话框中的标题栏才能移动整个对话框）
   *param3 
   *return undefined
   */
  function setDragable(obj, trigger) {
    if (!getComputedStyle(obj).position.match(/relative|absolute|fixed/)) {
      console.warn("argument[0] of function setResizable should be a HTMLElement with relative position or absolute position");
      return;
    }
    
    trigger = trigger || obj;
    var deltaX,
        deltaY;
    
    trigger.addEventListener("mousedown", mousedown);
    
    function mousedown(e) {
      var offsetLeft = obj.offsetLeft,
          offsetTop = obj.offsetTop,
          style = obj.style;
      
      deltaX = offsetLeft - e.clientX;
      deltaY = offsetTop - e.clientY;
      //强制转化为top、left定位，且margin: 0;
      style.margin = "0";
      style.top = offsetTop;
      style.left = offsetLeft;
      
      trigger.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    }
    function mousemove(e) {
      obj.style.left = e.clientX + deltaX + "px";
      obj.style.top = e.clientY + deltaY + "px";
    }
    function mouseup() {
      trigger.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
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
   *return undefined
   */
  function setResizable(obj, minHeight, minWidth) {
    if (!getComputedStyle(obj).position.match(/relative|absolute/)) {
      console.warn("argument[0] of function setResizable should be a HTMLElement with relative position or absolute position");
      return;
    }
    minHeight = minHeight || 0;
    minWidth = minWidth || 0;

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
        initOffsetLeft, initOffsetTop; //mousedown时obj位置

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
      var target = e.target,
          style = target.style;

      initOffsetLeft = obj.offsetLeft;
      initOffsetTop = obj.offsetTop;
      initClientX = e.clientX;
      initClientY = e.clientY;
      initHeight = oStyle.height;
      initWidth = oStyle.width;
      //强制转化为top、left定位，且margin: 0;
      style.margin = "0";
      style.top = initOffsetTop;
      style.left = initOffsetLeft;
      
      target.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
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
            style.top = initOffsetTop + delta + "px";
          }
        } else if (num & 2) {
          delta = e.clientY - initClientY;
          height = initHeight + delta;
          if (height >= minHeight) {
            style.height = height;
          }
        }
        if (num & 1) {
          delta = e.clientX - initClientX;
          width = initWidth - delta;
          if (width >= minWidth) {
            style.width = width;
            style.left = initOffsetLeft + delta + "px";
          }
        } else if (num & 4) {
          delta = e.clientX - initClientX;
          width = initWidth + delta;
          if (width >= minWidth) {
            style.width = width;
          }
        }
      }
    }

    function mouseup() {
      obj.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    }
  }
    
})(task06);

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

    
var popover = document.querySelector(".popover");
//console.log(popover);
DR.setDragable(popover);

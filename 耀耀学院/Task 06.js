// JavaScript Document

var task06 = {};

var popover = function() {
  // 静态变量
  var popover = document.querySelector(".popover"), //浮出层
      mask = document.querySelector("#mask"), //遮避层
      title = document.querySelector("#popover-drag"), //拖动浮出层是鼠标需要点击的元素
      scrollable = true, //浮出层弹出后是否可以滚动，ture可以
      minHeight = 125, //缩放时的最小高宽
      minWidth = 250; //.
  
  /*
   *初始化函数，给目标设置浮出层，可拖动，可缩放，以及相应鼠标事件
   *param none
   *return undefined
   */
  function initial() {
    task06.setPopover(popover, mask);
    task06.setDragable(popover, title);
    task06.setResizable(popover, minHeight, minWidth);
    document.addEventListener("click", function(e) {
      switch (e.target.id) {
        case "click0":
        case "click1":
        case "click2":
        case "click3":
          task06.popoverShow(popover, mask, scrollable);
          break;
        case "mask":
        case "popover-confirm":
        case "popover-cancel":
          task06.popoverHidden(mask, scrollable);
          break;
        case "disable-scroll":
          scrollable = !scrollable;
          if (scrollable) {
            e.target.innerHTML = "点我~现在浮出层弹出后，启用滚动";
          } else {
            e.target.innerHTML = "点我~现在浮出层弹出后，禁用滚动";
          }
          break;
        case "set-popover":
          popover2Click();
      }
    });
  }
  
  /*
   *设置浮出层的高宽
   *param1 width Number
   *param2 height Number
   *return undefined
   */
  function setPopoverWH(width, height) {
    var style = popover.style;
    style.width = width + "px";
    style.height = height + "px";
  }
  
  /*
   *#popover2的点击事件，包括弹出浮出层，添加事件等等
   *param none
   *return undefined
   */
  function popover2Click() {
    var target = document.querySelector("#popover2"), //目标浮动层
        submitB = document.querySelector("#popover2-confirm"), //确认按钮
        cancelB = document.querySelector("#popover2-cancel"), //取消按钮
        heightI = document.querySelector("#popover2-height"), //高度输入input
        widthI = document.querySelector("#popover2-width"), //宽度输入input
        dragable = document.querySelector("#popover2-dragable"), //可拖动按钮
        trigger = document.querySelector("#popover2 h5"), //标题栏
        p = document.querySelector("#popover2 p"); //文字描述
    //给本浮动层中的元素添加点击事件
    target.addEventListener("click", function(e) {
      switch (e.target) {
        case submitB: //确认按钮
          widthI.setCustomValidity("");
          if (!widthI.validity.valid) {
            widthI.setCustomValidity("亲，300~800哦");
          }
          heightI.setCustomValidity("");
          if (!heightI.validity.valid) {
            heightI.setCustomValidity("亲，200~400哦");
          }
          if (!target.checkValidity()) {
            break;
          }        
          setPopoverWH(widthI.value, heightI.value);
          task06.popoverHidden(target, true);
          break;       
        case cancelB: //取消按钮
          task06.popoverHidden(target, true);
          break;
      }
    });
    
    target.addEventListener("submit", function(e) {//禁止提交表单
      e.preventDefault();
    });
    
    dragable.addEventListener("click", function foo() {//设置本浮动层可以拖动
      task06.setDragable(target, trigger);
      dragable.removeEventListener("clicl", foo);
      dragable.parentNode.removeChild(dragable);
      p.innerHTML = "这个浮出层功能比较简单，不能缩放，没有遮蔽层，但现在可以拖动了";
      dragable = trigger = p = null;
    })
    //设置为浮动层
    task06.setPopover(target);
    //再次点击时不用以上步骤
    popover2Click = function() {
      task06.popoverShow(target, null, true);
    };
    //显示浮出层
    popover2Click(target);
  }
  
  return {
  /*
   *初始化函数，给目标设置浮出层，可拖动，可缩放，以及相应鼠标事件
   *param none
   *return undefined
   */
    initial : initial,
  /*
   *设置浮出层的高宽
   *param1 width Number
   *param2 height Number
   *return undefined
   */
    setPopoverWH : setPopoverWH
  };
}();



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
   *return undefined
   */
  interface.setPopover = setPopover;
  /*
   *浮出层显示
   *param1 obj Element 需要显示的元素，有遮蔽层就是填遮蔽层，无遮蔽层就填浮出层
   *param2 mask Element 遮蔽层
   *                    可无 去默认值obj
   *param3 scrollable Boolean 浮出层显示后，是否禁用滚动 true不禁用 false禁用 
   *                         可无 取默认值 false禁用
   *return undefined
   */        
  interface.popoverShow = popoverShow;
  /*
   *浮出层关闭
   *param1 obj Element 需要显示的元素，有遮蔽层就是填遮蔽层，无遮蔽层就填浮出层
   *param2 scrollable Boolean 浮出层显示后，是否禁用滚动 true不禁用 false禁用 
   *                         可无 取默认值 false禁用
   *return undefined
   */
  interface.popoverHidden = popoverHidden;
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
   *return undefined
   */
  function setPopover(obj, mask) {
    var style;
    
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
  }
  
  /*
   *浮出层显示
   *param1 obj Element 需要显示的元素，有遮蔽层就是填遮蔽层，无遮蔽层就填浮出层
   *param2 mask Element 遮蔽层
   *                    可无 去默认值obj
   *param3 scrollable Boolean 浮出层显示后，是否禁用滚动 true不禁用 false禁用 
   *                         可无 取默认值 false禁用
   *return undefined
   */
  function popoverShow(obj, mask, scrollable) {
    mask = mask || obj;
    mask.style.display = "block";
    obj.style.top = (window.innerHeight - obj.offsetHeight) / 2 + "px";
    obj.style.left = (window.innerWidth - obj.offsetWidth) / 2 + "px";
    if (!scrollable) {
      window.addEventListener("wheel", preventScrolling);
    }
  }
  
  /*
   *浮出层关闭
   *param1 obj Element 需要显示的元素，有遮蔽层就是填遮蔽层，无遮蔽层就填浮出层
   *param2 scrollable Boolean 浮出层显示后，是否禁用滚动 true不禁用 false禁用 
   *                         可无 取默认值 false禁用
   *return undefined
   */
  function popoverHidden(obj, scrollable) {
    obj.style.display = "none";
    if (!scrollable) {
      window.removeEventListener("wheel", preventScrolling);
    }
  }

  //禁用滚动
  function preventScrolling(e) {
    e.preventDefault();
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
      console.warn("argument[0] of function setResizable should be a HTMLElement with relative position or absolute or fixed position");
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
      
      document.body.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    }
    function mousemove(e) {
      obj.style.left = e.clientX + deltaX + "px";
      obj.style.top = e.clientY + deltaY + "px";
    }
    function mouseup() {
      document.body.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    }
  }

  /*
   *给元素添加拖拽边缘缩放的功能
   *!!!warning 需要添加该功能的元素的position必须是relative或者absolute或者fixed
   *param1 obj Element 需要添加缩放功能的元素
   *param2 minHeight Num 允许的最小高度
   *                     可无
   *param3 minWidth Num 允许的最小宽度
   *                    可无
   *return undefined
   */
  function setResizable(obj, minHeight, minWidth) {
    if (!getComputedStyle(obj).position.match(/relative|absolute|fixed/)) {
      console.warn("argument[0] of function setResizable should be a HTMLElement with relative position or absolute or fixed position");
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

        oStyle = getComputedStyle(obj), //o is short for obj which is the argument
        posTop = "top: -" + (oStyle.borderTopWidth || 0) + "; ", //pos is short for position
        posRight = "right: -" + (oStyle.borderRightWidth || 0) + "; ",
        posBottom = "bottom: -" + (oStyle.borderBottomWidth || 0) + "; ", 
        posLeft = "left: -" + (oStyle.borderLeftWidth || 0) + "; ",
        
        initClientX, initClientY, //mousedown时的鼠标坐标
        initHeight, initWidth, //mousedown时obj大小
        initOffsetLeft, initOffsetTop, //mousedown时obj位置
        target; //mousedown时的鼠标点击的元素

    top.style.cssText = "position: absolute; " + posTop + posLeft + posRight + "margin: 0; " + "height: 5px; border: none; cursor: n-resize;";
    right.style.cssText = "position: absolute; " + posTop + posRight + posBottom + "margin: 0; " + "width: 5px; border: none; cursor: e-resize;";
    bottom.style.cssText = "position: absolute; " + posBottom + posLeft + posRight + "margin: 0; " + "height: 5px; border: none; cursor: s-resize;";
    left.style.cssText = "position: absolute; " + posTop + posLeft + posBottom + "margin: 0; " + "width: 5px; border: none; cursor: w-resize;";
    topRight.style.cssText = "position: absolute; " + posTop + posRight+ "margin: 0; " + "height: 5px; width: 5px; border: none; cursor: ne-resize;";
    topLeft.style.cssText = "position: absolute; " + posTop + posLeft + "margin: 0; " + "height: 5px; width: 5px; border: none; cursor: nw-resize;";
    bottomRight.style.cssText = "position: absolute; " + posBottom + posRight + "margin: 0; " + "height: 5px; width: 5px; border: none; cursor: se-resize;";
    bottomLeft.style.cssText = "position: absolute; " + posBottom + posLeft + "margin: 0; " + "height: 5px; width: 5px; border: none; cursor: sw-resize;";

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
      target = e.target;
      
      if (target !== top && target !== right && target !== bottom && target !== left && target !== topLeft && target !== topRight && target !== bottomLeft && target !== bottomRight) {
        return;
      }
      var style = target.style;
      
      initOffsetLeft = obj.offsetLeft;
      initOffsetTop = obj.offsetTop;
      initClientX = e.clientX;
      initClientY = e.clientY;
      initHeight = Number(oStyle.height.slice(0, -2));
      initWidth = Number(oStyle.width.slice(0, -2));
      //强制转化为top、left定位，且margin: 0;
      style.margin = "0";
      style.top = initOffsetTop;
      style.left = initOffsetLeft;
      
      document.body.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);      
    }

    function mousemove(e) {
      switch (target) {
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
            style.height = height + "px";
            style.top = initOffsetTop + delta + "px";
          }
        } else if (num & 2) {
          delta = e.clientY - initClientY;
          height = initHeight + delta;
          if (height >= minHeight) {
            style.height = height + "px";
          }
        }
        if (num & 1) {
          delta = e.clientX - initClientX;
          width = initWidth - delta;
          if (width >= minWidth) {
            style.width = width + "px";
            style.left = initOffsetLeft + delta + "px";
          }
        } else if (num & 4) {
          delta = e.clientX - initClientX;
          width = initWidth + delta;
          if (width >= minWidth) {
            style.width = width + "px";
          }
        }
      }
    }

    function mouseup() {
      document.body.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    }
  }
    
})(task06);
    
popover.initial();

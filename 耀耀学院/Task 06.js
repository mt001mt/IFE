// JavaScript Document

/********************************************************/
/*****************拖拽窗口以及改变窗口大小******************/
/*******************************************************/
(function() {
  //设置接口
  var DR = {
    /*
     *初始化函数，把事件处理程序添加给相应对象
     *param none
     *return undefined
     */
    initial: initial/*,
    setWH: setWH,
    setTitle: setTitle,
    setContent: setContent*/
  };
  window.popover = popover;
  
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
})();

document.addEventListener("DOMContentLoaded", popover.initial);
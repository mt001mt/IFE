// JavaScript Document

$(window).ready(function() {
  //右键点击div，出现自定义菜单栏事件
  $("div").contextmenu(function() {
    event.preventDefault();
    event.stopPropagation();
    let menu = $(".user-menu"),
        left = event.pageX,
        top = event.pageY,
        width = menu.outerWidth(),
        height = menu.outerHeight(),
        innerWidth = $(window).width(),
        innerHeight = $(window).height();
    if (left + width > innerWidth && left - width > 0) {
      left -= width;
    }
    if (top + height > innerHeight && top - height > 0) {
      top -= height;
    }
    menu.css({
      "left": left,
      "top": top
    });
    $(".user-menu").show();
  });
  //左键点击事件
  $(document).click(function() {
    let menu = $(".user-menu");
    ////自定义菜单栏隐藏
    if (menu.css("display") === "block") {
      menu.hide();
    }
    ////执行自定义菜单栏的命令
    if (event.target === menu.find(".command-1")[0]) {
      setTimeout(function() {
        alert("显示一个对话框");
      }, 50);
    }
  });
  //右键点击事件
  $(document).contextmenu(function() {
    let menu = $(".user-menu");
    ////自定义菜单栏隐藏
    if (menu.css("display") === "block") {
      menu.hide();
    }
    if ($.contains(menu[0], event.target)) {
      event.preventDefault();
    } 
  });
});
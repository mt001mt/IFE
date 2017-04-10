// JavaScript Document

$(window).ready(function() {
  //右键点击div，出现自定义菜单栏事件
  $("div").contextmenu(function(e) {
    e.preventDefault();
    e.stopPropagation();
    var menu = $(".user-menu"),
        left = e.pageX,
        top = e.pageY,
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
  $(document).click(function(e) {
    var menu = $(".user-menu");
    ////自定义菜单栏隐藏
    if (menu.css("display") === "block") {
      menu.hide();
    }
    ////执行自定义菜单栏的命令
    if (e.target === menu.find(".command-1")[0]) {
      setTimeout(function() {
        alert("显示一个对话框");
      }, 50);
    }
  });
  //右键点击事件
  $(document).contextmenu(function(e) {
    var menu = $(".user-menu");
    ////自定义菜单栏隐藏
    if (menu.css("display") === "block") {
      menu.hide();
    }
    if ($.contains(menu[0], e.target)) {
      e.preventDefault();
    } 
  });
});
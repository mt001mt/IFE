// JavaScript Document

var task07 = {}; 
var main = {};

/*******************主函数，JS运行时被调用******************/
/************************定义函数************************/
/*******************给各元素设置不同事件*******************/
/*************************main*************************/
(function(interface) {
  //设置接口
  /*
   *初始化 给各元素设置事件
   *param none
   *return undefined
   */
  interface.initial = initial;
  
  //以下是函数定义
  /*
   *初始化 给各元素设置事件
   *param none
   *return undefined
   */
  function initial() {
    //“点我随机生成表格数据”按钮事件
    document.querySelector("#fill").addEventListener("click", function() {
      var score = generateScore(3);
      if (score) {
        task07.fill(document.querySelector("table"), score);
        clearSortMark();
      }
    });
    //表头点击事件
    document.querySelector("#chinese").addEventListener("click", function() {
      task07.sort(document.querySelector("table"), 1, sortOrder(1));
    });
    document.querySelector("#maths").addEventListener("click", function() {
      task07.sort(document.querySelector("table"), 2, sortOrder(2));
    });
    document.querySelector("#english").addEventListener("click", function() {
      task07.sort(document.querySelector("table"), 3, sortOrder(3));
    });
    document.querySelector("#total").addEventListener("click", function() {
      task07.sort(document.querySelector("table"), 4, sortOrder(4));
    });    
    //阻止表格提交 但是要用submit自动检测数据有效性的功能
    document.querySelector("form").addEventListener("submit", function(e) {
      e.preventDefault();
    });
  }
  
  /*
   *生成表格数据
   *param1 num Number 学科的数目，不包括总分
   *return JSON 如果input中的数据不正确，则返回null
   *            格式 {"score" : [num, "姓名1", "91", "92", "92", "姓名2", ...]}
   */
  function generateScore(num) {
    var input = document.querySelector("#num"),
        studentNum,
        array = [num],
        i, j;
    
    if (!input.checkValidity()) {
      return null;
    }
    
    studentNum = Number(input.value);
    for (j = 0; j < studentNum; j++) {
      array.push(randomName());
      for (i = 0; i < num; i++) {
        array.push(randomInt(0, 100).toString());
      }
    }
    
    return JSON.stringify({score : array});
    
    
    //生成随机姓名，return String
    function randomName() {
      //姓名长度
      var length = randomInt(2, 3),
          name = "",
          i;
      for (i = 0; i < length; i++) {
        name += String.fromCharCode(randomInt(0x4e00, 0x9fa5));
      }
      
      return name;
    }
  }
  
  /*生成随机数
   *param1 start Number->Int 最小随机数，被Number.floor()强制转换成Int
   *param2 end Number->Int 最大随机数，被Number.ceil()强制转换成Int
   *return Number 如果start >= end，返回null
   */
  function randomInt(start, end) {
    if (start >= end) {
      return null;
    }
    start = Math.floor(start);
    end = Math.ceil(end);
    
    return Math.floor(Math.random()*(end - start + 1)) + start;
  }
  
  /*根据上次排序结果，确定本次排序的顺序，并显示排序标志
   *col Number 需要排序的列的序号 从0开始
   *return Boolean true递增 false递减
   */
  var sortOrder,
  /*将排序标识归零，并去除排序标识的显示
   *param none
   *return Undefined
   */
      clearSortMark;
  
  (function(num) {
    //静态变量
    var mark = -1, //用于存放8个排序箭头的状态
        arrowArray = document.querySelector("thead").querySelectorAll("span"); //用于存放显示排序顺序的8个箭头
    
    sortOrder = function(col) {
      var newMark = col * 2 - 1,
          order = false;
      
      if (mark !== -1) {
        arrowArray[mark].style.removeProperty("color");
      }
      if (mark === newMark) {
        mark--;
        order = true;
      } else {
        mark = newMark;
      }
      arrowArray[mark].style.setProperty("color", "#aaa");
      
      return order;
    };
    
    clearSortMark = function() {
      if (mark === -1) {
        return;
      }
      for (var i = 0, max = num * 2; i < max; i++) {
        if (i === mark) {
          arrowArray[i].removeAttribute("style");
          return;
        }
      }
    };
  })(3 + 1); //3 + 1 3门课程 1个总分
})(main);

/*************************模块功能************************/
/******************根据成绩大小对表格列排序*****************/
/***************根据收到的JSON数据生成新表格****************/
/************************task07*************************/

(function(interface) {
  //设置接口
  /*
   *排序功能 只对<tbody>中的元素进行排序，其他表格内容请写入<thead>或<tfoot>中
   *param1 table HTMLTableElement 需要添加浮出层功能的元素                             
   *param2 num Number 需要排序的列
   *param3 order Boolean true递增 false递减
   *return undefined
   */
  interface.sort = sort;
  /*
   *根据参数，填写表格内容
   *param1 table HTMLTableElement 需要的填写内容的表格
   *param2 data JSON 需要填写入表格的JSON数据
   *                 格式 {"score" : [num, "姓名1", "91", "92", "92", "姓名2", ...]}
  *                  num Number 表示有几门课程，不包括总分，JSON数据中也不含有总分
   *return undefined
   */
  interface.fill = fill;
  
  
  //以下是函数定义
  /*
   *排序函数 只对<tbody>中的元素进行排序，其他表格内容请写入<thead>或<tfoot>中
   *param1 table HTMLTableElement 需要排序的表格
   *param2 num Number 需要排序的列
   *param3 order Boolean true递增 false递减
   *                     可无 取默认值false
   *return undefined
   */
  function sort(table, num, order) {
    console.clear();
    var tbodyArray = table.querySelectorAll("tbody"),
        trArray = [],
        tbody = document.createElement("tbody"),
        i,
        length = tbodyArray.length;
    
    if (length === 0) {
      return;
    }
    //提取tr，并删除多余的tbody，只保留第一个
    trArray = trArray.concat(Array.prototype.slice.call(tbodyArray[0].children, 0));
    for (i = 1; i < length; i++) {
      trArray = trArray.concat(Array.prototype.slice.call(tbodyArray[i].children, 0));
      table.removeChild(tbodyArray[i]);
    }
    //排序
    trArray.sort(function(val1, val2) {
      if (order) {
        return val1.children[num].textContent - val2.children[num].textContent;
      }
      return val2.children[num].textContent - val1.children[num].textContent;
    });
    //生成排序后的tbody
    for (i = 0, length = trArray.length; i < length; i++) {
      tbody.appendChild(trArray[i]);
    }
    //排序后的tbodytable代替原tbody
    table.replaceChild(tbody, table.querySelector("tbody"));
  }
  
  /*
   *根据参数，填写表格内容
   *param1 table HTMLTableElement 需要的填写内容的表格
   *param2 data JSON 需要填写入表格的JSON数据
   *                 格式 {"score" : [num, "姓名1", "91", "92", "92", "姓名2", ...]}
  *                  num Number 表示有几门课程，不包括总分，JSON数据中也不含有总分
   *return undefined
   */
  function fill(table, data) {
    var dataJS = JSON.parse(data).score,
        increase = Number(dataJS[0]),
        tbody = "",
        tbodyArray = table.querySelectorAll("tbody"),
        i, j,
        total = 0, //用来计算总分
        length = tbodyArray.length;
    //删除多余的tbody，或添加tbody，只保留一个
    for (i = 1; i < length; i++) {
      table.removeChild(tbodyArray[i]);
    }
    if (length === 0) {
      table.appendChild(document.createElement("tbody"));
    }
    //根据data，生成表格数据
    for (i = 1, length = dataJS.length; i < length;) {
      tbody += "<tr><td>" + dataJS[i++] + "</td>";
      for (j = 0; j < increase; j++) {
        tbody += "<td>" + dataJS[i] + "</td>";
        total += Number(dataJS[i++]);
      }
      tbody += "<td>" + total + "</td></tr>";
      total = 0;
    }
    
    table.querySelector("tbody").innerHTML = tbody;
  }
  
})(task07);

main.initial();
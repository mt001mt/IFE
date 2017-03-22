// JavaScript Document

(function(window){
  //定义静态私有变量
  var depth, //二叉树深度，由init初始化
      divTree, //二叉树，由init初始化
      traversing = false; //遍历是否正在进行
  //赋值给全局变量，暴露接口
  var treeApp = {
    /*
     *初始化函数，根据用户输入的二叉树深度，生成data数据为div的满二叉树
     *@param none
     *@return undefined
     */
    init : init,
    /*
     *显示函数，将二叉树显示在网页中
     *@param none
     *@return undefined
     */
    display : display,
    /*
     *后续遍历n叉树
     *@param1 tree 需要遍历的n叉树
     *@param2 callback 遍历到节点时应该进行的操作函数
     *@return undefined
     */
    traverse : traverse
  };
  window.treeApp = treeApp;


  /*
   *初始化函数，根据用户输入的二叉树深度，生成data数据为div的满二叉树
   *@param none
   *@return undefined
   */
  function init() {
    var totalNum,
        div,
        divList = [];
    divTree = new Tree();
    var depth = parseInt(prompt("请输入二叉树的深度(≤5)", "4"));
    if (depth > 5 || depth < 1 || isNaN(depth) ) {
      depth = parseInt(prompt("请输入二叉树的深度(≤5)", "4"));
    }
    if (depth > 5 || depth < 1 || isNaN(depth) ) {
      depth = 4;
      alert("深度取默认值4");
    }
    totalNum = Math.pow(2, depth) - 1;
    for (var i = 0; i < totalNum; i++) {
      div = document.createElement("div");
      div.id = "div" + i;
      divList.push(div);
    }
    divTree.setFullBinaryTree(depth, divList);
  }
  
  /*
   *显示，将二叉树显示在网页中
   *@param none
   *@return undefined
   */
  function display() {
    var fragment = document.createDocumentFragment();
    //将节点的data对应的div添加到fragment中
    divTree.traverseBF (callback);
    document.body.appendChild(fragment);
    
    function callback(node) {
      var parent = node.parent;
      //非根节点
      if (parent) {
        parent.data.appendChild(node.data);
        return;
      }
      //根节点
      fragment.appendChild(node.data);
      return;
    }
  }
  
  /*
   *遍历二叉树，并将遍历到的节点data对应的div背景色改为蓝色
   *@param String 可取值LRD LDR DLR，表示遍历的顺序
   *@return undefined
   *p.s. 既然有现成的后续遍历，为什么不用呢~
   */
  function traverse(order) {
    //遍历正在进行
    if (traversing) {
      alert("请等待上一次遍历结束");
      return;
    }
    traversing = true;
    var divList = [];
    //把节点data对应的div压入divList中
    switch(order) {
      case "LRD":
        divTree.traverseLRD(callback);
        break;
      case "LDR":
        divTree.traverseLDR(callback);
        break;
      case "DLR":
        divTree.traverseDLR(callback);
        break;
        return;
    }
    
    traverseDisplay();
    
    function traverseDisplay() {
      var i = 1,
          divListTemp = divList,
          length = divListTemp.length;
      divListTemp[0].className += " travesing";
      setTimeout(loop, 1300);
      
      function loop(){
        var temp;
        if (i < length) {
          temp = divListTemp[i-1];
          temp.className = temp.className.replace(/travesing/, "travesed");
          divListTemp[i++].className += " travesing";
          setTimeout(loop, 1300);
        } else {
          temp = divListTemp[length-1];
          temp.className = temp.className.replace(/travesing/, "travesed");
          traversing = false;
          setTimeout(function(){
            divListTemp.forEach(function(item){
              item.className = item.className.replace(/travesed/, "");
            });
            alert("遍历结束");            
          }, 1000);
        }
      }
    }
    
    function callback(node) {
      divList.push(node.data);
    }
  }

  
  /**********************************************************/
  /*******************创建二叉树的构造函数**********************/
  /**********************************************************/
  /*
   *创建二叉树的构造函数
   */
  function Node(data) {
    this.parent = null;
    this.data = data;
    this.children = [];
  }
  function Tree(data) {
    var node = new Node(data);
    this._root = node;
  }
  /*
   *树的深度优先遍历 LRD
   *@param callback Function 遍历到节点时应该进行的操作函数
   *@return undefined
   */
  Tree.prototype.traverseLRD = function(callback) {
    (function recurse(currentNode){
      for(var i = 0, length = currentNode.children.length; i < length; i++) {
        recurse(currentNode.children[i]);
      }
      callback(currentNode);
    })(this._root);
  };
  /*
   *树的深度优先遍历 LDR
   *@param callback Function 遍历到节点时应该进行的操作函数
   *@return undefined
   */
  Tree.prototype.traverseLDR = function(callback) {
    (function recurse(currentNode){
      for(var i = 0, length = currentNode.children.length / 2; i < length; i++) {
        recurse(currentNode.children[i]);
      }
      callback(currentNode);
      for(length *= 2; i < length; i++) {
        recurse(currentNode.children[i]);
      }
    })(this._root);
  };
  /*
   *树的深度优先遍历 DLR
   *@param callback Function 遍历到节点时应该进行的操作函数
   *@return undefined
   */
  Tree.prototype.traverseDLR = function(callback) {
    (function recurse(currentNode){
      callback(currentNode);
      for(var i = 0, length = currentNode.children.length; i < length; i++) {
        recurse(currentNode.children[i]);
      }
    })(this._root);
  };
  /*
   *树的广度优先遍历
   *@param callback Function 遍历到节点是应该进行的操作函数
   *@return undefined
   */
  Tree.prototype.traverseBF = function(callback) {
    var queue = [];
    var currentNode = this._root;
    while(currentNode){
      for(var i = 0, length = currentNode.children.length; i < length; i++){
        queue.push(currentNode.children[i]);
      }
      callback(currentNode);
      currentNode = queue.shift();
    }
  };
  /*
   *创建一个深度为depth的满二叉树
   *@param depth Number 二叉树的深度
   *@param data Array[] 广度优先遍历二叉树的节点值组成的数组
   *@return Tree
   */
  Tree.prototype.setFullBinaryTree = function(depth, data) {
    var node,
        parent,
        count = 0,
        nodeQueue = [],
        i, j, k, levelLength;
    if (data instanceof Array && data.length > 0) {//console.log(data);
      node = new Node(data[count++]);
      this._root = node;
      nodeQueue.push(node);
      for (i = 1; i < depth - 1; i++) {
        //每次都添加两个“亲兄弟"节点，并和父母相连。levelLength为i层节点的个数
        for (j = 0, levelLength = Math.pow(2, i - 1); j < levelLength; j++){
          parent = nodeQueue.shift();
          for (k = 0; k < 2; k++) {
            node = new Node(data[count++]);
            node.parent = parent;
            parent.children.push(node);
            nodeQueue.push(node);
          }
        }
      }
      //添加最后一层
      for (j = 0, levelLength = Math.pow(2, depth - 2); j < levelLength; j++){
        parent = nodeQueue.shift();
        for (k = 0; k < 2; k++) {
          node = new Node(data[count++]);
          node.parent = parent;
          parent.children.push(node);
        }
      }
    }
    //没有传入data数组
    else {
      node = new Node();
      this._root = node;
      nodeQueue.push(node);
      for (i = 1; i < depth - 1; i++) {
        //每次都添加两个“亲兄弟"节点，并和父母相连。levelLength为i层节点的个数
        for (j = 0, levelLength = Math.pow(2, i - 1); j < levelLength; j++){
          parent = nodeQueue.shift();
          for (k = 0; k < 2; k++) {
            node = new Node();
            node.parent = parent;
            parent.children.push(node);
            nodeQueue.push(node);
          }
        }
      }
      //添加最后一层
      for (j = 0, levelLength = Math.pow(2, depth - 2); j < levelLength; j++){
        parent = nodeQueue.shift();
        for (k = 0; k < 2; k++) {
          node = new Node();
          node.parent = parent;
          parent.children.push(node);
        }
      }
    }
  };
})(window);
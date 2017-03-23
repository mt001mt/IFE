// JavaScript Document

(function(window){
  //定义静态私有变量
  var divTree, //二叉树，由init初始化
      traversing = null, //遍历是否正在进行
      matchedNode = []; //搜索到的节点
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
    traverse : traverse,
    /*
     *根据输入的根元素Element，生成n叉树。data属性中保存的是HTMLElement
     *@param root HTMLElement，表示n叉树的根节点
     *@return undefined
     */
    getTree : getTree,
    /*
     *根据输入的内容，搜索n叉树，并高亮符合的节点
     *@param none
     *@return undefined
     */
    search : search
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
    var divList = [];
    clear();
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
          traversing = setTimeout(loop, 1300);
        } else {
          temp = divListTemp[length-1];
          temp.className = temp.className.replace(/travesing/, "travesed");
          traversing = null;
          setTimeout(function(){
            divListTemp.forEach(function(item){
              item.className = item.className.replace(/travesed/, "");
            });
            alert("遍历结束");
          }, 1300);
        }
      }
    }
    
    function callback(node) {
      divList.push(node.data);
    }
  }
  /*
   *根据输入的根元素Element，生成n叉树。data属性中保存的是HTMLElement
   *@param root HTMLElement，表示n叉树的根节点
   *@return undefined
   *p.s. 利用了广度优先遍历
   */
  function getTree(root) {
    divTree = new Tree(root);
    divTree.traverseBF(setNodeChildren);
    //根据输入的Node节点，给该节点的children属性赋值
    //由traverseBF调用
    function setNodeChildren(node) {
      var childArray, length;
      childArray = Array.prototype.slice.call(node.data.childNodes, 0);
      length = childArray.length;
      for (var i = 0; i < length; i++) {
        //子节点为Element_Node
        if (childArray[i].nodeType === 1) {
          node.children.push(new Node(childArray[i]));
        }
      }
    }
  }
  /*
   *根据输入的内容，搜索n叉树，并高亮符合的节点
   *@param none
   *@return undefined
   */
  function search() {
    var input = document.getElementById("search-input").value;
    if (input) {
      clear();
      var nodeQueue = [],
          ret = false;
      (function traverse(currentNode) {
        console.count("traverse被调用了：");
        var childArray = Array.prototype.slice.call(currentNode.data.childNodes, 0),
            length = childArray.length;
        for (var i = 0; i < length; i++) {
          //子节点为Element_Node && 内容和搜索的相同
          if (childArray[i].nodeType === 3 && childArray[i].nodeValue.trim() === input) {
            ret = true;
            nodeQueue.push(currentNode.data);
            break;
          }
        }
        //currentNode的内容与input不同，继续递归
        if (!ret) {
          for (i = 0, length = currentNode.children.length; i< length; i++) {
            nodeQueue.push(currentNode.children[i]);
          }
          var nextNode = nodeQueue.shift();
          if (nextNode) {
            traversing = setTimeout(function(){
              currentNode.data.className = currentNode.data.className.replace(/travesing/, "travesed");
              traverse(nextNode);
            }, 1300);
          } else { //没找到相应节点，且已经遍历完了
            traversing = setTimeout(function(){
              currentNode.data.className = currentNode.data.className.replace(/travesing/, "travesed");
              traversing = setTimeout(function(){
                clear();
                alert("遍历结束，没找到相应数据");
              }, 1300);
            }, 1300);
          }
        } else {//currentNode的内容与input相同，跳出递归
          traversing = setTimeout(function(){
            currentNode.data.className = currentNode.data.className.replace(/travesing/, "travesed matched");
            matchedNode.push(currentNode);
            clearBC();
            alert("找到节点");
          }, 1300);
        }
        currentNode.data.className += " travesing";
      })(divTree.getRoot());
    }
  }
  /*
   *将
   *@param none
   *@return undefined
   */
  function clear() {
    if (matchedNode.length) {
      for (var i = 0, length = matchedNode.length; i < length; i++) {
        matchedNode[i].data.className = matchedNode[i].data.className.replace(/matched/, "");
      }
      matchedNode = [];
    }
    if (traversing !== null) {
      clearTimeout(traversing);
      divTree.traverseBF(cleartraverse);
      traversing = null;
    }
    //遍历树，把所有被遍历标记的class去除
    function cleartraverse(node) {
      node.data.className = node.data.className.replace(/travesing|travesed/, "");
    }
  }
  /*
   *将
   *@param none
   *@return undefined
   */
  function clearBC() {
    divTree.traverseBF(cleartraverse);
    traversing = null;
    //遍历树，把所有被遍历标记的class去除
    function cleartraverse(node) {
      node.data.className = node.data.className.replace(/travesing|travesed/, "");
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
   *返回树的根节点
   *@param none
   *@return Node
   */
  Tree.prototype.getRoot = function() {
    return this._root;
  };
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
      callback(currentNode);
      for(var i = 0, length = currentNode.children.length; i < length; i++){
        queue.push(currentNode.children[i]);
      }
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
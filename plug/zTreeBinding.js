
function zTreeBinding (obj, treeData, opt) {
  var opt = opt || {}
  var input = $('[ztreedropdown="#' + obj.attr('id') + '"]')
  var treeContainer = obj.parent()
  var tree = obj
  var zTree = {}
  var json = {
    input: input,
    treeContainer: treeContainer,
    tree: tree,
    zTree: zTree
  }
  if (opt.isLeftTree) {

    // zTree.onClick = function (e, treeId, treeNode) {
    //   var zTree = $.fn.zTree.getZTreeObj(this.tree.attr('id')),
    //   nodes = zTree.getSelectedNodes(),
    //   v = "",
    //   nodeData = ""
    //   nodes.sort(function compare(a,b){return a.id-b.id})
    //   var checkedNode = nodes[0]
    //   // console.log(checkedNode)
    // }.bind(json)


    function addHoverDom(treeId, treeNode) {
      var sObj = $("#" + treeNode.tId + "_span")
      if (treeNode.editNameFlag || sObj.parent().find("[customBtn]").length>0) return
      var addBtns = ''
      for (var i = 0; i < opt.customBtns.length; i++) {
        if (opt.customBtns[i].filter) {
          for (var attr in opt.customBtns[i].filter) {
            if (treeNode[attr] || treeNode[attr] === 0) {
              if (opt.customBtns[i].filter[attr] !== treeNode[attr]) {
                if (opt.customBtns[i].modal) {
                  addBtns += "<span customBtn data-toggle='modal' data-target='" + opt.customBtns[i].modal + "' class='" + opt.customBtns[i].class + "' event-" + opt.customBtns[i].event + "='" + JSON.stringify(treeNode) + "' title='" + opt.customBtns[i].name + "'>" + opt.customBtns[i].name + "</span>"
                } else {
                  addBtns += "<span customBtn class='" + opt.customBtns[i].class + "' event-" + opt.customBtns[i].event + "='" + JSON.stringify(treeNode) + "' title='" + opt.customBtns[i].name + "'>" + opt.customBtns[i].name + "</span>"
                }
                break
              }
            }
          }
        } else {
          if (opt.customBtns[i].modal) {
            addBtns += "<span customBtn data-toggle='modal' data-target='" + opt.customBtns[i].modal + "' class='" + opt.customBtns[i].class + "' event-" + opt.customBtns[i].event + "='" + JSON.stringify(treeNode) + "' title='" + opt.customBtns[i].name + "'>" + opt.customBtns[i].name + "</span>"
          } else {
            addBtns += "<span customBtn class='" + opt.customBtns[i].class + "' event-" + opt.customBtns[i].event + "='" + JSON.stringify(treeNode) + "' title='" + opt.customBtns[i].name + "'>" + opt.customBtns[i].name + "</span>"
          }
        }
      }
      if (opt.disabledClick) {
        if (treeNode[opt.disabledClick.key] !== opt.disabledClick.value) {
            sObj.parent().attr('event-' + opt.treeEvent, JSON.stringify(treeNode))
        }
      }else{
          sObj.parent().attr('event-' + opt.treeEvent, JSON.stringify(treeNode))
      }
      sObj.after(addBtns)
      opt.instance.eventsBinding()
    }

    function removeHoverDom(treeId, treeNode) {
      for (var i = 0; i < opt.customBtns.length; i++) {
        $('#' + treeNode.tId).children().children("[event-" + opt.customBtns[i].event + "]").unbind().remove()
      }
    }
    function filter(treeId, parentNode, responseData) {
      var zTree = $.fn.zTree.getZTreeObj(treeId)
      var childNodes=[]
      if(responseData.success){
        if(responseData.result.length > 0){
          childNodes= responseData.result
          for(var i = 0; i < childNodes.length ; i++){
            var menuUrl = childNodes[i].menuUrl
            var menuType =  childNodes[i].menuType
            childNodes[i].isParent = true
            if(menuType =='leaf'){
              childNodes[i].isParent = false
            }
          }
        }else{
          if(parentNode==null||parentNode==undefined){
            return
          }
          parentNode.isParent = false
          zTree.updateNode(parentNode)
          return
        }
      }else{
        if(parentNode==null||parentNode==undefined){
          return
        }
        parentNode.isParent = false
        zTree.updateNode(parentNode)
        return
      }
      return childNodes
    }
    function beforeClick (treeId, treeNode) {
      var check = treeNode
      if (check && opt.disabledClick) {
        check = treeNode[opt.disabledClick.key] !== opt.disabledClick.value
        if (window.event.target.getAttribute('custombtn') === null && !check) {
            if (opt.disabledClick.callback) {
              opt.disabledClick.callback()
            }
        }
      }
      return check
    }

    function beforeDrag () {
      return false
    }

		function onAsyncSuccess(event, treeId, treeNode, msg) {
      if (zTree.extendType == 'asyncAll') {
        zTree.asyncNodes(treeNode.children);
      }
		}
    var setting = {
      view: {
        showIcon: true,
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom
      },
      edit: {
        enable: true,
        showRenameBtn: false,
        showRemoveBtn: false
      },
      data: {
        key:{
          name: opt.name || 'name'
        },
        simpleData: {
          enable: true,
          pIdKey: opt.pIdKey || 'pId',
        }
      },
      callback: {
				beforeDrag: beforeDrag,
        beforeClick: beforeClick,
        onAsyncSuccess: onAsyncSuccess
      }
    }
    if (opt.isASync) {
      setting.async = {
        enable: true, // 设置 zTree是否开启<strong>异步</strong>加载模式
        url: '../' + opt.isASync.url, // Ajax 获取数据的 URL 地址
        autoParam: opt.isASync.autoParam,
        dataFilter: filter
      }
    }
    zTree = $.fn.zTree.init(tree, setting, treeData)

    zTree.refreshNode = function (opt) {
      var opt = opt || {}
      var zTree = $.fn.zTree.getZTreeObj(this.tree.attr('id'))
			var type = opt.type || 'refresh'
			var silent = typeof(opt.silent) === 'boolean' ? opt.silent : true
      var nodes
      if (opt.targetParam) {
        nodes = []
        var node = zTree.getNodeByParam(opt.targetParam[0], opt.targetParam[1])
        if (node) {
          nodes.push(node)
        }
      } else {
			  nodes = zTree.getSelectedNodes()
      }
			if (nodes.length == 0) {
        swal({
          type: 'info',
          titleText: '请先选择一个父节点'
        }).catch(swal.noop)
			} else {
  			for (var i=0, l=nodes.length; i<l; i++) {
  				zTree.reAsyncChildNodes(nodes[i], type, silent)
  				if (!silent) zTree.selectNode(nodes[i])
  			}
      }
		}.bind(json)

		zTree.expandNode = function (type) {
      var zTree = $.fn.zTree.getZTreeObj(this.tree.attr('id'))
			nodes = zTree.getSelectedNodes();
			if (type == "expandAll") {
				zTree.expandAll(true);
			} else if (type == "collapseAll") {
				zTree.expandAll(false);
			}
		}.bind(json)

    zTree.asyncAll = function () {
      var zTree = $.fn.zTree.getZTreeObj(this.tree.attr('id'))
      zTree.asyncNodes(zTree.getNodes());
      zTree.extendType = 'asyncAll'
    }.bind(json)

		zTree.asyncNodes = function (nodes) {
			if (!nodes) return;
      var zTree = $.fn.zTree.getZTreeObj(this.tree.attr('id'))
			for (var i=0, l=nodes.length; i<l; i++) {
				if (nodes[i].isParent && nodes[i].zAsync) {
					zTree.asyncNodes(nodes[i].children);
				} else {
					zTree.reAsyncChildNodes(nodes[i], "refresh", true);
				}
			}
      zTree.expandAll('expandAll')
		}.bind(json)
  } else {
    zTree.beforeClick = function (treeId, treeNode) {
      var check = treeNode
      if (check && opt.disabledClick) {
        check = treeNode[opt.disabledClick.key] !== opt.disabledClick.value
        if (window.event.target.getAttribute('custombtn') === null && !check) {
            if (opt.disabledClick.callback) {
              opt.disabledClick.callback()
            }
        }
      }
      return check
    }

    zTree.onClick = function (e, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj(this.tree.attr('id')),
      nodes = zTree.getSelectedNodes(),
      // v = "",
      nodeData = ""
      nodes.sort(function compare(a,b){return a.id-b.id;})
      var checkedNode = nodes[0]
      // nodeData = JSON.stringify(checkedNode)
      // v = checkedNode.name
      // nodeData = JSON.stringify({
      //   id: checkedNode.id,
      //   pId: checkedNode.pId,
      //   areaLevel: checkedNode.areaLevel
      // })
      // if (checkedNode.areaLevel === 3) {
      //   v = checkedNode.getParentNode().getParentNode().name + '-' + checkedNode.getParentNode().name + '-' + v
      // } else if (checkedNode.areaLevel === 2) {
      //   v = checkedNode.getParentNode().name + '-' + v
      // }
      // this.input.val(v)
      // this.input.attr('nodeData', nodeData)
      this.input[0].node = checkedNode
      this.input.change()
      this.zTree.hideMenu()
    }.bind(json)

    zTree.hideMenu = function () {
      this.treeContainer.fadeOut("fast")
      $("body").unbind("mousedown", this.zTree.onBodyDown)
    }.bind(json)

    zTree.onBodyDown = function (event) {
      if (!(event.target === this.treeContainer[0] || $(event.target).parents('.' + this.treeContainer.attr('class')).length >= 1)) {
        this.zTree.hideMenu()
      }
    }.bind(json)
    function beforeDrag () {
      return false
    }
    zTree = $.fn.zTree.init(tree, {
      view: {
        dblClickExpand: false
      },
      data: {
        simpleData: {
          enable: true,
          pIdKey: opt.pIdKey,
        }
      },
      callback: {
				beforeDrag: beforeDrag,
        beforeClick: zTree.beforeClick,
        onClick: zTree.onClick
      }
    }, treeData)
    zTree.showMenu = function (modal) {
      var cityOffset = this.input.offset()
      if (modal) {
        var extraLeft = -(document.documentElement.clientWidth - $('.modal-dialog').width()) / 2
        var extraTop = -parseInt($('.modal-dialog').css('marginTop'))
        this.treeContainer.css({left:cityOffset.left + extraLeft + "px", top:cityOffset.top + this.input.outerHeight() + extraTop + "px"}).slideDown("fast")
      } else {
        this.treeContainer.css({left:cityOffset.left + "px", top:cityOffset.top + this.input.outerHeight() + "px"}).slideDown("fast")
      }
      $("body").bind("mousedown", this.zTree.onBodyDown)
    }.bind(json)
  }

  return zTree
}

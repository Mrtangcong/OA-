window.util = {
  ajax: function(opt) {
    opt.url =  opt.url
    var def = $.Deferred()
    def.fail(function(info) {
      swal(info).catch(swal.noop)
    })
    opt.data = opt.data ? opt.data : {}
    opt.cache = false
    $.ajax(opt).done(function(response) {
      response.success ? def.resolve(response) : def.reject({
        type: 'error',
        titleText: response.info
      })
    }).fail(function(response) {
      def.reject({
        type: 'error',
        titleText: response.status
      })
    })
    return def
  },
  serialize: function(obj) {
    var form = $(obj).is('form') ? obj : $(obj.target).parents('.modal-dialog').find('form')
    return form.serialize()
  },
  validate: function(obj) {
    var def = $.Deferred()
    var form = $(obj).is('form') ? obj : $(obj.target).parents('.modal-dialog').find('form')
    $(form).validate().form() ? def.resolve() : def.reject()
    return def
  },
  serializeFormToObj: function(form) {
    var result = {};
    $(form).find('*[name]').each(function(i, v) {
      var nameSpace,
        name = $(v).attr('name'),
        val = $.trim($(v).val()),
        tempArr = [],
        tempObj = {};
      if (name == '') {
        return;
      }

      //处理radio add by yhx  2014-06-18
      if ($(v).attr("type") == "radio") {
        var tempradioVal = null;
        $("input[name='" + name + "']:radio").each(function() {
          if ($(this).is(":checked"))
            tempradioVal = $(this).val();
        });
        if (tempradioVal) {
          val = tempradioVal;
        } else {
          val = "";
        }
      }

      if ($(v).attr('type') == 'checkbox') {
        var tempcheckVal = [];
        $("input[name='" + name + "']:checked").each(function(i, v) {
          tempcheckVal.push($(v).val());
        });
        val = tempcheckVal.join(',');
      }

      //构建参数
      if (name.match(/\./)) {
        tempArr = name.split('.');
        nameSpace = tempArr[0];
        tempObj[tempArr[1]] = val;
        if (!result[nameSpace]) {
          result[nameSpace] = tempObj;
        } else {
          result[nameSpace] = $.extend({}, result[nameSpace], tempObj);
        }

      } else {
        result[name] = val;
      }

    });
    var obj = {};
    for (var o in result) {
      var v = result[o];
      if (typeof v == "object") {
        obj[o] = JSON.stringify(v);
      } else {
        obj[o] = result[o]
      }
    }
    return obj;
  },
  renderTree: function (parent, data) {
    for (var i = 0 ; i < data.length; i++) {
        if (parent.id === data[i].parentId) {
          parent.children.push(data[i])
          if (parent.children[parent.children.length - 1].menuType !== 'leaf') {
            parent.children[parent.children.length - 1].children = []
            util.renderTree(parent.children[parent.children.length - 1], data)
          }
        }
    }
    return parent.children
  },
  zTree: {

    format: function (obj, data, type) {
      if (type === 'list') {
      	  var tree = data
      } else {
          var tree = util.renderTree({
              id: 0,
              children: []
            }, data)
      }
      return $.fn.zTree.init(obj, {
        check: {
          enable: true,
          autoCheckTrigger: true
        },
        callback: {
          onClick: onClick
        }
      }, tree)
      function onClick(e,treeId, treeNode) {
        // configForm.zTree.expandNode(treeNode);
        configForm.zTree.checkNode(treeNode, !treeNode.checked, true);
      }
    },
    setChecked: function (obj, data) {
      $.each(data, function(i, v) {
        var node = obj.getNodeByParam("id", v.menuId, null)
        if (node != null) {
          obj.checkNode(node, true, false)
        }
      })
    },
    getChecked: function (tree) {
      var ids = []
      var nodes = tree.getChangeCheckedNodes(true);
      for (var i = 0; i < nodes.length; i++) {
        ids.push(nodes[i].id)
      }
      return ids
    }
  },
  copyTableHead: function (container, opt) {
    var opt = opt || {}
    var extra = opt.extra || 0
    var table = container.querySelectorAll('table')[opt.num] || container.querySelector('table')
    if (!table.tBodies[0]) { return false }
    var newTable = document.createElement('table')
    var newHead = table.tHead
    newTable.className = table.className
    if ($(table).parents('.modal-dialog').length) { // 判断table是否在模态框内
      setTimeout(setHead, 150) // bootstrap的模态框渲染时长为150毫秒
    } else {
      setHead()
    }
    function setHead() {
      $(newTable).attr('style', $(table).attr('style'))
      // table.tHead.rows[0].cells[table.tHead.rows[0].cells.length - 1].removeAttribute('width')
      table.parentNode.parentNode.insertBefore(newTable, table.parentNode)
      newTable.appendChild(table.tHead)
      setStyle()
    }
    function setStyle() {
      for (var i = 0; i < newHead.rows[0].cells.length; i++) {
        newHead.rows[0].cells[i].width =  table.tBodies[0].rows[0].cells[i].offsetWidth
        newHead.rows[0].cells[i].style['min-width'] =  table.tBodies[0].rows[0].cells[i].offsetWidth
      }
      table.parentNode.style.width = newHead.offsetWidth >= table.parentNode.offsetWidth ? newHead.offsetWidth + 'px' : ''
      $(table.parentNode).css('height', opt.height || 'calc(100%' + ' - ' + ($(table.parentNode).offset().top - 3 + extra) + 'px)')
    }
    window.removeEventListener('resize', setStyle)
    window.addEventListener('resize', setStyle)
  },
  
  formatDate:function (time, format) {
	  var t = new Date(time);
      var tf = function (i) {
          return (i < 10 ? '0' : '') + i
      };
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
          switch (a) {
              case 'yyyy':
                  return tf(t.getFullYear());
                  break;
              case 'MM':
                  return tf(t.getMonth() + 1);
                  break;
              case 'mm':
                  return tf(t.getMinutes());
                  break;
              case 'dd':
                  return tf(t.getDate());
                  break;
              case 'HH':
                  return tf(t.getHours());
                  break;
              case 'ss':
                  return tf(t.getSeconds());
                  break;
          }
      })
  },
  getMonthFirstDay:function (data){
	  var date_ = new Date();
      var year = date_.getFullYear();
      var month = date_.getMonth() + 1;
      if (data === 'date') {
          var firstdate = year + '-' + month + '-01'
          var month_first = util.formatDate(firstdate, "yyyy-MM-dd");
      } else {
          var firstdate = year + '-' + month + '-01' + " 00:00:00"
          var month_first = util.formatDate(firstdate, "yyyy-MM-dd") + " 00:00:00";
      }
      return month_first;
  },
  getToday:function (){
	  var date_ = new Date();
      var today = util.formatDate(date_, "yyyy-MM-dd") + " 00:00:00";
      return today;
  }
  
}

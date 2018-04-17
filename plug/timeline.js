
function TimeLine (opt) {
  for (var i in opt) { this[i] = opt[i] }
  this.init(opt)
}
TimeLine.prototype.init = function (opt) {
  this.baseNum = 25
  this.delay = 100
  this.resetData() // 整理数据
  this.createBox()
  if (this.el.offsetWidth) {
    this.createLine()
  } else {
    setTimeout(function () {
      this.createLine()
    }.bind(this), 300)
  }
}
TimeLine.prototype.resetData = function () {
  for (var i = 0; i < this.lineData.length; i++) {
    this.lineData[i].start = parseInt(this.lineData[i].startTime.split(':')[0])
    this.lineData[i].end = parseInt(this.lineData[i].endTime.split(':')[0]) + 1
  }
}
TimeLine.prototype.createBox = function () {
  var ul = document.createElement('ul')
  this.el.appendChild(ul)
  for (var i = 0; i < this.baseNum; i++) { // 25个点 24条线（每一个线段是一个小时）
    this['point' + i] = document.createElement('li')
    ul.appendChild(this['point' + i])
  }
}
TimeLine.prototype.clearLine = function (opt) {
  if (this.allLine) {
    for (var i = this.allLine.length - 1; i > -1; i--) {
      this.allLine[i].parentNode.removeChild(this.allLine[i])
    }
  }
  this.allLine = []
}
TimeLine.prototype.createLine = function (opt) {
  this.clearLine()
  for (var i = 0; i < this.lineData.length; i++) {
    this.setLine({
      begin: this.lineData[i - 1],
      target: this.lineData[i]
    })
  }
}
TimeLine.prototype.setLine = function (opt) {
  var line = document.createElement('div')
  this.el.appendChild(line)
  this.allLine.push(line)
  if (opt.begin) {
    line.style.left = this['point' + opt.begin.end].offsetLeft + 'px'
  } 
  if (opt.begin && opt.target) {
    line.style.width = this['point' + opt.target.end].offsetLeft + this['point' + opt.target.end].offsetWidth - this['point' + opt.begin.end].offsetLeft + 'px'
  } else if (opt.target) {
    line.style.width = this['point' + opt.target.end].offsetLeft + this['point' + opt.target.end].offsetWidth + 'px'
  } else {
    line.style.width = this.el.offsetWidth - this['point'+opt.begin.end].offsetLeft + 'px'
  }
  for (var i = 0; i < 2; i++) {
    var span = document.createElement('span')
    line.appendChild(span)
    var strong = document.createElement('strong')
    span.appendChild(strong)
    strong.innerHTML = i === 0 ? opt.target.start : opt.target.end
  }

  var instance = this
  line.children[0].onmousedown = function (ev) {
    var oEvent = ev || window.event
    oEvent.preventDefault()
    var _this = this.parentNode
    var nowNum = this.children[0]
    var min = instance.point1.offsetLeft + _this.children[0].offsetWidth
    var l = oEvent.clientX - _this.offsetLeft
    var w = _this.offsetWidth + _this.offsetLeft
    var crl = _this.offsetLeft + _this.children[1].offsetLeft + _this.children[1].offsetWidth // children right left 右侧的按钮的left距离
    instance.setActive(_this)
    window.onmousemove = function (ev) {
      var oEvent = ev || window.event
      var L
      if (oEvent.clientX - l > 0) {
        L = oEvent.clientX - l
      } else {
        L = 0
      }
      if (_this.offsetLeft + _this.children[1].offsetLeft + _this.children[1].offsetWidth / 2 - L < min) {
        L = crl - min
      }
      var W 
      if (w - L > min) {
        W = w - L
      } else {
        W = min
      }
      _this.style.left = L + 'px'
      _this.style.width = W + 'px'
      instance.movePoint(_this, nowNum, true)
    }
    window.onmouseup = function (ev) {
      this.onmousemove = this.onmouseup = null
      setTimeout(function () {
        instance.removeActive(_this)
      }, this.delay)
      instance.toPoint(_this, true)
    }
  }
  line.children[1].onmousedown = function (ev) {
    var oEvent = ev || window.event
    oEvent.preventDefault()
    var _this = this.parentNode
    var nowNum = this.children[0]
    var min = instance.point1.offsetLeft + _this.children[1].offsetWidth
    var l = oEvent.clientX - _this.offsetWidth
    instance.setActive(_this)
    window.onmousemove = function (ev) {
      var oEvent = ev || window.event
      var L
      if (oEvent.clientX - l > _this.parentNode.offsetWidth - _this.offsetLeft) {
        L = _this.parentNode.offsetWidth - _this.offsetLeft
      } else if (oEvent.clientX - l < min) {
        L = min
      } else if (oEvent.clientX - l > 30) {
        L = oEvent.clientX - l
      }
      _this.style.width = L + 'px'
      instance.movePoint(_this, nowNum)
    }
    window.onmouseup = function (ev) {
      this.onmousemove = this.onmouseup = null
      setTimeout(function () {
        instance.removeActive(_this)
      }, this.delay)
      instance.toPoint(_this)
    }
  }
}
TimeLine.prototype.setActive = function (_this) {
  for (var i = 0; i < _this.parentNode.children.length; i++) {
    _this.parentNode.children[i].classList.add('disabled')
  }
  _this.classList.remove('disabled')
  _this.classList.add('active')
  _this.children[0].classList.add('active')
  _this.children[1].classList.add('active')
}
TimeLine.prototype.removeActive = function (_this) {  
  for (var i = 0; i < _this.parentNode.children.length; i++) {
    _this.parentNode.children[i].classList.remove('disabled')
  }
  _this.classList.remove('active')
  _this.children[0].classList.remove('active')
  _this.children[1].classList.remove('active')
}
TimeLine.prototype.toPoint = function (_this, l) {
  var tpi = this.getTPI(_this, l)
  if (this.isChange(_this, tpi.i, tpi.p, l)) {
    this.edit(tpi.i, tpi.p, l)
    this.setExtraData()
    setTimeout(function () {
      this.createLine()
      this.callback && this.callback(this.lineData)
    }.bind(this), this.delay)
  }
}
TimeLine.prototype.movePoint = function (_this, nowNum, l) {
  setTimeout(function () {
    var tpi = this.getTPI(_this, l)
    if (nowNum.innerHTML != tpi.p) {
      nowNum.innerHTML = tpi.p
    }
  }.bind(this), this.delay)
}
TimeLine.prototype.getTPI = function (_this, l) {
  var translate = l ? 0 : _this.children[1].offsetLeft + _this.children[1].offsetWidth / 2 // 判断是否左侧按钮
  var point = Math.round((_this.offsetLeft + translate) / this.point1.offsetLeft)
  var index = [].indexOf.call(_this.parentNode.children, _this) - 1
  return {
    t: translate,
    p: point,
    i: index
  }
}
TimeLine.prototype.isChange = function (_this, index, point, l) {  
  if (l) { // 判断是否左侧按钮
    _this.style.left = this['point' + point].offsetLeft + 'px'
    _this.style.width = _this.offsetWidth + _this.offsetLeft - this['point' + point].offsetLeft + 'px'
  } else {
    _this.style.width = this['point' + point].offsetLeft - _this.offsetLeft + _this.children[1].offsetWidth + 'px';
  }
  var isEdit = this.lineData[index][l ? 'start' : 'end'] !== point
  return isEdit
}
TimeLine.prototype.edit = function (index, point, l) {
  var isBig = this.lineData[index][l ? 'start' : 'end'] > point
  this.lineData[index][l ? 'start' : 'end'] = point
  if (l) { // 左侧按钮拖拽
    if (isBig) { // 往左拉：修改或者删除
      for (var i = index - 1; i > -1; i--) {
        if (this.lineData[i].start >= point) {
          this.lineData.splice(i, 1)
        } else if (this.lineData[i].end > point) {
          this.lineData[i].end = point
          break
        }
      }
    } else { // 往右拉：新增
      this.lineData.splice(index, 0, {
        start: this.lineData[index - 1] ? this.lineData[index - 1].end : 0,
        end: this.lineData[index].start
      })
    }
  } else { // 右侧按钮拖拽
    if (isBig) { // 往左拉: 新增
      this.lineData.splice(index + 1, 0, {
        start: this.lineData[index].end,
        end: this.lineData[index + 1] ? this.lineData[index + 1].start : this.baseNum - 1
      })
    } else { // 往右拉：修改或者删除
      for (var i = index + 1; i < this.lineData.length; i++) {
        if (this.lineData[i].end <= point) {
          this.lineData.splice(i, 1)
          i--
        } else if (this.lineData[i].start < point) {
          this.lineData[i].start = point
          break
        }
      }
    }
  }
}
TimeLine.prototype.setExtraData = function () {
  for (var json of this.lineData) {
    json.startTime = json.start > 9 ? json.start + ':00' : '0' + json.start + ':00'
    json.endTime = json.end - 1 > 9 ? json.end - 1 + ':59' : '0' + (json.end - 1) + ':59'
    for (var i = 0; i < this.extraKey; i++) {
      if (!(this.extraKey[i] in json)) {
        json[this.extraKey[i]] = ''
      }
    }
  }
}
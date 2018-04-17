function calendar (opt) {
  return new Calendar(opt)
}
function Calendar (opt) {
  this.init(opt)
}

Calendar.prototype.init = function (opt) {
  for ( var i in opt ) {
    this[i] = opt[i]
  }

  this.container = this.createPanel({
    container: this.el,
    tagName: 'div'
  })

  var header = this.createPanel({
    container: this.container,
    tagName: 'div'
  })

  var today = this.createPanel({
    container: header,
    tagName: 'span'
  })

  this.year = this.createPanel({
    container: header,
    tagName: 'span'
  })

  this.month = this.createPanel({
    container: header,
    tagName: 'span'
  })

  var previous = this.createPanel({
    container: header,
    insertBefore: header.children[0],
    tagName: 'b',
    className: 'previous'
  })

  var next = this.createPanel({
    container: header,
    tagName: 'b',
    className: 'next'
  })

  var table = this.createPanel({
    container: this.container,
    tagName: 'table'
  })

  var thead = this.createPanel({
    container: table,
    tagName: 'thead'
  })

  var tr = this.createPanel({
    container: thead,
    tagName: 'tr'
  })

  this.tbody = this.createPanel({
    container: table,
    tagName: 'tbody'
  })

  this.days = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
  }

  for (var i = 1; i < 8; i++) {
    var th = this.createPanel({
      container: tr,
      tagName: 'th'
    })
    th.innerHTML = this.days[i] || this.days[0]
  }

  this.container.className = 'calendar'
  today.innerHTML = this.week ? '本周' : '今天'
  // previous.innerHTML = '<'
  previous.toMonth = -1
  // next.innerHTML = '>'
  next.toMonth = 1
  this.showDate = this.todayDate = this.selectDate = new Date()
  var _this = this
  previous.onclick = next.onclick = today.onclick = function () {
    _this.click(this.toMonth)
  }
  this.setDates()
}

Calendar.prototype.click = function (toMonth) {
  if (toMonth) {
    var toDate = new Date(this.showDate)
    toDate.setDate(1)
    toDate.setMonth(this.showDate.getMonth() + toMonth)
    this.showDate = toDate
  } else {
    this.showDate = this.selectDate = this.todayDate
  }
  this.setDates()
}

Calendar.prototype.setDates = function () {
  this.tbody.innerHTML = ''
  this.year.v = this.showDate.getFullYear()
  this.month.v = this.showDate.getMonth() + 1
  this.year.innerHTML = this.year.v + '年'
  this.month.innerHTML = this.month.v + '月'
  var thisTotal = new Date(this.showDate.getFullYear(), this.showDate.getMonth() + 1, 0).getDate() // 本月的总天数
  var previousTotal = new Date(this.showDate.getFullYear(), this.showDate.getMonth(), 0).getDate() // 上月的总天数
  var firstDay = new Date(this.showDate)
  firstDay.setDate(1) // 设置为本月第1天
  var fd = firstDay.getDay() // 获取第一天是星期几
  var row = Math.ceil((fd + thisTotal - 1) / 7) // 一共几行日期
  !fd && row++ // 如果是0（星期日），增加一行日期
  var dateNum = 1 // 本月1号开始递增
  var nextDateNum = 1 // 下个月1号开始递增
  var d = fd || 7 // 如果是0 就是7（星期日）
  for (var i = 0; i < row; i++) {
    var tr = this.createPanel({
      container: this.tbody,
      tagName: 'tr'
    })
    for (var j = 0; j < 7; j++) {
      var toYear, toMonth
      var td = this.createPanel({
        container: tr,
        tagName: 'td'
      })
      if (i == 0 && d > j + 1) { // 上个月的日期
        td.innerHTML = previousTotal - (d - j - 2)
        td.setAttribute('previousMonth', true)
        var previousDate = new Date(firstDay.getFullYear(), firstDay.getMonth() - 1)
        toYear = previousDate.getFullYear()
        toMonth = previousDate.getMonth() + 1
      } else if (dateNum <= thisTotal) { // 本月的日期
        td.innerHTML = dateNum++
        toYear = this.year.v
        toMonth = this.month.v
      } else { // 下个月的日期
        td.innerHTML = nextDateNum++
        toYear = this.year.v
        toMonth = +this.month.v + 1
        td.setAttribute('nextMonth', true)
      }
      var day = j + 1 < 7 ? j + 1 : 0
      td.setAttribute('date', toYear + '-' + this.toDouble(toMonth) + '-' + this.toDouble(td.innerHTML))
    }
  }
  this.selectClick()
}

Calendar.prototype.selectClick = function () {
  this.active = this.tbody.querySelector('[date="' + this.selectDate.getFullYear() + '-' + this.toDouble((this.selectDate.getMonth() + 1)) + '-' + this.toDouble(this.selectDate.getDate()) + '"]')
  if (this.active) {
    this.active = this.week ? this.active.parentNode : this.active
    var newValue = this.week ? this.active.children[0].getAttribute('date') + ' - ' + this.active.children[6].getAttribute('date') : this.active.getAttribute('date')
    if (this.value !== newValue) {
      this.value = newValue
      if (this.week) {
        this.detail = []
        for (var i = 0; i < this.active.children.length; i++) {
          this.detail.push({
            day: this.days[i + 1] || this.days[0],
            date: this.active.children[i].getAttribute('date')
          })
        }
      }
      this.callback && this.callback()
    }
    this.active.className = 'active'
  }
  var els = this.week ? this.tbody.children : this.tbody.querySelectorAll('td')
  for (var i = 0; i < els.length; i++) {
    els[i].onclick = function (ev) {
      var oEvent = ev || event
      var date = oEvent.target.getAttribute('date').split('-')
      this.selectDate = new Date(date[0], date[1] - 1, date[2])
      var atMonth = +date[1] - parseInt(this.month.innerHTML)
      if (atMonth) { this.click(atMonth) }
      this.setDates()
    }.bind(this)
  }
}

Calendar.prototype.createPanel = function (opt) {
  var el = document.createElement(opt.tagName)
  opt.insertBefore ? opt.container.insertBefore(el, opt.insertBefore) : opt.container.appendChild(el)
  if (opt.className) { el.className = opt.className }
  return el
}

Calendar.prototype.toDouble = function (num) {
  return num >= 10 ? num : '0' + num
}

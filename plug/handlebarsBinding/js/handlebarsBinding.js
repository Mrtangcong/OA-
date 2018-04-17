function HandlebarsBinding (opt) {
  var _this = this
  if (/^dialog$|^tile$/.test(opt.container.getAttribute('role'))) {
    this.isInit = true
  }
  this.set(opt)
  if (!this.isInit && this.refresh) {
    setTimeout(function () {
      _this.refresh.call(_this, {
        instance: _this,
        events: _this.events
      })
    }, 0)
  }
  setTimeout(function () {
      this.isInit = false
  }.bind(this), 0)
}
HandlebarsBinding.prototype.set = function (opt) {
  for (var i in opt) {
    this[i] = opt[i]
  }
  this.render(this)
  if (this.container.querySelector('.h-pagination') && this.data && this.data.count) {
    this.setPagination()
  }
  this.eventsBinding()
  if (!this.isInit && /tile/.test(this.container.className)) {
    this.container.classList.add('tile-show')
    this.container.scrollTop = 0
  }
  if (!this.isInit && this.setExtra) {
    this.setExtra.call(this, {
      instance: this,
      events: this.events
    })
  }
}
HandlebarsBinding.prototype.render = function (opt) {
  var template = Handlebars.compile(opt.template.innerHTML)
  opt.container.innerHTML = template(opt.data)
}
HandlebarsBinding.prototype.loading = function (obj) {
  this.hModal = document.createElement('div')
  obj ? obj.appendChild(this.hModal) : this.container.appendChild(this.hModal)
  this.hModal.className = 'template-modal'
  this.hModal.innerHTML = '<svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>'
  if (getComputedStyle(this.container, false)['position'] === 'static') {
    this.container.style.position = 'relative'
  }
  setTimeout(function (obj) {
    obj.hModal.style.opacity = .9
  }, 50, this)
}
HandlebarsBinding.prototype.closeLoading = function () {
  this.hModal.parentNode.removeChild(this.hModal)
}
HandlebarsBinding.prototype.eventsBinding = function () {
  var _this = this
  for (var binding in this.events) {
    var eles = this.container.querySelectorAll('[event-' + binding + ']')
    if (eles.length) {
      for (var i = 0; i < eles.length; i++) {
        eles[i].binding = []
        for (var ev in this.events[binding]) {
          eles[i].binding.push(binding)
          eles[i]['on' + ev] = function (oEv) {
            if (this.locked) {
              return false
            }
            var oEvent = oEv || window.event
            console.log(this.binding)
            for (var i = 0; i < this.binding.length; i++) {
              _this.events[this.binding[i]][oEvent.type].call(_this, {
                instance: _this,
                el: this,
                eventJson: this.getAttribute('event-' + this.binding[i]) || '{}',
                form: (function () {
                  if ($(this).parents('.modal-dialog').length) {
                    return $(this).parents('.modal-dialog').find('form')
                  } else if ($(this).parents('.tile').length) {
                    return $(this).parents('.tile').find('form')
                  }
                }).bind(this)(),
                modal: (function () {
                  if ($(this).parents('.modal').length) {
                    return $(this).parents('.modal')
                  }
                }).bind(this)()
              })
            }
            this.locked = true
            setTimeout(function () {
              this.locked = false
            }.bind(this), 200)
          }
        }
      }
    } else {
      // console.warn('"' + binding + '" no element found')
    }
  }
}
HandlebarsBinding.prototype.setPagination = function () {

  var _this = this
  this.pages = document.createElement('ul')
  this.container.querySelector('.h-pagination').appendChild(this.pages)
  this.pages.className = 'pagination'

  var totalPage = Math.ceil(this.data.count / this.paginationData.pageSize)
  var currentPage = this.paginationData.currentPage

  var total = document.createElement('b')
  this.container.querySelector('.h-pagination').insertBefore(total, this.pages)
  total.innerHTML = '共' + totalPage + '页， ' + this.data.count + '个记录'

  var min = currentPage < 2 ? currentPage - 2 : currentPage - 3
  min = min < 0 ? 0 : min
  var max = +currentPage + 2 >= totalPage ?  totalPage : +currentPage + 2

  if (currentPage == totalPage) {
    if (min - 2 > -1) { min -= 2 }
    else if (min - 1 > -1) { min -= 1 }
  } else if (currentPage == +totalPage - 1 && min - 1 > -1 ) { min -= 1 }

  if (+currentPage - 1 == 0) {
    if (max + 2 <= totalPage) { max += 2 }
    else if (max + 1 <= totalPage) { max += 1 }
  } else if (+currentPage - 1 == 1 && max + 1 <= totalPage) { max += 1 }

  var btns = [{
    text: '首页',
    value: 1
  },{
    text: '上一页',
    value: +currentPage - 1 > 0 ? +currentPage - 1 : ''
  },{
    text: '下一页',
    value: +currentPage + 1 <= totalPage ? +currentPage + 1 : ''
  },{
    text: '尾页',
    value: totalPage
  }]

  for (var i = 0; i < btns.length; i++) {
    var li = document.createElement('li')
    this.pages.appendChild(li)
    var a = document.createElement('a')
    li.appendChild(a)
    a.innerHTML = btns[i].text
    a.target = btns[i].value
    a.setAttribute('role', 'button')
    if (!a.target || currentPage == a.target) {
      li.classList.add('disabled')
    }
  }

  for (var i = min; i < max; i++) {
    var li = document.createElement('li')
    this.pages.insertBefore(li, this.pages.children[this.pages.children.length - 2])
    var a = document.createElement('a')
    li.appendChild(a)
    a.innerHTML = a.target = i + 1
    a.setAttribute('role', 'button')
    if (currentPage == a.target) {
      li.classList.add('active')
    }
  }
  for (var i = 0; i < this.pages.children.length; i++) {
    this.pages.children[i].children[0].onclick = function () {
      if (_this.pageLocked) {
        return false
      }
      if (this.target && this.parentNode.className !== 'disabled') {
        _this.paginationData.currentPage = this.target
        _this.events.getList.click.call(_this, {
          instance: _this,
          el: this
        })
      }
      _this.pageLocked = true
      setTimeout(function () {
        _this.pageLocked = false
      }.bind(_this), 300)
    }
  }
}

HandlebarsBinding.prototype.setPaginationData = function (opt) {
  if (this.isInit !== false ) {
    opt.paginationData.pageSize = opt.paginationData.pageSize && opt.paginationData.pageSize > 0 ? opt.paginationData.pageSize : this.paginationData && this.paginationData.pageSize ? this.paginationData.pageSize : 10
  } else {
    opt.paginationData.pageSize = this.paginationData ? this.paginationData.pageSize : opt.paginationData.pageSize
  }
  opt.paginationData.currentPage =  opt.paginationData.currentPage ? opt.paginationData.currentPage : this.paginationData && this.paginationData.currentPage ? this.paginationData.currentPage : 1
  if (opt.isAdd) {
    opt.paginationData.currentPage = Math.ceil((this.data.count + 1) / opt.paginationData.pageSize)
  }
  this.paginationData = opt.paginationData
}

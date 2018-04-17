
function webuploaderBiding (opt) {
  var opt = opt
  var uploader = WebUploader.create($.extend({
    auto: true,
    duplicate: true,
  }, opt.config , {
    server: '../' + opt.config.server
  }))
  // var uploader = WebUploader.create({
  //   // 选完文件后，是否自动上传。
  //   auto: true,
  //   // 文件接收服务端。
  //   server: '../picture/uploadImageFile.jpeg',
  //   // 选择文件的按钮。可选。
  //   pick: '#upload',
  //   // 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
  //   dnd: '#upload',
  //   // 重复上传同个文件
  //   duplicate: true,
  //   // 单个文件限制大小 2 * 1024 * 1024 = 2mb
  //   fileSingleSizeLimit: 2 * 1024 * 1024,
  //   // 只允许选择图片文件。
  //   accept: {
  //       title: 'Images',
  //       extensions: 'jpg,jpeg,png',
  //       mimeTypes: 'image/jpg, image/jpeg, image/png'
  //   }
  // })

  // 文件上传成功，给item添加成功class, 用样式标记上传成功。
  uploader.on('uploadSuccess', function(file, response) {
    uploader.successFile = file
    uploader.successResponse = response
    setTimeout(function () {
      $(uploader.options.pick.id).change()
      delete uploader.successFile
      delete uploader.successResponse
    }, 350)
  })

  // 文件上传失败，显示上传出错。
  uploader.on('uploadError', function(file, reason) {
    uploader.errorFile = file
    uploader.errorReason = reason
    setTimeout(function () {
      $(uploader.options.pick.id).change()
      delete uploader.errorFile
      delete uploader.errorReason
    }, 350)
  })

  if (opt.config.accept && opt.config.accept.title === 'Images') {
    uploader.on('error', function (type, size, file) {
      $(uploader.options.pick.id).change()
      var fileError
      if (document.getElementById('file-error')) {
        fileError = document.getElementById('file-error')
      } else {
        fileError = document.createElement('div')
        document.body.appendChild(fileError)
        fileError.innerHTML = '您以下的文件上传失败:'
      }
      fileError.id = 'file-error'
      var newError = document.createElement('div')
      fileError.appendChild(newError)
      if (arguments.length === 3) {
        var type = /image/.test(file.type) ? '超过2mb：' : '格式错误：'
        newError.innerHTML = type + file.name
      } else if (arguments.length === 2) {
        newError.innerHTML = '格式错误：' + size.name
      }
      clearTimeout(fileError.timer)
      fileError.timer = setTimeout(function () {
        fileError.parentNode.removeChild(fileError)
      }, 10000)
      setTimeout(function () {
        newError.parentNode.removeChild(newError)
      }, 10000)
    })
  }

  return uploader
}

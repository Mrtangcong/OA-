window.addEventListener('load', function () { if (window.location.hash) { pjax() } })
window.addEventListener('hashchange', function () { pjax('hashchange') })
function pjax(type) {
  $('#content-wrapper').html('加载中...')
  $.ajax({
    url: window.location.hash.split('?')[0].substring(1),
    headers: {'X-PJAX': true},
    success: function (html) {
      $('#content-wrapper').html(html)
      setActive(type)
    },
    error: function (error) {
      $('#content-wrapper').html('')
      setActive(type)
      swal({
        type: 'error',
        titleText: error.status
      })
        .catch(swal.noop)
    }
  })
}
function setActive (type) {
  $("#leftMenu li.active").removeClass("active")
  $('#leftMenu a[href="#' + window.location.hash.split('?')[0].substring(1) + '"]').parent().addClass('active')
  if (type === 'hashchange') {
    $('#leftMenu a[href="#' + window.location.hash.split('?')[0].substring(1) + '"]').parents('ul').each(function (i, item) {
      if(item.style.display !== 'block') {
        item.click()
      }
    })
  }
}

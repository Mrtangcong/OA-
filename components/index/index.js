(function() {

	var APIS = {
		getList: 'http://192.168.1.160:8093/wf/info/getByEntity', //'menu/selectByPrimaryKey',
		add: 'http://192.168.1.160:8093/wf/info/add', //'menu/addMenuInfo',
		edit: 'http://192.168.1.160:8093/wf/info/edit', //'menu/updateMenuInfo',
		remove: 'http://192.168.1.160:8093/wf/info/deleteById', //'menu/deleteMenuInfo',
		open: 'http://192.168.1.160:8093/wf/info/openById', //'menu/deleteMenuInfo',
		stop: 'http://192.168.1.160:8093/wf/info/stopByd', //'menu/deleteMenuInfo',
		refurbishAll: 'cachemanager/refreshMenuInfo',
		view: 'http://192.168.1.160:8093/',
	}
	var searchForm = new HandlebarsBinding({
		template: document.getElementById('template-searchForm'), // handlebars模版
		container: document.getElementById('searchForm'), // 渲
		events: {
			search: {
				click: function(opt) {
					  grid.events.getList.click.call(grid, {
			              paginationData: {
			                currentPage: 1
			              }
			            })
				}
			}
		}
	})
	var btnList = new HandlebarsBinding({
		template: document.getElementById('template-btnList'), // handlebars模版
		container: document.getElementById('btnList'), // 渲染到指定元素
		methods: {
			setSourceData: function() {
				return {
					
				};
			}
		},
		events: {
			add: {
				click: function(opt) {	
				}
			},
		}
	})
	var grid = new HandlebarsBinding({
		template: document.getElementById('template-grid'), // handlebars模版
		container: document.getElementById('grid'), // 渲染到指定元素
		refresh: function(opt) {

			this.events.getList.click.call(this, opt || {})
			
			if($('.status').html()=="启用"){
				$(this).addClass("blue")
			}else{
				$(this).addClass("red")
			}
		},
		methods:{
			setSourceData:function(res){
				function leixing(leixing){
					if(leixing=="BU业务"||leixing=="启用"){
						return true
					}else{
						return false
					}
					
				}
				return{
					xiugai:true,
					name:res.name,
					infoCode:res.infoCode,
					status:leixing(res.status),
					unde:true,
					description:res.description,
					wfUrl:res.wfUrl,
					leixing:leixing(res.typeCode)
				}
			}
		},
		events: {
			getList: {
				click: function(opt) {
					this.setPaginationData($.extend(opt || {}, { // 设置分页数据
						paginationData: $.extend(opt.paginationData || {}, {
							pageSize: Math.floor((document.querySelector('.h-center').offsetHeight - 40) / 40)
						})
					}))
					this.loading(this.container.children[0]) // 开启loading，可以选择传入一个参数，参数为loading的容器
					util.ajax({
						url: APIS.getList,
						type: 'POST',
						data: $.extend(util.serializeFormToObj($(searchForm.container)), opt.paginationData),
					}).then(function(response) {
						console.log(response)
						this.set({
							data: {
								list: response.result,
								count: response.count
							}
						})
						util.copyTableHead(this.container) // 复制一个table的并将header移入（达到固定效果）
					}.bind(this))
				}

			},
			get: {
				click: function(opt) {
					var obj = JSON.parse(opt.eventJson);
					window.location.href="../next/next.shtml?id="+obj.id
				}
			},
			view: {
				click: function(int) {
					var obj = JSON.parse(int.eventJson);
					// editForm.loading(editForm.container.children[0]) // 开启loading，可以选择传入一个参数，参数为loading的容器
					// util.ajax({
					// 	url: APIS.get,
					// 	type: 'POST',
					// 	data: {
					// 		"name":obj.name
					// 	}
					// }).then(function(response) {
					// 	editForm.set({
					// 		data: this.methods.setSourceData(response),
					// 	})
					// 	layuiinput()
					// }).catch(function(error) {
					// 	$(editForm.container).modal('hide') // 关闭弹窗
					// })
					editForm.set({
							data: this.methods.setSourceData(obj),
						})
						layuiinput()
				}
			},
			stop:{
				click:function(opt){
					var formData = JSON.parse(opt.eventJson)
						swal({
							title: '确定要停用?',
							text: formData.name,
							type: 'warning',
							showCancelButton: true,
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							confirmButtonclass: 'button btn-success',
							cancelButtonclass: 'button btn-danger'
						}).then(function() {
							this.loading();
							util.ajax({
								url: APIS.stop,
								type: 'post',
								data: {
									id: formData.id,
								}
							}).then(function(response) {
								swal({
									type: 'success',
									titleText: response.result
								}).catch(swal.noop); // swal需要写catch否则遮罩关闭会报错
								this.refresh() //刷新
							}.bind(this)).catch(function(error) {
								this.closeLoading()
							}.bind(this))
						}.bind(this)).catch(swal.noop) // swal需要写catch否则遮罩关闭会报错
					}
				},
			run:{
				click:function(opt){
					var formData = JSON.parse(opt.eventJson)
					swal({
						title: '确定要启用?',
						text: formData.name,
						type: 'warning',
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						confirmButtonclass: 'button btn-success',
						cancelButtonclass: 'button btn-danger'
					}).then(function() {
						this.loading();
						console.log(formData.state);
						util.ajax({
							url: APIS.open,
							type: 'post',
							data: {
								id: formData.id,
							}
						}).then(function(response) {
							swal({
								type: 'success',
								titleText: response.result
							}).catch(swal.noop); // swal需要写catch否则遮罩关闭会报错
							this.refresh() //刷新
							leftTree.tree.refreshNode({ // 刷新节点
								targetParam: ['id', formData.parentId]
							})
						}.bind(this)).catch(function(error) {
							this.closeLoading()
						}.bind(this))
					}.bind(this)).catch(swal.noop) // swal需要写catch否则遮罩关闭会报错
				}
				},
			del: {
				click: function(opt) {
					var formData = JSON.parse(opt.eventJson)
					swal({
						title: '确定要删除?',
						text: formData.name,
						type: 'warning',
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						confirmButtonclass: 'button btn-success',
						cancelButtonclass: 'button btn-danger'
					}).then(function() {
						this.loading();
						console.log(formData.state);
						util.ajax({
							url: APIS.remove,
							type: 'post',
							data: {
								id: formData.id,
							}
						}).then(function(response) {
							swal({
								type: 'success',
								titleText: response.result
							}).catch(swal.noop); // swal需要写catch否则遮罩关闭会报错
							this.refresh() //刷新
							leftTree.tree.refreshNode({ // 刷新节点
								targetParam: ['id', formData.parentId]
							})
						}.bind(this)).catch(function(error) {
							this.closeLoading()
						}.bind(this))
					}.bind(this)).catch(swal.noop) // swal需要写catch否则遮罩关闭会报错
				}
			}
			}
		
	})
	var editForm = new HandlebarsBinding({
		template: document.getElementById('template-editForm'), // handlebars模版
		container: document.getElementById('editForm'), // 渲染到指定元素
		
		events: {
			confirm: {
				click: function(opt) {
					$('[name="createUser"]').val("1")	
					var formData = new FormData($("#DataForm")[0]);
					var isAdd = $("#DataForm").find('[name="id"]').length ? true : false // 判断是否为新增
					util.validate(opt.form).then(function() {
						this.loading(this.container.children[0]) // 开启loading，可以选择传入一个参数，参数为loading的容器
						util.ajax({
							url: isAdd ? APIS.edit : APIS.add,
							type: 'post',
							contentType: false,  
          					processData: false, 
							data: formData	
						}).then(function(response) {
							if(response.success) {
								opt.modal.modal('hide') // 关闭弹窗
								grid.refresh({
									isAdd: isAdd
								}) // 传入是否为新增，刷新grid
								$('#DataForm')[0].reset()
							}
							util.copyTableHead(this.container);

						}).catch(function(error) {
							this.closeLoading()
						}.bind(this))
					}.bind(this))
				}
			}
		}
	})
	function layuiinput(){
		layui.use('form', function(){
	  			 form = layui.form;
			})
			form.render(); 
	}
	layuiinput()
})();
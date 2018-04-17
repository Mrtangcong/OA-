(function() {

	var APIS = {
		get: 'http://192.168.1.160:8093/sys/archive/queryDetail', //'menu/selectByPrimaryKey',
		getList: 'http://192.168.1.160:8093/wf/definition/getByEntity', //'menu/menuList',
		add: 'http://192.168.1.160:8093/sys/archive/insertOrUpdate', //'menu/addMenuInfo',
		edit: 'http://192.168.1.160:8093/sys/archive/insertOrUpdate', //'menu/updateMenuInfo',
		remove: 'http://192.168.1.160:8093/sys/archive/insertOrUpdate', //'menu/deleteMenuInfo',
		open: 'http://192.168.1.160:8093/wf/definition/openById', //'menu/deleteMenuInfo',
		stop: 'http://192.168.1.160:8093/wf/definition/stopById', //'menu/deleteMenuInfo',
		zjdlist: 'http://192.168.1.160:8093/wf/endConfig/selectEndConfigList', //'menu/deleteMenuInfo',
		del: 'http://192.168.1.160:8093/wf/linkConfig/deleteLinkConfig', //'menu/deleteMenuInfo',
		zjdopen: 'http://192.168.1.160:8093/wf/endConfig/openEndConfig', //'menu/deleteMenuInfo',
		zjdstop: 'http://192.168.1.160:8093/wf/endConfig/stopEndConfig', //'menu/deleteMenuInfo',
		zjddel: 'http://192.168.1.160:8093/wf/endConfig/deleteEndConfig', //'menu/deleteMenuInfo',
		lclx: 'http://192.168.1.160:8093/wf/linkConfig/selectLinkConfigList', //'menu/deleteMenuInfo',
		detail: 'http://192.168.1.160:8093/wf/definition/getById', //'menu/deleteMenuInfo',
		refurbishAll: 'cachemanager/refreshMenuInfo',
	}
	var searchForm = new HandlebarsBinding({
		template: document.getElementById('template-searchForm'), // handlebars模版
		container: document.getElementById('searchForm'), // 渲染到指定元素

		events: {
			search: {
				click: function(opt) {
					grid.events.getList.click.call(grid, {
						paginationData: {
							currentPage: 1,
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
		},
		events: {
			add: {
				click: function(opt) {		
					editForm.set({
						data: {}
					})
					layuiinput()
					events()
				}
			},
			zjd:{
				click:function(opt){
					zjdxx.events.getList.click.call(grid, {
						paginationData: {
							currentPage: 1,
						}
					})
				}
			}
		}
	})
	var grid = new HandlebarsBinding({
		template: document.getElementById('template-grid'), // handlebars模版
		container: document.getElementById('grid'), // 渲染到指定元素
		refresh: function(opt) {
			this.events.getList.click.call(this, opt || {})
		},
		methods:{
			setendData:function(int){
				return{
					jdmc:'第一节点',
					unde:true,
					zdz:'100',
					zxz:"1000",
					state:0,				
				}
			},
			sethuituiData:function(int){
				var obj = JSON.parse(int.eventJson)
				console.log(obj)
				return{
					huituilist:[{
					jdmc:obj.lcmc,
					next:true,
					nextlist:[
						{
							nextjiedian:"第一节点"	
						},
						{
							nextjiedian:"第二节点"	
						},
						{
							nextjiedian:"第三节点"	
						}
					]
					}]
				}
			}
		},
		events: {
			getList: {
				click: function(opt) {
					$('[name="infoId"]').val(GetRequest("id").id)
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
			view: {
				click: function(int) {
					var obj = JSON.parse(int.eventJson)
					console.log(obj)
					util.ajax({
						url: APIS.detail,
						type: 'POST',
						data: {id:obj.id},
					}).then(function(response) {
						var obj =response.result
						obj.unde = true
						
						editForm.set({
							data:obj
						})
		 				layuiinput()
						events()
						if(obj.isStart=='n'){
							$('#qsjdno').css('display','block')

						}
						if(obj.roleId){
							$('#jsfs').css('display','block')
							$('#ryfs').css('display','none')
						}
						if(obj.roleType == 'sp'){
							$('#tsgz').css('display','block')
						}
						util.copyTableHead(this.container) // 复制一个table的并将header移入（达到固定效果）
					}.bind(this))
					
					

				}
			},
			huitui: {
				click: function(int) {
					
					huituilist.set({
						data:this.methods.sethuituiData(int),
					})

					layuiinput()	
				}
			},
			end: {
				click: function(int) {
					end.set({
						data: this.methods.setendData(),
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
								leftTree.tree.refreshNode({ // 刷新节点
									targetParam: ['id', formData.parentId]
								})
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
						util.ajax({
							url: APIS.remove,
							type: 'post',
							data: {
								id: formData.id,
								state: 'DELETE',
								archiveNo: formData.archiveNo,
								archiveBelong: formData.archiveBelong,
								archiveName: formData.archiveName,
								archiveType: formData.archiveType,
								depId: formData.depId
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
			stop:{
				click:function(opt){
					
				}
			},
			confirm: {
				click: function(opt) {			
					$('[name="createUser"]').val('1')//创建人
					$('[name="infoId"]').val(GetRequest("id").id)
					var formData = new FormData($( "#DataForm" )[0]);	
					var isAdd = $(opt.form).find('[name="id"]').length ? false : true // 判断是否为新增
					util.validate(opt.form).then(function() {
						this.loading(this.container.children[0]) // 开启loading，可以选择传入一个参数，参数为loading的容器
						util.ajax({
							url: isAdd ? APIS.add : APIS.edit,
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
							}
						}).catch(function(error) {
							this.closeLoading()
						}.bind(this))
					}.bind(this))
				}
			}
		}
	})
	var liucxsz = new HandlebarsBinding({
		template: document.getElementById('template-liucxsz'), // handlebars模版
		container: document.getElementById('liucxsz'), // 渲染到指定元素
		events:{

		}
	})
	var end = new HandlebarsBinding({
		template: document.getElementById('template-end'), // handlebars模版
		container: document.getElementById('end'), // 渲染到指定元素
		events:{

		}
	})
	var huitui = new HandlebarsBinding({
		template: document.getElementById('template-huitui'), // handlebars模版
		container: document.getElementById('huitui'), // 渲染到指定元素
		events:{

		}
	})
	var huituilist = new HandlebarsBinding({
		template: document.getElementById('template-huituilist'), // handlebars模版
		container: document.getElementById('huituilist'), // 渲染到指定元素
		events:{
			ok:{
				click:function(opt){
					
				}
			}
		}
	})
	var zjdxx = new HandlebarsBinding({
		template: document.getElementById('template-zjdxx'), // handlebars模版
		container: document.getElementById('zjdxx'), // 渲染到指定元素
		refresh: function(opt) {
			this.events.getList.click.call(this, opt || {})

		},
		events: {
			getList: {
				click: function(opt) {
					this.loading(this.container.children[0]) // 开启loading，可以选择传入一个参数，参数为loading的容器
					util.ajax({
						url: APIS.zjdlist,
						type: 'POST',
						data: {id:GetRequest("id").id},
					}).then(function(response) {
						this.set({
							data: {
								list: response.result,
								count: response.count
							}
						})
//						util.copyTableHead(this.container) // 复制一个table的并将header移入（达到固定效果）
					}.bind(this))
				}

			},
			stop:{
				click:function(opt){
					var formData = JSON.parse(opt.eventJson)
						swal({
							title: '确定要停用?',
							text: formData.finalLinkName,
							type: 'warning',
							showCancelButton: true,
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							confirmButtonclass: 'button btn-success',
							cancelButtonclass: 'button btn-danger'
						}).then(function() {
							this.loading();
							util.ajax({
								url: APIS.zjdstop,
								type: 'post',
								data: {
									id: formData.finalLinkId,
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
				run:{
					click:function(opt){
						var formData = JSON.parse(opt.eventJson)
						swal({
							title: '确定要启用?',
							text: formData.finalLinkName,
							type: 'warning',
							showCancelButton: true,
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							confirmButtonclass: 'button btn-success',
							cancelButtonclass: 'button btn-danger'
						}).then(function() {
							this.loading();
							util.ajax({
								url: APIS.zjdopen,
								type: 'post',
								data: {
									id: formData.finalLinkId,
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
						text: formData.finalLinkName,
						type: 'warning',
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						confirmButtonclass: 'button btn-success',
						cancelButtonclass: 'button btn-danger'
					}).then(function() {
						this.loading();
						util.ajax({
							url: APIS.zjddel,
							type: 'post',
							data: {
								id: formData.finalLinkId,
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
		}
	})
	var xzlxmodal = new HandlebarsBinding({
		template: document.getElementById('template-xzlxmodal'), // handlebars模版
		container: document.getElementById('xzlxmodal'), // 渲染到指定元素
		refresh: function(opt) {
				this.loading(this.container.children[0]) // 开启loading，可以选择传入一个参数，参数为loading的容器
					util.ajax({
						url: APIS.getList,
						
						type: 'POST',
						data: {"linkName":"","status":""},
					}).then(function(response) {
						this.set({
							data: {
								list: response.list
							}
						})
//						util.copyTableHead(this.container) // 复制一个table的并将header移入（达到固定效果）
					}.bind(this))
		},
		events:{
			confirm:{
				click:function(opt){
					var jiedian = $('[name=jiedianselect]').val()
					var xiafa = $('[name=xiafaselect]').val()
					if(!jiedian||!xiafa){
						alert('请选择节点')
						return
					}
					if(jiedian==xiafa){
						alert('请选择不同节点')
						return
					}
					swal({
						title: '确定要新增流程向?',
						text: jiedian+'==>'+xiafa,
						type: 'warning',
						showCancelButton: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						confirmButtonclass: 'button btn-success',
						cancelButtonclass: 'button btn-danger'
					}).then(function() {
						this.loading();
						util.ajax({
							url: APIS.xzlcx,
							type: 'post',
							data: {
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

	var lxlx = new HandlebarsBinding({
		template: document.getElementById('template-lxlx'), // handlebars模版
		container: document.getElementById('lxlx'), // 渲染到指定元素
		refresh: function(opt) {

			this.events.getList.click.call(this, opt || {})

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
						url: APIS.lclx,	
						type: 'POST',
						data: {id:GetRequest("id").id},
					}).then(function(response) {
						this.set({
							data: {
								list: response.result,
								count: response.count
							}
						})
//						util.copyTableHead(this.container) // 复制一个table的并将header移入（达到固定效果）
					}.bind(this))
					layuiinput()

				}
			},
			del:{
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
					
						util.ajax({
							url: APIS.remove,
							type: 'post',
							data: {
								id: formData.id,
								state: 'DELETE',
								archiveNo: formData.archiveNo,
								archiveBelong: formData.archiveBelong,
								archiveName: formData.archiveName,
								archiveType: formData.archiveType,
								depId: formData.depId
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

		},

	})
	function layuiinput(){
		layui.use('form', function(){
	  			 form = layui.form;
			})
			form.render(); 

	}
	function GetRequest() {  
	   var url = location.search; //获取url中"?"符后的字串  
	   var theRequest = new Object();  
	   if (url.indexOf("?") != -1) {  
	      var str = url.substr(1);  
	      strs = str.split("&");  
	      for(var i = 0; i < strs.length; i ++) {  
	         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
	      }  
	   }  
	   return theRequest;  
	} 
	function events(){
		$('[lay-value="n"]').click(function(){
			$('#qsjdno').css('display','block')
		})
		$('[lay-value="y"]').click(function(){
			$('#qsjdno').css('display','none')
		})
		$('[lay-value="state2"]').click(function(){
			$('#qsjdno').css('display','none')
		})
		$('[lay-value="sp"]').click(function(){
			$('#tsgz').css('display','block')
		})
		$('[lay-value="dep"]').click(function(){
			$('#tsgz').css('display','none')
		})
		$('[lay-value="all"]').click(function(){
			$('#tsgz').css('display','none')
		})
		$('[lay-value="tsgz03"]').click(function(){
			$('#tsgz').css('display','none')
		})
		$('.layui-unselect').click(function(){
			switch ($(this).children('div').html())
			{
				case '人员发送':
				$('#jsfs').css('display','none')
				$('#ryfs').css('display','block')
				break;
				case '角色发送':
				$('#jsfs').css('display','block')
				$('#ryfs').css('display','none')
				break;
			}
		})
	}
	layuiinput()
})();


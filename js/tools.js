//这个文件是我们的工具函数

/*
	封装绑定事件处理函数的工具函数
		addEventListener()
*/

var t = (function (){
	function on(element,evName,evFn){
		element.addEventListener(evName,evFn);	
	}

	function off(element,evName,evFn){
		element.removeEventListener(evName,evFn);	
	}
	
	// 把这些方法暴露出去

	return {
		on:on,
		off:off
	}

})()




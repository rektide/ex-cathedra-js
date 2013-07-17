var becomePromise= require("becomePromise"),
  block= require("./block"),
  newInstance= require("./new-instance"),
  Q= require("q")

module.exports= fileJs
module.exports.fileJs= fileJs

function fileJs(jf){
	var self= newInstance(this,fileJs,arguments)
	if(jf instanceof String){
		var file= qfs.read(jf)
		becomePromise(self,file)
		self.filename= jf
	}else{
		assert(false,"unknown type "+gotName(jf)+" to construct jsfile")
	}
	return self
}

fileJs.prototype= Object.create(Q.promise.prototype)
fileJs.prototype.constructor= fileJs

fileJs.prototype.toString= block 
fileJs.prototype.eval= (function(){
	var haveEval= eval
	function eval(){
		var txt= toString()
		haveEval(txt)
	}
	return eval
}())

function gotName(o){
	return o&&o.constructor.name? o.constructor.name: ""
}

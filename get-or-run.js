module.exports= getOrRun
module.exports.getOrRun= getOrRun

function getOrRun(o,a,b,c,d,e,f){
	return o instanceof Function? o(a,b,c,d,e,f): o
}

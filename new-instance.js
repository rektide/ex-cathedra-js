module.exports= newInstance
module.exports.newInstance= newInstance
module.exports.needsThis= needsThis
module.exports.invokeThis= invokeThis

function newInstance(self,constr,args){
	if(needsThis(self,constr))
		return invokeThis(constr,args)
	return self
}
function needsThis(self,constr){
	return !(self instanceof constr)
}
function invokeThis(constr,args){
	// via: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible/#1608546
	function F() {
	    return constructor.apply(this, args);
	}
	F.prototype = constructor.prototype;
	return new F();
}

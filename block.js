module.exports= block
function block(o){
	if(!o && this != module.exports){
		o= this
	}
	if(o.then && o.inspect){
		var ins
		while((ins= o.inspect()).state == "pending")
			;
		if(ins.state == "rejected")
			throw ins.reason
		return o.value
	}
	return o
}

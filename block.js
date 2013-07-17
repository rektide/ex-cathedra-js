module.exports= block
function block(o){
	if(!o && this != module.exports){
		o= this
	}
	if(o.inspect){
		while(o.inspect().state == "pending")
			;
		return o
	}
}

function getOrDefault(obj,slot,def){
	var o= obj[slot]
	if(o === undefined){
		if(typeof def == 'function'){
			o= obj[slot]= def(obj,slot)
		}else{
			o= def
		}
	}
	return o
};

module.exports= getOrDefault
module.exports.getOrDefault= getOrDefault

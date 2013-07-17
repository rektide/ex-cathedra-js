module.exports= forEachOmni
module.exports.forEachOmni= forEachOmni

function forEachOmni(inp,fn,args){
	if(inp.forEach){
		inp.forEach(fn)
	}else if(inp instanceof Function){
		return forEachOmni(inp.apply(null,args),fn)
	}else if(inp.next instanceof Function){
		forEachGenerator(inp,fn)
	}else if(inp.then){
		inp.then(function(resolved){
			forEachOmni(resolved,fn,args)
		})
	}else if(inp instanceof String || inp instanceof Number){
		fn(inp)
	}else if(inp.length){
		for(var i= 0; i< inp.length; ++i){
			fn(inp[i],i,inp)
		}
	}else{
		for(var i in inp){
			fn(inp[i],i,inp)
		}
	}
}

module.exports= forEachGenerator
module.exports.forEachGenerator= forEachGenerator
function forEachGenerator(generator,fn){
	var i= 0
	while(generator.next){
		var val
		try{
			val= generator()
			fn(val,i++,generator)
		}catch(ex){
			if(ex instanceof StopIteration)
				break;
			throw new Error("Iteration "+i,ex)
		}
	}
}

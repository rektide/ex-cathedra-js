module.exports= {}

// todo: source set from gitsubmodule file.
var set= [
	["block","ex-cathedra-block"]
]
set.forEach(memoizeRequire)

function memoizeRequire(arr){
	return function(){
		try{
			var req= require(arr[arr.length-1])
			for(var i= 0; i< arr.length-1; ++i)
				module.exports.arr[i]= req
		}catch(ex){
		}
	}
}

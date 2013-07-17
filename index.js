var exInternAt= require("./intern-at")
module.exports= {internAt: exInternAt}

// todo: source set from dir.
var set= [
	["block","./block"]
	//["internAt","./intern-at"],
	["getOrSet","./get-or-set"],
	["newInstance","./new-instance"]
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

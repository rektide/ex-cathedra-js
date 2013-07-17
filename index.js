var internAt= require("./intern-at"),
  forEachOmni= require("./foreach-omni")
module.exports= {internAt: exInternAt, forEachOmni: forEachOmni}

// todo: source set from dir.
var set= [
	["block","./block"],
	["internAt","./intern-at"],
	["forEachGenerator","./foreach-generator"],
	["forEachOmni","./foreach-omni"],
	["getOrSet","./get-or-set"],
	["newInstance","./new-instance"]
]
set.forEach(memoizeRequire)

function memoizeRequire(arr){
	var req
	try{
		req= require(arr[arr.length-1])
	}catch(ex){
	}
	for(var i= 0; i< arr.length-1; ++i)
		module.exports.arr[i]= req
}

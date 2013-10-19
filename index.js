module.exports= {}

// todo: source set from dir.
var set= [
	["becomePromise","./becom-promise"],
	["block","./block"],
	["internAt","./intern-at"],
	["fileJs","./file-js"],
	["forEachGenerator","./foreach-generator"],
	["forEachOmni","./foreach-omni"],
	["getOrRun","./get-or-run"],
	["internAt","./intern-at"],
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
		module.exports[arr[i]]= req
}

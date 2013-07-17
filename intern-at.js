var getOrRun= require("./get-or-run"),
  forEachOmni= require("./foreach-omni")

module.exports= internAt
module.exports.internAt= internAt

/**
  internAt takes an input and maps it into a slot on an object
  
  internAt mandates a specifier for the destination object, a specifier for the slot on the destination object, and a optionally takes a specifier for the value as well.
  these specifiers can two two forms: either literals (which will be used directly), or a function (which will be passed the input) and whose output will be used.
  @param dest specify a destination to intern into
  @param slot specify a slot to intern into the destination at
  @param val (optional) specify a map for the input value
  @param input a value to intern, or function producing a value, or generator
*/
function internAt(dest,slot,val,input){
	if(val !== undefined && input === undefined){
		input= val
		val= undefined
	}
	forEachOmni(input,function(el){
		getOrRun(dest,el)[getOrRun(slot,el)= val? val(el): el
	})
}

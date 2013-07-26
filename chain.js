var Q= require("q"),
  newInstance= require("./new-instance"),
  getOrDefault= require("./get-or-default")

module.exports= Chain
module.exports.CC= Chain
module.exports.cc= Chain
module.exports.Cc= Chain
module.exports.Chain= Chain
module.exports.chain= Chain

// DEBUGGING OPTIONS
module.exports.debug= function(){}
module.exports.debug= console.warn.bind(console)

// RUNTIME OPTIONS
module.exports.deepCopy= true // when copying Chains, do a deep copy
module.exports.resetOnExecute= false // execute will always begin from the start if set, else `pos` is accepted in.

/**
  Chain of Command pattern
*/
function Chain(){
	if(newInstance.needsThis(this,Chain)){
		return newInstance.invokeThis(Chain,arguments)
	}

	// determine a compute-chain
	var chain= Array.prototype.splice.call(arguments,0),
	  first= chain[0]
	if(chain.length == 1 && first instanceof Array){
		this.cc= chain[0]
	}else if(chain.length == 1 && first.cc instanceof Array){
		this.cc= copyCc(first)
		this.pos= copyPos(first)
	}else{
		this.cc= module.exports.deepCopy? copyCc(chain): chain
	}
	return this
}
/**
  Execute a context and return when done.
*/
Chain.prototype.exec= function(ctx){
	ctx= ctx||{}
	ctx.pos= ctx.pos&&module.exports.resetOnExecute? ctx.pos: [0]
	ctx.next= next.bind(ctx)
	ctx.filter= filter.bind(ctx)
	ctx.__proto__= this
	ctx.done= ctx.next().then(function(val){
		return this
	}.bind(ctx))
	return ctx.done
}

function next(val){
	if(val){
		return this
	}

	var curs= fetchPositions(this),
	  cur= get(this,curs)

	if(!cur){ // done, do filters if avail
		return this.filter()
	}else if(cur.filter){ // not done, but add filter
		getOrDefault(this,filters,Array).push(cur.filter)
	}

	// advance in advance of the run we're about to do
	goNext(this,curs)
	var handler= run(cur,this)
	return Q.when(handler, this.next, this.filter)
}

function filter(){
	var filters= this.filters
	if(!filters || filters.length == 0){
		return
	}
	var f= filters.pop(),
	  handler= run(f,this)
	return Q.when(handler, this.filter)
}


////////////
// UTILITY:

function _cc(ctx){
	if(!ctx){
		throw "Cannot resolve chain of undefined"
	}
	return ctx.cc? ctx.cc: ctx
}

function isChain(ctx){
	if(!ctx)
		return false
	return ctx.cc|| ctx instanceof Array
}

/**
  Return the topmost Command specified by `pos` or a cursors.
*/
function get(ctx,curs){
	curs= curs||fetchPositions(ctx)
	return curs[curs.length-1]
}

/**
  Return the second to top Command specified by a `pos` or a cursors.
*/
function getPrev(ctx,curs){
	curs= curs||fetchPositions(ctx)
	return curs[curs.length-2]
}

/**
  Return an array of every Command specified by every level of `pos`.
  This will also extend incomplete `pos` which do not specify a concrete Command, until a Command is arrived at (recurses through Chains until a real Command is arrived at).
*/
function fetchPositions(ctx){
	var curs= new Array(ctx.pos.length), // TODO: +1 i think?, assert below.
	  i= 0 // depth
	curs[0]= ctx
	while(i< ctx.pos.length){
		var prev= curs[i], // fetch previous depth's element
		  prevCc= _cc(prev), // get the chain from previous
		  n= ctx.pos[i++], // get position at this depth, go to next depth
		  cur= prevCc[n] // lookup new current cursor
		curs[i]= cur // save element at next depth
	}
	// assert.equals(ctx.pos.length+1, curs.length)
	return iterateInside(ctx,curs)
}

/**
  Look for and return the next concrete Command, updating `pos` along the way
*/
function goNext(ctx,curs){
	curs= curs||fetchPositions(ctx)
	var i= curs.length-2
	while(true){
		var prev= curs[i]
		if(!prev){
			throw "No element"
			//++ctx.pos[0]
			//return false
		}
		var prevCc= _cc(prev),
		  n= ctx.pos[i],
		  next= prevCc[n+1]
		if(next){ // advance now
			++ctx.pos[i]
			break
		}else if(ctx.pos.length>1){ // more depth try
			ctx.pos.pop()
			--i
		}else{ // cannot do, march off the edge
			++ctx.pos[0]
			return false
		}
	}
	// we've walked up until until we found a place to advance pos.
	curs= iterateInside(ctx,curs) // find current topmost curs
	return curs
}

/**
  A `pos` might reference a chain: lookup zero index elements onto sub-chains until a concrete Command is reached
*/
function iterateInside(ctx,curs){
	var cur= curs[curs.length-1]
	while(isChain(cur)){
		var cc= _cc(cur)
		if(cc.length==0) // egads, we're in an empty chain- very weird, skip it.
		  return goNext(ctx,curs)
		cur= cc[0] // become first element and try again
		curs.push(cur)
		ctx.pos.push(0)
	}
	return curs
}

function copyCc(cc){
	if(cc.cc){
		return copyCc(cc.cc)
	}
	if(!(cc instanceof Array)){
		return cc
	}
	var rv= new Array(cc.length)
	for(var i= 0; i< cc.length; ++i){
		var el= cc[i]
		rv[i]= (module.exports.deepCopy && el instanceof Array || el.cc instanceof Array)? copyCc(el): el
	}
	return rv
}

function copyPos(pos){
	if(!pos)
		return
	if(!(pos instanceof Array))
		throw "Cannot copy pos, not array"
	var rv= new Array(pos.length)
	for(var i= 0; i< pos.length; ++i){
		var el= pos[i]
		if(el instanceof Number)
			rv[i]= el
		else
			throw "Cannot copy pos, non-number element"
	}
	return rv
}

function run(el,self){ // rename & reorder: ctx,command
	if(typeof el == 'function'){
		return el(self)
	}else if(typeof el.handler == 'function'){ // extension for crazy
		return el.handler(self)
	}else if(el.cc){
		module.exports.debug("RUN-CC")
		return next()
	}else{
		return el
	}
}

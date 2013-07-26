var Q= require("q"),
  newInstance= require("./new-instance"),
  getOrDefault= require("./get-or-default")

module.exports= Chain
module.exports.CC= Chain
module.exports.cc= Chain
module.exports.Cc= Chain
module.exports.Chain= Chain
module.exports.chain= Chain

module.exports.deepCopy= true
module.exports.resetOnExecute= false

/**
  Chain of Command pattern
*/
function Chain(){
	if(!(this instanceof Chain)){
		return newInstance(Chain,arguments)
	})

	// determine a compute-chain
	var chain= Array.prototype.splice.call(arguments,0),
	  first= chain[0]
	if(args.length == 1 && first instanceof Array){
		this.cc= args[0]
	}else if(args.length == 1 && first.cc instanceof Array){
		this.cc= copyCc(first)
		this.pos= copyPos(first)
	}else{
		this.cc= module.exports.deepCopy? copyCc(chain): chain
	}
	this.done= Q.defer()
	return this
}
Chain.prototype.exec= function(ctx){
	ctx= ctx||{}
	ctx.pos= ctx.pos&&module.exports.resetOnExecute? ctx.pos: [[0]]
	ctx.__proto__= this
	ctx.done= Q.defer()
	var done= next.bind(ctx,null)()
	return done.then(function(){
		this.done.resolve(ctx)
	}.bind(ctx),function(err){
		this.done.reject(err)
	}.bind(ctx),function(not){
		this.done.notify(not)
	}.bind(ctx))
}

function next(val){
	if(val)
		return this

	var curs= fetchPositions(this),
	  cur= get(this,curs)

	if(!cur){ // done, do filters if avail
		return this.filters? filter.bind(this)(): this
	}else if(cur.filter){ // not done, but add filter
		getOrDefault(this,filters,Array).push(cur.filter)
	}

	// advance in advance of the run we're about to do
	goNext(curs)
	return Q.when(run(cur,this), arguments.callee)
}

function filter(){
	var filters= this.filters
	if(!filters || filters.length == 0){
		return this
	}
	var f= filters.pop()
	return Q.when(run(f,this), arguments.callee)
}


////////////
// UTILITY:

function _cc(ctx){
	return ctx.cc? ctx.cc: ctx
}

function isChain(ctx){
	return ctx.cc|| ctx instanceof Array
}

/**
  Return the topmost Command specified by `pos` or a cursors.
*/
function get(ctx,curs){
	curs= curs||getPositions(ctx)
	return curs[curs.length-1]
}

/**
  Return the second to top Command specified by a `pos` or a cursors.
*/
function getPrev(ctx,curs){
	curs= curs||getPositions(ctx)
	return curs[curs.length-2]
}

/**
  Return an array of every Command specified by every level of `pos`.
  This will also extend incomplete `pos` which do not specify a concrete Command, until a Command is arrived at (recurses through Chains until a real Command is arrived at).
*/
function fetchPositions(ctx){
	var curs= new Array(ctx.pos.length+1),
	  i= 0 // depth
	curs[0]= ctx
	while(i< ctx.pos.length){
		var prev= curs[i], // fetch previous depth's element
		  prevCc= _cc(prev), // get the chain from previous
		  n= ctx.pos[i++], // get position at this depth, go to next depth
		  cur= prevCc[n] // lookup new current cursor
		curs[i]= cur // save element at next depth
	}
	return iterateInside(ctx,curs)
}

/**
  Look for and return the next concrete Command, updating `pos` along the way
*/
function goNext(ctx,curs){
	curs= curs||getPositions(ctx)
	var i= ctx.pos.length-2 // curs.length-1
	while(true){
		var prev= curs[i],
		  prevCc= _cc(prev),
		  n= ctx.pos[i+1],
		  next= prevCc[n+1]
		if(next){ // advance now
			++ctx.pos[i+1]
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
		var next= _cc(cur)[0]
		if(!next) // egads, we're in an empty chain- very weird, skip it.
		  return goNext(ctx,curs)
		curs.push(next)
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
	for(var i= 0; i< cc.length){
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

function run(el,self){
	if(typeof el == 'function'){
		return el(self)
	}else if(typeof el.handler == 'function'){ // extension for crazy
		return el.handler(self)
	}else if(el.cc){
		return next.call(self)
	}else{
		return el
	}
}

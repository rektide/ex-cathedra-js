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
	var last= this.pos++,
	  post= this.cc[last],
	  future= this.cc[this.pos]
	if(post.filter){
		getOrDefault(this,filters,Array).push(post)
	}

	if(!future){ // do filters, or done
		return this.filters? filter.bind(this)(): this
	}

	return Q.when(run(future,this), arguments.callee)
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
  Return the topmost Command specified by `pos`.
*/
function get(){
	var curs= getPosition(this)
	return curs[curs.length-1]
}

/**
  Look for and return the next concrete Command, updating `pos` along the way
Update `pos` with the next command
*/
function getNext(){
	var curs= getPosition(this),
	  i= this.pos.length-1,
	  done= false
	while(!done){
		var top= curs[i],
		  chain= _cc(top),
		  next= this.pos[i]
	}
}

/**
  Return an array of every Command specified by every level of `pos`.
  This will also extend incomplete `pos` which do not specify a concrete Command, until a Command is arrived at (recurses through Chains until a real Command is arrived at).
*/

function getPositions(ctx){
	var cur
	  curs= new Array(ctx.pos.length),
	  i= 0
	curs[0]= _cc(ctx)[0]
	while(i< ctx.pos.length){
		var prev= curs[i], // current becomes previous 
		  n= ctx.pos[++i], // find new i'th position
		  prevCc= _cc(prev) // get the chain from prev
		cur= prevCc[n] // lookup new current cursor
		curs[i]= cur
	}
	while(isChain(cur)){
		var cur= cur[0]
		curs.push(next)
		ctx.pos.push(0)
		cur= _cc(cur)
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
	}else if(el.cc){
		el.exec(self)
	}else{
		return el
	}
}

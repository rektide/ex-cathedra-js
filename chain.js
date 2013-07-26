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
	ctx.pos= [[0]]
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
	if(post.post){
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
			rv[i]= copyPos(el)
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

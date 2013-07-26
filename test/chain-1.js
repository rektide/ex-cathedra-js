var Chain= require("../chain")
var assert= require("assert") 

function dog(ctx){
	ctx.dog= 11
	ctx.other= "dog"
}
function cat(ctx){
	ctx.cat= (ctx.cat||0)+ 22
	ctx.other= "cat"
}
function agg(ctx){
	ctx.net= ctx.dog+ ctx.cat+ (ctx.net||0)
	ctx.other= "agg"
}

var Cc1= Chain([dog,cat,agg])

Cc1.exec().then(function(ctx){
	assert.equal(ctx.net,33)
	assert.equal(ctx.other,"agg")
}).done()

Cc1.exec({net:9}).then(function(ctx){
	assert.equal(ctx.net,42)
	assert.equal(ctx.other,"agg")
}).done()

/*
var Cc2= Chain([dog,Cc1])
Cc2.exec().then(function(ctx){
	assert.equal(ctx.dog,11)
	assert.equal(ctx.net,33)
	assert.equal(ctx.other,"agg")
}).done()
Cc2.exec({net:9}).then(function(ctx){
	assert.equal(ctx.dog,11)
	assert.equal(ctx.net,42)
	assert.equal(ctx.other,"agg")
}).done()

var Cc3= Chain([cat,cat,Cc1,Cc1,cat])
Cc3.exec({net:1}).then(function(ctx){
	assert.equal(ctx.net,111)
	assert.equal(ctx.other,"cat")
}).done()

var Cc4= Chain([Cc3])
Cc4.exec({net:3}).then(function(ctx){
	assert.equal(ctx.net,113)
	assert.equal(ctx.other,"cat")
}).done()
*/

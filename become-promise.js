function becomePromise(self,promise){
	
	var accept, reject, notify
	function resolver(acc,rej,not){
		accept= acc
		reject= rej
		notify= not
	}
	Q.promise.apply(self,resolver)
	promise.then(function(acc){
		accept(acc)
	},function(err){
		reject(err)
	},function(not){
		notify(not)
	})

	if(!(self.constructor instanceof Q.promise)){
		console.warn("not a promise")
	}

	return self
}

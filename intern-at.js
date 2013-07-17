var exc= require("../ex-cathedra"),
  getOrRun= exc.getOrRun

function internAt(dest,slot,input){
	if(input.then){
		input.then(internAt.bind(null,dest,slot))
	}
	if(input instanceof Function){
		input= input()
		function doIntern(val){
			getOrRun(dest)[getOrRun(slot)]= val
		}
		if(input.next){
			while(1){
				try{
					doIntern(input.next())
				}catch(ex){
					if(ex instanceof StopIteration)
						break;
					throw ex
				}
			}
		}else{
			doIntern(input)
		}
		
	}
	
}

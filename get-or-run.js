function getOrRun(a){
	return a instanceof Function? a(): a
}

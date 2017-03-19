//	code to execute on dom loaded
!function($,W,p){
	var
	D = W.document;

	//	init menus (tags & words)
	initmenus();

	//	toolTips
	$(D).on('mouseover',onHovers);

	//	mousedowns
	$(D).on('mousedown',onMousedowns);

	//	clicks
	$(D).on('click',onClicks);
}(Cosmos,this);

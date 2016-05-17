$(document).ready(function(){
console.log("ready");
function scrollBottom(){
$(document).height() - $(window).height() - $(window).scrollTop();	
}

scrollBottom();
});
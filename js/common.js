var api_url = "http://b.youngmen.cn:8080/guang_zhou/"
var sessionId = sessionStorage.getItem("sessionId")
function logout(){
	location.href='login.html';
	sessionStorage.clear();
}
function showWin (title,url,id,w,h) {
	
            x_admin_show(title,url,w,h); 
        }
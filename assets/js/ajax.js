function ambil(){
var xhr = new XMLHttpRequest();
var data=null;
xhr.onreadystatechange =function(){
	if(this.readyState === 4 && this.status === 200){
		data = JSON.parse(this.responseText);
		// console.log(this.responseText);
		console.log(data);
		return data;
	}
};
xhr.open("GET","/carNA",true);
xhr.send();

}

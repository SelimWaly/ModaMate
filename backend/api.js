const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open('GET', 'https://ali-express1.p.rapidapi.com/search?query=' + query + '&page=1');
xhr.setRequestHeader('x-rapidapi-key', '43312ae66dmsh01d4bdf12bde8dcp1a925ejsn0294fc3300be');
xhr.setRequestHeader('x-rapidapi-host', 'ali-express1.p.rapidapi.com');

xhr.send(data);
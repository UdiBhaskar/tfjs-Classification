let model;

async function loadModel() {
	console.log("model loading...");
	loader = document.getElementById("progress-box");
	load_button = document.getElementById("load-button");
	loader.style.display = "block";
	modelName = "mobilenet";
	model = undefined;
	model = await mobilenet.load();
	loader.style.display = "none";
	load_button.disabled = true;
	load_button.innerHTML = "Model Loaded";
	console.log("model loaded...");
}

$(document).on('change', '#select-file-image', async function(){
	document.getElementById("select-file-box").style.display = "table-cell";
	document.getElementById("predict-box").style.display = "table-cell";
	document.getElementById("prediction").innerHTML = "Click predict to find the label!";
    renderImage(this.files[0]);
});

function renderImage(file) {
  var reader = new FileReader();
  reader.onload = function(event) {
    img_url = event.target.result;
    document.getElementById("test-image").src = img_url;
  }
  reader.readAsDataURL(file);
}

$(document).on('click', '#predict-button', async function(){

	if (model == undefined) {
		alert("Please load the model first..")
	}
	if (document.getElementById("predict-box").style.display == "none") {
		alert("Please load an image using 'Upload Image' button..")
	}
	console.log(model);
	let image  = document.getElementById("test-image");
	let tensor = preprocessImage(image, modelName);
	console.log(tensor)
	console.log(image)

	let predictions = await model.classify(tensor);
	console.log(predictions)

	document.getElementById("predict-box").style.display = "block";
	document.getElementById("prediction").innerHTML = "NeuralNet Prediction: <br><b>" + predictions[0].className +"<br>" + '( Probability-'+ predictions[0].probability.toFixed(3)+ " )" + "</b>";

	var ul = document.getElementById("predict-list");
	ul.innerHTML = "";
	predictions.forEach(function (p) {
		console.log(p.className + " - " + p.probability.toFixed(3));
		var li = document.createElement("LI");
		li.innerHTML = p.className + " - " + p.probability.toFixed(3);
		ul.appendChild(li);
	});
});

function preprocessImage(image, modelName) {
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([227, 227])
		.toFloat();

	if (modelName === undefined) {
		return tensor.expandDims();
	} else if (modelName === "mobilenet") {
		let offset = tf.scalar(127.5);
		return tensor.sub(offset)
			.div(offset)
			.expandDims();
	} else {
		alert("Unknown model name..")
	}
}





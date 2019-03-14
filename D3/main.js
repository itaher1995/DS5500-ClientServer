var body = d3.selectAll('input');



function rocCurve(d){

	baseline = [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]

	// adapted from DS5500 D3.js tutorial
	var width = 600;
	var height = 600;
	var margin = {
					top: 25,
					left: 75,
					right: 25,
					bottom: 75
				};
	var svg = d3.select("body") // will grab body label in DOM
	        .append("svg") //appends svg object 
	        .attr("width", width)
	        .attr("height", height);

	var xScale = d3.scaleLinear() // takes a continuous linear scale
	           .domain([0,1]) //range of vals to map to scale
	           .range([margin.left,width - margin.right]);
	          // start margin.left because we set margin and end
	          // width - margin.right our max in the svg is width
	          // and we set a margin.

	var yScale = d3.scaleLinear()
	           .domain([0,1])
	           .range([height-margin.bottom,margin.top]);

	var xAxis = svg.append("g") // g is a grouping of subelements
	           .attr("transform",`translate(0,${height-margin.bottom})`) // takes special quotes are arg
	           .call(d3.axisBottom().scale(xScale)) // assigns xScale to bot

	var yAxis = svg.append("g")
	           .attr("transform",`translate(${margin.left},0)`)
	           .call(d3.axisLeft().scale(yScale));

    // TIME TO DRAW THE LINES!!!!!
    
    // adapted from 
    var line = d3.line()
				   .x(function(d) { return xScale(d.fpr)})
				   .y(function(d) { return yScale(d.tpr)})

	var baselineLine = d3.line() // to create baseline to show how much better model does than random
						.x(function(p) {return xScale(p)})
						.y(function(p) {return yScale(p)})

    var roc = svg.append("path") // create roc curve
				.datum(d)
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 1.5)
				.attr("d", line);

	var rocBaseline = svg.append("path") // create baseline line adapted from https://medium.freecodecamp.org/learn-to-create-a-line-chart-using-d3-js-4f43f1ee716b
						.datum(baseline)
						.attr("fill", "none")
						.attr("stroke", "red")
						.style("stroke-dasharray", ("3, 3")) 
						.attr("stroke-linejoin", "round")
						.attr("stroke-linecap", "round")
						.attr("stroke-width", 1.5)
						.attr("d", baselineLine);




	var title = svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("ROC Curve");

var yLabel =   svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y",margin.left - 50 )
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("True Positive Rate"); 

var xLabel =   svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height - margin.top) + ")")
      .style("text-anchor", "middle")
      .text("False Positive Rate");
};

// Learned how to do onclicks here : https://www.w3schools.com/jsref/event_onclick.asp
document.getElementById("plotButton").onclick = function(){ // click on Plot ROC to plot the curve
	
	// get current preprocessing and c value
	if (body['_groups'][0][0]['checked']){
		var processing = body['_groups'][0][0].value 
	}
	else{
		var processing = body['_groups'][0][1].value
	}

	var c= parseFloat(body['_groups'][0][2].value)


	var url = 'http://127.0.0.1:5000/'+processing + '&' + c; 
	d3.json(url).then(function(d) { // make a call to the flask API

		if (d3.selectAll("svg")['_groups'][0].length===0){ // if there are no svg objects just create the graph
			rocCurve(d);
		}

		else { // remove the svg object and create the graph
			d3.select("svg").remove(); // adapted code from https://stackoverflow.com/questions/21490020/remove-line-from-line-graph-in-d3-js
			rocCurve(d);
			};


	});




};


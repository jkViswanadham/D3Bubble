/*JK*/


function bubbleChart() {
  
  var width = 1000;  var height = 700;
  var tooltip = floatingTooltip('bubble_tooltip', 240); 
  var center = { x: width / 2, y: height / 2 };
  var ChartPanelCenters = {
	1: {x: width / 3, y: height / 4 + 70 },
	2: {x: width / 2, y: height / 4 + 70},
	3:{ x: 2 * width / 3, y: height / 4 + 70},
    4: { x: width / 3, y: 3*height / 4 - 80 },
    5: { x: width / 2, y: 3*height / 4 -80},
    6: { x: 2 * width / 3 + 60, y: 3*height / 4 - 80 }
  };
  var ChartPanelTitleX = {
	1: 160,
    2: width / 2,
    3: width - 160,
    4: 160,
    5: width / 2,
    6: width - 160
  };
  var ChartPanelTitleY = {
	1: 20,
    2: 20,
    3: 20,
    4: height/2 + 70,
    5: height / 2 + 70,
    6: height/2 + 70
  }; 
  var damper = 0.09; 
  var svg = null;
  var bubbles = null;
  var nodes = [];  
  function PreProcessRawData(data_filter, buttonId){
	 
	 
	 if(buttonId == "pm"){
		ReturnData = data_filter
		
		
		   for( i = 0; i < ReturnData.length ; i ++)
			 {
				 ReturnData[i].Product_Name = ReturnData[i].Product
				  ReturnData[i].Volume = ReturnData[i].Share
				  
				 if(ReturnData[i].Date=="February"){
				 ReturnData[i].pannelIndex =  1
				 }
				  if(ReturnData[i].Date=="March"){
				 ReturnData[i].pannelIndex =  2
				 }
				  if(ReturnData[i].Date=="April"){
				 ReturnData[i].pannelIndex =  3
				 }
				  if(ReturnData[i].Date=="May"){
				 ReturnData[i].pannelIndex =  4
				 }
				  if(ReturnData[i].Date=="June"){
				 ReturnData[i].pannelIndex =  5
				 }
			 }
			 
	 }		 
	 
	 if(buttonId=='vbp' || buttonId== 'vbr_p'){
		 var TempData = d3.nest().key(function(d) { return d.Product_Name; }).rollup(function(v) {return {Index: function(d,i){return i},Volume: d3.sum(v, function(d) { return d.Volume; })}}).entries(data_filter);
	    
		 TempData = TempData.sort(function(a,b) { return +b.values.Volume - +a.values.Volume })
		 var ReturnData = []
		 SortedProducts = []
		 for(i = 0; i< TempData.length; i++){ ReturnData.push({'Product_Name': TempData[i].key,"Volume":TempData[i].values.Volume , "Color_Index":i  })}
	     
	     for(i = 0; i< 6; i++){ SortedProducts.push(TempData[i].key) }
	     
		 if(buttonId == 'vbr_p'){
			 ReturnData =  data_filter.filter( function( el ) {return SortedProducts.includes(el.Product_Name)} );
			 for( i = 0; i < ReturnData.length ; i ++)
			 {
				 ReturnData[i].pannelIndex = SortedProducts.indexOf(ReturnData[i].Product_Name) + 1
			 }
		 }
	  }
	  
	   if( buttonId=='vbp_r' || buttonId=='vbrp' ){
		  ReturnData =  data_filter
		 
		 
	     var TempData = d3.nest().key(function(d) { return d.Region_Name; }).rollup(function(v) {return {Index: function(d,i){return i},Volume: d3.sum(v, function(d) { return d.Volume; })}}).entries(data_filter);
		 TempData = TempData.sort(function(a,b) { return +b.values.Volume - +a.values.Volume })
		 SortedRegions = []
	     for(i = 0; i< 6; i++){ SortedRegions.push(TempData[i].key) ;}
	     
		 
		   for( i = 0; i < ReturnData.length ; i ++)
			 {
				 ReturnData[i].pannelIndex = SortedRegions.indexOf(ReturnData[i].Region_Name) + 1
			 }
		  
		  
	  }
	   if(buttonId=='vbr'){
		  var TempData = d3.nest().key(function(d) { return d.Region_Name; }).rollup(function(v) {return {Volume: d3.sum(v, function(d) { return d.Volume; })}}).entries(data_filter);
	      var ReturnData = []
	      for(i = 0; i< TempData.length; i++){ ReturnData.push({'Region_Name': TempData[i].key,"Volume":TempData[i].values.Volume  })}
	
	  }
	   
	    if(buttonId=='all'){ReturnData = d3.nest().rollup(function(v) {return {Volume: d3.sum(v, function(d) { return d.Volume; })}}).entries(data_filter);}
	

	  for(i =0 ; i< ReturnData.length ; i++){ReturnData[i].Index = i}
		  return ReturnData
	  
  }
  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  } 
  var force = d3.layout.force().size([width, height]).charge(charge).gravity(-0.01).friction(0.9);
  var fillColor = d3.scale.ordinal().domain(['low', 'medium', 'high']).range(['#d84b2a', '#beccae', '#7aa25c']);
 

  var fillColorProduct = ["#000080","#0E4D92","#008081","#57A0D3","#73C2FB","#95C8D8","#728585","#6593F5","#4C516D","#BECCAE","#D84B2A"]
  var radiusScale = d3.scale.pow().exponent(0.5).range([2, 85]);
  function createNodes(rawData,buttonId) {
	  if(buttonId == "pm")
	{
		var myNodes = rawData.map(function (d) {
      return {
        radius: radiusScale(+d.Share)/1.8,
        value: d.Share,
        Product: d.Product,
        Month: d.Date,
		group :d.Product,
		pannelIndex: d.pannelIndex,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });
	
	}
   if(buttonId=='vbrp' || buttonId=='vbp_r' || buttonId=='vbr_p')
   {
    var myNodes = rawData.map(function (d) {
      return {
        radius: radiusScale(+d.Volume),
        value: d.Volume,
        Product: d.Product_Name,
        Region: d.Region_Name,
		group :d.Product_Name,
		pannelIndex: d.pannelIndex,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });
   }
   
   if(buttonId=='vbp')
   {
	  
    var myNodes = rawData.map(function (d) {
      return {
        radius: radiusScale(+d.Volume),
        value: d.Volume,
        Product: d.Product_Name,
		group :d.Product_Name,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });
   }
   
   if(buttonId=='vbr' )
   {
    var myNodes = rawData.map(function (d) {
      return {
        radius: radiusScale(+d.Volume),
        value: d.Volume,
        Region: d.Region_Name,
		group :d.Region_Name,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });
   }
   
   myNodes.sort(function (a, b) { return b.value - a.value; });
   
    return myNodes;
  }
  var chart = function chart(selector, Data, Product_Data) {
    
	d3.select(selector).selectAll("*").remove();
	
	var button = d3.select("#toolbar").select('.active');
    var buttonId = button.attr('id');
	
	
	if(buttonId == "pm")
	{
		Data = Product_Data
	}
	
    rawData = PreProcessRawData(Data, buttonId)
	
	svg = d3.select(selector).append('svg').attr('width', width).attr('height', height).attr("transform", "translate(0 ,  -600)")

	
	if(buttonId == "all")
	{
		 svg.append("g").attr("class","circle").append("circle").attr("cx",width / 2).attr("cy",height / 2 - 150).attr("r",height / 4).style("fill","rgb(122, 162, 192)")
		 .on('mouseover', sd_static).on('mouseout', hd_static);
		 
		 var content = 
                  '<span class="name">Volume: </span><span class="value">' +
                  addCommas(parseFloat(rawData.Volume).toFixed(2)) +
                  '</span>';
				  
		 function sd_static(){
		 tooltip.showTooltip(content, d3.event);
		 }
		 
		 function hd_static(){
		 tooltip.hideTooltip();
		 }
		 
		 generateLegend('','','')
		 
	}
	else
	{
		
	var maxAmount = d3.max(rawData, function (d) { return +d.Volume; });
    radiusScale.domain([0, maxAmount]);

    nodes = createNodes(rawData,buttonId);
	
    force.nodes(nodes);
	
    bubbles = svg.selectAll('.bubble').data(nodes);

    
     var TempData = d3.nest().key(function(d) { return d.Product_Name; }).rollup(function(v) {return {Index: function(d,i){return i},Volume: d3.sum(v, function(d) { return d.Volume; })}}).entries(rawData);
	 TempData = TempData.sort(function(a,b) { return +b.values.Volume - +a.values.Volume })
	 ColorIdProducts = []
	 for(i = 0; i< TempData.length; i++){ ColorIdProducts.push( TempData[i].key )}
	
	window.ColorIdProducts = ColorIdProducts
	
    bubbles.enter().append('circle').classed('bubble', true).attr('r', 0)
	.attr('fill', function (d) { 
	if(buttonId == "vbp_r" || buttonId == "vbrp" || buttonId == "vbp" || buttonId=="pm") { k = ColorIdProducts.indexOf(d.Product) ;  if(k > 39){k = 10} else if(k >= 9) {k = 9} ;return fillColorProduct[k]}; 
	
	return d3.rgb(122, 162, 192); })
		.attr('stroke', function (d) { if(buttonId == "vbp_r" || buttonId == "vbrp" || buttonId == "vbp") 
		{ k = ColorIdProducts.indexOf(d.Product) ;  if(k > 39){k = 10} else if(k >= 9) {k = 9} ;return d3.rgb(fillColorProduct[k]).darker()};

	return d3.rgb(122, 162, 192).darker(); } 
		).attr('stroke-width', 2).on('mouseover', showDetail).on('mouseout', hideDetail);

	generateLegend(buttonId, ColorIdProducts )
    bubbles.transition().duration(2000).attr('r', function (d) { return d.radius; });
    
	if(buttonId == "vbp_r" || buttonId == "vbr_p" || buttonId == "pm") {splitBubbles(buttonId, rawData);}
	else{groupBubbles(buttonId);}
	}
  };

 
  function groupBubbles(buttonId) {
    hideYears();

if(buttonId == "vbrp"){
	force.on('tick', function (e) {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y - 20; });
    });
}
else{
    force.on('tick', function (e) {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y-140; });
    });
}
    force.start();
  }

  function moveToCenter(alpha) {
    return function (d) {
      d.x = d.x + (center.x - d.x) * damper * alpha;
      d.y = d.y + (center.y - d.y) * damper * alpha;
    };
  }

  
  function splitBubbles(buttonId , rawData) {
	  Titles = []
	  for(i = 0; i <rawData.length;i++)
	  {
	  if(buttonId=="vbp_r"){
		  Titles.push({'title':rawData[i].Region_Name,'index':rawData[i].pannelIndex})
	  }
	   if(buttonId=="vbr_p"){
		  Titles.push({'title':rawData[i].Product_Name,'index':rawData[i].pannelIndex})
	  }
	   if(buttonId=="pm"){
		  Titles.push({'title':rawData[i].Date,'index':rawData[i].pannelIndex})
	  }
	  }
	  
    showTitles(Titles,buttonId);

    force.on('tick', function (e) {
      bubbles.each(moveToTitles(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

 
  function moveToTitles(alpha) {
    return function (d) {
      var target = ChartPanelCenters[d.pannelIndex];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  
  function hideYears() {
    svg.selectAll('.Titles').remove();
  }

 
  
    
  function showTitles(Titles,buttonId) {
   
    var Titles_txt = svg.selectAll('.Titles').data(Titles);

    
    Titles_txt.enter().append('text')
      .attr('class', 'Titles')
      .attr('x', function (d) { if(buttonId == "pm"){return ChartPanelTitleX[d.index] + 50} return ChartPanelTitleX[d.index]; })
      .attr('y', function(d){if(buttonId == "pm") {if(d.index <= 3){return ChartPanelTitleY[d.index]+ 10}else{return ChartPanelTitleY[d.index]-30}} return ChartPanelTitleY[d.index]})
      .attr('text-anchor', 'middle')
      .text(function (d) { return d.title; });
  }


  function showDetail(d) {
    // change outline to indicate hover state.

    d3.select(this).attr('stroke', 'red');
    

	
	var button = d3.select("#toolbar").select('.active');
    var buttonId = button.attr('id');
	if(buttonId == "pm")
	{
	HSV = d3.select("#vis").select("svg").selectAll("circle")
	HSV.attr('stroke',function(d1){
		if(d1.Product === d.Product){
			
			
			return'red'
		}
		else{
			
			 k = window.ColorIdProducts.indexOf(d1.Product) ; 
			 if(k > 39){k = 10} else if(k >= 9) {k = 9} ;return d3.rgb(fillColorProduct[k]).darker()
		}
	})
	
	
    var content = 
                  '<span class="name">Product: </span><span class="value">' +
                   d.Product +
                  '</span><br/>' +
				  '<span class="name">Month: </span><span class="value">' +
                   d.Month +
                  '</span><br/>' +
                  '<span class="name">Share: </span><span class="value">' +
                  parseFloat(d.value).toFixed(2)  +
                  '%</span>';
	}
	if(buttonId == "vbp_r" || buttonId == "vbr_p" || buttonId == "vbrp")
	{
    var content = '<span class="name">Region: </span><span class="value">' +
                  d.Region +
                  '</span><br/>' +
                  '<span class="name">Product: </span><span class="value">' +
                  d.Product +
                  '</span><br/>' +
                  '<span class="name">Volume: </span><span class="value">' +
                  addCommas(parseFloat(d.value).toFixed(2) ) +
                  '</span>';
	}
	if(buttonId == "vbp")
	{
    var content = 
                  '<span class="name">Product: </span><span class="value">' +
                   d.Product +
                  '</span><br/>' +
                  '<span class="name">Volume: </span><span class="value">' +
                  addCommas(parseFloat(d.value).toFixed(2) ) +
                  '</span>';
	}
	if(buttonId == "vbr")
	{
    var content = 
                  '<span class="name">Region: </span><span class="value">' +
                  d.Region +
                  '</span><br/>' +
                  '<span class="name">Volume: </span><span class="value">' +
                  addCommas(parseFloat(d.value).toFixed(2) ) +
                  '</span>';
	}
    tooltip.showTooltip(content, d3.event);
  }

 
  function hideDetail(d) {
    // reset outline
	var button = d3.select("#toolbar").select('.active');
    var buttonId = button.attr('id');
	
	HSV = d3.select("#vis").select("svg").selectAll("circle")
	HSV.attr('stroke',function(d1){
		if(buttonId == "vbp_r" || buttonId == "vbrp" || buttonId == "vbp" || buttonId=="pm"){
			
			 k = window.ColorIdProducts.indexOf(d1.Product) ; 
			 if(k > 39){k = 10} else if(k >= 9) {k = 9} ;return d3.rgb(fillColorProduct[k]).darker()
		}
	})
	
	
	tooltip.hideTooltip();
    
  }

  
  chart.toggleDisplay = function (displayName) {
	 
    if(displayName === 'all') {groupBubbles();}
	else if(displayName ==  "vbr" || displayName == "vbp" || displayName == "vbp_r" ||displayName == "vbr_p" || displayName == "vbrp" ){splitBubbles(displayName);}
  };


  function generateLegend(buttonId, ColorIdProducts ){
	  d3.select("#Legend").selectAll("*").remove();
	  
	 if(buttonId =="pm"){
		addval = 50 
	 }
	
		legend_svg = d3.select("#Legend").append("svg").attr("width",190).attr("height",600).attr("transform", "translate(-100 ,  0)")
	
	  if(buttonId == "vbp" || buttonId == "vbp_r" || buttonId =="vbrp" || buttonId =="pm" ){
		  for(i = 0; i < 9 ; i ++)
		  {
			  legend_svg.append("rect").attr("x" ,20).attr("y", height/20*(i+1)).attr("width",5).attr("height",5).attr("fill",fillColorProduct[i])
			  legend_svg.append("text").attr("x" , 27).attr("y", height/20*(i+1) + 6).text(ColorIdProducts[i]).attr("font-size","10px")
		  }
		   legend_svg.append("rect").attr("x" , 20).attr("y", height/20*(i+1)).attr("width",5).attr("height",5).attr("fill",fillColorProduct[i])
		   legend_svg.append("text").attr("x" , 27).attr("y", height/20*(i+1)+6).text("Next 30").attr("font-size","10px")
		   i = i +1
		   legend_svg.append("rect").attr("x" , 20).attr("y", height/20*(i+1)).attr("width",5).attr("height",5).attr("fill",fillColorProduct[i])
		   legend_svg.append("text").attr("x" , 27).attr("y", height/20*(i+1)+6).text("Remaining").attr("font-size","10px")
	  }
	
	  
  }
  
  return chart;
}



var myBubbleChart = bubbleChart();

function display(error, data) {
  if (error) {
    console.log(error);
  }
  d3.csv('data/Data2_P.csv', function(error, data_Product){
	  Product_data = data_Product
	   filterdata = data.filter( function( el ) {return el.Date == '202005';} );
       myBubbleChart('#vis', filterdata,Product_data);
	  
  });
 
}

function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      d3.selectAll('.button').classed('active', false);
      var button = d3.select(this);
      button.classed('active', true);
      var buttonId = button.attr('id');
      myBubbleChart('#vis', filterdata,Product_data);
    });
}


function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

// Load the data.
d3.csv('data/Data_new.csv', display);

// setup the buttons.
setupButtons();

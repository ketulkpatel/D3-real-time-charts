d3.helper = {};


d3.helper.tooltip = function(){
    var tooltipDiv;
    var bodyNode = d3.select('body').node();

    function tooltip(selection){
      
        selection.on('mouseover.tooltip', function(pD, pI){
            // Clean up lost tooltips
            d3.select('body').selectAll('div.tooltip').remove();
            // Append tooltip
            var absoluteMousePos = d3.mouse(bodyNode);  
            
            tooltipDiv = d3.select('body')
                           .append('div')
                           .attr('class', 'tooltip')
                           .style("left",(absoluteMousePos[0] + 10) + "px;top: " + (absoluteMousePos[1] - 40) + "px;");
            
            // tooltipDiv.style({

            //     left: (absoluteMousePos[0] + 10)+'px',
            //     top: (absoluteMousePos[1] - 40)+'px',
            //     'background-color': '#d8d5e4',
            //     width: '65px',
            //     height: '30px',
            //     padding: '5px',
            //     position: 'absolute',
            //     'z-index': 1001,
            //     'box-shadow': '0 1px 2px 0 #656565'
            // });

            var d=new Date(Date.parse(pD.time));
            var date=d.getDate();
            var month=d.getMonth();
            var year= d.getFullYear();
            var hour= d.getHours();
            var minute=d.getMinutes();
            var second=d.getSeconds();
            var final_string= date + '-' + month + '-'+ year +' ' + hour + ":" + minute + ":" + second  
          
            var first_line = '<p>X-Value: ' + final_string + '</p>'
            var second_line = '<p>Y-Value: ' + pD.x + '</p>'
            tooltipDiv.html(first_line + second_line)
        })
        .on('mousemove.tooltip', function(pD, pI){        
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.attr("style", "left: "+ (absoluteMousePos[0] + 10) + "px;top: " + (absoluteMousePos[1] - 40) + "px;");
        })
        .on('mouseout.tooltip', function(pD, pI){            
            tooltipDiv.remove();
        });

    }

    tooltip.attr = function(_x){
        if (!arguments.length) return attrs;
        attrs = _x;
        return this;
    };

    tooltip.style = function(_x){
        if (!arguments.length) return styles;
        styles = _x;
        return this;
    };

    return tooltip;
};





















function realTimeLineChart() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = 1200,
      height = 400,
      duration = 1000;

  function chart(selection) {
    // Based on https://bl.ocks.org/mbostock/3884955
    selection.each(function(data) {
 
      slices = ["x"].map(function(c) {
        return {
          label: c,
          values: data.map(function(d) {
            return {time: +d.time, value: d[c]};
          })
        };
      });

      var t = d3.transition().duration(duration).ease(d3.easeLinear),
          x = d3.scaleTime().rangeRound([0, width-margin.left-margin.right]),
          y = d3.scaleLinear().rangeRound([height-margin.top-margin.bottom, 0]);
      


      var xMin = d3.min(slices, function(c) { return d3.min(c.values, function(d) {  return d.time; })});
      var xMax = new Date(new Date(d3.max(slices, function(c) {
        return d3.max(c.values, function(d) { return d.time; })
      })).getTime());


      x.domain([xMax-300000, xMax]);
      y.domain([
        d3.min(slices, function(c) { return d3.min(c.values, function(d) { return d.value; })}),
        d3.max(slices, function(c) { return d3.max(c.values, function(d) { return d.value; })})
      ]);
    
      var line = d3.line()
        // .curve(d3.curveBasis)
        .x(function(d) { return x(d.time); })
        .y(function(d) {  return y(d.value); });

      var svg = d3.select(this).selectAll("svg").data([data]);
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("g").attr("class", "axis x").transition().duration(5000);
      gEnter.append("g").attr("class", "axis y").transition().duration(5000);
      gEnter.append("defs").append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("width", width-margin.left-margin.right)
          .attr("height", height-margin.top-margin.bottom);
      


      var svg = selection.select("svg");
      svg.attr('width', width).attr('height', height);
      var g = svg.select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.select("g.axis.x")
        .attr("transform", "translate(0," + (height-margin.bottom-margin.top) + ")")
        .transition(t)
        .call(d3.axisBottom(x).ticks(10));

      g.select("g.axis.y")
        .transition()
        .duration(5000)
        .attr("class", "axis y")
        .call(d3.axisLeft(y));

   

        gEnter.append("g")
          .attr("class", "lines")
          .attr("clip-path", "url(#clip)")
        .selectAll(".data").data(slices).enter()
          .append("path")
            .attr("class", "data");

      g.selectAll("g path.data")
        .data(slices)
        .style("stroke", "blue")
        .style("stroke-width", 1)
        .style("fill", "none")
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .on("start", tick)
    

        
          g.append("g").attr("class", "circles").attr("clip-path", "url(#clip)").selectAll(".point")
    .data(data)
  .enter().append("circle")
    .attr("class", "point")

  
      function tick() {


    g.selectAll("g circle.point")
    .attr("r", 2)
    
    .attr("stroke","red")
    .attr("cx", function(d) { return x(d.time) })
    .attr("cy", function(d) { return y(d.x); })
    .call(d3.helper.tooltip());


        d3.select(this)
          .attr("d", function(d) { return line(d.values); })
          .attr("transform", null);
   

        var xMinLess = new Date(new Date(xMax-300000).getTime() - duration);
        d3.active(this)
            .attr("transform", "translate(" + x(xMinLess) + ",0)")
          .transition()
          .duration(5000)
            .on("start", tick1);

      }
      function tick1() {
 
         d3.select("g circle.point")
          .attr("cx", function(d) {return x(d.value); })
          .attr("cy",function(d){  return y(d.x);})
          .attr("transform", null)
              

        var xMinLess = new Date(new Date(xMax-300000).getTime() - duration);
        d3.active(".point")
            .attr("transform", "translate(" + x(xMinLess) + ",0)")
          .transition()
          .duration(5000)
            .on("start", tick);

      }

       

    });
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };

  chart.duration = function(_) {
    if (!arguments.length) return duration;
    duration = _;
    return chart;
  };

  return chart;
}
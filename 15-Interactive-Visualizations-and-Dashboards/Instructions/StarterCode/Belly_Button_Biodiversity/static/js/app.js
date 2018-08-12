;function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url_meta = "/metadata/" + sample
  console.log(url_meta);
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.json(url_meta).then((sample_metadata) => {
    console.log(sample_metadata);

    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    var metadata = Object.entries(sample_metadata);
    
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    metadata.forEach((sample) => {
      panel
      .append('li')
      .text(`${sample[0]}: ${sample[1]}`)
    });
   
  })


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
var url_chart = "/samples/" + sample
console.log(url_chart)

// @TODO: Use `d3.json` to fetch the sample data for the plots
d3.json(url_chart).then((sample_data) => {
  console.log(sample_data);

  var response = sample_data;
  
  // @TODO: Build a Bubble Chart using the sample data
  var trace1 = {
    x:response.otu_ids,
    y:response.sample_values,
    mode:'markers',
    marker:{
        color:response.otu_ids,
        size:response.sample_values
    },
    text:response.otu_labels
  };

  var data1 = [trace1];

  var layout1 = {
    title:'Session Duration v. Traffic',
    xaxis: {title:'Traffic'},
    yaxis: {title: 'Session duration'}
  }
  Plotly.newPlot('bubble',data1,layout1);
  
  // @TODO: Build a Pie Chart
  var trace2 = {
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    values:response.sample_values.slice(0,10),
    labels:response.otu_ids.slice(0,10),
    hovertext:response.otu_labels.slice(0,10),
    type:'pie'
  };

  var data2 = [trace2];

  var layout2 = {
    title: 'Item ID searced by user'
  };
  Plotly.newPlot('pie',data2,layout2);
});


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

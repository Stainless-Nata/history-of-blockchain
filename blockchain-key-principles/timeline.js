// CONST and GLOBALS

let width = window.innerWidth * 0.3,
  height = window.innerHeight * 0.4,
  margin = { top: 70, bottom: 70, left: 40, right: 20 },
  radius = 10;
let formatYear = d3.timeFormat('%Y');
/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;
let div;
//let title;

// Aplication state
let state = {
  data: [],
};

// Load data
Promise.all([
  d3
    .csv('./../data/draft6.csv', d => ({
      Year: new Date(d.Year, 0, 1),
      Name: d.Name,
      Step: d.Step,
      Count: d.Count,
      Type: d.Type,
    }))
    .then(raw_data => {
      //console.log('raw_data', raw_data, raw_data[0]);
      state.data = raw_data;

      init();
    }),
]);

//INITIALIZING FUNCTION
// this will be run one time when data finishes loading in

function init() {
  // SCALES
  // xScale = d3
  //   .scaleLinear()
  //   //.domain(d3.extent(state.data, d => d.Count))
  //   .domain([0.5, 5])
  //   .range([margin.left, width - margin.right]);
  xScale = d3
    .scaleTime()
    .domain(d3.extent(state.data, d => d.Year))
    .range([margin.left, width - margin.right]);
  console.log(xScale.range());
  // yScale = d3
  //   .scaleBand()
  //   .domain(state.data.map(d => d.Type))
  //   .range([margin.top + 20, height - margin.bottom])
  //   .paddingInner(60);
  yScale = d3
    .scaleBand()
    .domain(state.data.map(d => d.Type))
    .range([margin.top + 20, height - margin.bottom])
    .paddingInner(30);

  //console.log(yScale.domain());

  // create an svg element in our main `d3-container` element
  svg = d3
    .select('#sticky-chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  // text = svg
  //   .selectAll('text')
  //   .data(state.data, d => d.Year)
  //   .join('text')
  //   .attr('class', 'label')
  //   .attr('y', d => yScale(d.Type))
  //   .attr('x', d => xScale(d.Count))
  //   .text(d => d.Year)
  //   .attr('font-size', 16)
  //   .attr('dy', '0.5em')
  //   .attr('dx', '-1.3em');
  // AXES
  let xAxis = d3.axisBottom(xScale).ticks(5);
  let yAxis = d3.axisRight(yScale).tickSize(0);
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${height - margin.bottom + 20} )`)
    .call(xAxis)
    .append('text')
    .attr('class', 'axis-label')
    .attr('x', '50%')
    .attr('dy', '3em')
    .text('Year');
  //add the yAxis
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', `translate(${margin.left},${width / 30})`)
    .call(yAxis)

    .append('text')
    .attr('class', 'axis-label');

  draw();
  // calls the draw function
}

function draw() {
  // let title = d3
  //   .select('#chart-title')
  //   .data(state.data, d => d.Type)
  //   .attr('class', d => `dot-${d.Type}`)

  //   .text(d => d.Type);

  div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  svg
    .selectAll('.dot')
    .data(state.data, d => d.Name) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append('circle')
          //.attr('class', 'dot')
          .attr('class', d => `dot-${d.Step}`) // Note: this is important so we can identify it in future updates
          .attr('stroke', 'black')
          .attr('opacity', 0.5)
          .attr('r', radius)
          .attr('cx', d => xScale(d.Year))
          .attr('cy', d => yScale(d.Type))
          .attr('fill', '#e0d0ba')

          // .append('text')
          // .attr('class', d => `name-${d.Name}`) //, console.log(`.name-${d.Name}`)) // Note: this is important so we can identify it in future updates
          // .text(d => d.Name)
          // .attr('opacity', 1)
          // .attr('x', d => xScale(d.Count))
          // .attr('y', d => yScale(d.Type))
          // .attr('fill', 'black')

          .on('mouseover', (event, d) => {
            div.transition().duration(50).style('opacity', 1);

            div
              .html(
                '<strong>' + d.Name + '</strong>' + ' <br>' + formatYear(d.Year)
              )
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');
          })
          .on('mouseout', () => {
            div
              .transition() //
              .duration(100)
              .style('opacity', 0);
          }),

      update => update,

      exit => exit
    );

  let lineFunc = d3
    .line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Type));

  let line = svg
    .selectAll('path.trend')
    //.data(d3.groups([state.data, d => d.Type]))
    .data([state.data])
    .join(
      enter => enter.append('path').attr('class', 'trend').attr('opacity', 0), // start them off as opacity 0 and fade them in
      update => update, // pass through the update selection
      exit => exit.remove()
    )
    .call(selection =>
      selection
        .transition() // sets the transition on the 'Enter' + 'Update' selections together.
        .duration(800)
        .attr('opacity', 0.8)
        .attr('d', d => lineFunc(d))
    );
}

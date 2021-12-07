// CONST and GLOBALS

let width = window.innerWidth * 0.4,
  height = window.innerHeight * 0.6,
  margin = { top: 70, bottom: 60, left: 30, right: 0 },
  radius = 30;

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;
let div;
let title;

// Aplication state
let state = {
  data: [],
};

// Load data
Promise.all([
  d3.csv('./../data/draft6.csv', d3.autoType).then(raw_data => {
    console.log('raw_data', raw_data, raw_data[0]);
    state.data = raw_data;

    init();
  }),
]);

//INITIALIZING FUNCTION
// this will be run one time when data finishes loading in

function init() {
  // SCALES
  xScale = d3
    .scaleLinear()
    //.domain(d3.extent(state.data, d => d.Count))
    .domain([0.5, 5])
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleBand()
    .domain(state.data.map(d => d.Type))
    .range([margin.top + 20, height - margin.bottom])
    .paddingInner(60);

  console.log(yScale.domain());

  // create an svg element in our main `d3-container` element
  svg = d3
    .select('#sticky-chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  svg
    .selectAll('text')
    .data(state.data, d => d.Year)
    .join('text')
    .attr('class', 'label')
    .attr('y', d => yScale(d.Type))
    .attr('x', d => xScale(d.Count))
    .text(d => d.Year)
    .attr('dy', '-2.1em')
    .attr('dx', '-1.3em');
  // AXES

  let yAxis = d3.axisRight(yScale).tickSize(0);

  //add the yAxis
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', `translate(${margin.left},-70)`)
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

  let circles = svg
    .selectAll('.dot')
    .data(state.data, d => d.Name) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append('circle')
          //.attr('class', 'dot')
          .attr('class', d => `dot-${d.Year}`) // Note: this is important so we can identify it in future updates
          .attr('stroke', 'black')
          .attr('opacity', 1)
          .attr('r', radius)
          .attr('cx', d => xScale(d.Count))
          .attr('cy', d => yScale(d.Type))
          .attr('fill', '#e0d0ba')

          .on('mouseover', (event, d) => {
            div.transition().duration(50).style('opacity', 1);

            div
              .html(d.Name)
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');
          })
          .on('mouseout', () => {
            div
              .transition() //
              .duration(100)
              .style('opacity', 0);
          })
          .append('text')
          //.attr('class', 'dot')
          .attr('class', 'text')
          .text(d => d.Name) // Note: this is important so we can identify it in future updates
          .attr('stroke', 'black')
          .attr('opacity', 1)

          .attr('x', d => xScale(d.Count))
          .attr('y', d => yScale(d.Type))
          .attr('fill', '#e0d0ba'),
      update => update,
      exit => exit
    );
  // svg
  //   .selectAll('.text')
  //   .data(state.data, d => d.Type) // use `d.name` as the `key` to match between HTML and data elements
  //   .join(
  //     enter =>
  //       // enter selections -- all data elements that don't have a `.dot` element attached to them yet
  //       enter
  //         .append('text')
  //         .attr('class', 'text-name')
  //         .attr('text', d => `text-${d.Name}`)
  //         .attr('x', d => xScale(d.Count))
  //         .attr('y', d => yScale(d.Type))
  //         .attr('opacity', 1)
  //         // .attr('fill', 'black')
  //         .attr('style', 'stroke: black; stroke-width: 0.75px'),

  //     update => update,
  //     exit => exit
  //   );
  // svg
  //   .selectAll('text')
  //   .data(state.data, d => d.Name)
  //   .join('text')
  //   .attr('class', 'label')
  //   .attr('y', d => yScale(d.Type))
  //   .attr('x', d => xScale(d.Count))
  //   .text(d => d.Name)
  //   .attr('dy', '1.8em');
}

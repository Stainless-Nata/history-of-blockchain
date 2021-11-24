// CONST and GLOBALS

const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 60, bottom: 50, left: 180, right: 0 },
  radius = 30;

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;

// Aplication state
let state = {
  data: [],
};

// Load data
Promise.all([
  d3.csv('/../data/draft6.csv', d3.autoType).then(raw_data => {
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
    .range([margin.top + 50, height - margin.bottom])
    .paddingInner(10);

  console.log(yScale.domain());

  // AXES

  // let xAxis = d3.axisBottom(xScale).tickSize(0);
  let yAxis = d3.axisLeft(yScale).tickSize(0);

  // .attr('style', 'position: absolute, opacity: 0;')
  // .attr('position: top: 100%, left:50%');

  // create an svg element in our main `d3-container` element
  svg = d3
    .select('#d3-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // add the yAxis
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis)
    .append('text')
    .attr('class', 'axis-label');
  // .attr('y', '50%') //in the middle of line
  // .attr('dx', '-5em');

  div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  draw();
  // calls the draw function
}

function draw() {
  //   svg
  //     .selectAll('text')
  //     .data(state.data, d => d.Name)
  //     .join('text')
  //     .attr('class', 'label')
  //     // this allows us to position the text in the center of the bar
  //     .attr('y', d => yScale(d.Type))
  //     // .text(d => d.activity)
  //     .attr('x', d => xScale(d.Count))
  //     .text(d => d.Name)
  //     .attr('dy', '1.8em');

  svg
    .selectAll('.dot')

    .data(state.data, d => d.Name) // use `d.name` as the `key` to match between HTML and data elements

    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append('circle')
          .attr('class', 'dot') // Note: this is important so we can identify it in future updates
          .attr('stroke', 'black')
          .attr('opacity', 1)
          .attr('r', radius)
          .attr('cx', d => xScale(d.Count))
          .attr('cy', d => yScale(d.Type))
          .attr('fill', '#e0d0ba')
          //   .append('text')
          //   .attr('class', 'text')
          //   .attr('text', d => d.Name)
          //   .attr('x', d => d.Count)
          //   .attr('y', d => d.Type)

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
          }),
      update => update,
      exit => exit
    );
}

// setting up scrollama
let container = d3.select('#scroll');
let graphic = container.select('.scroll__graphic');
let chart = graphic.select('.chart');
let text = container.select('.scroll__text');
// let step = text.selectAll('.step');
let step = text.selectAll('.step');

// initialize the scrollama
let scroller = scrollama();

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  let stepHeight = Math.floor(window.innerHeight * 0.75);
  step.style('height', stepHeight + 'px');

  // 2. update width/height of graphic element
  let bodyWidth = d3.select('body').node().offsetWidth;

  graphic
    .style('width', bodyWidth + 'px')
    .style('height', window.innerHeight + 'px');

  let chartMargin = 32;
  let textWidth = text.node().offsetWidth;
  let chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;

  chart
    .style('width', chartWidth + 'px')
    .style('height', Math.floor(window.innerHeight / 2) + 'px');

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }

  // add color to current step only
  step.classed('is-active', function (d, i) {
    return i === response.index;
  });

  // update graphic based on step
  chart.select('p').text(response.index + 1);
}

function handleContainerEnter(response) {
  // response = { direction }

  // sticky the graphic (old school)
  graphic.classed('is-fixed', true);
  graphic.classed('is-bottom', false);
}

function handleContainerExit(response) {
  // response = { direction }

  // un-sticky the graphic, and pin to top/bottom of container
  graphic.classed('is-fixed', false);
  graphic.classed('is-bottom', response.direction === 'down');
}

function init() {
  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      container: '#scroll',
      graphic: '.scroll__graphic',
      text: '.scroll__text',
      step: '.scroll__text .step',
      debug: true,
    })
    .onStepEnter(handleStepEnter);
  // .onContainerEnter(handleContainerEnter)
  // .onContainerExit(handleContainerExit);

  // setup resize event
  window.addEventListener('resize', handleResize);
}

// kick things off
init();

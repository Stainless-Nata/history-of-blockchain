// CONST and GLOBALS

let width1 = window.innerWidth * 0.4,
  height1 = window.innerHeight * 0.6,
  margin1 = { top: 70, bottom: 60, left: 30, right: 0 },
  radius1 = 30;

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg1;
let xScale1;
let yScale1;
let div1;
let title1;

// Aplication state
let state1 = {
  data1: [],
};

// Load data
Promise.all([
  d3.csv('./../data/draft6.csv', d3.autoType).then(raw_data1 => {
    //console.log('raw_data', raw_data, raw_data[0]);
    state1.data1 = raw_data1;

    init();
  }),
]);

//INITIALIZING FUNCTION
// this will be run one time when data finishes loading in

function init() {
  // SCALES
  xScale1 = d3
    .scaleLinear()
    //.domain(d3.extent(state.data, d => d.Count))
    .domain([0.5, 5])
    .range([margin1.left, width1 - margin1.right]);

  yScale1 = d3
    .scaleBand()
    .domain(state1.data1.map(d => d.Type))
    .range([margin1.top + 20, height1 - margin1.bottom])
    .paddingInner(60);

  //console.log(yScale.domain());

  // create an svg element in our main `d3-container` element
  svg1 = d3
    .select('#chart')
    .append('svg')
    .attr('width', width1)
    .attr('height', height1);
  svg1
    .selectAll('text')
    .data(state1.data1, d => d.Year)
    .join('text')
    .attr('class', 'label11')
    .attr('y', d => yScale(d.Type))
    .attr('x', d => xScale(d.Count))
    .text(d => d.Year)
    .attr('font-size', 16)
    .attr('dy', '0.5em')
    .attr('dx', '-1.3em');
  // AXES

  let yAxis1 = d3.axisRight(yScale1).tickSize(0);

  //add the yAxis
  svg1
    .append('g')
    .attr('class', 'axis y-axis1')
    .attr('transform', `translate(${margin1.left},-70)`)
    .call(yAxis1)

    .append('text')
    .attr('class', 'axis-label1');

  draw();
  // calls the draw function
}

function draw() {
  // let title = d3
  //   .select('#chart-title')
  //   .data(state.data, d => d.Type)
  //   .attr('class', d => `dot-${d.Type}`)

  //   .text(d => d.Type);

  div1 = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  let circles = svg1
    .selectAll('.dot')
    .data(state1.data1, d => d.Name) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append('circle')
          //.attr('class', 'dot')
          .attr('class', d => `dot-${d.Step}`) // Note: this is important so we can identify it in future updates
          .attr('stroke', 'black')
          .attr('opacity', 0.5)
          .attr('r', radius1)
          .attr('cx', d => xScale(d.Count))
          .attr('cy', d => yScale(d.Type))
          .attr('fill', '#e0d0ba')
          .append('text')
          .attr('class', d => `name-${d.Name}`) //, console.log(`.name-${d.Name}`)) // Note: this is important so we can identify it in future updates
          .text(d => d.Name)
          .attr('opacity', 1)
          .attr('x', d => xScale(d.Count))
          .attr('y', d => yScale(d.Type))
          .attr('fill', 'black')

          .on('mouseover', (event, d) => {
            div1.transition().duration(50).style('opacity', 1);

            div1
              .html('<strong>' + d.Name + '</strong>' + ' <br>' + d.Year)
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');
          })
          .on('mouseout', () => {
            div1
              .transition() //
              .duration(100)
              .style('opacity', 0);
          }),

      update => update,
      exit => exit
    );
}

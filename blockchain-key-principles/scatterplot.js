// VERTICAL TIMELINE

// CONST and GLOBALS

let width = 400; //window.innerWidth * 0.3,
height = 700; //window.innerHeight * 0.7,
margin = { top: 60, bottom: 100, left: 80, right: 100 };

let formatYear = d3.timeFormat('%Y');
/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;
let div;
let text;
//let title;

// Aplication state
let state = {
  data: [],
};

// Load data
Promise.all([
  d3
    .csv('./../data/draft5.csv', d => ({
      Year: new Date(d.Year, 0, 1),
      Name: d.Name,
      Step: d.Step,
      Count: +d.Count,
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
  yScale = d3
    .scaleTime()
    //.domain(1900, 2010)
    .domain(d3.extent(state.data, d => d.Year))
    .range([margin.top + 20, height - margin.bottom]);

  xScale = d3
    .scaleBand()
    .domain(state.data.map(d => d.Type))
    .range([margin.left, width - margin.right])
    .paddingInner(5);

  // create an svg element in our main `d3-container` element
  // svg = d3
  //   .select('#sticky-chart')
  //   .append('svg')
  //   .attr('width', width)
  //   .attr('height', height);
  svg = d3
    .select('#sticky-chart')
    .append('svg')
    .attr('viewBox', '0 0 400 700')
    .append('g')
    .attr('transform', 'translate(0,0)');

  text = svg
    .selectAll('text')
    .data(state.data, d => d.Year)
    .join('text')
    .attr('class', 'label')
    .attr('x', d => xScale(d.Type) + 15)
    .attr('y', d => {
      if (d.Name === 'Ancient Times') return '1em';
      else return yScale(d.Year);
    })
    .text(d => {
      if (d.Name === 'Ancient Times') return '';
      else return formatYear(d.Year);
    })
    .attr('font-size', 12);
  // .attr('dy', '2em')
  // .attr('dx', d => yScale(d.Year));

  // AXES
  let xAxis = d3.axisBottom(xScale).ticks(0);
  let yAxis = d3.axisRight(yScale).tickSize(0);

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(-10 ,${margin.top + 30} )`)
    .call(xAxis)
    .attr('writing-mode', 'vertical-rl');

  //add the yAxis
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .attr('transform', `translate(${width - margin.left + 20},0)`)
    .call(yAxis);

  function xGridLines() {
    return d3.axisBottom().scale(xScale).ticks(4);
  }

  svg
    .append('g')
    .attr('class', 'grid-lines')
    .call(
      xGridLines()
        .tickSize(height - margin.top, 0, 0)

        .tickFormat('')
    );

  draw();
  // calls the draw function
}

function draw() {
  div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  let circle = svg
    .selectAll('.dot')
    .data(state.data, d => d.Name)
    // use `d.Name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append('circle')
          .attr('class', d => `dot-${d.Step}`) // Note: this is important so we can identify it in future updates
          .attr('stroke', 'black')
          .attr('opacity', d => {
            if (d.Type === 'Digital Money') return 0.4;
            else return 1;
          })
          .attr('cy', d => {
            if (d.Name === 'Ancient Times') return '1em';
            else return yScale(d.Year);
          })
          .attr('cx', d => xScale(d.Type))
          .attr('r', 15)
          .attr('fill', d => {
            if (d.Type === 'Cryptography') return 'darkgrey';
            else if (d.Type === 'Open-source software') return '#c0ac92';
            else if (d.Type === 'Decentralization') return 'gold';
            else return '#f1e8dc';
          })
          .on('mouseover', (event, d) => {
            //d3.select(this).attr('stroke-width', 3);
            //console.log(this);
            // tooltip
            div.transition().duration(50).style('opacity', 1);

            div
              .html(
                '<strong>' +
                  d.Type +
                  '</strong>:' +
                  '<br>' +
                  d.Name +
                  ' <br>' +
                  formatYear(d.Year)
              )
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');
          })
          .on('mouseout', () => {
            div
              .transition() //
              .duration(100)
              .style('opacity', 0);
          })

          .on('click', function (event, d) {
            // changing stroke-width of the circle that is being clicked
            d3.select(this).attr('style', 'stroke-width: 3px');

            // getting to the atricle of the clicked circle
            d3.select(`#id${d.Step}`).node().scrollIntoView({
              block: 'start',
              behavior: 'smooth',
              inline: 'start',
            });
          }),
      update => update,
      exit => exit
    );
}

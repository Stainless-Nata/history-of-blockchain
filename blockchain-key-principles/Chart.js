class Chart {
  // only runs once for each instance
  constructor(state, setGlobalState) {
    this.margin = {
      top: 0,
      right: 0,
      bottom: 40,
      left: 160,
    };
    this.width = window.innerWidth * 0.7;
    this.height = window.innerHeight * 0.5;

    this.svg = d3
      .select('#d3-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    //   .attr('viewBox', '0 0 600 200')
    //   .append('g')
    //   .attr('transform', 'translate(0,0)');
  }
  // calling every time state updates
  draw(state, setGlobalState) {
    // Title of Chart that will change - category
    let title = d3
      .select('#category-title')
      .text('Encryption')
      .style('opacity', '0');
    // creating scales and axis

    // SCALES
    this.xScale = d3
      .scaleLinear()
      //.domain(d3.extent(state.data, d => d.Count))
      .domain([0.5, 5])
      .range([this.margin.left, this.width - this.margin.right]);

    this.yScale = d3
      .scaleBand()
      .domain(state.data.map(d => d.Type))
      .range([this.margin.top + 50, this.height - this.margin.bottom])
      .paddingInner(10);

    console.log(this.yScale.domain());

    // AXES

    // let xAxis = d3.axisBottom(xScale).tickSize(0);
    let yAxis = d3.axisLeft(this.yScale).tickSize(0);

    this.svg
      .append('g')
      .attr('class', 'axis y-axis')
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(yAxis)
      .append('text')
      .attr('class', 'axis-label');
    // creating a chart
    this.svg
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
            .attr('r', 30)
            .attr('cx', d => this.xScale(d.Count))
            .attr('cy', d => this.yScale(d.Type))
            .attr('fill', '#e0d0ba')
            // .append('text')
            // .attr('class', 'text')
            // .attr('text', d => d.Name)
            // .attr('x', d => d.Count)
            // .attr('y', d => d.Type)

            .on('mouseover', (event, d) => {
              this.div.transition().duration(50).style('opacity', 1);

              this.div
                .html(d.Name)
                .style('left', event.pageX + 10 + 'px')
                .style('top', event.pageY - 28 + 'px');
            })
            .on('mouseout', () => {
              this.div.transition().duration(100).style('opacity', 0);
            }),
        update => update,
        exit => exit
      );
  }
}

// SET UP SCROLLAMA
let scroller = scrollama();
let step = d3.selectAll('.step');
scroller
  .setup({
    step: '.step',
    debug: false,
    offset: 0.8,
  })
  .onStepEnter(handleStepEnter);

// SCROLLAMA STEP HANDLER
function handleStepEnter(response) {
  step.classed('is-active');

  // STEP 1 DOWN
  if (
    step.classed('is-active', true) &&
    response.index === 0 &&
    response.direction === 'down'
  ) {
    // Add title of the category
    let title = d3
      .select('#category-title')
      .text('Encryption')
      .style('opacity', '1')
      .transition(d3.easeElastic)
      .duration(100);

    // Make first circle larger
    this.svg
      .selectAll('.dot')
      .data(state.data, d => d.Name == ['Ancient History'])
      .attr('radius', 30)
      .transition(d3.easeElastic)
      .attr('radius', 60)
      .style('opacity', 1);
  }
}
export { Chart };

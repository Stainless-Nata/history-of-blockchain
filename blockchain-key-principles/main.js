// youtube video: https://www.youtube.com/watch?v=d7wTA9F-l8c
// adopted code: https://github.com/jsoma/simplified-scrollama-scrollytelling/

let main = document.querySelector('main');
let scrolly = main.querySelector('#scrolly');
let sticky = scrolly.querySelector('.sticky-chart');
let article = scrolly.querySelector('article');
let steps = article.querySelectorAll('.step');
//let name = article.querySelector('.name');

// initialize the scrollama
let scroller = scrollama();

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }
  let el = response.element;
  //console.log('element', el);
  //console.log('response', response);
  // remove is-active from all steps
  // then add is-active to this step
  steps.forEach(step => step.classList.remove('is-active'));
  el.classList.add('is-active');

  // update graphic based on step
  let change = d3
    .selectAll('circle')
    .transition(d3.easeElastic)
    .duration(200)
    .attr('r', 15)
    .attr('fill', d => {
      if (d.Type === 'Cryptography') return 'darkgrey';
      else if (d.Type === 'Open-source software') return '#c0ac92';
      else if (d.Type === 'Decentralization') return 'gold';
      else return '#f1e8dc';
    })
    .attr('stroke-width', 1)
    .attr('opacity', d => {
      if (d.Type === 'Digital Money') return 0.4;
      else return 1;
    });

  d3.select(`.dot-${el.dataset.step}`)
    .transition(d3.easeElastic)
    .duration(600)
    .attr('fill', 'black')
    .attr('stroke-width', 3)
    .attr('stroke-color', 'black');
  // .style('opacity', 1);
  d3.select(`.name-${el.dataset.name}`)
    // .transition(d3.easeElastic)
    // .duration(600)
    .append('text', `.name-${el.dataset.name}`)
    .style('opacity', 1);

  //console.log('change', change);
  //console.log('string', `.name-${el.dataset.name}`);
  //console.log('string', `.dot-${el.dataset.step}`);
  //console.log('name:', el.dataset.name);
  //console.log('step:', el.dataset.step);

  //sticky.querySelector('p').innerText = el.dataset.step;
  sticky.querySelector('p').innerText = el.dataset.name;
  //console.log('el.dataset', el.dataset);
}

function init() {
  scroller
    .setup({
      step: '#scrolly article .step',
      offset: 0.5,
      debug: false, //if true - we can see the trigger on the webpage
    })
    .onStepEnter(handleStepEnter);

  // setup resize event
  window.addEventListener('resize', scroller.resize);
}
// added button Read more
// https://www.w3schools.com/howto/howto_js_read_more.asp

function readMore() {
  var dots = document.getElementById('dots');
  var moreText = document.getElementById('more');
  var btnText = document.getElementById('myBtn');

  if (dots.style.display === 'none') {
    dots.style.display = 'inline';
    btnText.innerHTML = 'Read more about DES';
    moreText.style.display = 'none';
  } else {
    dots.style.display = 'none';
    btnText.innerHTML = 'Read less';
    moreText.style.display = 'inline';
  }
}
init();

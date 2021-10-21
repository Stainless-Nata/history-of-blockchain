// youtube video: https://www.youtube.com/watch?v=d7wTA9F-l8c
// adopted code: https://github.com/jsoma/simplified-scrollama-scrollytelling/

let main = document.querySelector('main');
let scrolly = main.querySelector('#scrolly');
let sticky = scrolly.querySelector('.sticky-thing');
let article = scrolly.querySelector('article');
let steps = article.querySelectorAll('.step');

// initialize the scrollama
let scroller = scrollama();

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }
  let el = response.element;

  // remove is-active from all steps
  // then add is-active to this step
  steps.forEach(step => step.classList.remove('is-active'));
  el.classList.add('is-active');

  // update graphic based on step
  sticky.querySelector('p').innerText = el.dataset.step;
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

// kick things off
init();

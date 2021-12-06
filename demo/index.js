// import components
import { Chart } from './Chart.js';

let chart;

let state = {
  data: [],
};

d3.csv('../data/draft6.csv', d3.autoType).then(data => {
  console.log('data', data);
  state.data = data;

  init();
});

function init() {
  chart = new Chart(state, setGlobalState);

  draw();
}

function draw() {
  chart.draw(state, setGlobalState);
}

function setGlobalState(nextState) {
  state = { ...state, ...nextState };
  // takes state, creates a new object and reassignes it to what was previously in state and bringing in new property that we are passing in
  console.log('new state', state);
  draw();
}

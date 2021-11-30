import generateChart from './chart.js';

const chart = document.querySelector('#myChart');
const query = 'select * from employee';
const label = 'employee points';
const xAxis = 'completename';
const yAxis = 'currentpoints';
const type = 'bar';
generateChart({ chart, query, label, xAxis, yAxis, type });

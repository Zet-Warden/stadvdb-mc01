import generateChart from './chart.js';

const chart = document.querySelector('#myChart');
const chart2 = document.querySelector('#myChart2');
const chart3 = document.querySelector('#myChart3');
const chart4 = document.querySelector('#myChart4');
const chart5 = document.querySelector('#myChart5');

const query = 'select * from employee where currentpoints > 1000';
const label = 'employee points';
const xAxis = 'completename';
const yAxis = 'currentpoints';
const type = 'bar';

generateChart({ chart, query, label, xAxis, yAxis, type });
generateChart({ chart: chart2, query, label, xAxis, yAxis, type: 'line' });
generateChart({ chart: chart3, query, label, xAxis, yAxis, type: 'bar' });
generateChart({ chart: chart4, query, label, xAxis, yAxis, type: 'bar' });
generateChart({ chart: chart5, query, label, xAxis, yAxis, type: 'bar' });

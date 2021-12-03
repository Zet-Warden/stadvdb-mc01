/* import generateChart from './chart.js';

const chart = document.querySelector('#myChart');
const chart2 = document.querySelector('#myChart2');
const chart3 = document.querySelector('#myChart3');
const chart4 = document.querySelector('#myChart4');
const chart5 = document.querySelector('#myChart5');

const query = ` SELECT fact_table.year, directors.last_name, directors.first_name, fact_table.genre, AVG(fact_table.movie_rank) AS average_rating
                FROM fact_table
                JOIN directors on fact_table.director_id = directors.director_id
                GROUP BY directors.director_id, genre, year
                ORDER BY average_rating DESC
                LIMIT 10;`;

const label = 'employee points';
const xAxis = 'last_name';
const yAxis = 'average_rating';
const type = 'bar';

generateChart({ chart, query, label, xAxis, yAxis, type });
generateChart({ chart: chart2, query, label, xAxis, yAxis, type: 'line' });
generateChart({ chart: chart3, query, label, xAxis, yAxis, type: 'bar' });
generateChart({ chart: chart4, query, label, xAxis, yAxis, type: 'bar' });
generateChart({ chart: chart5, query, label, xAxis, yAxis, type: 'bar' });
 */

import generateChart from './chart.js';

generateChart({ chartId: myChart });
generateChart({ chartId: myChart2 });
generateChart({ chartId: myChart3 });
generateChart({ chartId: myChart4 });
generateChart({ chartId: myChart5 });

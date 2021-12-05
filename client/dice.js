import generateChart from './chart.js';
import getData from './getData.js';

//displays the chart from the queried data
async function displayChart(whereCondition = '') {
    const query = ` SELECT genre, avg(movie_rank) as rating, year
                    FROM fact_table
                    GROUP BY genre, year
                    ORDER BY genre, year;`;

    const data = await getData(query);

    const genreMap = {};
    data.forEach((elem) => {
        if (genreMap[elem.genre] == null) {
            genreMap[elem.genre] = {
                name: elem.genre,
                data: Array(2004 - 1892 + 1).fill(null),
            };
        } else {
            genreMap[elem.genre].data[elem.year - 1892] = elem.rating;
        }
    });

    const seriesData = Object.keys(genreMap).map((key) => genreMap[key]);

    generateChart({
        chartId: myChart4,
        seriesData: seriesData,
        type: 'line',
        title: 'Average Rating of Different Genres Throughout the Years',
        subtitle: 'Slice',
        pointStart: 1892,
        zoomType: 'x',
        xTickInterval: 1,
        xAllowDecimals: false,
    });
}

displayChart();

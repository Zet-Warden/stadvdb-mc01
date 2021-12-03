async function generateChart({ chartId }) {
    const query = ` SELECT d.first_name as first_name, d.last_name as last_name, d.director_id, ROUND(avg(ft.movie_rank),5) as rating
                    FROM fact_table ft JOIN directors d ON ft.director_id = d.director_id
                    GROUP BY d.director_id, d.last_name, d.first_name
                    ORDER BY rating DESC, d.director_id DESC
                    LIMIT 10;`;

    const queryParams = new URLSearchParams();
    queryParams.set('query', query);

    console.log('hello');
    const res = await fetch(`/api?${queryParams}`);
    const data = await res.json();

    const chart = Highcharts.chart(chartId, {
        chart: {
            type: 'bar',
        },
        title: {
            text: 'Fruit Consumption',
        },
        xAxis: {
            categories: data.map((e) => e.last_name),
        },
        series: [
            {
                name: 'ranking',
                data: data.map((e) => e.rating),
            },
        ],
        credits: {
            enabled: false,
        },
    });
}

export default generateChart;

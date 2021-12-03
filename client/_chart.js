async function generateChart({
    chart,
    query,
    type = 'bar',
    label,
    backgroundColor = ['rgba(54, 162, 235, 0.2)'],
    borderColor = ['rgba(54, 162, 235, 0.2)'],
    xAxis,
    yAxis,
}) {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);

    const res = await fetch(`/api?${queryParams}`);
    const data = await res.json();
    //console.log(data);

    const xLabels = data.reduce(
        (acc, v) => (acc.includes(v[xAxis]) ? acc : acc.concat(v[yAxis])),
        []
    );
    //console.log(xLabels);

    const ctx = chart.getContext('2d');
    new Chart(ctx, {
        type: type,
        data: {
            datasets: [
                {
                    label: label,
                    data: data.map((o) => {
                        //onsole.log(xLabels.indexOf(o.x));
                        return {
                            x: xLabels.indexOf(o[xAxis]),
                            y: o[yAxis],
                        };
                    }),
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                    borderWidth: 3,
                },
            ],
        },
        options: {
            responsive: true,
            legend: false,
            scales: {
                xAxes: {
                    offset: true,
                    ticks: {
                        stepSize: 1,
                        callback: (v) => {
                            console.log(xLabels[v]);
                            return xLabels[v];
                        },
                    },
                },
                y: {
                    beginAtZero: true,
                },
            },
            parsing: {
                xAxisKey: xAxis,
                yAxisKey: yAxis,
            },
        },
    });
}

export default generateChart;

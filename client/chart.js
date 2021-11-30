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

    const ctx = chart.getContext('2d');
    new Chart(ctx, {
        type: type,
        data: {
            datasets: [
                {
                    label: label,
                    data: data,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {},
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

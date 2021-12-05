async function generateChart({
    chartId,
    seriesName = 'My Series',
    seriesData,
    categories,
    yMax = undefined,
    xMax = undefined,
    xTickInterval = undefined,
    title = 'My Chart',
    subtitle = 'My Subtitle',
    type = 'bar',
    stacking = undefined,
    tooltipFormatter,
    pointStart = 0,
    zoomType = undefined,
    xAllowDecimals,
}) {
    //console.log(seriesData);
    const chart = Highcharts.chart(chartId, {
        chart: {
            type: type,
            zoomType: zoomType,
        },
        title: {
            text: title,
            align: 'left',
        },
        subtitle: {
            text: subtitle,
            align: 'left',
        },
        tooltip: {
            formatter: tooltipFormatter,
        },
        xAxis: {
            categories: categories,
            max: xMax,
            allowDecimals: xAllowDecimals,
        },
        yAxis: {
            max: yMax,
            tickInterval: xTickInterval,
            stackLabels: {
                enabled: true,
            },
        },
        plotOptions: {
            column: {
                stacking: stacking,
                dataLabels: {
                    enabled: true,
                },
            },
            row: {
                colorByPoint: true,
            },
            series: {
                pointStart: pointStart,
            },
        },
        series: seriesData,
        credits: {
            enabled: false,
        },
    });
}

export default generateChart;

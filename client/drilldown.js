import generateChart from './chart.js';
import getData from './getData.js';

const topCheckboxes = [...document.querySelectorAll('.drilldown-cb')];
const topLabels = [...document.querySelectorAll('.drilldown-label')];
let cachedChartData; //caches the chart data

topCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', rerenderChart);
});

function rerenderChart() {
    const deletedIndices = [];
    let directorNames = topCheckboxes.map((e) => e.value);

    topCheckboxes.forEach((checkbox, i) => {
        if (!checkbox.checked) deletedIndices.push(i);
    });

    directorNames = directorNames.filter(
        (name, i) => !deletedIndices.includes(i)
    );

    const seriesData = cachedChartData.map((dataObj) => {
        const dataArr = dataObj.data.filter(
            (numMovies, i) => !deletedIndices.includes(i)
        );

        return {
            name: dataObj.name,
            data: dataArr,
        };
    });

    generateChart({
        chartId: myChart3,
        categories: directorNames,
        seriesData: seriesData,
        type: 'column',
        title: 'Most Diverse Directors Based on Genres of Movies Made',
        subtitle: 'Drill-Down',
    });
}

//displays the chart from the queried data
async function displayChart(whereCondition = '') {
    const query = ` select ft.director_id, d.first_name, d.last_name, count(distinct ft.movie_id) as num_movies, ft.genre
                    from fact_table ft
                    join (
                        select ft.director_id as director_id, count(distinct ft.genre) as num_movies
                        from fact_table ft
                        group by ft.director_id
                        order by num_movies desc
                        limit 10	
                    ) subq on subq.director_id = ft.director_id
                    join directors d on ft.director_id = d.director_id
                    group by ft.director_id, ft.genre
                    order by ft.director_id desc, num_movies desc;`;

    const data = await getData(query);

    const categoriesArr = data.map(
        (elem) => `${elem.first_name} ${elem.last_name}`
    );

    const categories = [...new Set(categoriesArr)];

    //update check boxes
    categories.forEach((category, i) => {
        topLabels[i].innerText = category;
        topCheckboxes[i].value = category;
        topCheckboxes[i].checked = true;
    });

    let genreMap = {};
    data.forEach((elem) => {
        if (genreMap[elem.genre] == null) {
            genreMap[elem.genre] = {
                name: elem.genre,
                data: Array(10).fill(0),
            };
        }
        const directorName = `${elem.first_name} ${elem.last_name}`;
        const directorIndex = categories.indexOf(directorName);
        const directorData = data.filter(
            (directorDatum) =>
                `${directorDatum.first_name} ${directorDatum.last_name}` ==
                directorName
        );
        const directorGenres = directorData.map((data) => data.genre);

        if (directorGenres.includes(elem.genre)) {
            genreMap[elem.genre].data[directorIndex] = elem.num_movies;
        }
    });

    const seriesData = Object.keys(genreMap).map((key) => genreMap[key]);
    cachedChartData = seriesData; //cache the data

    generateChart({
        chartId: myChart3,
        query: query,
        categories: categories,
        seriesData: seriesData,
        type: 'column',
        title: 'Most Diverse Directors Based on Genres of Movies Made',
        subtitle: 'Drill-Down',
    });
}

displayChart();

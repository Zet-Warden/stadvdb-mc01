import generateChart from './chart.js';
import getData from './getData.js';

const query = ` SELECT d.first_name, d.last_name,
                SUM(ft.genre = 'Action') AS Action,
                SUM(ft.genre = 'Adult') AS Adult,
                SUM(ft.genre = 'Adventure') AS Adventure,
                SUM(ft.genre = 'Animation') AS Animation,
                SUM(ft.genre = 'Comedy') AS Comedy,
                SUM(ft.genre = 'Crime') AS Crime,
                SUM(ft.genre = 'Documentary') AS Documentary,
                SUM(ft.genre = 'Drama') AS Drama,
                SUM(ft.genre = 'Family') AS Family,
                SUM(ft.genre = 'Fantasy') AS Fantasy,
                SUM(ft.genre = 'Horror') AS Horror,
                SUM(ft.genre = 'Music') AS Music,
                SUM(ft.genre = 'Musical') AS Musical,
                SUM(ft.genre = 'Mystery') AS Mystery,
                SUM(ft.genre = 'Romance') AS Romance,
                SUM(ft.genre = 'Sci-Fi') AS 'Sci-Fi',
                SUM(ft.genre = 'Short') AS Short,
                SUM(ft.genre = 'Thriller') AS Thriller,
                SUM(ft.genre = 'War') AS War,
                SUM(ft.genre = 'Western') AS Western
                FROM fact_table ft JOIN directors d ON ft.director_id = d.director_id
                GROUP BY d.director_id, ft.movie_id
                LIMIT 10`;

const data = await getData(query);
const categories = data.map((elem) => `${elem.first_name} ${elem.last_name}`);

let genreInfo = {};
data.forEach((elem, i) => {
    Object.keys(elem).forEach((key) => {
        if (key == 'last_name' || key == 'first_name') return;
        if (genreInfo[key] == undefined) {
            genreInfo[key] = {
                name: key,
                data: [Number(elem[key])],
            };
        } else {
            genreInfo[key].data.push(Number(elem[key]));
        }
    });
});

const seriesData = Object.keys(genreInfo).map(
    (property) => genreInfo[property]
);

console.log(seriesData);
generateChart({
    chartId: myChart2,
    query: query,
    categories: categories,
    seriesData: [
        { type: 'treemap', layoutAlgorithm: 'strip', data: seriesData },
    ],
    type: 'column',
    title: 'Breakdown of Number of Movies Made per Genre by Directors',
});

import generateChart from './chart.js';
import getData from './getData.js';

const genreCheckboxes = [...document.querySelectorAll('.pivot-cb')];
const allGenreCheckbox = document.querySelector('#pivot-all-genre');
const submitBtn = document.querySelector('#pivot-submit');

const minCounter = document.querySelector('#pivot-min-counter');
const minSlider = document.querySelector('#pivot-slider');

let canQuery = true;

function queryTimeOut() {
    //canQuery = false;
    setTimeout(() => {
        canQuery = true;
    }, 2000);
}

function checkAllGenreBox() {
    genreCheckboxes.forEach((cb) => {
        cb.checked = true;
    });
}

allGenreCheckbox.addEventListener('change', () => {
    if (allGenreCheckbox.checked) {
        checkAllGenreBox();
        const whereCondition = generateGenreCondition();
        if (canQuery) displayChart(whereCondition, minSlider.value);
    }
});

genreCheckboxes.forEach((cb) => {
    cb.checked = true;
    cb.addEventListener('change', () => {
        const whereCondition = generateGenreCondition();
        if (canQuery) displayChart(whereCondition, minSlider.value);
        if (!cb.checked) allGenreCheckbox.checked = false;
    });
});

minSlider.addEventListener('input', () => {
    minCounter.textContent = minSlider.value;
});

minSlider.addEventListener('change', () => {
    const whereCondition = generateGenreCondition();
    if (canQuery) displayChart(whereCondition, minSlider.value);
});

function generateGenreCondition() {
    const checkedCb = allGenreCheckbox.checked
        ? [] //empty array to return an empty where condition at the end
        : genreCheckboxes.filter((element) => element.checked);

    const whereSet = checkedCb.map((element) => element.value);
    const whereCondition =
        whereSet.length > 0 ? `WHERE ft.genre IN (${whereSet.join(',')})` : '';
    return whereCondition;
}

// submitBtn.addEventListener('click', () => {
//     const genreCondition = generateGenreCondition();
//     displayChart(genreCondition, minSlider.value);
// });

async function displayChart(whereCondition = '', minNumMovies = 10) {
    queryTimeOut();
    const query = ` SELECT d.first_name, d.last_name, num_movies
                    FROM (
                        SELECT count(distinct ft.movie_id) as num_movies, ft.director_id
                        FROM fact_table ft ${
                            whereCondition.length <= 0
                                ? ''
                                : 'USE INDEX (idx_fact_table_genre_year)'
                        }
                        ${whereCondition}
                        GROUP BY ft.director_id
                        having num_movies >= ${minNumMovies}
                        order by num_movies desc
                        LIMIT 50
                        ) subq
                    JOIN directors d on d.director_id = subq.director_id`;

    const data = await getData(query);
    const seriesData = data.map((elem, i) => {
        let displayName = '';
        //if (i >= 0 && i <= 9) {
        displayName = `${elem.first_name} ${elem.last_name}`;
        //}
        return {
            name: displayName,
            value: elem.num_movies,
            _name: `${elem.first_name} ${elem.last_name}`,
            color: '#CAE1FF',
            borderWidth: 2,
            borderColor: '#fff',
        };
    });

    generateChart({
        chartId: myChart2,
        query: query,
        seriesData: [
            {
                type: 'treemap',
                layoutAlgorithm: 'strip',
                data: seriesData,
            },
        ],
        type: 'column',
        title: 'Most Experienced Directors Based on Number of Movies Directed',
        subtitle: 'Pivot',
        tooltipFormatter: function () {
            return `${this.point._name}: ${this.point.value}`;
        },
    });
}

await displayChart();

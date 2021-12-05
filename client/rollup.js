import generateChart from './chart.js';
import getData from './getData.js';

const genreCheckboxes = [...document.querySelectorAll('.rollup-cb')];
const yearCheckboxes = [...document.querySelectorAll('.rollup-cb-year')];

const allGenreCheckbox = document.querySelector('#rollup-all-genre');
const allYearCheckbox = document.querySelector('#rollup-all-year');

const formGenre = document.querySelector('#rollup-form-genre');
const formYear = document.querySelector('#rollup-form-year');

const submitBtn = document.querySelector('#rollup-submit');

let canQuery = true;

function queryTimeOut() {
    canQuery = false;
    setTimeout(() => {
        canQuery = true;
    }, 2000);
}

function checkAllGenreBox() {
    genreCheckboxes.forEach((cb) => {
        cb.checked = true;
    });
}

function checkAllYearBox() {
    yearCheckboxes.forEach((cb) => {
        cb.checked = true;
    });
}

genreCheckboxes.forEach((cb) => {
    cb.checked = true;
    cb.addEventListener('change', () => {
        const whereCondition = generateWhereCondition();
        if (canQuery) displayChart(whereCondition);
        if (!cb.checked) allGenreCheckbox.checked = false;
    });
});

yearCheckboxes.forEach((cb) => {
    cb.checked = true;
    cb.addEventListener('change', () => {
        const whereCondition = generateWhereCondition();
        if (canQuery) displayChart(whereCondition);
        if (!cb.checked) allYearCheckbox.checked = false;
    });
});

allGenreCheckbox.addEventListener('change', () => {
    if (allGenreCheckbox.checked) {
        checkAllGenreBox();
        const whereCondition = generateWhereCondition();
        if (canQuery) displayChart(whereCondition);
    }
});

allYearCheckbox.addEventListener('change', () => {
    if (allYearCheckbox.checked) {
        checkAllYearBox();
        const whereCondition = generateWhereCondition();
        if (canQuery) displayChart(whereCondition);
    }
});

function generateWhereCondition() {
    const genreCondition = generateGenreCondition();
    const yearCondition = generateYearCondition();

    let conjunct =
        yearCondition.length > 0 && genreCondition.length > 0 ? 'AND (' : '';
    const end =
        yearCondition.length > 0 && genreCondition.length > 0 ? ')' : '';

    if (genreCondition.length <= 0 && yearCondition.length > 0) {
        conjunct = 'WHERE ';
    }
    return `${genreCondition} ${conjunct} ${yearCondition} ${end}`;
}

function generateGenreCondition() {
    const checkedCb = allGenreCheckbox.checked
        ? [] //empty array to return an empty where condition at the end
        : genreCheckboxes.filter((element) => element.checked);

    const whereSet = checkedCb.map((element) => element.value);
    const whereCondition =
        whereSet.length > 0 ? `WHERE ft.genre IN (${whereSet.join(',')})` : '';

    return whereCondition;
}

function generateYearCondition() {
    const checkedCb = allYearCheckbox.checked
        ? []
        : yearCheckboxes.filter((element) => element.checked);

    const yearConditions = checkedCb.map((element) => {
        const [startYear, endYear] = element.value.split('-');
        return `(ft.year >= ${startYear} AND ft.year <= ${endYear})`;
    });

    const whereCondition = yearConditions.join(' OR ');
    return whereCondition;
}

//displays the chart from the queried data
async function displayChart(whereCondition = '') {
    queryTimeOut();
    const query = ` SELECT d.first_name, d.last_name, subq.rating
                    FROM 
                    (
                        SELECT  ft.director_id, ROUND(avg(ft.movie_rank), 3) as rating
                        FROM fact_table ft ${
                            whereCondition.length <= 0
                                ? ''
                                : 'USE INDEX (idx_fact_table_genre_year)'
                        }
                        ${whereCondition}
                        GROUP BY ft.director_id
                        ORDER BY rating DESC, ft.director_id ASC
                        LIMIT 10
                    ) subq
                    JOIN directors d on d.director_id = subq.director_id`;

    const data = await getData(query);

    const categories = data.map(
        (elem) => `${elem.first_name} ${elem.last_name}`
    );
    const seriesData = data.map((elem) => elem.rating);

    generateChart({
        chartId: myChart,
        categories: categories,
        seriesData: [
            {
                colorByPoint: true,
                showInLegend: false,
                name: 'Avg. movie rating',
                data: [...seriesData],
            },
        ],
        yMax: 10,
        xTickInterval: 0.5,
        type: 'bar',
        title: 'Top Rated Directors Based on Average Rating',
        subtitle: 'Roll-Up and Dice',
    });
}

displayChart();

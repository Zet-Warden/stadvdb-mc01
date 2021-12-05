async function getData(query) {
    const queryParams = new URLSearchParams();
    queryParams.set('query', query);

    const res = await fetch(`/api?${queryParams}`);
    const data = await res.json();

    return data;
}

export default getData;

const API_BASE_URL = 'https://feed.entertainment.tv.theplatform.eu/f/jGxigC';

/**
     * Auto generated by VSCODE
    * @param {string} [tags]
    * @param {number} [year]
    * @param {string} [range]
*/
export const fetchSeries = async (tags?: string, year?: number, range?: string) => {
    let url = `${API_BASE_URL}/bb-all-pas?form=json&byProgramType=series`;

    // Add filters hvis de er sat ellers fetcher den bare default data
    if (tags) url += `&byTags=${tags}`;
    if (year) url += `&byYear=${year}`;
    if (range) url += `&range=${range}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
};

/**
     * Auto generated by VSCODE
     * @param {string} id
*/
export const fetchProgramById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/bb-all-pas/${id}?form=json`);
    const data = await response.json();

    return data;
};

/**
     * Auto generated by VSCODE
    * @param {string} [tags]
    * @param {number} [year]
    * @param {string} [range]
*/
export const fetchMovies = async (tags?: string, year?: number, range?: string) => {
    let url = `${API_BASE_URL}/bb-all-pas?form=json&byProgramType=movie`;

    // Add filters hvis de er sat ellers fetcher den bare default data
    if (tags) url += `&byTags=${tags}`;
    if (year) url += `&byYear=${year}`;
    if (range) url += `&range=${range}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
};

/**
     * Auto generated by VSCODE
    * @param {string} franchise
    * @param {string} [sort]
    * @param {string} [range]
*/
export const fetchProgramsByFranchise = async (franchise: string, sort?: string, range?: string) => {
    let url = `${API_BASE_URL}/bb-all-pas?form=json&byTags=franchise:${encodeURIComponent(franchise)}`;

    // Add filters hvis de er sat ellers fetcher den bare default data
    if (sort) url += `&sort=${sort}`;
    if (range) url += `&range=${range}`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
};

/**
     * Auto generated by VSCODE
    * @param {string} scopeId
*/
export const fetchProductByScopeId = async (scopeId: string) => {
    const response = await fetch(`https://feed.product.theplatform.eu/f/jGxigC/bb-da-products?form=json&fields=id,scopeIds,pricingPlan,scopes,title,productTags,offerStartDate,offerEndDate&byScopeIds=${encodeURIComponent(scopeId)}`);
    const data = await response.json();

    return data;
};

/**
     * Auto generated by VSCODE
    * @param {string} seriesId
*/
export const fetchSeasonsBySeriesId = async (seriesId: string) => {
    const response = await fetch(`${API_BASE_URL}/bb-all-seasons?form=json&lang=da&bySeriesId=${encodeURIComponent(seriesId)}`);
    const data = await response.json();

    return data;
};

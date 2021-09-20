import superagent from 'superagent';

const host = 'http://localhost:8080';
const root = host + '/api';

export default {
    getData(path, pageNum = 0, pageSize = 2) {
        return superagent
            .get(root + path)
            .query({size: pageSize})
            .query({page: pageNum})
            .set('Accept', 'application/hal+json')
            .then(response => {
                if (response.error) {
                    throw new Error(response.statusCode + ": " + response.statusText);
                }

                let body = response.body;
                if (body._embedded === undefined) {
                    throw new Error('No embedded content in response for ' + path);
                }

                return body;
            });
    }
}
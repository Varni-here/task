const getHeaderInfo = async function () {
    return {
        headers: {
            "content-type": "application/json",
        },
    };
};

const handleResponse = (response) => {
    return response;
};

export const get = async function (url, params = {}) {
    let header = await getHeaderInfo();
    try {
        let resp = await fetch(url + "?" + new URLSearchParams(params), {
            method: "GET",
            ...header,
        });
        let data = await resp.json();
        return handleResponse(data);
    } catch (err) {
        throw handleResponse(err);
    }
};

export const post = async function (url, params) {
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(params),
        });
        let data = await response.json();
        return handleResponse(data);
    } catch (err) {
        throw handleResponse(err);
    }
};

export const patch = async function (url, params) {
    try {
        let response = await fetch(url, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(params),
        });
        let data = await response.json();
        return handleResponse(data);
    } catch (err) {
        throw handleResponse(err);
    }
};

export const deleteApi = async function (url, params = {}) {
    try {
        let response = await fetch(url + "?" + new URLSearchParams(params), {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
            },
        });
        let data = await response.json();
        return handleResponse(data);
    } catch (err) {
        throw handleResponse(err);
    }
};

export const put = async function (url, params) {
    try {
        let response = await fetch(url, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(params),
        });
        let data = await response.json();
        return handleResponse(data);
    } catch (err) {
        throw handleResponse(err);
    }
};
import https from './interface'

// 封装get请求
function getRequest(url, data){
	return https({
		url,
		method: 'GET',
		data,
		token: url.startsWith('/open-api') ? false : true
	})
}

function postRequest(url, data){
	return https({
        url,
        method: 'POST',
        data,
		token: url.startsWith('/open-api') ? false : true,
    })
}

function putRequest(url, data){
	return https({
        url: url,
        method: 'PUT',
        data,
		token: url.startsWith('/open-api') ? false : true
    })
}

function deleteRequest(url, data){
	return https({
        url: url,
        method: 'DELETE',
        data,
		token: url.startsWith('/open-api') ? false : true
    })
}

module.exports = {
	getRequest: getRequest,
	postRequest: postRequest,
	putRequest: putRequest,
	deleteRequest: deleteRequest
}
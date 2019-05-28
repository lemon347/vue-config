import 'whatwg-fetch';
const CODE_SUCCESS = 200;
const METHODS = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
};
const request = (url, params, headers = {}, method = METHODS.POST, jsonType = true) => {
  var options = {
      headers: {
        'Content-Type': jsonType ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded'
      },
      method: method,
  };
  options.body = jsonType ? JSON.stringify(params) : JSON.stringify(params);
  return fetch(url, options).then(checkRespStatus);
};

const checkRespStatus = (respPromise) => {
  return respPromise.json().then(resp => {
    return new Promise((resolve, reject) => {
      if (resp && resp.code == CODE_SUCCESS) {
        console.log('111111111111');
        console.log(resp);
        console.log('222222222');
        resolve(resp);
      }else {
        reject(resp);
      }
    });
  });
};

export default{
    queryList: param => request('/company/query_company_list', param),
    addCompany: param => request('/company/add_company', param),
    updateCompany: param => request('/company/update_company', param),
    deleteCompany: param => request('/company/delete_company', param)
}

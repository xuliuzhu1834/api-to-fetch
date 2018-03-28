const urlParse = require('url-parse');
const sendRequst = require('request-promise');
const tough = require('tough-cookie');

module.exports = function (remote, username, password) {

  const MAX_LIMIT = 1000;

  const url = urlParse(remote, true);
  const BASEREMOTE = url.origin;
  const project_id = url.pathname.split('/').filter(d=> d && !isNaN(Number(d)))[0];

  const login = async () => {
    const loginOptions = {
      method: 'POST',
      uri: `${BASEREMOTE}/api/user/login`,
      body: {
        email: username || 'xuliuzhu@shein.com',
        password
      },
      json: true,
      transform: (body, response) => {
        return response;
      }
    };

    try {

      const res = await sendRequst(loginOptions);
      const {body, headers } = res;
      if (body.errcode === 0) {
        const Cookie = tough.Cookie;

        const cookiejar = sendRequst.jar();
        if (headers['set-cookie'] instanceof Array) {
          headers['set-cookie'].forEach(v => cookiejar.setCookie(Cookie.parse(v), BASEREMOTE));
        }
        else {
          cookiejar.setCookie(Cookie.parse(headers['set-cookie']), BASEREMOTE);
        }
        const getApiOption = {
          method: 'GET',
          uri: `${BASEREMOTE}/api/interface/list?page=1&limit=${MAX_LIMIT}&project_id=${project_id}`,
          jar: cookiejar,
          json: true,
        };
        const allApi = await sendRequst(getApiOption);
        if (allApi.errcode === 0) {
         return {list:allApi.data.list, jar:cookiejar};
        }
        return console.error(allApi.errmsg);
      }
      return console.error(body.errmsg);

    } catch (e) {
      console.error(e);
    }

  };
  return login();
};
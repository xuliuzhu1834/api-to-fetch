const configs = require('./config-yargs');
const urlParse = require('url-parse');
const sendRequst = require('request-promise');
const getApi = require('./get-api');


const {remote, username, password} = configs;


if (!remote || !username || !password) {
  return;
}
const url = urlParse(remote, true);
const BASEREMOTE = url.origin;

const apis = async () => {
  const data = await getApi(remote, username, password);
  if (data) {
    const { list, jar } = data;
    let allApiDetails = []; // 所有接口的详细信息
    for (let i=0; i<list.length; i++) {
      try {
        const detail = await sendRequst({
          method: 'GET',
          uri: `${BASEREMOTE}/api/interface/get?id=${list[i]['_id']}`,
          jar: jar,
          json: true,
        });
        if (detail.errcode === 0) {
          allApiDetails.push(detail.data);
        }
      } catch (e) {
        console.error(e);
      }

    }
    /**
     *  TODO 把每个接口信息组装成 fetch 代码且带接口描述
     *  TODO 参数由命令改为配置文件
     */
  }
};
module.exports = apis();
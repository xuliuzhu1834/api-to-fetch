const CONFIG_GROUP = "Config options:";
const BASIC_GROUP = "Basic options:";

const yargs = require('yargs').usage("api-to-fetch " + require("./package.json").version);

try {
  const localPack = require.resolve(path.join(process.cwd(), "node_modules", "api-to-fetch", "app.js"));
  if(__filename !== localPack) {
    return require(localPack);
  }
} catch(e) {}

// 定义参数及描述
const config = (yargs) => {
  yargs
    .help("help")
    .alias("help", "h")
    .version()
    .alias("version", "v")
    .options({
      "remote": {
        type: "string",
        describe: "api文档地址",
        group: CONFIG_GROUP,
        requiresArg: true
      },
      "username": {
        type: "string",
        describe: "api平台地址的用户名",
        group: CONFIG_GROUP,
        requiresArg: true
      },
      "password": {
        type: "string",
        describe: "api平台地址的密码",
        group: CONFIG_GROUP,
        requiresArg: true
      },
    }).strict()
};

config(yargs);

module.exports = yargs.parse(process.argv.slice(2), (err, argv, output) => {
  // arguments validation failed
  if(err && output) {
    console.error(output);
    process.exitCode = 1;
    return;
  }

  // help or version info
  if(output) {
    console.log(output);
    return;
  }

  if (!argv.remote || !argv.username || !argv.password) {
    console.error('缺少必要参数,请输入 api-to-fetch --h 查看具体信息');
    return;
  }

  return argv;
});



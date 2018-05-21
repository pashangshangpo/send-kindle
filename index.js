/**
 * @file 入口文件
 * @author pashangshangpo
 * @createTime 2018年5月21日 下午10:15
 */

const fs = require('fs')
const program = require('commander')
const nodemailer = require('nodemailer')

program
  .version('1.0.0')
  .option('-t, --to [to]', 'kindle邮箱地址, 如: xx@kindle.cn')
  .option('-f, --from [from]', '发送者邮箱账号密码, 如: zh@qq.com:mm')
  .parse(process.argv)

if (!program.to && !program.from) {
    
}
else {
    const packageObject = JSON.parse(fs.readFileSync('./package.json'))

    if (packageObject.kindleConfig) {
        if (program.to) {
            packageObject.kindleConfig.to = program.to
        }

        if (program.from) {
            packageObject.kindleConfig.from = program.from
        }
    }
    else {
        packageObject.kindleConfig = {
            to: program.to,
            from: program.from
        }
    }
    
    fs.writeFileSync('package.json', JSON.stringify(packageObject, null, '\t'))
}

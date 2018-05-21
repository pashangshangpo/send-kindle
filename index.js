/**
 * @file 入口文件
 * @author pashangshangpo
 * @createTime 2018年5月21日 下午10:15
 */

const fs = require('fs')
const program = require('commander')
const nodemailer = require('nodemailer')

const packageObject = JSON.parse(fs.readFileSync('./package.json'))

const send = ({ user, pass, to, paths} = config) => {

}

program
  .version('1.0.0')
  .option('-t, --to [to]', 'kindle邮箱地址, 如: xx@kindle.cn')
  .option('-f, --from [from]', '发送者邮箱账号密码, 如: zh@qq.com:mm')
  .parse(process.argv)

if (!program.to && !program.from) {
  if (!packageObject.kindleConfig) {
    console.error('请先配置邮箱信息, 如: send-kindle --to xx@kindle.cn --from zh@qq.com:mm')
  }
  else {
    const from = packageObject.kindleConfig.from.split(':')

    send({
      user: from[0],
      pass: from[1],
      to: packageObject.kindleConfig.to,
      paths: process.argv.slice(2)
    })
  }
}
else {
    if (packageObject.kindleConfig) {
        if (program.to) {
            packageObject.kindleConfig.to = program.to
        }

        if (program.from) {
            packageObject.kindleConfig.from = program.from
        }

        console.log('修改邮箱信息成功')
    }
    else {
        packageObject.kindleConfig = {
            to: program.to,
            from: program.from
        }

        console.log('邮箱信息, 设置成功')
    }
    
    fs.writeFileSync('package.json', JSON.stringify(packageObject, null, '\t'))
}

/**
 * @file 入口文件
 * @author pashangshangpo
 * @createTime 2018年5月21日 下午10:15
 */

const fs = require('fs')
const { resolve, basename, extname } = require('path')
const program = require('commander')
const nodemailer = require('nodemailer')

const packagePath = resolve(__dirname, 'package.json')
const packageObject = JSON.parse(fs.readFileSync(packagePath))

/**
 * .def: getAttachments => paths => Object
 *   paths: Array [Item] 路径列表
 *     Item: String 相对于当前控制台路径
 *   @return: Array [Item]
 *     Item: Object
 *       filename: String 文件名
 *       path: String 文件的绝对路径
 */
const getAttachments = paths => {
  const attachments = []

  const pushAttachment = paths => {
    paths.forEach(path => {
      if (fs.statSync(path).isDirectory()) {
        pushAttachment(fs.readdirSync(resolve('.', path)).map(p => resolve('.', path, p)))
      }
      else {
        attachments.push({
          filename: basename(path),
          path: resolve('.', path)
        })
      }
    })
  }

  pushAttachment(paths)

  return attachments
}

/**
 * .def: setConfig: config => undefined
 *   config: Object
 *     to: String 接收的邮箱地址
 *     from: String 发送邮箱地址和密码
 */
const setConfig = config => {
  if (packageObject.kindleConfig) {
    if (config.to) {
      packageObject.kindleConfig.to = config.to
    }

    if (config.from) {
      packageObject.kindleConfig.from = config.from
    }

    console.log('修改邮箱信息成功')
  }
  else {
    packageObject.kindleConfig = {
      to: config.to,
      from: config.from
    }

    console.log('邮箱信息, 设置成功')
  }

  fs.writeFileSync(packagePath, JSON.stringify(packageObject, null, '\t'))
}

/**
 * .def: send: config => undefined
 *   config: Object
 *     user: String 邮箱地址
 *     pass: String 邮箱密码
 *     to: String 接收的邮箱地址
 *     paths: Array [Item] 发送的附件列表
 *       Item: Object
 *         filename: String 文件名
 *         path: String 文件路径
 */
const send = ({ user, pass, to, paths } = config) => {
  const emailName = user.slice(user.lastIndexOf('@') + 1, user.lastIndexOf('.'))

  let transporter = nodemailer.createTransport({
    host: `smtp.${emailName}.com`,
    port: 25,
    secure: false,
    auth: {
      user: user,
      pass: pass
    }
  })

  let fileName = basename(paths[0])

  let mailOptions = {
    from: user,
    to: to,
    subject: fileName.slice(0, fileName.indexOf('.')),
    attachments: getAttachments(paths)
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }

    console.log('发送成功')
  })
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
  setConfig(program)
}

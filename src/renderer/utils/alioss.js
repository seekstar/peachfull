var OSS = require('ali-oss')
export function client() {
  var client = new OSS({
    region: 'oss-cn-shenzhen',
    accessKeyId: 'LTAI4FqsLxvxeGVYaAJmMHw2',
    accessKeySecret: '39dozEqWk42qIyiYlDlesrF4mjW85A',
    bucket: 'pingshanxyz'
  }) // 后端提供数据
  return client
}

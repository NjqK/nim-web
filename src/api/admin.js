import request from '@/utils/request'

const adminApi = {
  ServerInfo: '/admin/getServerInfo',
  ReleaseConnections: '/admin/releaseConnections',
  RecoverServer: '/admin/recoverServer'
}

export function getServerInfo (serverType) {
  return request({
    url: adminApi.ServerInfo,
    method: 'Get',
    params: { 'serverType': serverType }
  })
}

export function releaseConnections (appName, ip, port) {
  return request({
    url: adminApi.ReleaseConnections,
    method: 'POST',
    data: { 'appName': appName, 'ip': ip, 'port': port }
  })
}

export function recoverServer (appName, ip, port) {
  return request({
    url: adminApi.RecoverServer,
    method: 'POST',
    data: { 'appName': appName, 'ip': ip, 'port': port }
  })
}

import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  //console.log(sessionStorage.getItem("token"));
  return request('/merchant/current');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

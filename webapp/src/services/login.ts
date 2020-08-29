import request from '@/utils/request';

export interface LoginParamsType {
  userName: string;
  password: string;
  captcha: string;
}

export async function login(params: LoginParamsType) {
  let formData=new FormData();
  formData.set("loginName",params.userName);
  formData.set("passwd",params.password);
  formData.set("captcha",params.captcha);
  return request('/merchant/login', {
    method: 'POST',
    data: formData,
  });
}

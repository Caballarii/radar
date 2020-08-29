import { Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { Link, connect, Dispatch, FormattedMessage } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';
import { v4 as uuid } from 'uuid';

import styles from './style.less';

const { Tab, UserName, Password, Captcha, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { success, msg } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  const [rd,setRd]=useState(uuid());

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    setRd(uuid());
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };
  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab={<FormattedMessage id='menu.login' />}>
          {!success && msg && !submitting && (
            <LoginMessage content={msg} />
          )}

          <UserName
            name="userName"
            placeholder="username"
            rules={[
              {
                required: true,
                message: 'Please input username!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="password"
            rules={[
              {
                required: true,
                message: 'Please input password!',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="captcha"
            uuid={rd}
            setuuid={()=>setRd(uuid())}
            rules={[
              {
                required: true,
                message: 'Please input captcha!'
              }
            ]}
          />
        </Tab>
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            Forget password
          </a>
        </div>
        <Submit loading={submitting}>登录</Submit>
        <div className={styles.other}>
          <Link className={styles.register} to="/user/register">
            注册账户
          </Link>
        </div>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);

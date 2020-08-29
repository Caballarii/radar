import { Button, Col, Input, Row, Form, message } from 'antd';
import React, { useState, useCallback, useEffect, SetStateAction, Dispatch } from 'react';
import omit from 'omit.js';
import { FormItemProps } from 'antd/es/form/FormItem';

import ItemMap from './map';
import LoginContext, { LoginContextProps } from './LoginContext';
import styles from './index.less';

export type WrappedLoginItemProps = LoginItemProps;
export type LoginItemKeyType = keyof typeof ItemMap;
export interface LoginItemType {
  UserName: React.FC<WrappedLoginItemProps>;
  Password: React.FC<WrappedLoginItemProps>;
  Captcha: React.FC<WrappedLoginItemProps>;
}

export interface LoginItemProps extends Partial<FormItemProps> {
  name?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  buttonText?: React.ReactNode;
  countDown?: number;
  getCaptchaButtonText?: string;
  getCaptchaSecondText?: string;
  updateActive?: LoginContextProps['updateActive'];
  type?: string;
  defaultValue?: string;
  customProps?: { [key: string]: unknown };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tabUtil?: LoginContextProps['tabUtil'];

  uuid?: string,
  setuuid?: ()=>void
}

const FormItem = Form.Item;

const getFormItemOptions = ({
  onChange,
  defaultValue,
  customProps = {},
  rules,
  uuid,
  setuuid
}: LoginItemProps) => {
  const options: {
    rules?: LoginItemProps['rules'];
    onChange?: LoginItemProps['onChange'];
    initialValue?: LoginItemProps['defaultValue'];
  } = {
    rules: rules || (customProps.rules as LoginItemProps['rules']),
  };
  if (onChange) {
    options.onChange = onChange;
  }
  if (defaultValue) {
    options.initialValue = defaultValue;
  }
  return options;
};

const LoginItem: React.FC<LoginItemProps> = (props) => {
  
  const {
    onChange,
    customProps,
    defaultValue,
    rules,
    name,
    getCaptchaButtonText,
    getCaptchaSecondText,
    updateActive,
    type,
    tabUtil,
    ...restProps
  } = props;

  if (!name) {
    return null;
  }
  // get getFieldDecorator props
  const options = getFormItemOptions(props);
  const otherProps = restProps || {};

  if (type === 'Captcha') {
    const inputProps = omit(otherProps, ['uuid', 'setuuid']);

    return (
      <FormItem shouldUpdate noStyle>
        {({ getFieldValue }) => (
          <Row gutter={8}>
            <Col span={12}>
              <FormItem name={name} {...options}>
                <Input {...customProps} {...inputProps} />
              </FormItem>
            </Col>
            <Col span={12}>
              <img onClick={()=>props.setuuid&&props.setuuid} style={{width:185,height:39.8}} src={`/services/v1/common/getCaptcha?rd=${props.uuid}`} alt="获取验证码"/>
            </Col>
          </Row>
        )}
      </FormItem>
    );
  }
  return (
    <FormItem name={name} {...options}>
      <Input {...customProps} {...otherProps} />
    </FormItem>
  );
};

const LoginItems: Partial<LoginItemType> = {};

Object.keys(ItemMap).forEach((key) => {
  const item = ItemMap[key];
  LoginItems[key] = (props: LoginItemProps) => (
    <LoginContext.Consumer>
      {(context) => (
        <LoginItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
});

export default LoginItems as LoginItemType;

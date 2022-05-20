import React from 'react';
import { Form, Button, Input, Select, Spin } from 'antd';
import { CloudType, AwsRegion, AliRegion, HuaweiRegion } from '../common/enum';
import { StaticProfileForm } from '../common/interface'
import { FormInstance } from 'antd/lib/form';
import { post } from '../api/request';
import { Urls } from '../api/apis';
import { ResponseData } from '../common/interface';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';

interface ProfileProps {
  cloudType: CloudType;
  disableSubmit: boolean;
  onClickSubmit: (values: StaticProfileForm) => void;
  onClickCancel: () => void;
}

interface ProfileState {
  disableSubmit: boolean;
  loading: boolean;
}
export class ProfileForm extends React.Component<ProfileProps, ProfileState> {
  public formRef = React.createRef<FormInstance>();
  constructor(props: ProfileProps) {
    super(props);
    this.state = {
      disableSubmit: false,
      loading: true,
    }
  }

  componentWillReceiveProps(nextProps: ProfileProps) {
    this.setSubmitBtnDisable(nextProps.disableSubmit);
    this.fillStaticProfile();
  }

  componentDidMount() {
    this.fillStaticProfile();
  }

  decode = (str: string) => {
    const key = Utf8.stringify(Base64.parse(str));
    return key;
  }

  fillStaticProfile = () => {
    const { cloudType } = this.props;
    post(Urls.ShowStaticProfile, { resource_type: cloudType }).then(data => {
      const res = data as ResponseData;
      if (res.code === 0) {
        if (res.result !== null) {
          const result = res.result as { access_key: string, secret_key: string, region: AwsRegion | AliRegion | HuaweiRegion, resource_type: CloudType };
          const secret_key = this.decode(result.secret_key);
          this.onFill({
            access_key: result.access_key,
            secret_key,
            region: result.region,
          });
        }
      }
      this.setLoadingStatus(false);
    });
  }

  setSubmitBtnDisable = (disableSubmit: boolean) => {
    this.setState({
      disableSubmit,
    })
  }

  setLoadingStatus = (loading: boolean) => {
    this.setState({
      loading,
    })
  }

  onFill = (values: StaticProfileForm) => {
    if (this.formRef.current) {
      this.formRef.current.setFieldsValue(values);
    }
  };

  renderOptions(type: CloudType) {
    let options: string[] = [];
    switch (type) {
      case CloudType.AWS:
        options = Object.values(AwsRegion);
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
      case CloudType.ALI:
        options = Object.values(AliRegion);
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
      case CloudType.HUAWEI:
        options = Object.values(HuaweiRegion);
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
    }
  }

  submit = () => {
    const { onClickSubmit } = this.props;
    const values: StaticProfileForm = this.formRef.current?.getFieldsValue();
    onClickSubmit(values);
  }

  render() {
    const { cloudType, onClickCancel } = this.props;
    const { disableSubmit, loading } = this.state;
    return (
      <>
        <Spin spinning={loading} tip={'加载中……'}>
          <Form
            layout="horizontal"
            requiredMark={true}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            ref={this.formRef}
          >
            <Form.Item
              label="Access_key"
              name="access_key"
              key="access_key"
              rules={[{ required: true, message: '请输入 access_key!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Secret_key"
              name="secret_key"
              key="secret_key"
              rules={[{ required: true, message: '请输入 secret_key!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Region"
              name="region"
              key="region"
              rules={[{ required: true, message: '请输入 region!' }]}
            >
              <Select
                placeholder="Select a option and change input text above"
                allowClear
              >
                {this.renderOptions(cloudType)}
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 5, span: 16 }} key="button">
              <Button onClick={onClickCancel} style={{ marginRight: 8 }} disabled={disableSubmit}>
                取消
              </Button>
              <Button onClick={this.submit} type="primary" disabled={disableSubmit}>
                下一步
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </>
    );
  }
}
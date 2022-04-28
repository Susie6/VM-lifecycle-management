import React from 'react';
import { Form, Button, Input, Select } from 'antd';
import { CloudType, AwsRegion, AliRegion, HuaweiRegion, } from '../common/enum';
import { StaticProfileForm } from '../common/interface'
import { FormInstance } from 'antd/lib/form';
import { post } from '../api/request';
import { Urls } from '../api/apis';
import { ResponseData } from '../common/interface';
interface ProfileProps {
  cloudType: CloudType;
  onClickSubmit: (values: StaticProfileForm) => void;
  onClickCancel: () => void;
}

export class ProfileForm extends React.Component<ProfileProps> {
  public formRef = React.createRef<FormInstance>();
  constructor(props: ProfileProps) {
    super(props);
  }
  
  componentDidMount() {
    const { cloudType } = this.props;
    post(Urls.ShowStaticProfile, { resource_type: cloudType }).then(data => {
      const res = data as ResponseData;
      if (res.code === 0) {
        if (res.result !== null) {
          const result = res.result as { access_key: string, secret_key: string, region: string, resource_type: CloudType }
          this.onFill({
            access_key: result.access_key,
            secret_key: result.secret_key,
            region: result.region,
          });
        }
      }
    });
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
    return (
      <>
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
              // onChange={this.onGenderChange}
              allowClear
            >
              {this.renderOptions(cloudType)}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5, span: 16 }} key="button">
            <Button onClick={onClickCancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.submit} type="primary">
              下一步
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}
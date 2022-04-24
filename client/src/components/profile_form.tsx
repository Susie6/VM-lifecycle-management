import React from 'react';
import { Form, Button, Input, Select } from 'antd';
import { CloudType, AwsRegion, AliRegion, HuaweiRegion } from '../common/enum';

interface ProfileProps {
  cloudType: CloudType;
}

export class ProfileForm extends React.Component<ProfileProps> {
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
  render() {
    const { cloudType } = this.props;
    return (
      <Form
        layout="vertical"
        hideRequiredMark
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Access_key"
          name="access_key"
          rules={[{ required: true, message: '请输入 access_key!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Secret_key"
          name="secret_key"
          rules={[{ required: true, message: '请输入 secret_key!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Region"
          name="region"
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
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
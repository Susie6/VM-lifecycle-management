import React from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker } from 'antd';
import { DrawerType, CloudType, AwsInstanceType, AliInstanceType, HuaweiInstanceType } from '../common/enum';

interface InstanceFormProps {
  cloudType: CloudType;
  drawerType: DrawerType;
}

export class InstanceForm extends React.Component<InstanceFormProps> {
  renderInstanceTypeOptions() {
    const { cloudType: type } = this.props;
    let options: string[] = [];
    switch (type) {
      case CloudType.AWS:
        options = Object.values(AwsInstanceType);
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
      case CloudType.ALI:
        options = Object.values(AliInstanceType);
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
      case CloudType.HUAWEI:
        options = Object.values(HuaweiInstanceType);
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
    }
  }
  renderAwsForm() {
    return(
      <Form
        layout="vertical"
        hideRequiredMark
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
      >

      </Form>
    );
  }
  renderAliForm() {
    return(
      <Form
        layout="vertical"
        hideRequiredMark
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
      >
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
            {this.renderInstanceTypeOptions()}
          </Select>
        </Form.Item>
        <Form.Item
          label="实例名称"
          name="instance_name"
          rules={[{ required: true, message: '请输入实例名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="AMI"
          name="ami_id"
          rules={[{ required: true, message: '请输入AMI!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  }
  renderHuaweiForm() {
    return(
      <Form
        layout="vertical"
        hideRequiredMark
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
      >

      </Form>
    );
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

      </Form>
    );
  }
}
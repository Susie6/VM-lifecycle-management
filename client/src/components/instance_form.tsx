import React from 'react';
import { Form, Button, Input, Select } from 'antd';
import {
  DrawerType,
  CloudType,
  AwsInstanceType,
  AliInstanceType,
  HuaweiInstanceType,
  DiskCategory,
  AliAvailableZone,
  HuaweiAvailableZone,
  AwsRegion,
  AliRegion,
  HuaweiRegion,
  HuaweiSystemDiskType,
  HuaweiDataDiskType
} from '../common/enum';
import { HuaweiForm, AliForm, AwsForm } from '../common/interface';
import { FormInstance } from 'antd/lib/form';

interface InstanceFormProps {
  cloudType: CloudType;
  drawerType: DrawerType;
  onClickSubmit: (values: HuaweiForm | AwsForm | AliForm) => void;
  onClickCancel: () => void;
}

export class InstanceForm extends React.Component<InstanceFormProps> {
  public region: AwsRegion | AliRegion | HuaweiRegion;
  public formRef = React.createRef<FormInstance>();
  constructor(props: InstanceFormProps) {
    super(props);
    this.region = AliRegion.BeiJing; // 向后端查询
  }

  onFill = () => {
    if (this.formRef.current) {
      this.formRef.current.setFieldsValue({
        // url: 'https://taobao.com/',
      });
    }
  };

  submit = () => {
    const { onClickSubmit } = this.props;
    const values: HuaweiForm | AwsForm | AliForm = this.formRef.current?.getFieldsValue();
    onClickSubmit(values);
  }

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

  renderAvailableZoneOptions() {
    const { cloudType: type } = this.props;
    const { region } = this;
    let options: string[] = [];
    switch (type) {
      // case CloudType.AWS:
      //   options = Object.values(AwsInstanceType);
      //   return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
      case CloudType.ALI:
        options = AliAvailableZone[region as AliRegion];
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
      case CloudType.HUAWEI:
        options = HuaweiAvailableZone[region as HuaweiRegion];
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
    }
  }

  renderAliForm() {
    const { onClickSubmit, onClickCancel } = this.props;
    return (
      <div>
        <Form
          layout="horizontal"
          requiredMark={true}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          ref={this.formRef}
        >
          <Form.Item
            label="实例类型"
            name="instance_type"
            rules={[{ required: true, message: '请输入实例类型!' }]}
          >
            <Select
              placeholder="请选择实例类型"
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
            label="可用区"
            name="availability_zone"
            rules={[{ required: true, message: '请输入可用区!' }]}
          >
            <Select
              placeholder="请选择可用区"
              // onChange={this.onGenderChange}
              allowClear
            >
              {this.renderAvailableZoneOptions()}
            </Select>
          </Form.Item>
          <Form.Item
            label="system_disk_category"
            name="system_disk_category"
            rules={[{ required: true, message: '请输入 system_disk_category!' }]}
          >
            <Select
              placeholder="请选择system_disk_category"
              // onChange={this.onGenderChange}
              allowClear
            >
              {Object.values(DiskCategory).map(op =>
                <Select.Option value={op}>{op}</Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            label="system_disk_name"
            name="system_disk_name"
            rules={[{ required: true, message: '请输入system_disk_name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="system_disk_description"
            name="system_disk_description"
            rules={[{ required: true, message: '请输入system_disk_description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="system_disk_size"
            name="system_disk_size"
            rules={[{ required: true, message: '请输入system_disk_size!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="data_disk_category"
            name="data_disk_category"
            rules={[{ required: true, message: '请输入 data_disk_category!' }]}
          >
            <Select
              placeholder="请选择data_disk_category"
              // onChange={this.onGenderChange}
              allowClear
            >
              {Object.values(DiskCategory).map(op =>
                <Select.Option value={op}>{op}</Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            label="data_disk_name"
            name="data_disk_name"
            rules={[{ required: true, message: '请输入data_disk_name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="data_disk_description"
            name="data_disk_description"
            rules={[{ required: true, message: '请输入data_disk_description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="data_disk_size"
            name="data_disk_size"
            rules={[{ required: true, message: '请输入data_disk_size!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
            <Button onClick={onClickCancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.submit} type="primary">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
  renderAwsForm() {
    const { onClickSubmit, onClickCancel } = this.props;
    return (
      <div>
        <Form
          layout="horizontal"
          requiredMark={true}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          ref={this.formRef}
        >
          <Form.Item
            label="实例类型"
            name="instance_type"
            rules={[{ required: true, message: '请输入实例类型!' }]}
          >
            <Select
              placeholder="请选择实例类型"
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
          <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
            <Button onClick={onClickCancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.submit} type="primary">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
  renderHuaweiForm() {
    const { onClickSubmit, onClickCancel } = this.props;
    return (
      <div>
        <Form
          layout="horizontal"
          requiredMark={true}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          ref={this.formRef}
        >
          <Form.Item
            label="实例类型"
            name="instance_type"
            rules={[{ required: true, message: '请输入实例类型!' }]}
          >
            <Select
              placeholder="请选择实例类型"
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
            label="可用区"
            name="availability_zone"
            rules={[{ required: true, message: '请输入可用区!' }]}
          >
            <Select
              placeholder="请选择可用区"
              // onChange={this.onGenderChange}
              allowClear
            >
              {this.renderAvailableZoneOptions()}
            </Select>
          </Form.Item>
          <Form.Item
            label="image_name"
            name="image_name"
            rules={[{ required: true, message: '请输入image_name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="system_disk_type"
            name="system_disk_type"
            rules={[{ required: true, message: '请输入 system_disk_type!' }]}
          >
            <Select
              placeholder="请选择system_disk_type"
              // onChange={this.onGenderChange}
              allowClear
            >
              {Object.values(HuaweiSystemDiskType).map(op =>
                <Select.Option value={op}>{op}</Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            label="system_disk_size"
            name="system_disk_size"
            rules={[{ required: true, message: '请输入system_disk_size!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="data_disk_type"
            name="data_disk_type"
            rules={[{ required: true, message: '请输入 data_disk_type!' }]}
          >
            <Select
              placeholder="请选择data_disk_type"
              // onChange={this.onGenderChange}
              allowClear
            >
              {Object.values(HuaweiDataDiskType).map(op =>
                <Select.Option value={op}>{op}</Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item
            label="data_disk_size"
            name="data_disk_size"
            rules={[{ required: true, message: '请输入data_disk_size!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
            <Button onClick={onClickCancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.submit} type="primary">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
  render() {
    const { cloudType } = this.props;
    if (cloudType === CloudType.AWS) {
      return this.renderAwsForm();
    } else if (cloudType === CloudType.ALI) {
      return this.renderAliForm();
    } else {
      return this.renderHuaweiForm();
    }
  }
}
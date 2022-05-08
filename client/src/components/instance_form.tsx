import React from 'react';
import { Form, Button, Input, Select, message, Spin } from 'antd';
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
import { ResponseData, AwsResult } from '../common/interface';
import { post } from '../api/request';
import { Urls } from '../api/apis';

interface InstanceFormProps {
  cloudType: CloudType;
  drawerType: DrawerType;
  disableSubmit: boolean;
  instanceId?: string | null;
  onClickSubmit: (values: HuaweiForm | AwsForm | AliForm) => void;
  onClickCancel: () => void;
}

interface InstanceFormState {
  disableSubmit: boolean;
  loading: boolean;
}

export class InstanceForm extends React.Component<InstanceFormProps, InstanceFormState> {
  public region: AwsRegion | AliRegion | HuaweiRegion;
  public formRef = React.createRef<FormInstance>();
  constructor(props: InstanceFormProps) {
    super(props);
    this.region = AliRegion.BeiJing; // 向后端查询
    this.state = {
      disableSubmit: false,
      loading: true,
    }
  }

  componentWillReceiveProps(nextProps: InstanceFormProps) {
    this.setSubmitBtnDisable(nextProps.disableSubmit);
  }

  componentDidMount() {
    const { drawerType } = this.props;
    if (drawerType === DrawerType.EDIT) {
      this.setInstanceInfo();
    }
  }

  setSubmitBtnDisable = (disableSubmit: boolean) => {
    this.setState({
      disableSubmit,
    })
  }

  setInstanceInfo() {
    const { cloudType, instanceId } = this.props;
    if (instanceId) {
      post(Urls.ShowSingleResource, { resource_type: cloudType, instance_id: instanceId }).then((data) => {
        const res = data as ResponseData;
        if (res.code === 0 && res.result !== null) {
          switch (cloudType) {
            case CloudType.AWS:
              const result = res.result as AwsResult; // 根据 cloud type
              const values = {
                instance_type: result.item.values.instance_type,
                instance_name: result.item.values.tags.Name,
                ami_id: result.item.values.ami,
              }
              this.onFill(values);
              break;
            case CloudType.ALI:
              //..
              break;
            case CloudType.HUAWEI:
              //..
              break;
          }
        } else if (res.code !== 0) {
          message.error({ content: res.msg });
        }
        this.setLoadingStatus(false);
      });
    }
  }

  onFill = (values: HuaweiForm | AwsForm | AliForm) => {
    if (this.formRef.current) {
      this.formRef.current.setFieldsValue(values);
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

  setLoadingStatus = (loading: boolean) => {
    this.setState({
      loading,
    })
  }

  renderAliForm() {
    const { onClickCancel } = this.props;
    const { disableSubmit, loading } = this.state;
    return (
      <div>
        <Spin spinning={loading} tip={'加载中……'}>
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
              <Button onClick={onClickCancel} style={{ marginRight: 8 }} disabled={disableSubmit}>
                取消
              </Button>
              <Button onClick={this.submit} type="primary" disabled={disableSubmit}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    );
  }

  renderAwsForm() {
    const { onClickCancel } = this.props;
    const { disableSubmit, loading } = this.state;
    return (
      <div>
        <Spin spinning={loading} tip={'加载中……'}>
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
              <Button onClick={onClickCancel} style={{ marginRight: 8 }} disabled={disableSubmit}>
                取消
              </Button>
              <Button onClick={this.submit} type="primary" disabled={disableSubmit}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    );
  }

  renderHuaweiForm() {
    const { onClickCancel } = this.props;
    const { disableSubmit, loading } = this.state;
    return (
      <div>
        <Spin spinning={loading} tip={'加载中……'}>
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
              <Button onClick={onClickCancel} style={{ marginRight: 8 }} disabled={disableSubmit}>
                取消
              </Button>
              <Button onClick={this.submit} type="primary" disabled={disableSubmit}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Spin>
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
import React from 'react';
import { Form, Button, Input, Select, message, Spin, InputNumber } from 'antd';
import {
  DrawerType,
  CloudType,
  AwsInstanceType,
  AliInstanceType,
  HuaweiInstanceType,
  DiskCategory,
  AwsAvailableZone,
  AliAvailableZone,
  HuaweiAvailableZone,
  AwsRegion,
  AliRegion,
  HuaweiRegion,
  HuaweiSystemDiskType,
  HuaweiDataDiskType,
  HuaweiImageName,
} from '../common/enum';
import { HuaweiForm, AliForm, AwsForm, HuaweiResult, AliResult } from '../common/interface';
import { FormInstance } from 'antd/lib/form';
import { ResponseData, AwsResult } from '../common/interface';
import { post } from '../api/request';
import { Urls } from '../api/apis';

interface InstanceFormProps {
  cloudType: CloudType;
  drawerType: DrawerType;
  disableSubmit: boolean;
  region: AwsRegion | AliRegion | HuaweiRegion | null;
  instanceId?: string | null;
  onClickSubmit: (values: HuaweiForm | AwsForm | AliForm) => void;
  onClickCancel: () => void;
}

interface InstanceFormState {
  disableSubmit: boolean;
  loading: boolean;
}

export class InstanceForm extends React.Component<InstanceFormProps, InstanceFormState> {
  public formRef = React.createRef<FormInstance>();
  constructor(props: InstanceFormProps) {
    super(props);
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
    } else {
      this.setLoadingStatus(false);
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
        let result;
        let values;
        if (res.code === 0 && res.result !== null) {
          switch (cloudType) {
            case CloudType.AWS:
              result = res.result as AwsResult;
              values = {
                instance_type: result.item.values.instance_type,
                instance_name: result.item.values.tags.Name,
                ami_id: result.item.values.ami,
                availability_zone: result.item.values.availability_zone,
              }
              this.onFill(values);
              break;
            case CloudType.ALI:
              result = res.result as AliResult;
              values = {
                instance_type: result.item.values.instance_type,
                instance_name: result.item.values.tags.Name,
                availability_zone: result.item.values.availability_zone,
                system_disk_category: result.item.values.system_disk_category,
                system_disk_name: result.item.values.system_disk_name,
                system_disk_size: result.item.values.system_disk_size,
                system_disk_description: result.item.values.system_disk_description,
                data_disk_category: result.item.values.data_disks[0].category,
                data_disk_name: result.item.values.data_disks[0].name,
                data_disk_size: result.item.values.data_disks[0].size,
                data_disk_description: result.item.values.data_disks[0].description,
                password: result.item.values.password,
              }

              this.onFill(values);
              break;
            case CloudType.HUAWEI:
              result = res.result as HuaweiResult;
              values = {
                instance_type: result.item.values.flavor_id,
                instance_name: result.item.values.tags.Name,
                image_name: result.item.values.image_name,
                availability_zone: result.item.values.availability_zone,
                system_disk_type: result.item.values.system_disk_type,
                system_disk_size: result.item.values.system_disk_size,
                data_disk_type: result.item.values.data_disks[0].type,
                data_disk_size: result.item.values.data_disks[0].size,
                password: result.item.values.admin_pass,
              }
              this.onFill(values);
              break;
          }
        } else if (res.code !== 0) {
          message.error(res.msg);
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
    const { cloudType: type, region } = this.props;
    let options: string[] = [];
    switch (type) {
      case CloudType.AWS:
        options = AwsAvailableZone[region as AwsRegion];
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
      case CloudType.ALI:
        options = AliAvailableZone[region as AliRegion];
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
      case CloudType.HUAWEI:
        options = HuaweiAvailableZone[region as HuaweiRegion];
        return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
    }
  }

  renderHuaweiImageOptions() {
    const options = Object.values(HuaweiImageName);
    return options.map(op => <Select.Option value={op}>{op}</Select.Option>);
  }

  setLoadingStatus = (loading: boolean) => {
    this.setState({
      loading,
    })
  }

  renderAliForm() {
    const { drawerType, onClickCancel } = this.props;
    const { disableSubmit, loading } = this.state;
    const disableChange = drawerType === DrawerType.EDIT ? true : false;
    return (
      <div>
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
                disabled={disableChange}
                allowClear
              >
                {this.renderAvailableZoneOptions()}
              </Select>
            </Form.Item>
            <Form.Item
              label="系统盘类别"
              name="system_disk_category"
              rules={[{ required: true, message: '请输入 system_disk_category!' }]}
            >
              <Select
                placeholder="请选择system_disk_category"
                disabled={disableChange}
                allowClear
              >
                {Object.values(DiskCategory).map(op =>
                  <Select.Option value={op}>{op}</Select.Option>
                )}
              </Select>
            </Form.Item>
            <Form.Item
              label="系统盘名称"
              name="system_disk_name"
              rules={[{ required: true, message: '请输入system_disk_name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="系统盘描述"
              name="system_disk_description"
              rules={[{ required: true, message: '请输入system_disk_description!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="系统盘内存大小"
              name="system_disk_size"
              extra={<p>提示：大小范围在 40 - 500 之间</p>}
              rules={[{ required: true, message: '请输入system_disk_size!' }]}
            >
              <InputNumber min={40} max={500} addonAfter={"G"} />
            </Form.Item>
            <Form.Item
              label="数据盘类别"
              name="data_disk_category"
              rules={[{ required: true, message: '请输入 data_disk_category!' }]}
            >
              <Select
                placeholder="请选择data_disk_category"
                disabled={disableChange}
                allowClear
              >
                {Object.values(DiskCategory).map(op =>
                  <Select.Option value={op}>{op}</Select.Option>
                )}
              </Select>
            </Form.Item>
            <Form.Item
              label="数据盘名称"
              name="data_disk_name"
              rules={[{ required: true, message: '请输入data_disk_name!' }]}
            >
              <Input disabled={disableChange} />
            </Form.Item>
            <Form.Item
              label="数据盘描述"
              name="data_disk_description"
              rules={[{ required: true, message: '请输入data_disk_description!' }]}
            >
              <Input disabled={disableChange}/>
            </Form.Item>
            <Form.Item
              label="数据盘内存大小"
              name="data_disk_size"
              extra={<p>cloud_efficiency：[20, 32768]; cloud_ssd：[20, 32768]; cloud_essd：[20, 32768]; ephemeral_ssd: [5, 800]</p>}
              rules={[{ required: true, message: '请输入data_disk_size!' }]}
            >
              <InputNumber min={20} max={32768} addonAfter={"G"} disabled={disableChange}/>
            </Form.Item>
            <Form.Item
              label="实例密码"
              name="password"
              rules={[{
                required: true,
                message: '请输入实例密码!'
              }, {
                max: 26,
                message: '密码长度最大不能超过26！'
              }, {
                min: 8,
                message: '密码长度最小不能少于8！'
              }, ({ getFieldValue }) => ({
                validator(rule, value) {
                  let sign = 0;
                  if (value.match(/([a-z])+/)) {
                    sign++;
                  }
                  if (value.match(/([A-Z])+/)) {
                    sign++;
                  }
                  if (value.match(/([0-9])+/)) {
                    sign++;
                  }
                  if (value.match(/[^a-zA-Z0-9]+/)) {
                    sign++;
                  }
                  if (!value || sign === 4) {
                    return Promise.resolve();
                  }
                  return Promise.reject('密码必须包含大写字母、小写字母、数字和特殊字符！');
                },
              })]}
            >
              <Input.Password />
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
    const { drawerType, onClickCancel } = this.props;
    const { disableSubmit, loading } = this.state;
    const disableChange = drawerType === DrawerType.EDIT ? true : false;
    return (
      <div>
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
              label="实例类型"
              name="instance_type"
              rules={[{ required: true, message: '请输入实例类型!' }]}
            >
              <Select
                placeholder="请选择实例类型"
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
                disabled={disableChange}
                allowClear
              >
                {this.renderAvailableZoneOptions()}
              </Select>
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
    const { drawerType, onClickCancel } = this.props;
    const { disableSubmit, loading } = this.state;
    const disableChange = drawerType === DrawerType.EDIT ? true : false;
    return (
      <div>
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
                disabled={disableChange}
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
              <Select
                placeholder="请选择可用镜像"
                disabled={disableChange}
                allowClear
              >
                {this.renderHuaweiImageOptions()}
              </Select>
            </Form.Item>
            <Form.Item
              label="系统盘类别"
              name="system_disk_type"
              rules={[{ required: true, message: '请输入 system_disk_type!' }]}
            >
              <Select
                placeholder="请选择system_disk_type"
                disabled={disableChange}
                allowClear
              >
                {Object.values(HuaweiSystemDiskType).map(op =>
                  <Select.Option value={op}>{op}</Select.Option>
                )}
              </Select>
            </Form.Item>
            <Form.Item
              label="系统盘内存大小"
              name="system_disk_size"
              extra={<p>提示：大小范围在 40 - 32768 之间</p>}
              rules={[{ required: true, message: '请输入system_disk_size!' }]}
            >
              <InputNumber min={40} max={32768} addonAfter={"G"} disabled={disableChange}/>
            </Form.Item>
            <Form.Item
              label="数据盘类别"
              name="data_disk_type"
              rules={[{ required: true, message: '请输入 data_disk_type!' }]}
            >
              <Select
                placeholder="请选择data_disk_type"
                disabled={disableChange}
                allowClear
              >
                {Object.values(HuaweiDataDiskType).map(op =>
                  <Select.Option value={op}>{op}</Select.Option>
                )}
              </Select>
            </Form.Item>
            <Form.Item
              label="数据盘内存大小"
              name="data_disk_size"
              extra={<p>提示：大小范围在 40 - 32768 之间</p>}
              rules={[{ required: true, message: '请输入data_disk_size!' }]}
            >
              <InputNumber min={40} max={32768} addonAfter={"G"} disabled={disableChange}/>
            </Form.Item>
            <Form.Item
              label="实例密码"
              name="password"
              rules={[{
                required: true,
                message: '请输入实例密码!'
              }, {
                max: 26,
                message: '密码长度最大不能超过26！'
              }, {
                min: 8,
                message: '密码长度最小不能少于8！'
              }, ({ getFieldValue }) => ({
                validator(rule, value) {
                  let sign = 0;
                  if (value.match(/([a-z])+/)) {
                    sign++;
                  }
                  if (value.match(/([A-Z])+/)) {
                    sign++;
                  }
                  if (value.match(/([0-9])+/)) {
                    sign++;
                  }
                  if (value.match(/[^a-zA-Z0-9]+/)) {
                    sign++;
                  }
                  if (!value || sign === 4) {
                    return Promise.resolve();
                  }
                  return Promise.reject('密码必须包含大写字母、小写字母、数字和特殊字符！');
                },
              })]}
            >
              <Input.Password />
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
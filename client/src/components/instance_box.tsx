import React from 'react';
import { Card, Descriptions, Badge, Button, Divider, message } from 'antd';
import { InstanceStatus, StatusMap, AwsRegion, AliRegion, HuaweiRegion, AwsInstanceType, AliInstanceType, HuaweiInstanceType, CloudType } from '../common/enum';
import { ResponseData } from '../common/interface';
import './instance_box.css';
import { DetailsView } from '../views/details';
import { post } from '../api/request';
import { Urls } from '../api/apis';
import { Dialog } from './dialog';

export interface InstanceBoxInfo {
  instanceKey: string;
  instanceId: string;
  instanceName: string;
  region: AwsRegion | AliRegion | HuaweiRegion | null;
  publicIp: string;
  status: InstanceStatus;
  instanceType: AwsInstanceType | AliInstanceType | HuaweiInstanceType;
  image: string;
}
interface InstanceBoxProps extends InstanceBoxInfo {
  cloudType: CloudType;
  onEditClick: (id: string, instanceKey: string) => void;
}

interface InstanceBoxState {
  detailsPageVisible: boolean;
  dialogVisible: boolean;
  disableSubmit: boolean;
}

function getManagementBtns() {
  return (
    <div className='instance-btn-group'>
      <Button type="link" size='small'>启动</Button>
      <Divider type="vertical" />
      <Button type="link" size='small'>重启</Button>
      <Divider type="vertical" />
      <Button type="link" size='small'>停止</Button>
    </div>
  );
}

export class InstanceBox extends React.Component<InstanceBoxProps, InstanceBoxState> {

  constructor(props: InstanceBoxProps) {
    super(props);
    this.state = {
      detailsPageVisible: false,
      dialogVisible: false,
      disableSubmit: false,
    }
  }

  closeDetailsDrawer = () => {
    this.setState({
      detailsPageVisible: false,
    })
  }

  onSearchClick = () => {
    this.setState({
      detailsPageVisible: true,
    })
  }

  setDialogVisible(visible: boolean) {
    this.setState({
      dialogVisible: visible,
    })
  }

  setSubmitBtnDisable = (disableSubmit: boolean) => {
    this.setState({
      disableSubmit,
    })
  }

  onDestroyClick = () => {
    this.setDialogVisible(true);
  }

  destroyInstance = () => {
    const { instanceId, cloudType } = this.props;
    this.setSubmitBtnDisable(true);
    const msgKey = 'destroy';
    message.loading({ content: '正在销毁资源...', key: msgKey, duration: 10 });
    post(Urls.DestroyResource, { resource_type: cloudType, instance_id: instanceId }).then(data => {
      const res = data as ResponseData;
      if (res.code === 0) {
        message.success({ content: res.msg, key: msgKey});
      } else {
        message.error({ content: res.msg, key: msgKey});
      }
      this.setDialogVisible(false);
      this.setSubmitBtnDisable(false);
    });
  }

  render() {
    const { instanceId, instanceName, region, publicIp, status, instanceType, image, cloudType, instanceKey, onEditClick } = this.props;
    const { detailsPageVisible, dialogVisible, disableSubmit } = this.state;
    return (
      <>
        <div className='instance-box'>
          <Card title={instanceName} extra={getManagementBtns()}>
            <Descriptions size='small' bordered>
              <Descriptions.Item label='实例ID'>{instanceId}</Descriptions.Item>
              <Descriptions.Item label='地域'>{region}</Descriptions.Item>
              <Descriptions.Item label='规格'>{instanceType}</Descriptions.Item>
              <Descriptions.Item label='镜像'>{image}</Descriptions.Item>
              <Descriptions.Item label='公网IP'>{publicIp}</Descriptions.Item>
              <Descriptions.Item label='运行状态'>
                <Badge status={StatusMap[status]} text={status} />
              </Descriptions.Item>
            </Descriptions>
            <div className='instance-box-btns'>
              <Button type="primary" className='instance-box-btn' onClick={this.onDestroyClick}>销毁实例</Button>
              <Button type="primary" className='instance-box-btn' onClick={() => onEditClick(instanceId, instanceKey)}>修改实例信息</Button>
              <Button type="primary" className='instance-box-btn' onClick={this.onSearchClick}>查看实例详情</Button>
            </div>
          </Card>
        </div>
        <DetailsView cloudType={cloudType} instanceId={instanceId} visible={detailsPageVisible} onClose={this.closeDetailsDrawer} />
        <Dialog visible={dialogVisible} disableSubmit={disableSubmit} title={'销毁实例'} content={`是否销毁实例 ${instanceId}?`} onConfirm={this.destroyInstance} onClose={() => this.setDialogVisible(false)} />
      </>
    );
  }

}
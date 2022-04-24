import React from 'react';
import { Card, Descriptions, Badge, Button, Divider } from 'antd';
import { InstanceStatus, StatusMap, AwsRegion, AliRegion, HuaweiRegion } from '../common/enum';
import './instance_box.css';

interface InstanceBoxProps {
  instanceId: string;
  instanceName: string;
  region: AwsRegion | AliRegion | HuaweiRegion;
  publicIp: string;
  status: InstanceStatus;

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

export class InstanceBox extends React.Component<InstanceBoxProps> {
  render() {
    const { instanceId, instanceName, region, publicIp, status } = this.props;
    return (
      <div className='instance-box'>
        <Card title={instanceName} extra={getManagementBtns()}>
          <Descriptions size='small' bordered>
            <Descriptions.Item label='实例ID'>{instanceId}</Descriptions.Item>
            <Descriptions.Item label='地域'>{region}</Descriptions.Item>
            <Descriptions.Item label='公网IP'>{publicIp}</Descriptions.Item>
            <Descriptions.Item label='规格'>{publicIp}</Descriptions.Item>
            <Descriptions.Item label='镜像'>{publicIp}</Descriptions.Item>
            <Descriptions.Item label='运行状态'>
              <Badge status={StatusMap[status]} text={status} />
            </Descriptions.Item>
          </Descriptions>
          <div className='instance-box-btns'>
            <Button type="primary" className='instance-box-btn'>销毁实例</Button>
            <Button type="primary" className='instance-box-btn'>修改实例信息</Button>
            <Button type="primary" className='instance-box-btn'>查看实例详情</Button>
          </div>
        </Card>
      </div>
    );
  }

}
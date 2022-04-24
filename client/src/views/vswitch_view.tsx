import React from 'react';
import { ResourceTable } from '../components/table';

interface VswitchProps {}

export class VswitchView extends React.Component<VswitchProps> {
  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: '虚拟私有云',
      dataIndex: 'vpc_name',
      key: 'vpc_name',
    },{
      title: 'IPv4网段',
      dataIndex: 'ipv4',
      key: 'ipv4',
    },{
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },{
      title: '关联子网',
      dataIndex: 'subnet_name',
      key: 'subnet_name',
    }];

    const dataSource = [{
      key: 1,
      name: 'route-default',
      vpc_name: 'default-vpc',
      ipv4: '198',
      type: 'default',
      subnet_name: 'sub-default',
    }]
    return(
      <ResourceTable
        columns={columns}
        dataSource={dataSource}
      />
    );
  }
}
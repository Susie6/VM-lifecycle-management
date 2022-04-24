import React from 'react';
import { ResourceTable } from '../components/table';

interface VPCProps {}

export class VpcView extends React.Component<VPCProps> {
  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },{
      title: 'IPv4网段',
      dataIndex: 'ipv4',
      key: 'ipv4',
    },{
      title: '子网个数',
      dataIndex: 'subnet_count',
      key: 'subnet_count',
    },{
      title: '路由表',
      dataIndex: 'route_table',
      key: 'route_table',
    },{
      title: '服务器个数',
      dataIndex: 'instance_count',
      key: 'instance_count',
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    }];

    const dataSource = [{
      key: 1,
      name: 'vpc-default',
      ipv4: '198',
      subnet_count: 1,
      route_table: 1,
      instance_count: 1,
      status: '可用',
    }]
    return(
      <ResourceTable
        columns={columns}
        dataSource={dataSource}
      />
    );
  }
}
import React from 'react';
import { ResourceTable } from '../components/table';

interface SubnetProps {}

export class SubnetView extends React.Component<SubnetProps> {
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
      title: '可用区',
      dataIndex: 'available_zone',
      key: 'available_zone',
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },{
      title: '路由表',
      dataIndex: 'route_table',
      key: 'route_table',
    }];

    const dataSource = [{
      key: 1,
      name: 'sub-default',
      vpc_name: 'default-vpc',
      ipv4: '198',
      available_zone: 'ggg',
      route_table: 1,
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
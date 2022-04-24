import React from 'react';
import { Table, Divider, Tag } from 'antd';
import { TableColumn } from '../common/interface';

interface ResourceTableProps {
  columns: TableColumn[];
  dataSource: any[];
}

export  class ResourceTable extends React.Component<ResourceTableProps> {
  render() {
    const { dataSource, columns} = this.props;
    return(
      <Table columns={columns} dataSource={dataSource} />
    );
  }
}
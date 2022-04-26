import React from 'react';
import { Table } from 'antd';
import { TableColumn } from '../common/interface';
import './table.css';

interface ResourceTableProps {
  columns: TableColumn[];
  dataSource: any[];
}

export class ResourceTable extends React.Component<ResourceTableProps> {
  render() {
    const { dataSource, columns } = this.props;
    return (
      <div className='table'>
        <Table columns={columns} dataSource={dataSource} />
      </div>
    );
  }
}
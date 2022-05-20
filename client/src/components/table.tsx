import React from 'react';
import { Table } from 'antd';
import { TableColumn } from '../common/interface';
import './table.css';

interface ResourceTableProps {
  title: string;
  columns: TableColumn[];
  dataSource: any[];
}

export class ResourceTable extends React.Component<ResourceTableProps> {
  render() {
    const { dataSource, columns, title } = this.props;
    return (
      <div className='table'>
        <Table
          columns={columns}
          dataSource={dataSource}
          title={() => title}
          pagination={false}
        />
      </div>
    );
  }
}
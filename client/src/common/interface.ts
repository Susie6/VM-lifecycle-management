export interface BoxInfo {
  title: string;
  count: number;
}

export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  render?: (v: any) => any;
}
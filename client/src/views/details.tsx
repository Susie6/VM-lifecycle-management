import React from 'react';
import { Drawer, List } from 'antd';
import { CloudType } from '../common/enum';
import { ResponseData, AwsResult } from '../common/interface';
import { post } from '../api/request';
import { Urls } from '../api/apis';

interface DetailsProps {
  cloudType: CloudType;
  instanceId: string;
  visible: boolean;
  onClose: () => void;
}

interface DetailsState {
  visible: boolean;
  InstanceInfo: AwsResult | null;
}

interface ListData {
  label: string;
  value: string | number | undefined | string[];
}

export class DetailsView extends React.Component<DetailsProps, DetailsState> {
  constructor(props: DetailsProps) {
    super(props);
    this.state = {
      visible: false,
      InstanceInfo: null,
    }
    this.getInstanceInfo();
  }

  componentWillReceiveProps(nextProps: DetailsProps) {
    this.setDrawerVisible(nextProps.visible);
    this.getInstanceInfo();
  }

  setDrawerVisible = (visible: boolean) => {
    this.setState({
      visible,
    });
  };

  getInstanceInfo() {
    const { cloudType, instanceId } = this.props;
    post(Urls.ShowSingleResource, { resource_type: cloudType, instance_id: instanceId }).then((data) => {
      const res = data as ResponseData;
      if (res.code === 0) {
        this.setState({
          InstanceInfo: res.result,
        })
      }
    })
  }

  getListData(): ListData[] {
    const { cloudType } = this.props;
    const info = this.state.InstanceInfo?.item.values;
    switch (cloudType) {
      case CloudType.AWS:
        return [{
          label: '实例名称',
          value: info?.tags.Name,
        }, {
          label: '实例ID',
          value: info?.id,
        }, {
          label: 'AMI',
          value: info?.ami,
        }, {
          label: '公网IP',
          value: info?.public_ip,
        }, {
          label: '私网IP',
          value: info?.private_ip,
        }, {
          label: '可用区',
          value: info?.availability_zone,
        }, {
          label: 'CPU核数',
          value: info?.cpu_core_count,
        }, {
          label: '实例类型',
          value: info?.instance_type,
        }, {
          label: '运行状态',
          value: info?.instance_state,
        }, {
          label: '子网ID',
          value: info?.subnet_id,
        }, {
          label: '安全组ID',
          value: info?.vpc_security_group_ids,
        }]
      case CloudType.ALI:
        return [];
      case CloudType.HUAWEI:
        return [];
      default:
        return [];
    }
  }

  render() {
    const { onClose } = this.props;
    const data = this.getListData();
    return (
      <Drawer
        title='查看资源详情'
        width={720}
        onClose={onClose}
        visible={this.state.visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.label}
                description={item.value}
              />
            </List.Item>
          )}
        />
      </Drawer>
    );
  }
}
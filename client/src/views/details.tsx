import React from 'react';
import { Drawer, List, message } from 'antd';
import { CloudType } from '../common/enum';
import { ResponseData, AwsResult } from '../common/interface';
import { post } from '../api/request';
import { Urls } from '../api/apis';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { GlobalState } from '../store/action_type';
import { setLookupDrawerVisibleAction } from '../store/action';

interface DetailsProps {
  cloudType: CloudType;
  instanceId: string | null;
  visible: boolean;
  onClose: () => void;
}

interface DetailsState {
  InstanceInfo: AwsResult | null;
}

interface ListData {
  label: string;
  value: string | number | undefined | string[];
}

class DetailsView extends React.Component<DetailsProps, DetailsState> {
  constructor(props: DetailsProps) {
    super(props);
    this.state = {
      InstanceInfo: null,
    }
  }

  componentWillReceiveProps(nextProps: DetailsProps) {
    nextProps.visible && this.getInstanceInfo();
  }

  getInstanceInfo() {
    const { cloudType, instanceId } = this.props;
    if (instanceId) {
      post(Urls.ShowSingleResource, { resource_type: cloudType, instance_id: instanceId }).then(data => {
        const res = data as ResponseData;
        if (res.code === 0) {
          this.setState({
            InstanceInfo: res.result,
          })
        } else {
          message.error({ content: res.msg });
        }
      });
    }

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
    const { visible, onClose } = this.props;
    const data = this.getListData();
    return (
      <Drawer
        title='查看资源详情'
        width={720}
        onClose={() => {
          onClose();
          this.setState({
            InstanceInfo: null,
          })
        }}
        visible={visible}
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

const mapStateToProps = (state: GlobalState) => ({
  visible: state.lookupDrawerVisible,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setCreateDrawerVisible: (visible: boolean) => {
      dispatch(setLookupDrawerVisibleAction(visible));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsView);
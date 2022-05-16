import React from 'react';
import { Drawer, List, message, Descriptions, Spin, Badge } from 'antd';
import { CloudType, InstanceStatus, StatusMap, StatsuText } from '../common/enum';
import { ResponseData, AwsResult, AliResult, HuaweiResult } from '../common/interface';
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
  InstanceInfo: AwsResult | AliResult | HuaweiResult | null;
  loading: boolean;
}

interface ListData {
  label: string;
  value: string | number | undefined | string[] | JSX.Element;
  span?: number;
}

class DetailsView extends React.Component<DetailsProps, DetailsState> {
  constructor(props: DetailsProps) {
    super(props);
    this.state = {
      InstanceInfo: null,
      loading: true,
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
            loading: false,
          })
        } else {
          message.error(res.msg);
          this.setState({
            loading: false,
          })
        }
      });
    }

  }

  getListData(): ListData[] {
    const { cloudType } = this.props;
    let result = null;
    let info = null;
    if (!this.state.InstanceInfo) {
      return [];
    } else {
      switch (cloudType) {
        case CloudType.AWS:
          result = this.state.InstanceInfo as AwsResult;
          info = result.item.values;
          return [{
            label: '实例名称',
            value: info.tags.Name,
          }, {
            label: '实例ID',
            value: info.id,
          }, {
            label: 'AMI',
            value: info.ami,
          }, {
            label: '公网IP',
            value: info.public_ip,
          }, {
            label: '私网IP',
            value: info.private_ip,
          }, {
            label: '可用区',
            value: info.availability_zone,
          }, {
            label: 'CPU核数',
            value: info.cpu_core_count,
          }, {
            label: '实例类型',
            value: info.instance_type,
          }, {
            label: '运行状态',
            value: <Badge status={StatusMap[info.instance_state as InstanceStatus]} text={StatsuText[info.instance_state as InstanceStatus]} />,
          }, {
            label: '子网ID',
            value: info.subnet_id,
          }, {
            label: '安全组ID',
            value: info.vpc_security_group_ids,
          }]
        case CloudType.ALI:
          result = this.state.InstanceInfo as AliResult;
          info = result.item.values;
          return [
            {
              label: '实例名称',
              value: info.tags.Name,
            }, {
              label: '实例ID',
              value: info.id,
            }, {
              label: '实例类别',
              value: info.instance_type,
            }, {
              label: '镜像ID',
              value: info.image_id,
            }, {
              label: '公网IP',
              value: info.public_ip,
            }, {
              label: '私网IP',
              value: info.private_ip,
            }, {
              label: '可用区',
              value: info.availability_zone,
            }, {
              label: '系统盘类别',
              value: info.system_disk_category,
            }, {
              label: '系统盘名称',
              value: info.system_disk_name,
            }, {
              label: '系统盘内存大小',
              value: `${info.system_disk_size} G`,
            }, {
              label: '系统盘描述',
              value: info.system_disk_description,
            }, {
              label: '数据盘类别',
              value: info.data_disks[0].category,
            }, {
              label: '数据盘名称',
              value: info.data_disks[0].name,
            }, {
              label: '数据盘内存大小',
              value: `${info.data_disks[0].size} G`,
            }, {
              label: '数据盘描述',
              value: info.data_disks[0].description,
            }, {
              label: '运行状态',
              value: <Badge status={StatusMap[info.status as InstanceStatus]} text={StatsuText[info.status as InstanceStatus]} />,
            }, {
              label: '子网ID',
              value: info.subnet_id,
            }, {
              label: '安全组ID',
              value: info.security_groups[0],
            }
          ];
        case CloudType.HUAWEI:
          result = this.state.InstanceInfo as HuaweiResult;
          info = result.item.values;
          return [
            {
              label: '实例名称',
              value: info.tags.Name,
            }, {
              label: '实例ID',
              value: info.id,
            }, {
              label: '实例类别',
              value: info.flavor_id,
            }, {
              label: '镜像名称',
              value: info.image_name,
            }, {
              label: '镜像ID',
              value: info.image_id,
            }, {
              label: '公网IP',
              value: info.public_ip || '',
            }, {
              label: '可用区',
              value: info.availability_zone,
              span: 3,
            }, {
              label: '系统盘类别',
              value: info.system_disk_type,
            }, {
              label: '系统盘ID',
              value: info.system_disk_id,
            }, {
              label: '系统盘内存大小',
              value: `${info.system_disk_size} G`,
            }, {
              label: '数据盘类别',
              value: info.data_disks[0].type,
            }, {
              label: '数据盘内存大小',
              value: `${info.data_disks[0].size} G`,
              span: 2,
            }, {
              label: '运行状态',
              value: <Badge status={StatusMap[info.status as InstanceStatus]} text={StatsuText[info.status as InstanceStatus]} />,
            }, {
              label: '安全组ID',
              value: info.security_group_ids[0],
            }
          ];
        default:
          return [];
      }
    }
  }

  render() {
    const { visible, onClose } = this.props;
    const { loading } = this.state;
    const data = this.getListData();
    return (
      <Drawer
        title='查看资源详情'
        width={1280}
        onClose={() => {
          onClose();
          this.setState({
            InstanceInfo: null,
            loading: true,
          })
        }}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        {/* <List
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.label}
                description={item.value}
              />
            </List.Item>
          )}
        /> */}
        <Spin spinning={loading}>
          <Descriptions title="实例状态查看" bordered>
            {data.map(item => {
              return <Descriptions.Item label={item.label} span={item.span ? item.span : 1}>{item.value}</Descriptions.Item>
            })}
          </Descriptions>
        </Spin>
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
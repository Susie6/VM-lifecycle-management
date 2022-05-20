import React from 'react';
import { CloudType, AwsRegion, DrawerType, AliRegion, HuaweiRegion, InstanceStatus } from '../common/enum';
import { message, Spin } from 'antd';
import { NumberBox } from '../components/number_box';
import { InstanceBox, InstanceBoxInfo } from '../components/instance_box';
import { Toolbar } from '../components/toolbar';
import { EmptyView } from '../components/empty';
import { BoxInfo } from '../common/interface';
import DrawerView from './add_or_edit';
import DetailsView from './details';
import { ResponseData, AwsResultItem, HuaweiResultItem, AliResultItem } from '../common/interface';
import { post } from '../api/request';
import { Urls } from '../api/apis';
import { getInstanceKey } from '../utils/utils';
import { updateInstanceListAction, setCreateDrawerVisibleAction, setLookupDrawerVisibleAction } from '../store/action';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { GlobalState } from '../store/action_type';
import './instance_view.css';

interface InstanceViewProps {
  cloudType: CloudType;
  instanceList: InstanceBoxInfo[] | null
  updateInstanceList: (list: InstanceBoxInfo[] | null) => void;
  setCreateDrawerVisible: (visible: boolean) => void;
  setLookupDrawerVisible: (visible: boolean) => void;
}

interface InstanceViewState {
  isAddMode: boolean; // 是创建还是修改
  cloudType: CloudType;
  loading: boolean;
}
class InstanceView extends React.Component<InstanceViewProps, InstanceViewState> {
  public region: AwsRegion | AliRegion | HuaweiRegion | null;
  public selectedInstanceId: string | null;
  public selectedinstanceKey: string | null;

  constructor(props: InstanceViewProps) {
    super(props);
    this.state = {
      isAddMode: true,
      cloudType: props.cloudType,
      loading: true,
    }
    this.region = null;
    this.selectedInstanceId = null;
    this.selectedinstanceKey = null;
  }

  componentWillReceiveProps(nextProps: InstanceViewProps) {
    if (this.state.cloudType !== nextProps.cloudType) {
      this.setState({
        cloudType: nextProps.cloudType,
        loading: true,
      }, () => {
        this.setInstanceInfo();
      });
    }
  }
  componentDidMount() {
    this.setInstanceInfo();
  }

  reset = () => {
    this.selectedInstanceId = null;
    this.selectedinstanceKey = null;
  }

  async setInstanceInfo() {
    const { cloudType } = this.state;
    const region = await this.getRegion();
    if (region !== "None") {
      switch (cloudType) {
        case CloudType.AWS:
          this.region = region as AwsRegion;
          break;
        case CloudType.ALI:
          this.region = region as AliRegion;
          break;
        case CloudType.HUAWEI:
          this.region = region as HuaweiRegion;
          break;
      }
    }
    this.getAllInstance();
  }

  getNumberBoxes(): BoxInfo[] {
    const { instanceList } = this.props;
    const instanceCount = instanceList ? instanceList.length : 0;
    const running = instanceList ? instanceList.filter(item => item.status === InstanceStatus.Running).length : 0;
    return [{ title: '实例数量', count: instanceCount },
    { title: '运行中', count: running }]
  }

  handleAddInstanceClick = () => {
    const { setCreateDrawerVisible } = this.props;
    this.setState({
      isAddMode: true,
    }, () => {
      setCreateDrawerVisible(true);
    });
  }

  handleEditInstanceClick = (instanceId: string, instanceKey: string) => {
    const { setCreateDrawerVisible } = this.props;
    this.selectedInstanceId = instanceId;
    this.selectedinstanceKey = instanceKey;
    this.setState({
      isAddMode: false,
    }, () => {
      setCreateDrawerVisible(true);
    });
  }

  handleSearchInstanceClick = (instanceId: string, instanceKey: string) => {
    const { setLookupDrawerVisible } = this.props;
    this.selectedInstanceId = instanceId;
    this.selectedinstanceKey = instanceKey;
    this.setState({
      isAddMode: false,
    }, () => {
      setLookupDrawerVisible(true);
    });
  }

  closeDrawer = () => {
    const { setCreateDrawerVisible } = this.props;
    setCreateDrawerVisible(false);
    this.reset();
  }

  getRegion() {
    const { cloudType } = this.state;
    return post(Urls.ShowRegion, { resource_type: cloudType }).then(data => {
      const res = data as ResponseData;
      if (res.code === 0 && res.result !== null) {
        const result = res.result as { region: AwsRegion | AliRegion | HuaweiRegion };
        return Promise.resolve(result.region);
      } else {
        return Promise.resolve("None");
      }
    });
  }

  getAllInstance() {
    const { updateInstanceList } = this.props;
    const { cloudType } = this.state;
    post(Urls.ShowResourceInfo, { resource_type: cloudType }).then(data => {
      const res = data as ResponseData;
      if (res.code === 0) {
        let arr: InstanceBoxInfo[] = [];
        let result;
        if (res.result) {
          switch (cloudType) {
            case CloudType.AWS:
              result = res.result as AwsResultItem[];
              result.forEach(item => {
                if (item) {
                  const key = getInstanceKey(item.address);
                  arr.push({
                    instanceKey: key,
                    instanceId: item.values.id,
                    instanceName: item.values.tags.Name,
                    region: this.region,
                    publicIp: item.values.public_ip,
                    status: item.values.instance_state,
                    instanceType: item.values.instance_type,
                    image: item.values.ami,
                  })
                }
              });
              break;
            case CloudType.ALI:
              console.log(res.result);
              result = res.result as AliResultItem[];
              result.forEach(item => {
                if (item) {
                  const key = getInstanceKey(item.address);
                  arr.push({
                    instanceKey: key,
                    instanceId: item.values.id,
                    instanceName: item.values.tags.Name,
                    region: this.region,
                    publicIp: item.values.public_ip,
                    status: item.values.status === InstanceStatus.RunningX ? InstanceStatus.Running : InstanceStatus.Stopped,
                    instanceType: item.values.instance_type,
                    image: item.values.image_id,
                  })
                }
              });
              break;
            case CloudType.HUAWEI:
              result = res.result as HuaweiResultItem[];
              result.forEach(item => {
                if (item) {
                  const key = getInstanceKey(item.address);
                  arr.push({
                    instanceKey: key,
                    instanceId: item.values.id,
                    instanceName: item.values.tags.Name,
                    region: this.region,
                    publicIp: item.values.public_ip ? item.values.public_ip : "",
                    status: item.values.status === "ACTIVE" ? InstanceStatus.Running : InstanceStatus.Stopped,
                    instanceType: item.values.flavor_id,
                    image: item.values.image_id,
                  })
                }
              });
              break;
          }
          if (arr.length > 0) {
            updateInstanceList(arr);
          } else {
            updateInstanceList(null);
          }
        }
      } else {
        message.error(res.msg);
      }
      this.setState({
        loading: false,
      })
    });
  }

  render() {
    const { isAddMode, cloudType, loading } = this.state;
    const { instanceList, setLookupDrawerVisible } = this.props;
    const boxes = this.getNumberBoxes();
    return (
      <div className='instance-resource'>
        <div className='instance-resource--overview'>
          <NumberBox boxes={boxes}></NumberBox>
        </div>
        <div className='instance-resource--toolbar'>
          <Toolbar onAddInstance={this.handleAddInstanceClick}></Toolbar>
        </div>
        <Spin size='large' spinning={loading} tip='加载中……'>
          <div className='instance-resource--details'>
            {instanceList ? instanceList.map(item => {
              return <InstanceBox
                instanceKey={item.instanceKey}
                instanceId={item.instanceId}
                instanceName={item.instanceName}
                instanceType={item.instanceType}
                region={item.region}
                publicIp={item.publicIp}
                status={item.status}
                image={item.image}
                cloudType={cloudType}
                onEditClick={this.handleEditInstanceClick}
                onSearchClick={this.handleSearchInstanceClick}
              />
            }) : <EmptyView description='暂无已创建资源' />}
          </div>
        </Spin>
        <DrawerView
          cloudType={cloudType}
          type={isAddMode ? DrawerType.ADD : DrawerType.EDIT}
          onClose={this.closeDrawer}
          instanceId={this.selectedInstanceId}
          instanceKey={this.selectedinstanceKey}
        />
        <DetailsView
          cloudType={cloudType}
          instanceId={this.selectedInstanceId}
          onClose={() => {
            setLookupDrawerVisible(false);
            this.reset();
          }} />
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  instanceList: state.instanceList,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateInstanceList: (list: InstanceBoxInfo[] | null) => {
      dispatch(updateInstanceListAction(list));
    },
    setCreateDrawerVisible: (visible: boolean) => {
      dispatch(setCreateDrawerVisibleAction(visible));
    },
    setLookupDrawerVisible: (visible: boolean) => {
      dispatch(setLookupDrawerVisibleAction(visible));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstanceView);
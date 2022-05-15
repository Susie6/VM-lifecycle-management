import React from 'react';
import { CloudType, AwsRegion, DrawerType, AliRegion, HuaweiRegion, InstanceStatus } from '../common/enum';
import { NumberBox } from '../components/number_box';
import { InstanceBox, InstanceBoxInfo } from '../components/instance_box';
import { Toolbar } from '../components/toolbar';
import { EmptyView } from '../components/empty';
import { BoxInfo } from '../common/interface';
import { DrawerView } from './add_or_edit';
import { ResponseData, AwsResultItem, HuaweiResultItem, AliResultItem } from '../common/interface';
import { post } from '../api/request';
import { Urls } from '../api/apis';
import { getInstanceKey } from '../utils/utils';
import './instance_view.css';

interface InstanceViewProps {
  cloudType: CloudType;
}

interface InstanceViewState {
  drawerVisible: boolean;
  isAddMode: boolean; // 是创建还是修改
  InstanceList: InstanceBoxInfo[] | null;
  cloudType: CloudType;
}
export class InstanceView extends React.Component<InstanceViewProps, InstanceViewState> {
  public region: AwsRegion | AliRegion | HuaweiRegion | null;
  public selectedInstanceId: string | null;
  public selectedinstanceKey: string | null;

  constructor(props: InstanceViewProps) {
    super(props);
    this.state = {
      drawerVisible: false,
      isAddMode: true,
      InstanceList: null,
      cloudType: props.cloudType,
    }
    this.region = null;
    this.selectedInstanceId = null;
    this.selectedinstanceKey = null;
  }

  componentWillReceiveProps(nextProps: InstanceViewProps) {
    console.log("cloudType change: ", nextProps.cloudType);
    if (this.state.cloudType !== nextProps.cloudType) {
      this.setState({
        cloudType: nextProps.cloudType,
        InstanceList: null,
      }, () => {
        this.setInstanceInfo();
      });
    }
  }
  componentDidMount() {
    this.setInstanceInfo();
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
    return [{ title: '实例数量', count: 1 },
    { title: '运行中', count: 1 },
    { title: '即将过期', count: 1 },
    { title: '已过期', count: 1 }]
  }

  handleAddInstanceClick = () => {
    this.setState({
      drawerVisible: true,
      isAddMode: true,
    });
  }

  handleEditInstanceClick = (instanceId: string, instanceKey: string) => {
    this.selectedInstanceId = instanceId;
    this.selectedinstanceKey = instanceKey;
    this.setState({
      drawerVisible: true,
      isAddMode: false,
    });
  }

  closeDrawer = () => {
    this.setState({
      drawerVisible: false,
    })
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
                    status: item.values.status,
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
            this.setState({
              InstanceList: arr,
            });
          } else {
            this.setState({
              InstanceList: null,
            })
          }
        }
      }
    });
  }

  render() {
    const { drawerVisible, isAddMode, InstanceList, cloudType } = this.state;
    const boxes = this.getNumberBoxes();
    return (
      <div className='instance-resource'>
        <div className='instance-resource--overview'>
          <NumberBox boxes={boxes}></NumberBox>
        </div>
        <div className='instance-resource--toolbar'>
          <Toolbar onAddInstance={this.handleAddInstanceClick}></Toolbar>
        </div>
        <div className='instance-resource--details'>
          {InstanceList ? InstanceList.map(item => {
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
            />
          }) : <EmptyView description='暂无已创建资源' />}
        </div>
        <DrawerView
          cloudType={cloudType}
          visible={drawerVisible}
          type={isAddMode ? DrawerType.ADD : DrawerType.EDIT}
          onClose={this.closeDrawer}
          instanceId={this.selectedInstanceId}
          instanceKey={this.selectedinstanceKey}
        />
      </div>
    );
  }
}
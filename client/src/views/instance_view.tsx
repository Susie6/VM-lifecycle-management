import React from 'react';
import { CloudType, AwsRegion, InstanceStatus, DrawerType } from '../common/enum';
import { NumberBox } from '../components/number_box';
import { InstanceBox } from '../components/instance_box';
import { Toolbar } from '../components/toolbar';
import { BoxInfo } from '../common/interface';
import { DrawerView } from './add_or_edit';
import { DetailsView } from './details';
import './instance_view.css';

interface InstanceViewProps {
  cloudType: CloudType;
}

interface InstanceViewState {
  drawerVisible: boolean;
  isAddMode: boolean; // 是创建还是修改
  detailsPageVisible: boolean;
}

export class InstanceView extends React.Component<InstanceViewProps, InstanceViewState> {
  constructor(props: InstanceViewProps) {
    super(props);
    this.state = {
      drawerVisible: false,
      isAddMode: true,
      detailsPageVisible: false,
    }
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

  handleEditInstanceClick = () => {
    this.setState({
      drawerVisible: true,
      isAddMode: false,
    });
  }

  handleDestroyInstanceClick = () => {

  }

  handleSearchInstanceDetailsClick = () => {
    this.setState({
      detailsPageVisible: true,
    });
  }

  closeDrawer = () => {
    this.setState({
      drawerVisible: false,
    })
  }

  closeDetailsDrawer = () => {
    this.setState({
      detailsPageVisible: false,
    })
  }

  render() {
    const { cloudType } = this.props;
    const { drawerVisible, isAddMode, detailsPageVisible } = this.state;
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
          {/* {instance_info.map(info => {
            return <InstanceBox></InstanceBox>
          })} */}
          <InstanceBox
            instanceId={'111'}
            instanceName={'111'}
            region={AwsRegion.East}
            publicIp={'111'}
            status={InstanceStatus.Running}
            onSearchClick={this.handleSearchInstanceDetailsClick}
            onDestroyClick={this.handleDestroyInstanceClick}
            onEditClick={this.handleEditInstanceClick}
          />
        </div>
        <DrawerView
          cloudType={cloudType}
          visible={drawerVisible}
          type={isAddMode ? DrawerType.ADD : DrawerType.EDIT}
          onClose={this.closeDrawer}
        />
        <DetailsView cloudType={cloudType} instanceId={'i-ff2616574823ee23a'} visible={detailsPageVisible} onClose={this.closeDetailsDrawer}/>
      </div>
    );
  }
}
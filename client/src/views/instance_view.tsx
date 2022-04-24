import React from 'react';
import { CloudType, AwsRegion, InstanceStatus } from '../common/enum';
import { NumberBox } from '../components/number_box';
import { InstanceBox } from '../components/instance_box';
import { Toolbar } from '../components/toolbar';
import { BoxInfo } from '../common/interface';
import './instance_view.css';

interface InstanceViewProps {

}

interface InstanceViewState {
  resourceType: CloudType;
}

export class InstanceView extends React.Component<InstanceViewProps, InstanceViewState> {
  constructor(props: InstanceViewProps) {
    super(props);
    this.state = {
      resourceType: this.getResourceType(),
    }
  }

  getResourceType(): CloudType {
    return CloudType.AWS;
    // 从 url 参数中提取
  }

  getNumberBoxes(): BoxInfo[] {
    return [{ title: '实例数量', count: 1 },
    { title: '运行中', count: 1 },
    { title: '即将过期', count: 1 },
    { title: '已过期', count: 1 }]
  }

  render() {
    const boxes = this.getNumberBoxes();
    return (
      <div className='instance-resource'>
        <div className='instance-resource--overview'>
          <NumberBox boxes={boxes}></NumberBox>
        </div>
        <div className='instance-resource--toolbar'>
          <Toolbar></Toolbar>
        </div>
        <div className='instance-resource--details'>
          {/* {instance_info.map(info => {
            return <InstanceBox></InstanceBox>
          })} */}
          <InstanceBox
          instanceId={'111'}
          instanceName={'111'}
          region={AwsRegion.Beijing}
          publicIp={'111'}
          status={InstanceStatus.Running}
          ></InstanceBox>
          <InstanceBox
          instanceId={'111'}
          instanceName={'111'}
          region={AwsRegion.Beijing}
          publicIp={'111'}
          status={InstanceStatus.Running}
          ></InstanceBox>
        </div>
      </div>
    );
  }
}
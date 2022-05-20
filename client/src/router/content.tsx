import React from 'react';
import { Routes, Route } from "react-router-dom";
import { CloudType, ResourceType } from '../common/enum';
import { HomePage } from '../views/home';
import InstanceView from '../views/instance_view';
import VPCGroupView from '../views/vpc_group_view';
import { connect } from 'react-redux';
import { GlobalState } from '../store/action_type';
import { Dispatch } from 'redux';
import { updateCloudTypeAction, updateResourceTypeAction } from '../store/action';

interface RouterViewProps {
  cloudType: CloudType;
  resourceType: ResourceType;
  updateCloudType: (type: CloudType) => void;
  updateResourceType: (type: ResourceType) => void;
}

class RouterView extends React.Component<RouterViewProps> {
  constructor(props: RouterViewProps) {
    super(props);
    this.setType();
  }

  setType = () => {
    const href = window.location.href;
    if (href.includes(CloudType.ALI) || href.includes(CloudType.AWS) || href.includes(CloudType.HUAWEI)) {
      const arr = href.split('/');
      let cloudType: CloudType = CloudType.AWS;
      arr.forEach(str => {
        if (str === CloudType.ALI || str === CloudType.AWS || str === CloudType.HUAWEI) {
          cloudType = str as CloudType;
        }
      })
      this.props.updateCloudType(cloudType);
    }
    if (href.includes('vpc')) {
      this.props.updateResourceType(ResourceType.VPCGroup);
    } else {
      this.props.updateResourceType(ResourceType.Instance);
    }
  }

  render() {
    const { cloudType } = this.props;
    return (
      <Routes>
        <Route path="/" element={<InstanceView cloudType={cloudType} />}></Route>
        <Route path="/instance/:cloudType" element={<InstanceView cloudType={cloudType} />}></Route>
        <Route path="/vpc/:cloudType" element={<VPCGroupView cloudType={cloudType} />}></Route>
      </Routes>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  cloudType: state.cloudType,
  resourceType: state.resourceType
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateCloudType: (cloudType: CloudType) => {
      dispatch(updateCloudTypeAction(cloudType));
    }, updateResourceType: (resourceType: ResourceType) => {
      dispatch(updateResourceTypeAction(resourceType));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterView);
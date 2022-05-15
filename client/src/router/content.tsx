import React from 'react';
import { Routes, Route } from "react-router-dom";
import { CloudType } from '../common/enum';
import { HomePage } from '../views/home';
import InstanceView from '../views/instance_view';
import { VpcView } from '../views/vpc_view';
import { SubnetView } from '../views/subnet_view';
import { RouteTableView } from '../views/route_table_view';
import { connect } from 'react-redux';
import { GlobalState } from '../store/action_type';
import { Dispatch } from 'redux';
import { updateCloudTypeAction } from '../store/action';

interface RouterViewProps {
  cloudType: CloudType;
  updateCloudType: (type: CloudType) => void;
}

class RouterView extends React.Component<RouterViewProps> {
  constructor(props: RouterViewProps) {
    super(props);
    this.setCloudType();
  }

  setCloudType = () => {
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
  }

  render() {
    const { cloudType } = this.props;
    return (
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/instance/:cloudType" element={<InstanceView cloudType={cloudType} />}></Route>
        <Route path="/vpc/:cloudType" element={<VpcView />}></Route>
        <Route path="/subnet/:cloudType" element={<SubnetView />}></Route>
        <Route path="/routetable/:cloudType" element={<RouteTableView />}></Route>
      </Routes>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  cloudType: state.cloudType
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateCloudType: (cloudType: CloudType) => {
      dispatch(updateCloudTypeAction(cloudType));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterView);
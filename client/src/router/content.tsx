import React from 'react';
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import { CloudType } from '../common/enum';
import { HomePage } from '../views/home';
import { InstanceView } from '../views/instance_view';
import { VpcView } from '../views/vpc_view';
import { SubnetView } from '../views/subnet_view';
import { RouteTableView } from '../views/route_table_view';

interface RouterViewProps {
  cloudType: CloudType;
}

export class RouterView extends React.Component<RouterViewProps> {
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
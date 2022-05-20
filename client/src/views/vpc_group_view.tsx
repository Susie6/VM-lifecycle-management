import React from 'react';
import { CloudType, ResourceType, VPCStatus, VPCStatusText } from '../common/enum';
import { ResponseData, AWSVPCInfo, AWSSubnetInfo, AWSSecGroupInfo, AliVPCInfo, AliVswitchInfo, AliSecGroupInfo, HuaweiVPCInfo, HuaweiSubnetInfo, HuaweiSecGroupInfo } from '../common/interface';
import { ResourceTable } from '../components/table';
import { message, Button, Modal, Tag, Spin } from 'antd';
import { post } from '../api/request';
import { Urls } from '../api/apis';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { GlobalState } from '../store/action_type';
import { updateResourceTypeAction } from '../store/action';

interface VPCGroupProps {
  cloudType: CloudType;
  resourceType: ResourceType;
  updateResourceType: (type: ResourceType) => void;
}

interface VPCGroupState {
  VPCInfo: AWSVPCInfo | AliVPCInfo | HuaweiVPCInfo | null;
  SubnetInfo: AWSSubnetInfo | AliVswitchInfo | HuaweiSubnetInfo | null;
  SecGroupInfo: AWSSecGroupInfo | AliSecGroupInfo | HuaweiSecGroupInfo | null;
  // modalVisible: boolean;
  loading: boolean;
}

class VPCGroupView extends React.Component<VPCGroupProps, VPCGroupState> {

  constructor(props: VPCGroupProps) {
    super(props);
    this.state = {
      VPCInfo: null,
      SubnetInfo: null,
      SecGroupInfo: null,
      // modalVisible: false,
      loading: true,
    }
  }

  componentWillReceiveProps(nextProps: VPCGroupProps) {
    this.setState({
      VPCInfo: null,
      SubnetInfo: null,
      SecGroupInfo: null,
      loading: true,
    });
    this.getGroupInfo(nextProps.cloudType);
  }

  componentDidMount() {
    this.getGroupInfo(this.props.cloudType);
  }

  getGroupInfo = (cloudType: CloudType) => {
    post(Urls.ShowVPC, { resource_type: cloudType }).then(data => {
      const res = data as ResponseData;
      let result;
      if (res.code === 0) {
        switch (cloudType) {
          case CloudType.AWS:
            result = res.result as { vpc: AWSVPCInfo, subnet: AWSSubnetInfo, security_group: AWSSecGroupInfo };
            this.setState({
              VPCInfo: result.vpc,
              SubnetInfo: result.subnet,
              SecGroupInfo: result.security_group,
            });
            break;
          case CloudType.ALI:
            result = res.result as { vpc: AliVPCInfo, vswitch: AliVswitchInfo, security_group: AliSecGroupInfo };
            this.setState({
              VPCInfo: result.vpc,
              SubnetInfo: result.vswitch,
              SecGroupInfo: result.security_group,
            });
            break;
          case CloudType.HUAWEI:
            result = res.result as { vpc: HuaweiVPCInfo, subnet: HuaweiSubnetInfo, security_group: HuaweiSecGroupInfo };
            this.setState({
              VPCInfo: result.vpc,
              SubnetInfo: result.subnet,
              SecGroupInfo: result.security_group,
            });
            break;
          default:
            this.setState({
              VPCInfo: null,
              SubnetInfo: null,
              SecGroupInfo: null,
            });
        }
      } else {
        message.error(res.msg);
      }
      this.setState({
        loading: false,
      })
    });
  }

  getVPCColumns() {
    const { cloudType } = this.props;
    let columns: { title: string; dataIndex: string; key: string; render?: (text?: string) => JSX.Element; }[] = [];
    switch (cloudType) {
      case CloudType.AWS:
        columns = [{
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: 'VPC ID',
          dataIndex: 'id',
          key: 'id',
        }, {
          title: 'IPv4 CIDR',
          dataIndex: 'cidr_blocks',
          key: 'cidr_blocks',
          render: text => <a>{text}</a>,
        }, {
          title: '子网个数',
          dataIndex: 'subnet_count',
          key: 'subnet_count',
        }, {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: text => <Tag color="green">{text}</Tag>
        }];
        break;
      case CloudType.ALI:
        columns = [{
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: 'VPC ID',
          dataIndex: 'id',
          key: 'id',
        }, {
          title: 'IPv4 CIDR',
          dataIndex: 'cidr_block',
          key: 'cidr_block',
          render: text => <a>{text}</a>,
        }, {
          title: '子网个数',
          dataIndex: 'subnet_count',
          key: 'subnet_count',
        }, {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: text => <Tag color="green">{text}</Tag>
        }];
        break;
      case CloudType.HUAWEI:
        columns = [{
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: 'VPC ID',
          dataIndex: 'id',
          key: 'id',
        }, {
          title: 'IPv4 CIDR',
          dataIndex: 'cidr',
          key: 'cidr',
          render: text => <a>{text}</a>,
        }, {
          title: '子网个数',
          dataIndex: 'subnet_count',
          key: 'subnet_count',
        }, {
          title: '地域',
          dataIndex: 'region',
          key: 'region',
        }, {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: text => <Tag color="green">{text}</Tag>
        }];
        break;
    }
    return columns;
  }

  getVPCData() {
    const { cloudType } = this.props;
    const { VPCInfo } = this.state;
    let data = [{}];
    let info;
    if (VPCInfo) {
      switch (cloudType) {
        case CloudType.AWS:
          info = VPCInfo as AWSVPCInfo;
          data = [{
            key: `${cloudType}_vpc`,
            name: info.name,
            id: info.id,
            cidr_blocks: info.cidr_blocks,
            subnet_count: 1,
            status: VPCStatusText[VPCStatus.Available],
          }];
          break;
        case CloudType.ALI:
          info = VPCInfo as AliVPCInfo;
          data = [{
            key: `${cloudType}_vpc`,
            name: info.name,
            id: info.id,
            cidr_block: info.cidr_block,
            subnet_count: 1,
            status: VPCStatusText[info.status as VPCStatus] || info.status,
          }];
          break;
        case CloudType.HUAWEI:
          info = VPCInfo as HuaweiVPCInfo;
          data = [{
            key: `${cloudType}_vpc`,
            name: info.name,
            id: info.id,
            cidr: info.cidr,
            subnet_count: 1,
            region: info.region,
            status: VPCStatusText[info.status as VPCStatus] || info.status,
          }];
          break;
      }
    }
    return data;
  }

  getSubnetColumns() {
    const { cloudType } = this.props;
    let columns: { title: string; dataIndex: string; key: string; render?: (text?: string) => JSX.Element; }[] = [];
    switch (cloudType) {
      case CloudType.AWS:
        columns = [
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '子网 ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: 'IPv4 CIDR',
            dataIndex: 'cidr_blocks',
            key: 'cidr_blocks',
            render: text => <a>{text}</a>,
          }, {
            title: '可用区',
            dataIndex: 'availability_zone',
            key: 'availability_zone',
          }, {
            title: 'VPC ID',
            dataIndex: 'vpc_id',
            key: 'vpc_id',
          }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: text => <Tag color="green">{text}</Tag>
          }
        ];
        break;
      case CloudType.ALI:
        columns = [
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: 'vswitch ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: 'IPv4 CIDR',
            dataIndex: 'cidr_block',
            key: 'cidr_block',
            render: text => <a>{text}</a>,
          }, {
            title: '可用区',
            dataIndex: 'availability_zone',
            key: 'availability_zone',
          }, {
            title: 'VPC ID',
            dataIndex: 'vpc_id',
            key: 'vpc_id',
          }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: text => <Tag color="green">{text}</Tag>
          }
        ];
        break;
      case CloudType.HUAWEI:
        columns = [
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '子网 ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: 'IPv4 CIDR',
            dataIndex: 'cidr',
            key: 'cidr',
            render: text => <a>{text}</a>,
          }, {
            title: '地域',
            dataIndex: 'region',
            key: 'region',
          }, {
            title: '可用区',
            dataIndex: 'availability_zone',
            key: 'availability_zone',
          }, {
            title: '网关IP',
            dataIndex: 'gateway_ip',
            key: 'gateway_ip',
          }, {
            title: 'VPC ID',
            dataIndex: 'vpc_id',
            key: 'vpc_id',
          }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: text => <Tag color="green">{text}</Tag>
          }
        ];
        break;
    }
    return columns;
  }

  getSubnetData() {
    const { cloudType } = this.props;
    const { SubnetInfo } = this.state;
    let data = [{}];
    let info;
    if (SubnetInfo) {
      switch (cloudType) {
        case CloudType.AWS:
          info = SubnetInfo as AWSSubnetInfo;
          data = [{
            key: `${cloudType}_subnet`,
            name: info.name,
            id: info.id,
            cidr_blocks: info.cidr_blocks,
            availability_zone: info.availability_zone,
            vpc_id: info.vpc_id,
            status: VPCStatusText[VPCStatus.Available],
          }];
          break;
        case CloudType.ALI:
          info = SubnetInfo as AliVswitchInfo;
          data = [{
            key: `${cloudType}_vswitch`,
            name: info.name,
            id: info.id,
            cidr_block: info.cidr_block,
            availability_zone: info.availability_zone,
            vpc_id: info.vpc_id,
            status: VPCStatusText[info.status as VPCStatus] || info.status,
          }];
          break;
        case CloudType.HUAWEI:
          info = SubnetInfo as HuaweiSubnetInfo;
          data = [{
            key: `${cloudType}_subnet`,
            name: info.name,
            id: info.subnet_id,
            cidr: info.cidr,
            region: info.region,
            availability_zone: info.availability_zone,
            gateway_ip: info.gateway_ip,
            vpc_id: info.vpc_id,
            status: VPCStatusText[info.status as VPCStatus] || info.status,
          }];
          break;
      }
    }
    return data;
  }

  getSecGroupColumns = () => {
    const { cloudType } = this.props;
    let columns: { title: string; dataIndex: string; key: string; render?: () => JSX.Element; }[] = [];
    switch (cloudType) {
      case CloudType.AWS:
        columns = [
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '安全组 ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: 'VPC ID',
            dataIndex: 'vpc_id',
            key: 'vpc_id',
          },
          // {
          //   title: '出入站规则',
          //   dataIndex: 'rule',
          //   key: 'rule',
          //   render: () => (
          //     <Button onClick={this.showSecGroupRule} type='link'>查看出入站规则</Button>
          //   ),
          // }
        ];
        break;
      case CloudType.ALI:
        columns = [
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '安全组 ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: 'VPC ID',
            dataIndex: 'vpc_id',
            key: 'vpc_id',
          },
          // {
          //   title: '出入站规则',
          //   dataIndex: 'rule',
          //   key: 'rule',
          //   render: () => (
          //     <Button onClick={this.showSecGroupRule} type='link'>查看出入站规则</Button>
          //   ),
          // }
        ];
        break;
      case CloudType.HUAWEI:
        columns = [
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: '安全组 ID',
            dataIndex: 'id',
            key: 'id',
          }, {
            title: 'VPC ID',
            dataIndex: 'vpc_id',
            key: 'vpc_id',
          }, {
            title: '地域',
            dataIndex: 'region',
            key: 'region',
          },
          // {
          //   title: '出入站规则',
          //   dataIndex: 'rule',
          //   key: 'rule',
          //   render: () => (
          //     <Button onClick={this.showSecGroupRule} type='link'>查看出入站规则</Button>
          //   ),
          // }
        ];
        break;
    }
    return columns;
  }

  getSecGroupData() {
    const { cloudType } = this.props;
    const { SecGroupInfo, VPCInfo } = this.state;
    let data = [{}];
    let info;
    if (SecGroupInfo) {
      switch (cloudType) {
        case CloudType.AWS:
          info = SecGroupInfo as AWSSecGroupInfo;
          data = [{
            key: `${cloudType}_sec_group`,
            name: info.name,
            id: info.id,
            vpc_id: info.vpc_id,
          }];
          break;
        case CloudType.ALI:
          info = SecGroupInfo as AliSecGroupInfo;
          data = [{
            key: `${cloudType}_sec_group`,
            name: info.name,
            id: info.id,
            vpc_id: info.vpc_id,
          }];
          break;
        case CloudType.HUAWEI:
          info = SecGroupInfo as HuaweiSecGroupInfo;
          data = [{
            key: `${cloudType}_sec_group`,
            name: info.name,
            id: info.id,
            vpc_id: VPCInfo?.id,
            region: info.region,
          }];
          break;
      }
    }

    return data;
  }

  // showSecGroupRule = () => {
  //   this.setModalVisible(true);
  // }

  // setModalVisible = (visible: boolean) => {
  //   this.setState({
  //     modalVisible: visible,
  //   });
  // }

  // getSecRuleColumns() {
  //   const { cloudType } = this.props;
  //   let columns: { title: string; dataIndex: string; key: string; render?: () => JSX.Element; }[] = [];
  //   switch(cloudType){
  //     case CloudType.AWS:
  //       columns = [
  //         {
  //           title: '类型',
  //           dataIndex: 'name',
  //           key: 'name',
  //         },
  //       ]
  //   }
  //   return columns;
  // }

  // getSecRuleData() {

  // }

  // renderModalContent = () => {
  //   const { cloudType } = this.props;
  //   const { SecGroupInfo } = this.state;
  //   switch(cloudType){
  //     case CloudType.AWS:
  //       return
  //   }
  // }

  render() {
    const { cloudType } = this.props;
    const { loading } = this.state;
    const vpcColumns = this.getVPCColumns();
    const vpcData = this.getVPCData();
    const subnetColumns = this.getSubnetColumns();
    const subnetData = this.getSubnetData();
    const secGroupColumns = this.getSecGroupColumns();
    const secGroupData = this.getSecGroupData();
    const tableTitles = {
      VPC: 'VPC',
      Subnet: cloudType === CloudType.ALI ? 'VSwitch' : '子网',
      SecGroup: '安全组'
    }
    return (
      <div>
        <Spin size='large' spinning={loading} tip='加载中……' >
          <ResourceTable
            title={tableTitles.VPC}
            columns={vpcColumns}
            dataSource={vpcData}
          />
          <ResourceTable
            title={tableTitles.Subnet}
            columns={subnetColumns}
            dataSource={subnetData}
          />
          <ResourceTable
            title={tableTitles.SecGroup}
            columns={secGroupColumns}
            dataSource={secGroupData}
          />
          {/* <Modal></Modal> */}
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  resourceType: state.resourceType,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateResourceType: (resourceType: ResourceType) => {
      dispatch(updateResourceTypeAction(resourceType));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VPCGroupView);

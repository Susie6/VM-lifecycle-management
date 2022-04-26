import React from 'react';
import { Drawer, Steps } from 'antd';
import { DrawerType, CloudType } from '../common/enum';
import { ResponseData, StaticProfileForm, HuaweiForm, AliForm, AwsForm } from '../common/interface';
import { InstanceForm } from '../components/instance_form';
import { ProfileForm } from '../components/profile_form';
import { post } from '../api/request';
import { Urls } from '../api/apis';
import './add_or_edit.css';

interface DrawerProps {
  type: DrawerType;
  cloudType: CloudType;
  visible: boolean;
  onClose: () => void;
}

interface DrawerState {
  visible: boolean;
  current: number;
}

export class DrawerView extends React.Component<DrawerProps, DrawerState> {
  constructor(props: DrawerProps) {
    super(props);
    this.state = {
      visible: false,
      current: 0,
    }
  }

  componentWillReceiveProps(nextProps: DrawerProps) {
    this.setDrawerVisible(nextProps.visible);
  }

  submitProfileForm = (values: StaticProfileForm) => {
    const { cloudType } = this.props;
    const postData = {
      resource_type: cloudType,
      access_key: values.access_key,
      secret_key: values.secret_key,
      region: values.region,
    }
    post(Urls.StaticProfile, postData).then((data) => {
      const res = data as ResponseData;
      if (res.code === 0) {
        console.log(res);
        this.setState({
          current: 1,
        });
      }
    })
  }

  submitInstanceForm = (values: HuaweiForm | AwsForm | AliForm) => {
    const { cloudType } = this.props;
    post(Urls.ApplyResource, { ...values, resource_type: cloudType }).then((data) => {
      const res = data as ResponseData;
      if (res.code === 0) {
        console.log(res);
        this.setState({
          current: 0,
        });
        this.setDrawerVisible(false);
      }
    })
  }

  onCancel = () => {
    this.setDrawerVisible(false);
  }

  setDrawerVisible = (visible: boolean) => {
    this.setState({
      visible,
    });
  };

  render() {
    const { type, cloudType, onClose } = this.props;
    const { current } = this.state;
    const steps = [
      {
        title: `${cloudType}云 身份凭证确认`,
        content: <ProfileForm cloudType={cloudType} onClickCancel={this.onCancel} onClickSubmit={this.submitProfileForm} />,
      },
      {
        title: `${cloudType}云 实例信息输入`,
        content: <InstanceForm cloudType={cloudType} drawerType={type} onClickCancel={this.onCancel} onClickSubmit={this.submitInstanceForm} />,
      }
    ];
    return (
      <div>
        <Drawer
          title={type === DrawerType.ADD ? '创建实例' : '修改实例'}
          width={720}
          onClose={onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Steps current={current}>
            {steps.map(item => (
              <Steps.Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
        </Drawer>
      </div>
    );
  }
}
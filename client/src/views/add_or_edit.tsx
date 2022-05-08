import React from 'react';
import { Drawer, Steps, message } from 'antd';
import { DrawerType, CloudType, AwsRegion, AliRegion, HuaweiRegion } from '../common/enum';
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
  instanceId?: string | null;
  instanceKey?: string | null;
  onClose: () => void;
}

interface DrawerState {
  visible: boolean;
  current: number;
  disableSubmit: boolean;
}

export class DrawerView extends React.Component<DrawerProps, DrawerState> {
  public region: AwsRegion | AliRegion | HuaweiRegion | null;
  constructor(props: DrawerProps) {
    super(props);
    this.state = {
      visible: false,
      current: 0,
      disableSubmit: false,
    }
    this.region = null;
  }

  componentWillReceiveProps(nextProps: DrawerProps) {
    this.setDrawerVisible(nextProps.visible);
  }

  submitProfileForm = (values: StaticProfileForm) => {
    const { cloudType } = this.props;
    this.setSubmitBtnDisable(true);
    const postData = {
      resource_type: cloudType,
      access_key: values.access_key,
      secret_key: values.secret_key,
      region: values.region,
    }
    this.region = values.region;
    const msgKey = 'static';
    message.loading({ content: '正在执行初始化...', key: msgKey, duration: 10 });
    post(Urls.StaticProfile, postData).then((data) => {
      const res = data as ResponseData;
      console.log(res);
      if (res.code === 0) {
        this.setState({
          current: 1,
        });
        message.success({ content: res.msg, key: msgKey });
      } else {
        message.error({ content: res.msg, key: msgKey });
      }
      this.setSubmitBtnDisable(false);
    }).catch(err => {
      console.log(err);
    })
  }

  submitInstanceForm = (values: HuaweiForm | AwsForm | AliForm) => {
    const { cloudType, type, instanceKey } = this.props;
    this.setSubmitBtnDisable(true);
    if (type === DrawerType.ADD) {
      const msgKey = 'create';
      message.loading({ content: '正在创建云资源...', key: msgKey, duration: 20 });
      post(Urls.ApplyResource, { ...values, resource_type: cloudType }).then((data) => {
        const res = data as ResponseData;
        if (res.code === 0) {
          console.log(res);
          this.setState({
            current: 0,
          });
          message.success({ content: res.msg, key: msgKey });
          this.setDrawerVisible(false);
        } else {
          message.error({ content: res.msg, key: msgKey });
          this.setSubmitBtnDisable(false);
        }
      })
    } else {
      const msgKey = 'update';
      message.loading({ content: '正在升级云资源...', key: msgKey, duration: 20 });
      post(Urls.UpdateInstanceInfo, { modified_result: values, resource_type: cloudType, instance_key: instanceKey }).then((data) => {
        const res = data as ResponseData;
        if (res.code === 0) {
          this.setState({
            current: 0,
          });
          message.success({ content: res.msg, key: msgKey });
          this.setDrawerVisible(false);
        } else {
          message.error({ content: res.msg, key: msgKey });
          this.setSubmitBtnDisable(false);
        }
      })
    }
  }

  setSubmitBtnDisable = (disableSubmit: boolean) => {
    this.setState({
      disableSubmit,
    })
  }

  setDrawerVisible = (visible: boolean) => {
    this.setState({
      visible,
    });
  };

  render() {
    const { type, cloudType, instanceId, onClose } = this.props;
    const { current, disableSubmit } = this.state;
    const steps = [
      {
        title: `${cloudType} 身份凭证确认`,
        content: <ProfileForm cloudType={cloudType} onClickCancel={() => this.setDrawerVisible(false)} onClickSubmit={this.submitProfileForm} disableSubmit={disableSubmit} />,
      },
      {
        title: `${cloudType} 实例信息输入`,
        content: <InstanceForm cloudType={cloudType} drawerType={type} region={this.region} onClickCancel={() => this.setDrawerVisible(false)} onClickSubmit={this.submitInstanceForm} instanceId={instanceId} disableSubmit={disableSubmit} />,
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
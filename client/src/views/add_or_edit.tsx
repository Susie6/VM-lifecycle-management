import React from 'react';
import { Drawer, Steps, message } from 'antd';
import { DrawerType, CloudType, AwsRegion, AliRegion, HuaweiRegion } from '../common/enum';
import { ResponseData, StaticProfileForm, HuaweiForm, AliForm, AwsForm } from '../common/interface';
import { InstanceForm } from '../components/instance_form';
import { ProfileForm } from '../components/profile_form';
import { post } from '../api/request';
import { Urls } from '../api/apis';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { GlobalState } from '../store/action_type';
import { setCreateDrawerVisibleAction } from '../store/action';
import './add_or_edit.css';

interface DrawerProps {
  type: DrawerType;
  cloudType: CloudType;
  visible: boolean;
  instanceId?: string | null;
  instanceKey?: string | null;
  onClose: () => void;
  setCreateDrawerVisible: (visible: boolean) => void;
  synchronizeResources: () => void;
}

interface DrawerState {
  current: number;
  disableSubmit: boolean;
}

class DrawerView extends React.Component<DrawerProps, DrawerState> {
  public region: AwsRegion | AliRegion | HuaweiRegion | null;
  constructor(props: DrawerProps) {
    super(props);
    this.state = {
      current: 0,
      disableSubmit: false,
    }
    this.region = null;
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
    const loading = message.loading('正在执行初始化...', 0);
    post(Urls.StaticProfile, postData).then((data) => {
      const res = data as ResponseData;
      loading();
      if (res.code === 0) {
        this.setState({
          current: 1,
        });
        message.success(res.msg);
      } else {
        message.error(res.msg);
      }
      this.setSubmitBtnDisable(false);
    }).catch(err => {
      console.log(err);
    })
  }

  submitInstanceForm = (values: HuaweiForm | AwsForm | AliForm) => {
    const { cloudType, type, instanceKey, setCreateDrawerVisible, synchronizeResources } = this.props;
    this.setSubmitBtnDisable(true);
    if (type === DrawerType.ADD) {
      const loading = message.loading('正在创建云资源，可能需要等待一会...', 0);
      post(Urls.ApplyResource, { ...values, resource_type: cloudType }).then((data) => {
        const res = data as ResponseData;
        loading();
        if (res.code === 0) {
          this.setState({
            current: 0,
          });
          message.success(res.msg);
          setCreateDrawerVisible(false);
          synchronizeResources();
        } else {
          message.error(res.msg);
          this.setSubmitBtnDisable(false);
        }
      })
    } else {
      const loading = message.loading('正在升级云资源，可能需要一会...', 0);
      post(Urls.UpdateInstanceInfo, { modified_result: values, resource_type: cloudType, instance_key: instanceKey }).then((data) => {
        const res = data as ResponseData;
        loading();
        if (res.code === 0) {
          this.setState({
            current: 0,
          });
          message.success(res.msg);
          setCreateDrawerVisible(false);
          synchronizeResources();
        } else {
          message.error(res.msg);
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

  cancelEdit = () => {
    const { onClose } = this.props;
    onClose();
    this.setState({
      current: 0,
    })
  }

  render() {
    const { type, cloudType, instanceId } = this.props;
    const { current, disableSubmit } = this.state;
    const steps = [
      {
        title: `${cloudType} 身份凭证确认`,
        content: <ProfileForm cloudType={cloudType} onClickCancel={this.cancelEdit} onClickSubmit={this.submitProfileForm} disableSubmit={disableSubmit} />,
      },
      {
        title: `${cloudType} 实例信息输入`,
        content: <InstanceForm cloudType={cloudType} drawerType={type} region={this.region} onClickCancel={this.cancelEdit} onClickSubmit={this.submitInstanceForm} instanceId={instanceId} disableSubmit={disableSubmit} />,
      }
    ];
    return (
      <div>
        <Drawer
          title={type === DrawerType.ADD ? '创建实例' : '修改实例'}
          width={1000}
          onClose={this.cancelEdit}
          visible={this.props.visible}
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

const mapStateToProps = (state: GlobalState) => ({
  visible: state.createDrawerVisible,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setCreateDrawerVisible: (visible: boolean) => {
      dispatch(setCreateDrawerVisibleAction(visible));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerView);
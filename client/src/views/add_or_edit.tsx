import React from 'react';
import { Drawer, Form, Button, Select, Steps } from 'antd';
import { DrawerType, CloudType } from '../common/enum';

const { Option } = Select;

interface DrawerProps {
  type: DrawerType;
  resourceType: CloudType;
  visible: boolean;
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

  componentWillReceiveProps(prevProps: DrawerProps, nextProps: DrawerProps) {
    if (prevProps.visible !== nextProps.visible) {
      this.setDrawerVisible(nextProps.visible);
    }
  }

  setDrawerVisible = (visible: boolean) => {
    this.setState({
      visible,
    });
  };

  render() {
    const { type, resourceType } = this.props;
    const { current } = this.state;
    const steps = [
      {
        title: `${resourceType}云 身份凭证确认`,
        content: 'First-content',
      },
      {
        title: `${resourceType}云 实例信息输入`,
        content: 'Second-content',
      }
    ];
    return (
      <div>
        <Drawer
          title={type === DrawerType.ADD ? '创建实例' : '修改实例'}
          width={720}
          onClose={() => this.setDrawerVisible(false)}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Steps current={current}>
            {steps.map(item => (
              <Steps.Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
          <Form layout="vertical" hideRequiredMark>

          </Form>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={() => this.setDrawerVisible(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={() => this.setDrawerVisible(false)} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}
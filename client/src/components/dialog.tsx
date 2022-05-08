import React from 'react';
import { Button, Modal } from 'antd';

interface DialogProps {
  title: string;
  content: string;
  visible: boolean;
  disableSubmit: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

interface DialogState {
  isModalVisible: boolean;
  disableSubmit: boolean;
}

export class Dialog extends React.Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);
    this.state = {
      isModalVisible: false,
      disableSubmit: false,
    }
  }

  componentWillReceiveProps(nextProps: DialogProps) {
    this.setIsModalVisible(nextProps.visible);
    this.setSubmitBtnDisable(nextProps.disableSubmit);
  }

  setIsModalVisible(visible: boolean) {
    this.setState({
      isModalVisible: visible,
    })
  }

  setSubmitBtnDisable = (disableSubmit: boolean) => {
    this.setState({
      disableSubmit,
    })
  }

  handleOk = () => {
    this.props.onConfirm();
  };

  handleCancel = () => {
    this.props.onClose();
  };

  render() {
    const { title, content } = this.props;
    const { isModalVisible, disableSubmit } = this.state;
    return (
      <Modal
        title={title}
        visible={isModalVisible}
        // onOk={this.handleOk}
        // onCancel={this.handleCancel}
        footer={[
          <Button type="primary" onClick={this.handleCancel} disabled={disableSubmit}>取消</Button>,
          <Button type="primary" onClick={this.handleOk} disabled={disableSubmit}>确认</Button>
        ]}
      >
        <div>{content}</div>
      </Modal>
    );
  }
}

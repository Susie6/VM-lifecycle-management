import React from 'react';
import { Modal } from 'antd';

interface DialogProps {
  title: string;
  content: string;
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

interface DialogState {
  isModalVisible: boolean;
}

export class Dialog extends React.Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);
    this.state = {
      isModalVisible: false,
    }
  }

  componentWillReceiveProps(nextProps: DialogProps) {
    this.setIsModalVisible(nextProps.visible);
  }

  setIsModalVisible(visible: boolean) {
    this.setState({
      isModalVisible: visible,
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
    const { isModalVisible } = this.state;
    return (
      <Modal title={title} visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <div>{content}</div>
      </Modal>
    );
  }
}

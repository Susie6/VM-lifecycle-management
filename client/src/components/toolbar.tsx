import React from 'react';
import { Button } from 'antd';

interface ToolbarProps {
  onAddInstance: () => void;
}

export class Toolbar extends React.Component<ToolbarProps> {
  render() {
    const { onAddInstance } = this.props;
    return (
      <>
        <Button type="primary" size="large" onClick={onAddInstance}>创建实例</Button>
      </>
    );
  }
}
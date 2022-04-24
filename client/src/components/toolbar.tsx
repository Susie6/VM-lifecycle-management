import React from 'react';
import { Button } from 'antd';

interface ToolbarProps {

}

export class Toolbar extends React.Component<ToolbarProps> {
  render() {
    return (
      <>
        <Button type="primary" size="large">创建实例</Button>
      </>
    );
  }
}
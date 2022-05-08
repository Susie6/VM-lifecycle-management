import React from 'react';
import { Empty } from 'antd';

interface EmptyViewProps {
  description: string
}

export class EmptyView extends React.Component<EmptyViewProps> {
  render() {
    const { description } = this.props;
    return (
      <Empty
        description={
          <span>
            {description}
          </span>
        }
      />
    );
  }
}
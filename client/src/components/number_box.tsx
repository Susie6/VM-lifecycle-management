import React from 'react';
import { Statistic, Row, Col, Card } from 'antd';
import { BoxInfo } from '../common/interface';
import './number_box.css';

interface NumberBoxProps {
  boxes: BoxInfo[];
}

const GridCol = 24;

export class NumberBox extends React.Component<NumberBoxProps> {
  render() {
    const { boxes } = this.props;
    const colWidth = GridCol / boxes.length;
    return (
      <div className='number-box'>
        <Row justify="space-around" align="middle" gutter={10}>
          {
            boxes.map((box, index) => {
              return <Col span={colWidth} key={index}>
                <Card>
                  <Statistic title={box.title} value={box.count} />
                </Card>
              </Col>
            })
          }
        </Row>
      </div>
    );
  }
}
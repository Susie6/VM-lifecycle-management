import React from 'react';
import { Layout, Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { VerticalMenu } from '../components/vertical_menu';
import { CloudType, MenuSubItemType } from '../common/enum';
import { InstanceView } from './instance_view';
import './layout.css';

interface PageLayoutProps { };

export class PageLayout extends React.Component<PageLayoutProps> {
  getMenuOptions(type: CloudType) {
    return [{
      key: `${type}_${MenuSubItemType.Other}`,
      label: MenuSubItemType.Other,
      options: [{
        key: `${type}_vpc`,
        label: 'VPC',
      },{
        key: `${type}_subnet`,
        label: '子网',
      },{
        key: `${type}_route_table`,
        label: '路由表',
      }]
    }, {
      key: `${type}_${MenuSubItemType.Instance}`,
      label: MenuSubItemType.Instance,
      options: [{
        key: `${type}_instance`,
        label: '云实例',
      }]
    }];
  }

  handleMenuClick = (key: any) => {
    console.log(key);
  }

  render() {
    const { Header, Content, Sider } = Layout;
    const menuItems = [{
      key: CloudType.AWS,
      label: 'AWS',
      options: this.getMenuOptions(CloudType.AWS),
    }, {
      key: CloudType.ALI,
      label: 'ALI',
      options: this.getMenuOptions(CloudType.ALI),
    }, {
      key: CloudType.HUAWEI,
      label: 'HUAWEI',
      options: this.getMenuOptions(CloudType.HUAWEI),
    }];
    return (
      <>
        <Layout>
          <Header className="header">
            <div className="logo" />
            {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
            <Menu mode="horizontal" defaultSelectedKeys={['mail']} theme="dark">
              <Menu.Item key="mail" icon={<MailOutlined />}>
                Navigation One
              </Menu.Item>
              <Menu.SubMenu key="SubMenu" title="Navigation Three - Submenu" icon={<SettingOutlined />}>
                <Menu.ItemGroup title="Item 1">
                  <Menu.Item key="app" icon={<AppstoreOutlined />}>
                    Navigation Two
                  </Menu.Item>
                  <Menu.Item key="disabled" disabled>
                    Navigation Three
                  </Menu.Item>
                </Menu.ItemGroup>
              </Menu.SubMenu>
            </Menu>
          </Header>
          <Layout>
            <Sider width={256} className="site-layout-background">
              <VerticalMenu
                selectedKey={menuItems[0].key}
                openKey={menuItems[0].key}
                menuItems={menuItems}
                handleMenuClick={this.handleMenuClick}
              />
            </Sider>
            <Layout style={{ position: 'relative' }}>
              <Content
                className="site-layout-background"
              >
                <InstanceView></InstanceView>
              </Content>
            </Layout>
          </Layout>
        </Layout >
      </>
    );
  }
}
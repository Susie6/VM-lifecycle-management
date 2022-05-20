import React from 'react';
import { Layout, Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import VerticalMenu from '../components/vertical_menu';
import { CloudType, MenuSubItemType, ResourceType } from '../common/enum';
import { useNavigate } from 'react-router-dom';
import './layout.css';
import RouterView from '../router/content';

interface PageLayoutProps { };

export function PageLayout(props: PageLayoutProps) {
  // const [cloudType, setCloudType] = useState(CloudType.AWS);
  const getMenuOptions = (type: CloudType) => {
    return [{
      key: `${type}_${MenuSubItemType.Other}`,
      label: MenuSubItemType.Other,
      options: [{
        key: `${type}_vpc`,
        label: 'VPC资源组',
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
  const navigate = useNavigate();

  const handleMenuClick = (e: any) => {
    const arr = e.key.split('_');
    const cloudType = arr[0] as CloudType;
    navigate(`/${arr[1]}/${cloudType}`);
    // setCloudType(cloudType);
    let resourceType = ResourceType.Instance;
    if (arr[1] !== ResourceType.Instance) resourceType = ResourceType.VPCGroup;
    return { cloudType, resourceType };
  }

  const { Header, Content, Sider } = Layout;
  const menuItems = [{
    key: CloudType.AWS,
    label: 'AWS',
    options: getMenuOptions(CloudType.AWS),
  }, {
    key: CloudType.ALI,
    label: 'ALI',
    options: getMenuOptions(CloudType.ALI),
  }, {
    key: CloudType.HUAWEI,
    label: 'HUAWEI',
    options: getMenuOptions(CloudType.HUAWEI),
  }];
  return (
    <>
      <Layout>
        <Header className="header">
          {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} /> */}
          <h1 className='h1-font'>多云资源生命周期管理系统</h1>
        </Header>
        <Layout>
          <Sider width={256} className="site-layout-background">
            <VerticalMenu
              selectedKey={menuItems[0].key}
              openKey={menuItems[0].key}
              menuItems={menuItems}
              handleMenuClick={handleMenuClick}
            />
          </Sider>
          <Layout style={{ position: 'relative' }}>
            <Content
              className="site-layout-background"
            >
              <RouterView />
            </Content>
          </Layout>
        </Layout>
      </Layout >
    </>
  );
}
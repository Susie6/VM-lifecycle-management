import React from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

interface MenuOption {
  key: string; // 导航值
  label: string; //导航名称
  // disabled: boolean;
  icon?: JSX.Element;
}

interface MenuSubItem extends MenuOption { // item group
  options: MenuOption[];
}

interface MenuItem extends MenuOption {
  options: MenuSubItem[];
}

interface VerticalMenuProps {
  selectedKey: string;
  openKey: string;
  menuItems: MenuItem[];
  handleMenuClick: (e: any) => void;
};

interface VerticalMenuState {
  openKeys: string[];
}

export class VerticalMenu extends React.Component<VerticalMenuProps, VerticalMenuState> {
  public rootSubmenuKeys: string[];
  constructor(props: VerticalMenuProps) {
    super(props);
    this.rootSubmenuKeys = [];
  }
  handleClick() {

  }

  // onOpenChange = (openKeys: string[]) => {
  //   const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
  //   if (latestOpenKey && this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //     this.setState({ openKeys });
  //   } else {
  //     this.setState({
  //       openKeys: latestOpenKey ? [latestOpenKey] : [],
  //     });
  //   }
  // };

  render() {
    const { SubMenu } = Menu;
    const { selectedKey, openKey, menuItems, handleMenuClick } = this.props;

    return (
      <Menu
        onClick={handleMenuClick}
        // onOpenChange={this.onOpenChange}
        style={{ width: 256 }}
        defaultSelectedKeys={[selectedKey]}
        defaultOpenKeys={[openKey]}
        mode="inline"
        theme="dark"
      >
        {
          menuItems.map(item => {
            return <SubMenu key={item.key} icon={item.icon} title={item.label}>
              {
                item.options.map(option => {
                  return <Menu.ItemGroup title={option.label} key={option.key}>
                    {option.options.map(op => {
                      return <Menu.Item key={op.key} icon={op.icon}>{op.label}</Menu.Item>
                    })}
                  </Menu.ItemGroup>
                })
              }
            </SubMenu>
          })
        }
      </Menu>
    );
  };
}
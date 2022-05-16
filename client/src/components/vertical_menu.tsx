import React from 'react';
import { Menu } from 'antd';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CloudType } from '../common/enum';
import { updateCloudTypeAction } from '../store/action';
import { store } from '../store/store';

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
  handleMenuClick: (e: any) => CloudType;
};

interface VerticalMenuReduxProps {
  updateCloudType: (type: CloudType) => void;
}

type VerticalMenuAllProps = VerticalMenuProps & VerticalMenuReduxProps;

interface VerticalMenuState {
  openKeys: string[];
}

class VerticalMenu extends React.Component<VerticalMenuAllProps, VerticalMenuState> {
  public rootSubmenuKeys: string[];
  constructor(props: VerticalMenuAllProps) {
    super(props);
    this.rootSubmenuKeys = [];
  }

  handleClick = (e: any) => {
    const { handleMenuClick, updateCloudType } = this.props;
    const cloudType = handleMenuClick(e);
    updateCloudType(cloudType);
    console.log(store.getState());
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
    const { selectedKey, openKey, menuItems } = this.props;

    return (
      <Menu
        onClick={this.handleClick}
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

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateCloudType: (cloudType: CloudType) => {
      dispatch(updateCloudTypeAction(cloudType));
    }
  }
}
export default connect(null, mapDispatchToProps)(VerticalMenu);
import React from 'react';
import { Menu } from 'antd';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CloudType, ResourceType } from '../common/enum';
import { updateCloudTypeAction, updateResourceTypeAction, updateInstanceListAction } from '../store/action';
import { InstanceBoxInfo } from './instance_box';
import { GlobalState } from '../store/action_type';

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
  handleMenuClick: (e: any) => { cloudType: CloudType, resourceType: ResourceType };
};

interface VerticalMenuReduxProps {
  cloudType: CloudType;
  resourceType: ResourceType;
  updateCloudType: (type: CloudType) => void;
  updateResourceType: (resourceType: ResourceType) => void;
  updateInstanceList: (list: InstanceBoxInfo[] | null) => void;
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
    const { cloudType, resourceType, handleMenuClick, updateCloudType, updateResourceType, updateInstanceList } = this.props;
    const { cloudType: newCloudType, resourceType: newResourceType } = handleMenuClick(e);
    if (cloudType !== newCloudType || resourceType !== newResourceType) {
      updateCloudType(newCloudType);
      updateResourceType(newResourceType);
      updateInstanceList(null);
    }
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

const mapStateToProps = (state: GlobalState) => ({
  cloudType: state.cloudType,
  resourceType: state.resourceType
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateCloudType: (cloudType: CloudType) => {
      dispatch(updateCloudTypeAction(cloudType));
    },
    updateResourceType: (resourceType: ResourceType) => {
      dispatch(updateResourceTypeAction(resourceType));
    },
    updateInstanceList: (list: InstanceBoxInfo[] | null) => {
      dispatch(updateInstanceListAction(list))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(VerticalMenu);
import { CloudType, ResourceType } from "../common/enum";
import { InstanceBoxInfo } from '../components/instance_box';

export enum ActionType {
  UpdateCloudType = 'update_cloud_type',
  UpdateResourceType = 'update_resource_type',
  UpdateInstanceList = 'update_instance_list',
  SetCreateDrawerVisible = 'set_create_drawer_visible',
  SetLookupDrawerVisible = 'set_lookup_drawer_visible',
}

export interface IAction<T> {
  type: ActionType;
  payload: {
    newState: T;
  };
}

export interface GlobalState {
  cloudType: CloudType;
  resourceType: ResourceType;
  instanceList: InstanceBoxInfo[] | null;
  createDrawerVisible: boolean;
  lookupDrawerVisible: boolean;
}
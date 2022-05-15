import { CloudType } from "../common/enum";
import { InstanceBoxInfo } from '../components/instance_box';

export enum ActionType {
  UpdateCloudType = 'update_cloud_type',
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
  instanceList: InstanceBoxInfo[] | null;
  createDrawerVisible: boolean;
  lookupDrawerVisible: boolean;
}
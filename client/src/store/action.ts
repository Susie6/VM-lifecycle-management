import { CloudType, ResourceType } from "../common/enum";
import { ActionType } from "./action_type";
import { InstanceBoxInfo } from '../components/instance_box';

export function updateCloudTypeAction(type: CloudType) {
  return {
    type: ActionType.UpdateCloudType,
    payload: {
      newState: type,
    }
  }
}

export function updateResourceTypeAction(type: ResourceType) {
  return {
    type: ActionType.UpdateResourceType,
    payload: {
      newState: type,
    }
  }
}

export function updateInstanceListAction(list: InstanceBoxInfo[] | null) {
  return {
    type: ActionType.UpdateInstanceList,
    payload: {
      newState: list,
    }
  }
}

export function setCreateDrawerVisibleAction(visible: boolean) {
  return {
    type: ActionType.SetCreateDrawerVisible,
    payload: {
      newState: visible,
    }
  }
}

export function setLookupDrawerVisibleAction(visible: boolean) {
  return {
    type: ActionType.SetLookupDrawerVisible,
    payload: {
      newState: visible,
    }
  }
}
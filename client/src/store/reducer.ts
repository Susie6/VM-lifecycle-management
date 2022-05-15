import { ActionType, IAction } from "./action_type";
import { initState } from './store';

export const reducer = (state = initState, action: IAction<any>) => {
  switch (action.type) {
    case ActionType.UpdateCloudType:
      return {
        ...state,
        cloudType: action.payload.newState,
      };
    case ActionType.UpdateInstanceList:
      return {
        ...state,
        instanceList: action.payload.newState,
      }
    case ActionType.SetCreateDrawerVisible:
      return {
        ...state,
        createDrawerVisible: action.payload.newState,
      }
    case ActionType.SetLookupDrawerVisible:
      return {
        ...state,
        lookupDrawerVisible: action.payload.newState,
      }
    default:
      return state;
  }
}
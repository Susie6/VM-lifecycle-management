import { createStore } from 'redux';
import { reducer } from './reducer';
import { GlobalState } from './action_type'
import { CloudType } from '../common/enum';

export const initState: GlobalState = {
  cloudType: CloudType.AWS,
  instanceList: null,
  createDrawerVisible: false,
  lookupDrawerVisible: false,
};

export const store = createStore(reducer, initState);
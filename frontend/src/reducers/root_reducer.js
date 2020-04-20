import { combineReducers } from 'redux';
import errors from './errors_reducer';
//import other reducers

const RootReducer = combineReducers({
    errors
});

export default RootReducer;
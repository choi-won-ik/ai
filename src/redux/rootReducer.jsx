import { combineReducers } from 'redux';
import diary from './reducers/diary';

const rootReducer = combineReducers({
    diary,
});

export default rootReducer;

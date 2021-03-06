import * as actionTypes from '../actions/actions';
import { updateObject } from './utility';

const initialState = {
    currentOrder: null
};

const setCurrentOrder = (state, action) => {
    return updateObject(state, {currentOrder: action.order})
}
const setCurrentOrderNull = (state) => {
    return updateObject(state, {currentOrder: null})
}
const updateCurrentOrder = (state, action) => {
    return updateObject(state, {currentOrder: {...state.currentOrder, state: (parseInt(state.currentOrder.state) + 1).toString()}})
}

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_ORDER: return setCurrentOrder(state, action);
        case actionTypes.UPDATE_CURRENT_ORDER: return updateCurrentOrder(state,action);
        case actionTypes.NULL_ORDER: return setCurrentOrderNull(state)
        default: return state;
    }
};

export default orderReducer;
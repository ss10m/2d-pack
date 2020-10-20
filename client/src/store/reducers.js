import { combineReducers } from "redux";
import { nanoid } from "nanoid";

const UPDATE_WINDOW_SIZE = "UPDATE_WINDOW_SIZE";
const windowSizeReducer = (state = 0, action) => {
    switch (action.type) {
        case UPDATE_WINDOW_SIZE:
            return action.width;
        default:
            return state;
    }
};

const SET_NAVBAR = "SET_NAVBAR";
const TOGGLE_NAVBAR = "TOGGLE_NAVBAR";
const navbarReducer = (state = false, action) => {
    switch (action.type) {
        case SET_NAVBAR:
            return action.state;
        case TOGGLE_NAVBAR:
            return !state;
        default:
            return state;
    }
};

const ADD_BOX = "ADD_BOX";
const ADD_BOXES = "ADD_BOXES";
const CLEAR_BOXES = "CLEAR_BOXES";
const REMOVE_BOX = "REMOVE_BOX";
const boxesReducer = (state = { boxes: [], choices: [], oversized: [] }, action) => {
    switch (action.type) {
        case ADD_BOX:
            return { ...state, current: [...state.current, action.box] };
        case ADD_BOXES:
            return {
                current: action.boxes,
                choices: action.choices,
                oversized: action.oversized,
            };
        case REMOVE_BOX:
            let index = action.id;
            let boxes = state.current;
            if (index < 0 || index >= boxes.length) return state;
            let updatedBoxes = [...boxes.slice(0, index), ...boxes.slice(index + 1)];
            return { ...state, current: updatedBoxes };
        case CLEAR_BOXES:
            return { current: [], choices: [], oversized: [] };
        default:
            return state;
    }
};

const ADD_ITEMS = "ADD_ITEMS";
const CLEAR_ITEMS = "CLEAR_ITEMS";
const itemsReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_ITEMS:
            return [...action.items];
        case CLEAR_ITEMS:
            return [];
        default:
            return state;
    }
};

const ADD_NOTIFICATION = "ADD_NOTIFICATION";
const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
const notificationsReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            let notification = { id: nanoid(7), ...action.notification };
            return [notification, ...state];
        case REMOVE_NOTIFICATION:
            return state.filter((notification) => notification.id !== action.id);
        default:
            return state;
    }
};

export default combineReducers({
    windowSize: windowSizeReducer,
    navbarExpanded: navbarReducer,
    boxes: boxesReducer,
    items: itemsReducer,
    notifications: notificationsReducer,
});

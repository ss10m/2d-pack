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
const boxesReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_BOX:
            console.log("ADD_BOX");
            return [...state, action.box];
        case ADD_BOXES:
            return [...action.boxes];
        case REMOVE_BOX:
            let index = action.id;
            console.log("INDEX1: " + index);
            if (index < 0 || index >= state.length) return state;
            console.log("INDEX2: " + index);
            return [...state.slice(0, index), ...state.slice(index + 1)];
        case CLEAR_BOXES:
            return [];
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

const SHOW_ZOOM = "SHOW_ZOOM";
const HIDE_ZOOM = "HIDE_ZOOM";
const zoomInReducer = (state = null, action) => {
    switch (action.type) {
        case SHOW_ZOOM:
            return action.index;
        case HIDE_ZOOM:
            return null;
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
    zoomIn: zoomInReducer,
});

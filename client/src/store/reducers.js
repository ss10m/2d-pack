import { combineReducers } from "redux";

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
            var a = state.filter((box) => box.id !== action.id);
            console.log(a);
            return a;
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

const ADD_TOAST = "ADD_TOAST";
const REMOVE_TOAST = "REMOVE_TOAST";

const toastsReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_TOAST:
            return [...state, action.toast];
        case REMOVE_TOAST:
            return state.filter((currentToast) => currentToast !== action.toast);
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
    boxes: boxesReducer,
    items: itemsReducer,
    toasts: toastsReducer,
    zoomIn: zoomInReducer,
});

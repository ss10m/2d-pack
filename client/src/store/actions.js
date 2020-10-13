import { batch } from "react-redux";

export const setOrder = (order) => (dispatch) => {
    let boxes = [];
    order.boxes.forEach((layout) => boxes.push(layout.box));
    batch(() => {
        dispatch(addBoxes(boxes, order.original, order.oversized));
        dispatch(addItems(order.boxes));
    });
};

export const clearOrder = () => (dispatch) => {
    batch(() => {
        dispatch(clearBoxes());
        dispatch(clearItems());
    });
};

export const updateWindowSize = (width) => ({
    type: "UPDATE_WINDOW_SIZE",
    width,
});

export const setNavbar = (state) => ({
    type: "SET_NAVBAR",
    state,
});

export const toggleNavbar = () => ({
    type: "TOGGLE_NAVBAR",
});

export const addBox = (box) => ({
    type: "ADD_BOX",
    box,
});

export const addBoxes = (boxes, choices, oversized) => ({
    type: "ADD_BOXES",
    boxes,
    choices,
    oversized,
});

export const removeBox = (id) => ({
    type: "REMOVE_BOX",
    id,
});

export const clearBoxes = () => ({
    type: "CLEAR_BOXES",
});

export const addItems = (items) => ({
    type: "ADD_ITEMS",
    items,
});

export const clearItems = () => ({
    type: "CLEAR_ITEMS",
});

export const addToast = (toast) => ({
    type: "ADD_TOAST",
    toast,
});

export const removeToast = (toast) => ({
    type: "REMOVE_TOAST",
    toast,
});

export const addNotification = (notification) => ({
    type: "ADD_NOTIFICATION",
    notification,
});

export const removeNotification = (id) => ({
    type: "REMOVE_NOTIFICATION",
    id,
});

export const showZoom = (index) => ({
    type: "SHOW_ZOOM",
    index,
});

export const hideZoom = () => ({
    type: "HIDE_ZOOM",
});

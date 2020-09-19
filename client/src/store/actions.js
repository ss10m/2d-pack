// Window Size Actions
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

export const addBoxes = (boxes) => ({
    type: "ADD_BOXES",
    boxes,
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

export const showToast = (dispatch, toast) => {
    // Assigning IDs to notifications lets reducer ignore HIDE_NOTIFICATION
    // for the notification that is not currently visible.
    // Alternatively, we could store the timeout ID and call
    // clearTimeout(), but we’d still want to do it in a single place.
    dispatch(addToast(toast));

    setTimeout(() => {
        dispatch(removeToast(toast));
    }, toast["timeout"]);
};

export const showZoom = (index) => ({
    type: "SHOW_ZOOM",
    index,
});

export const hideZoom = () => ({
    type: "HIDE_ZOOM",
});

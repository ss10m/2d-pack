export const boxColors = ["red", "yellow", "blue", "purple", "green", "orange", "grey"];

export const itemOutlineColors = ["Red", "Yellow", "Blue", "Purple", "Green"];

export const items = [
    {
        url: "https://i.imgur.com/j9HWSmS.jpeg",
        width: 24,
        height: 16,
        id: 200458,
        color: "red",
        product: "",
    },
    {
        url: "https://i.imgur.com/ZWGeI3I.jpg",
        width: 36,
        height: 12,
        id: 200457,
        color: "blue",
        product: "",
    },
    {
        url: "https://i.imgur.com/4PoTjBe.jpg",
        width: 12,
        height: 8,
        id: 200456,
        color: "yellow",
        product: "",
    },
];

export const boxes = [
    { width: 18, height: 13, weight: 2, color: "red" },
    { width: 25, height: 19, weight: 4, color: "orange" },
    { width: 37, height: 25, weight: 6, color: "blue" },
    { width: 47, height: 34, weight: 8, color: "purple" },
    { width: 52, height: 42, weight: 10, color: "grey" },
];

export const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

export const getRandomImg = () => {
    let images = [
        "https://i.imgur.com/SeyV6fG.png",
        "https://i.imgur.com/j9HWSmS.jpeg",
        "https://i.imgur.com/QXhZt0t.jpg",
        "https://i.imgur.com/1lqBCGK.jpg",
        "https://i.imgur.com/GDAStfX.jpg",
        "https://i.imgur.com/qnpBsNw.jpg",
        "https://i.imgur.com/4PoTjBe.jpg",
        "https://i.imgur.com/ZWGeI3I.jpg",
        "https://i.imgur.com/xqWnFok.jpg",
        "https://i.imgur.com/KfQ1qsK.png",
        "https://i.imgur.com/FykFLSM.jpeg",
        "https://i.imgur.com/baPqZXo.jpg",
    ];
    return images[Math.floor(Math.random() * images.length)];
};

export const notificationTypeToIcon = (icon) => {
    switch (icon) {
        case "success":
            return "check-circle";
        case "error":
            return "exclamation-circle";
        default:
            return null;
    }
};

export function calculcateOffsets(currentBox, canvasWidth, canvasHeight) {
    let maxPosX = 0;
    let maxPosY = 0;

    currentBox["items"].forEach((item) => {
        if (item.x + item.width > maxPosX) maxPosX = item.x + item.width;
        if (item.y + item.height > maxPosY) maxPosY = item.y + item.height;
    });

    let offsetX = Math.round(
        (((currentBox.box.width - maxPosX) / currentBox.box.width) * canvasWidth) / 2
    );
    let offsetY = Math.round(
        (((currentBox.box.height - maxPosY) / currentBox.box.height) * canvasHeight) / 2
    );

    return { offsetX: offsetX, offsetY: offsetY };
}

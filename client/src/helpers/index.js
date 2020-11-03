export const items = [
    {
        url: "https://i.imgur.com/lKXVXCR.jpg",
        width: 20,
        height: 32,
        id: "200451",
        color: "red",
    },
    {
        url: "https://i.imgur.com/LLR5NxX.png",
        width: 24,
        height: 16,
        id: "200452",
        color: "blue",
    },
    {
        url: "https://i.imgur.com/XBd4Fd1.png",
        width: 24,
        height: 16,
        id: "200453",
        color: "yellow",
    },
    {
        url: "https://i.imgur.com/ecYnb.jpg",
        width: 35,
        height: 24,
        id: "200454",
        color: "yellow",
    },
];

export const boxes = [
    { width: 18, height: 13, weight: 2, color: "red" },
    { width: 25, height: 19, weight: 4, color: "orange" },
    { width: 37, height: 25, weight: 6, color: "blue" },
    { width: 47, height: 34, weight: 8, color: "purple" },
];

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function getRandomImg(ratio) {
    let images = {
        squre: ["https://i.imgur.com/jw9wjnB.jpg"],
        classic: [
            "https://i.imgur.com/1ePb80R.jpg",
            "https://i.imgur.com/ecYnb.jpg",
            "https://i.imgur.com/z1C9aFR.jpg",
            "https://i.imgur.com/En8nXpr.png",
        ],
        golden: [
            "https://i.imgur.com/Nv1Wcy4.jpg",
            "https://i.imgur.com/xe5kCmT.jpg",
            "https://i.imgur.com/XvXnpPd.jpg",
        ],
        wide: [
            "https://i.imgur.com/6bTyoJf.png",
            "https://i.imgur.com/diooRWV.png",
            "https://i.imgur.com/vHIonqW.png",
            "https://i.imgur.com/LLR5NxX.png",
            "https://i.imgur.com/HCoBlwC.png",
            "https://i.imgur.com/zG93bjQ.png",
            "https://i.imgur.com/XBd4Fd1.png",
            "https://i.imgur.com/aAYnjwK.png",
        ],
        ultrawide: ["https://i.imgur.com/vW2ew7S.jpg", "https://i.imgur.com/lKXVXCR.jpg"],
    };

    let ratioName;
    if (ratio < 1.2) {
        ratioName = "squre";
    } else if (ratio < 1.4) {
        ratioName = "classic";
    } else if (ratio < 1.8) {
        ratioName = "golden";
    } else if (ratio < 2.5) {
        ratioName = "wide";
    } else {
        ratioName = "ultrawide";
    }

    return images[ratioName][Math.floor(Math.random() * images[ratioName].length)];
}

export function notificationTypeToIcon(icon) {
    switch (icon) {
        case "success":
            return "check-circle";
        case "error":
            return "exclamation-circle";
        default:
            return null;
    }
}

export function calculcateOffsets(items, box, canvasWidth, canvasHeight) {
    let maxPosX = 0;
    let maxPosY = 0;

    items.forEach((item) => {
        if (item.x + item.width > maxPosX) maxPosX = item.x + item.width;
        if (item.y + item.height > maxPosY) maxPosY = item.y + item.height;
    });

    let offsetX = Math.round((((box.width - maxPosX) / box.width) * canvasWidth) / 2);
    let offsetY = Math.round((((box.height - maxPosY) / box.height) * canvasHeight) / 2);
    return { offsetX, offsetY };
}

export function parseBoxInfo(box, currentLayout, totalLayouts) {
    let name = box.name;
    let height = box.height;
    let width = box.width;
    return `${name} [${width} in x ${height} in] - ${currentLayout} of ${totalLayouts}`;
}

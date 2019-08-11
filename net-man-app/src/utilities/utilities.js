

export const getWidth = () => {
    const width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    return width;
}

export const getHeight = () => {
    const height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

    return height;
}
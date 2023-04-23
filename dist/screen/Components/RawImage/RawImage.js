export function RawImage(width, height, getData) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.imageSmoothingEnabled = false;
    return [
        [
            {
                type: "rawElement",
                element: canvas,
            },
        ],
        async () => {
            const data = await getData();
            if (data.mode == "single" || data.mode == "overlay") {
                for (const texture of data.textures) {
                    const bitmap = await createImageBitmap(new ImageData(texture, Math.sqrt(texture.length / 4), Math.sqrt(texture.length / 4)), {
                        resizeWidth: width,
                        resizeHeight: height,
                        resizeQuality: "pixelated",
                        imageOrientation: data.flipY ? "flipY" : undefined,
                    });
                    context.drawImage(bitmap, 0, 0, width, height);
                }
            }
        },
    ];
}

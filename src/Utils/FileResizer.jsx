import Resizer from "react-image-file-resizer";

export default function resizeFile (file) {
    new Promise((resolve) => {
        Resizer.imageFileResizer(
        file,
        350,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
            resolve(uri);
        },
        "base64"
        );
    });
}
import { useState } from "react";

interface ImageProps extends React.ComponentProps<"img"> {
    fallbackSrc?: string;
}

export function Image({
    src,
    fallbackSrc = "/fallback.png",
    ...props
}: ImageProps) {
    const [imageSrc, setImageSrc] = useState(src);

    return (
        <img
            {...props}
            src={imageSrc}
            onLoad={() => console.log("Loaded")}
            onError={() => {
                console.log("Error");
                if (imageSrc !== fallbackSrc) {
                    setImageSrc(fallbackSrc);
                }
            }}
        />
    );
}
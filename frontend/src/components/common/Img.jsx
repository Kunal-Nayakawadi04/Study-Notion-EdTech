import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const Img = ({ src, className, alt }) => {
    return (
        <LazyLoadImage
            className={`w-full h-full ${className || ''}`}
            wrapperClassName="w-full h-full block"
            alt={alt || 'Image'}
            effect='blur'
            src={src}
        />
    )
}

export default Img
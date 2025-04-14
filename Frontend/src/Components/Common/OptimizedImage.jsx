import React, { useState, useEffect } from 'react';

/**
 * OptimizedImage component for lazy loading and progressive image loading
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.placeholderColor - Placeholder background color
 * @returns {JSX.Element} - Rendered component
 */
const OptimizedImage = ({ 
    src, 
    alt, 
    className = '', 
    width, 
    height, 
    placeholderColor = '#f3f4f6',
    ...rest 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Reset state when src changes
        setIsLoaded(false);
        setError(false);
    }, [src]);

    // Create placeholder style
    const placeholderStyle = {
        backgroundColor: placeholderColor,
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
    };

    // Handle image load
    const handleLoad = () => {
        setIsLoaded(true);
    };

    // Handle image error
    const handleError = () => {
        setError(true);
    };

    return (
        <div className="relative overflow-hidden" style={{ width, height }}>
            {/* Placeholder */}
            {!isLoaded && !error && (
                <div 
                    className="absolute inset-0 animate-pulse" 
                    style={placeholderStyle}
                />
            )}
            
            {/* Actual image */}
            <img
                src={src}
                alt={alt}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                onLoad={handleLoad}
                onError={handleError}
                loading="lazy"
                width={width}
                height={height}
                {...rest}
            />
            
            {/* Error fallback */}
            {error && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500"
                    style={{ width, height }}
                >
                    <span>Failed to load image</span>
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;

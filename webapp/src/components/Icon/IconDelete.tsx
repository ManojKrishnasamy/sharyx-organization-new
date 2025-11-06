import { FC } from 'react';

interface IconDeleteProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconDelete: FC<IconDeleteProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path
                        opacity={duotone ? '0.5' : '1'}
                        d="M3 6L5 6H19L21 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        opacity={duotone ? '0.5' : '1'}
                        d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M19 6V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 11V16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M14 11V16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <circle cx="12" cy="12" r="11" fill="currentColor" />
                    <path
                        d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M3 6L5 6H19L21 6"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 11V16"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M14 11V16"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            )}
        </>
    );
};

export default IconDelete;

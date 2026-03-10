import React from 'react';

const TideVaultLogo = ({ size = 40, showText = true }) => (
    <svg
        width={showText ? size * 5.5 : size}
        height={size}
        viewBox={showText ? "0 0 220 40" : "0 0 40 40"}
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="tvg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a9e8f" />
                <stop offset="100%" stopColor="#22c4b3" />
            </linearGradient>
        </defs>

        {/* Vault circle outer */}
        <circle cx="20" cy="20" r="18"
            fill="#0f2040"
            stroke="url(#tvg)" strokeWidth="1.5" />

        {/* Vault circle inner */}
        <circle cx="20" cy="20" r="11"
            fill="none"
            stroke="url(#tvg)" strokeWidth="1"
            opacity="0.4" />

        {/* 4 vault spokes */}
        <line x1="20" y1="2" x2="20" y2="9"
            stroke="#22c4b3" strokeWidth="2"
            strokeLinecap="round" />
        <line x1="20" y1="31" x2="20" y2="38"
            stroke="#22c4b3" strokeWidth="2"
            strokeLinecap="round" />
        <line x1="2" y1="20" x2="9" y2="20"
            stroke="#22c4b3" strokeWidth="2"
            strokeLinecap="round" />
        <line x1="31" y1="20" x2="38" y2="20"
            stroke="#22c4b3" strokeWidth="2"
            strokeLinecap="round" />

        {/* Tidal wave inside */}
        <path d="M8,22 Q12,16 16,20 Q20,24 24,19 Q28,14 32,19"
            fill="none" stroke="url(#tvg)" strokeWidth="2.5"
            strokeLinecap="round" />

        {/* Second wave faint */}
        <path d="M8,27 Q12,21 16,25 Q20,29 24,24 Q28,19 32,24"
            fill="none" stroke="url(#tvg)" strokeWidth="1.2"
            strokeLinecap="round" opacity="0.35" />

        {/* Text — only when showText=true */}
        {showText && (
            <>
                <text
                    x="50" y="27"
                    fontFamily="'Syne', sans-serif"
                    fontSize="22" fontWeight="800"
                    fill="#e8f4f8"
                    letterSpacing="-0.5"
                >
                    Tide
                </text>
                <text
                    x="104" y="27"
                    fontFamily="'Syne', sans-serif"
                    fontSize="22" fontWeight="800"
                    fill="#1a9e8f"
                    letterSpacing="-0.5"
                >
                    Vault
                </text>
                <text
                    x="50" y="37"
                    fontFamily="'IBM Plex Mono', monospace"
                    fontSize="6.5" fontWeight="400"
                    fill="#7aa3b8"
                    letterSpacing="2.5"
                >
                    COASTAL INTELLIGENCE SYSTEM
                </text>
            </>
        )}
    </svg>
);

export default TideVaultLogo;

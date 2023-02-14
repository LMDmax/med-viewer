import React from "react";

const SlideNavigatorIcon = ({ isNavigatorActive }) => {
  return isNavigatorActive ? (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_ii_221_5772)">
        <rect width="28" height="28" fill="#DEDEDE" />
        <path
          d="M3.6919 16.9317L1.89551 13.9948L3.68571 11.0684L4.62312 11.6477L3.1871 13.9948L4.6293 16.3524L3.6919 16.9317Z"
          fill="#3B5D7C"
        />
        <path d="M20 5.5H8V22H20V5.5Z" fill="#3B5D7C" />
        <path
          d="M20.3713 22.9997H7.62939V5.00037H20.3713V22.9997ZM8.73254 21.8935H19.2709V6.10653H8.72979L8.73254 21.8935Z"
          fill="#DEDEDE"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.8955 18.5004H7.89551V17.5004H19.8955V18.5004Z"
          fill="#DEDEDE"
        />
        <path
          d="M24.3147 16.9317L23.3773 16.3524L24.8126 14.0052L23.3711 11.6477L24.3085 11.0684L26.1042 14.0052L24.3147 16.9317Z"
          fill="#3B5D7C"
        />
      </g>
      <defs>
        <filter
          id="filter0_ii_221_5772"
          x="-2"
          y="-2"
          width="32"
          height="32"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_221_5772"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-2" dy="-2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_221_5772"
            result="effect2_innerShadow_221_5772"
          />
        </filter>
      </defs>
    </svg>
  ) : (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.6919 16.9317L1.89551 13.9948L3.68571 11.0684L4.62312 11.6477L3.1871 13.9948L4.6293 16.3524L3.6919 16.9317Z"
        fill="#212224"
      />
      <path
        d="M20.3713 22.9997H7.62939V5.00037H20.3713V22.9997ZM8.73254 21.8935H19.2709V6.10653H8.72979L8.73254 21.8935Z"
        fill="#212224"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.8955 18.5004H7.89551V17.5004H19.8955V18.5004Z"
        fill="#212224"
      />
      <path
        d="M24.3149 16.9317L23.3775 16.3524L24.8129 14.0052L23.3713 11.6477L24.3087 11.0684L26.1044 14.0052L24.3149 16.9317Z"
        fill="#212224"
      />
    </svg>
  );
};

export default SlideNavigatorIcon;

import * as React from "react";

export default function ScalesIcon({ fillColor }) {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.99989 4C5.10446 4 5.99989 3.10457 5.99989 2C5.99989 0.895431 5.10446 0 3.99989 0C2.89532 0 1.99989 0.895431 1.99989 2C1.99989 3.10457 2.89532 4 3.99989 4Z"
        fill={fillColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.9999 4.5C20.9999 6.433 19.4329 8 17.4999 8C15.5669 8 13.9999 6.433 13.9999 4.5C13.9999 2.567 15.5669 1 17.4999 1C19.4329 1 20.9999 2.567 20.9999 4.5ZM18.9999 4.5C18.9999 5.32843 18.3283 6 17.4999 6C16.6715 6 15.9999 5.32843 15.9999 4.5C15.9999 3.67157 16.6715 3 17.4999 3C18.3283 3 18.9999 3.67157 18.9999 4.5Z"
        fill={fillColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.54017 8.56837L0.716309 5.95895L1.28348 4.04105L21.3028 9.96124L20.7356 11.8791L13.0335 9.60144L16.874 16.5144L15.9999 18H5.99989L5.12573 16.5144L9.54017 8.56837ZM10.9999 10.0591L14.3004 16H7.69941L10.9999 10.0591Z"
        fill={fillColor}
      />
    </svg>
  );
}
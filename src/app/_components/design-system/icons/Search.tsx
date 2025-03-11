export default function Search() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      className="h-6 w-6 -translate-x-2 stroke-blue-900"
    >
      {/* handle for magnifying glass */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        d="M16 15L21 23L23 21L18 14Z"
      />
      {/* circle for magnifying glass */}
      <circle cx="13" cy="9" r="7" className="fill-green-300" />
    </svg>
  );
}

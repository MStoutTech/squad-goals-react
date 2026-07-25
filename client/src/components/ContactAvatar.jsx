// components/ContactAvatar.jsx
// Renders a contact's real photo if one exists, otherwise a fallback SVG.
// Sizing/rounding is controlled entirely by the caller via `className` on the
// wrapper div -- this component doesn't hardcode a size or border-radius.

export function ContactAvatar({ contact, className = "" }) {
  const imageUrl = contact?.image;

  return (
    <div className={`overflow-hidden shrink-0 ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={
            "" /*`${contact?.firstName || ""} ${contact?.lastName || ""}`.trim()*/
          }
          className="w-full h-full object-cover"
        />
      ) : (
        // ---- FALLBACK ICON ----
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
        // ---- END FALLBACK ICON ----
      )}
    </div>
  );
}

export function SelectedContactChip({ contactObject, removeFunction }) {
  return (
    <div
      key={contactObject?._id}
      className="flex justify-between my-2 items-center pl-4 pr-2 border border-purple-300 rounded-md"
    >
      <ContactAvatar
        className="block size-6 border-2 rounded-full"
        contact={contactObject}
      />

      <span id="selected-contact-name">
        {contactObject?.firstName} {contactObject?.lastName}
      </span>
      <button
        type="button"
        className="hover:text-white font-bold min-h-[44px] min-w-[44px]"
        onClick={removeFunction}
      >
        ✕
      </button>
    </div>
  );
}

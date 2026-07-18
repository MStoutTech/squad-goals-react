import { useState, useRef, useEffect, useImperativeHandle } from "react";
import { apiFetch } from "../utils/apiUrl";

export default function ContactSearch({
  onSelect,
  excludeIds,
  clearOnSelect,
  customStateValidate,
  ref,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [contactSearchResults, setContactSearchResults] = useState([]);
  const inputRef = useRef(null);
  const query = searchInput.trim();
  const searchTimeout = useRef(null);

  useImperativeHandle(ref, () => ({
    validate() {
      if (!customStateValidate) {
        inputRef.current.setCustomValidity("Find and select existing contact");
      }
      return inputRef.current.reportValidity();
    },
  }));

  useEffect(() => {
    {
      /*When user deletes input, do not fetch*/
    }
    if (!query) {
      setContactSearchResults([]);
      return;
    }
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      const res = await apiFetch(`/api/mission/searchContacts?query=${query}`);
      const contacts = await res.json();
      if (excludeIds) {
        setContactSearchResults(
          contacts.filter((contact) => !excludeIds.includes(contact._id)),
        );
      } else {
        setContactSearchResults(contacts);
      }
    }, 200);

    return () => clearTimeout(searchTimeout.current);
  }, [searchInput]);

  const matchingContacts = contactSearchResults.map((contact) => (
    <li
      key={contact._id}
      className="p-2 hover:bg-purple-400 cursor-pointer"
      onClick={() => {
        onSelect(contact);
        if (clearOnSelect) {
          setSearchInput("");
        }
      }}
    >
      {contact.nickname
        ? `${contact.firstName} "${contact.nickname}" ${contact.lastName}`
        : `${contact.firstName} ${contact.lastName}`}
    </li>
  ));

  return (
    <div className="mb-6 relative">
      <input
        ref={inputRef}
        id="contact-search-input"
        type="search"
        className="border border-purple-300 rounded-md px-3 py-2 mt-[2px]"
        placeholder="Start typing a contact name"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {query && (
        <ul
          id="contact-search-results"
          className="absolute z-50 bg-(--c-violet-void)  rounded-md mt-1 text-white w-full max-h-40 overflow-y-auto"
        >
          {searchInput.length > 0 && contactSearchResults.length < 1 && (
            <li key={"empty"} className="p-2 text-xs text-(--c-violet-void-40)">
              No matching contacts.
            </li>
          )}
          {matchingContacts}
        </ul>
      )}
    </div>
  );
}

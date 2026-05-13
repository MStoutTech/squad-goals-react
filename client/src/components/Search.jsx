import { useState, useRef, useEffect } from "react";

export default function ContactSearch({ onSelect, excludeIds, clearOnSelect }) {
  const [searchInput, setSearchInput] = useState("");
  const [contactSearchResults, setContactSearchResults] = useState([]);

  const query = searchInput.trim();
  const searchTimeout = useRef(null);

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
      const res = await fetch(`api/mission/searchContacts?query=${query}`);
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
        id="contact-search-input"
        type="search"
        className="border border-purple-300 rounded-md px-3 py-2"
        placeholder="Start typing a name"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {query && (
        <ul
          id="contact-search-results"
          className="absolute z-50 bg-(--c-violet-void) border border-purple-300 rounded-md mt-1 text-white w-full max-h-40 overflow-y-auto"
        >
          {matchingContacts}
        </ul>
      )}
    </div>
  );
}

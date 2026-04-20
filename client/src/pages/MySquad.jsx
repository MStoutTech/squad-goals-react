import { useState, useEffect, useRef } from "react";
import { AnimatedCallToAction, PrimaryButton } from "../components/Buttons";
import CircularProgress from "@mui/material/CircularProgress";
import { CategoryTag, RoleTag } from "../components/Tags";
import ContactSearch from "../components/Search";
import { roleLabels } from "../utils/roleHelpers";

function FilterAndSearch({
  fetchSquad,
  activeFilter,
  setActiveFilter,
  searchValue,
  setSearchValue,
  friendshipRolesStart,
}) {
  const [isAddContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);

  function closeModal() {
    setIsContactModalOpen(false);
    setIsRolesModalOpen(false);
  }
  function openAddContactModal() {
    setIsContactModalOpen(true);
  }
  function openRolesModal() {
    setIsRolesModalOpen(true);
  }

  const handleChange = (event) => {
    event.preventDefault();
    setSearchValue(event.target.value.toLowerCase());
  };

  return (
    <div className="w-full mb-10">
      <ul className="flex justify-between">
        <div className="flex gap-3">
          <li>
            <PrimaryButton
              innerText="score"
              onClick={() => setActiveFilter("score")}
              isActive={"score" == activeFilter}
            />
          </li>
          <li>
            <PrimaryButton
              innerText="first"
              onClick={() => setActiveFilter("first")}
              isActive={"first" == activeFilter}
            />
          </li>
          <li>
            <PrimaryButton
              innerText="last"
              onClick={() => setActiveFilter("last")}
              isActive={"last" == activeFilter}
            />
          </li>
          <li>
            <PrimaryButton
              innerText="date"
              onClick={() => setActiveFilter("date")}
              isActive={"date" == activeFilter}
            />
          </li>
          <li>
            <PrimaryButton
              innerText="tag"
              onClick={() => setActiveFilter("tag")}
              isActive={"tag" == activeFilter}
            />
          </li>
          <li>
            <input
              type="search"
              className="text-sm border border-inherit rounded-md px-3 py-2"
              placeholder="SEARCH CONTACTS"
              onChange={handleChange}
              value={searchValue}
            />
          </li>
        </div>
        <div className="flex gap-2">
          <li>
            <PrimaryButton innerText="set roles" onClick={openRolesModal} />
          </li>
          <li>
            <PrimaryButton innerText="add" onClick={openAddContactModal} />
          </li>
          {isAddContactModalOpen && (
            <AddContactModal closeModal={closeModal} fetchSquad={fetchSquad} />
          )}
          {isRolesModalOpen && (
            <RolesModal
              closeModal={closeModal}
              fetchSquad={fetchSquad}
              friendshipRolesStart={friendshipRolesStart}
            />
          )}
        </div>
      </ul>
    </div>
  );
}

function AddContactModal({ closeModal, fetchSquad }) {
  const [isLoading, setIsLoading] = useState(false);

  async function createContact(event) {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await fetch("/api/contact/createContact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        nickname: formData.get("nickname"),
        connectionInstinct: formData.get("connectionInstinct"),
        preferredMethod: formData.get("preferredMethod"),
      }),
    });
    if (response.status === 201) {
      fetchSquad();
      setIsLoading(false);
      closeModal();
    }
  }
  return (
    <div
      id="add-contact"
      aria-labelledby="add-contact"
      className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent z-20"
    >
      <div className="fixed inset-0 bg-black/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

      <div
        tabindex="0"
        className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
      >
        <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
          <div className="bg-(--c-purple-tech-40)/40 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                {/*Window title*/}
                <h3
                  id="dialog-title"
                  className="text-base font-semibold text-gray-900"
                >
                  Add New Contact
                </h3>
                {isLoading ? (
                  <CircularProgress color="#7D4C9F" />
                ) : (
                  <div className="mt-2 text-purple-300 text-sm">
                    {/*form*/}
                    <form id="add-contact-form" onSubmit={createContact}>
                      <div className="flex flex-col">
                        <label
                          htmlFor="contactFirstName"
                          className="text-xs text-white"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="contactFirstName"
                          name="firstName"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          required
                        />
                        <label
                          htmlFor="contactLastName"
                          className="text-xs text-white"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="contactLastName"
                          name="lastName"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          required
                        />
                        <label
                          htmlFor="contactNickname"
                          className="text-xs text-white"
                        >
                          Nickname
                        </label>
                        <input
                          type="text"
                          id="contactNickname"
                          name="nickname"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                        />
                        <label
                          htmlFor="connection-instinct"
                          className="text-xs text-white"
                        >
                          How close are you?
                        </label>
                        <select
                          name="connectionInstinct"
                          id="connection-instinct"
                          className="bg-(--c-violet-void) rounded-md px-3 py-2 mb-6"
                          required
                        >
                          <option value="heartCore">Super close</option>
                          <option value="rayLiables">Pretty close</option>
                          <option value="buddies">Casual</option>
                        </select>
                        <label
                          htmlFor="method-preference"
                          className="text-xs text-white"
                        >
                          What is THEIR preferred contact method?
                        </label>
                        <select
                          name="preferredMethod"
                          id="method-preference"
                          className="bg-(--c-violet-void) rounded-md px-3 py-2"
                          required
                        >
                          <option value="socialMedia">Social media</option>
                          <option value="textMessage">Text message</option>
                          <option value="phoneCall">Phone call</option>
                        </select>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/*Window buttons*/}
          <div className="bg-(--c-violet-void-40) px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              form="add-contact-form"
              type="submit"
              className="inline-flex w-full justify-center rounded-md action-button sm:ml-3 sm:w-auto px-3 py-2 text-sm shadow-xs hover:bg-(--c-violet-void)"
            >
              ADD CONTACT
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-(--c-violet-void-40) px-3 py-2 text-sm font-semibold text-purple-400 shadow-xs inset-ring inset-ring-purple-400 hover:bg-(--c-violet-void-20) sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RolesModal({ closeModal, fetchSquad, friendshipRolesStart }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(
    friendshipRolesStart || {
      nonJudgementalBestie: null,
      brutallyHonestFriend: null,
      careerMentor: null,
      tirelessCheerleader: null,
      inCaseOfEmergency: null,
      healthcareProfessional: null,
      stylist: null,
    },
  );
  const excludeIds = Object.values(selectedRoles)
    .filter((role) => role != null)
    .map((role) => role._id);

  const roleDescription = {
    nonJudgementalBestie: `The Non-judgemental Bestie has your back at your best and your worst,
        reminding you that you are always worthy of love and support.`,
    brutallyHonestFriend: `Always gives you the truth no matter how hard it is to hear`,
    careerMentor: `Who you can turn to advice when it comes to job offers, career switches, education, or recommending you as a reference`,
    tirelessCheerleader: `This person is rooting for you to have the best results in life no matter your path`,
    inCaseOfEmergency: `Someone who lives close to you that will always show up in a crisis`,
    healthcareProfessional: `Someone who's opinion you trust when it comes to medical issues`,
    stylist: `Who can help you create your unique style and accentuate your beauty`,
  };

  const roleSelectors = Object.keys(selectedRoles).map((role) => (
    <div key={role}>
      <p className="text-xs">{roleDescription[role]}</p>
      <label htmlFor={{ role }} className="text-xs text-white">
        {roleLabels[role]}
      </label>
      {selectedRoles[role] ? (
        <div className="flex justify-between mb-6 items-center p-2 border border-purple-300 rounded-md">
          <img
            src={
              selectedRoles[role]
                ? selectedRoles[role].url || "/imgs/Small-Friend-Icon.png"
                : ""
            }
            alt=""
            className="inline size-6"
          />
          <span id="selected-contact-name">
            {selectedRoles[role]?.firstName} {selectedRoles[role]?.lastName}
          </span>
          <button
            type="button"
            className="text-(--c-violet-void) font-bold"
            onClick={() =>
              setSelectedRoles((prev) => ({ ...prev, [role]: null }))
            }
          >
            ✕
          </button>
        </div>
      ) : (
        <ContactSearch
          onSelect={(contact) =>
            setSelectedRoles((prev) => ({ ...prev, [role]: contact }))
          }
          excludeIds={excludeIds}
        />
      )}

      <input
        type="hidden"
        id={role}
        name={role}
        value={selectedRoles[role]?._id || ""}
      />
    </div>
  ));

  async function setFriendshipRoles(event) {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await fetch("/api/contact/setFriendshipRoles", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nonJudgementalBestie: formData.get("nonJudgementalBestie"),
        brutallyHonestFriend: formData.get("brutallyHonestFriend"),
        careerMentor: formData.get("careerMentor"),
        tirelessCheerleader: formData.get("tirelessCheerleader"),
        inCaseOfEmergency: formData.get("inCaseOfEmergency"),
        healthcareProfessional: formData.get("healthcareProfessional"),
        stylist: formData.get("stylist"),
      }),
    });
    if (response.status === 200) {
      fetchSquad();
      setIsLoading(false);
      closeModal();
    }
  }
  return (
    <div
      id="set-roles"
      aria-labelledby="set-roles"
      className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent z-20"
    >
      <div className="fixed inset-0 bg-black/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

      <div
        tabindex="0"
        className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
      >
        <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
          <div className="bg-(--c-purple-tech-40)/40 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                {/*Window title*/}
                <h3
                  id="dialog-title"
                  className="text-base font-semibold text-gray-900"
                >
                  Set Friendship Roles
                </h3>
                {isLoading ? (
                  <CircularProgress color="#7D4C9F" />
                ) : (
                  <div className="mt-2 text-purple-300 text-sm max-h-[500px] overflow-auto">
                    {/*form*/}
                    <form id="add-contact-form" onSubmit={setFriendshipRoles}>
                      <div className="flex flex-col">{roleSelectors}</div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/*Window buttons*/}
          <div className="bg-(--c-violet-void-40) px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              form="add-contact-form"
              type="submit"
              className="inline-flex w-full justify-center rounded-md action-button sm:ml-3 sm:w-auto px-3 py-2 text-sm shadow-xs hover:bg-(--c-violet-void)"
            >
              SAVE ROLES
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-(--c-violet-void-40) px-3 py-2 text-sm font-semibold text-purple-400 shadow-xs inset-ring inset-ring-purple-400 hover:bg-(--c-violet-void-20) sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactList({
  themeColor,
  contactList,
  title,
  img,
  setFeaturedContact,
  featuredContact,
  searchTerm,
  searchList,
}) {
  function toggleSelect(contact) {
    if (featuredContact == contact) {
      setFeaturedContact({});
    } else {
      setFeaturedContact(contact);
    }
  }
  const activeList = searchTerm != "" ? searchList : contactList;
  const styledContacts = activeList.map((contact) => (
    <li
      key={contact._id}
      className={`${contact._id == featuredContact._id ? "bg-(--c-violet-void-60) text-white" : "bg-(--c-violet-void)"} px-3 py-2 rounded-lg flex gap-2 hover:bg-(--c-violet-void-60) hover:text-white cursor-pointer`}
      onClick={() => toggleSelect(contact)}
    >
      <img
        src={contact.image ? contact.image : "/imgs/icons/profile.png"}
        alt=""
        className="size-6 mt-3 mx-3"
      />
      <div className="w-[150px]">
        <h4 className="text-sm">
          {contact.nickname ? contact.nickname : contact.firstName}
        </h4>
        <p>
          {contact.firstName} {contact.lastName}
        </p>
        <p className="text-sm">Score: {contact.evalScore}</p>
      </div>
      <div className="w-[150px]">
        <p>
          <img src={img} alt="clock-icon" className="inline" /> Contact:{" "}
          {contact.contactFrequency}
        </p>

        <p>
          Prev:{" "}
          {contact.lastContact
            ? new Date(contact.lastContact).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          Next:{" "}
          {contact.nextMission
            ? new Date(contact.nextMission.scheduledFor).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </li>
  ));
  return (
    <section style={{ color: `var(${themeColor})` }}>
      <h2 className="text-2xl text-center">{title}</h2>
      <ul
        className={` rounded-lg p-3  text-xs justify-center `}
        style={{ backgroundColor: `var(${themeColor})` }}
      >
        <div className="flex flex-col gap-2 lg:h-[640px] lg: overflow-auto">
          {activeList.length > 0 ? (
            styledContacts
          ) : (
            <li className="bg-(--c-violet-void) px-3 py-2 rounded-lg w-[388px] h-[156px] flex-column justify-center">
              <h3 className="h-[60px]">
                {searchTerm != ""
                  ? "No contact matches to search"
                  : "List empty, add more contacts!"}
              </h3>
            </li>
          )}
        </div>
      </ul>
    </section>
  );
}

export default function MySquad() {
  const [heartCoreList, setHeartCoreList] = useState([]);
  const [rayLiablesList, setRayLiablesList] = useState([]);
  const [buddiesList, setBuddiesList] = useState([]);
  const [featuredContact, setFeaturedContact] = useState({});
  const [activeFilter, setActiveFilter] = useState("score");
  const [searchValue, setSearchValue] = useState("");
  const [searchHeartCoreList, setSearchHeartCoreList] = useState([]);
  const [searchRayLiablesList, setSearchRayLiablesList] = useState([]);
  const [searchBuddiesList, setSearchBuddiesList] = useState([]);
  const [friendshipRoles, setFriendshipRoles] = useState({});

  const query = searchValue.trim();
  const searchTimeout = useRef(null);

  const fetchSquad = async () => {
    const response = await fetch("/api/contact/getSquad");
    const data = await response.json();
    setHeartCoreList(data.heartCoreList);
    setRayLiablesList(data.rayLiablesList);
    setBuddiesList(data.buddiesList);
    setFriendshipRoles(data.friendshipRoles);
    filterContacts(data.heartCoreList, data.rayLiablesList, data.buddiesList);
  };
  function filterContacts(heartCore, rayLiables, buddies) {
    if (activeFilter == "score") {
      setHeartCoreList(() =>
        heartCore.slice().sort((a, b) => b.evalScore - a.evalScore),
      );
      setRayLiablesList(() =>
        rayLiables.slice().sort((a, b) => b.evalScore - a.evalScore),
      );
      setBuddiesList(() =>
        buddies.slice().sort((a, b) => b.evalScore - a.evalScore),
      );
    } else if (activeFilter == "first") {
      setHeartCoreList(() =>
        heartCore
          .slice()
          .sort((a, b) => a.firstName.localeCompare(b.firstName)),
      );
      setRayLiablesList(() =>
        rayLiables
          .slice()
          .sort((a, b) => a.firstName.localeCompare(b.firstName)),
      );
      setBuddiesList(() =>
        buddies.slice().sort((a, b) => a.firstName.localeCompare(b.firstName)),
      );
    } else if (activeFilter == "last") {
      setHeartCoreList(() =>
        heartCore.slice().sort((a, b) => a.lastName.localeCompare(b.lastName)),
      );
      setRayLiablesList(() =>
        rayLiables.slice().sort((a, b) => a.lastName.localeCompare(b.lastName)),
      );
      setBuddiesList(() =>
        buddies.slice().sort((a, b) => a.lastName.localeCompare(b.lastName)),
      );
    } else if (activeFilter == "date") {
      setHeartCoreList(() =>
        heartCore
          .slice()
          .sort(
            (a, b) =>
              (a.lastContact ? new Date(a.lastContact) : new Date(2025, 1, 1)) -
              (b.lastContact ? new Date(b.lastContact) : new Date(2025, 1, 1)),
          ),
      );
      setRayLiablesList(() =>
        rayLiables
          .slice()
          .sort(
            (a, b) =>
              (a.lastContact ? new Date(a.lastContact) : new Date(2025, 1, 1)) -
              (b.lastContact ? new Date(b.lastContact) : new Date(2025, 1, 1)),
          ),
      );
      setBuddiesList(() =>
        buddies
          .slice()
          .sort(
            (a, b) =>
              (a.lastContact ? new Date(a.lastContact) : new Date(2025, 1, 1)) -
              (b.lastContact ? new Date(b.lastContact) : new Date(2025, 1, 1)),
          ),
      );
    }
  }
  useEffect(() => {
    fetchSquad();
  }, []);

  useEffect(() => {
    filterContacts(heartCoreList, rayLiablesList, buddiesList);
  }, [activeFilter]);

  useEffect(() => {
    if (!query) {
      setSearchHeartCoreList([]);
      setSearchRayLiablesList([]);
      setSearchBuddiesList([]);
      return;
    }
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchHeartCoreList(
        heartCoreList.filter(
          (contact) =>
            contact.firstName.toLowerCase().includes(query) ||
            contact.lastName.toLowerCase().includes(query) ||
            contact.nickname?.toLowerCase().includes(query),
        ),
      );
      setSearchRayLiablesList(
        rayLiablesList.filter(
          (contact) =>
            contact.firstName.toLowerCase().includes(query) ||
            contact.lastName.toLowerCase().includes(query) ||
            contact.nickname?.toLowerCase().includes(query),
        ),
      );
      setSearchBuddiesList(
        buddiesList.filter(
          (contact) =>
            contact.firstName.toLowerCase().includes(query) ||
            contact.lastName.toLowerCase().includes(query) ||
            contact.nickname?.toLowerCase().includes(query),
        ),
      );
    }, 200);

    return () => clearTimeout(searchTimeout.current);
  }, [searchValue]);

  return (
    <div class="text-purple-300 lg:max-h-[calc(100vh-4rem)] lg:p-12 flex flex-col">
      <FilterAndSearch
        fetchSquad={fetchSquad}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        friendshipRolesStart={friendshipRoles}
      />

      <main className="flex gap-6">
        {/*Inner Circle or "Heart" core friends*/}
        {(!featuredContact._id ||
          featuredContact.friendList === "heartCore" ||
          featuredContact.connectionInstinct === "heartCore") && (
          <ContactList
            title="Heart-Core Friends"
            themeColor="--c-deep-cerise"
            contactList={heartCoreList}
            searchList={searchHeartCoreList}
            searchTerm={query}
            img="/imgs/icons/pink-clock.png"
            setFeaturedContact={setFeaturedContact}
            featuredContact={featuredContact}
          />
        )}

        {/*Close Friends or "Ray"liables*/}
        {(!featuredContact._id ||
          featuredContact.friendList === "rayLiables" ||
          featuredContact.connectionInstinct === "rayLiables") && (
          <ContactList
            title="Ray-liables"
            themeColor="--c-light-coral"
            contactList={rayLiablesList}
            searchList={searchRayLiablesList}
            searchTerm={query}
            img="/imgs/icons/coral-clock.png"
            setFeaturedContact={setFeaturedContact}
            featuredContact={featuredContact}
          />
        )}

        {/*Casual Friends or "Bud"dies*/}
        {(!featuredContact._id ||
          featuredContact.friendList === "buddies" ||
          featuredContact.connectionInstinct === "buddies") && (
          <ContactList
            title="Bud-dies"
            themeColor="--c-green-sheen"
            contactList={buddiesList}
            searchList={searchBuddiesList}
            searchTerm={query}
            img="/imgs/icons/green-clock.png"
            setFeaturedContact={setFeaturedContact}
            featuredContact={featuredContact}
          />
        )}

        {featuredContact._id && (
          <FeaturedContact featuredContact={featuredContact} />
        )}
      </main>
    </div>
  );
}

function FeaturedContact({ featuredContact }) {
  const [contactHistory, setContactHistory] = useState([]);
  const [isMissionHistoryLoading, setIsMissionHistoryLoading] = useState(false);

  const fetchMissionHistory = async (contactId) => {
    setIsMissionHistoryLoading(true);
    const response = await fetch(`/api/contact/${contactId}/history`);
    const data = await response.json();
    setIsMissionHistoryLoading(false);
    setContactHistory(data);
  };

  const themeColor = {
    heartCore: "--c-deep-cerise",
    rayLiables: "--c-light-coral",
    buddies: "--c-green-sheen",
  };

  const contactTheme =
    themeColor[
      featuredContact.friendList
        ? featuredContact.friendList
        : featuredContact.connectionInstinct
    ];

  const missionHistoryList = contactHistory.map((entry) => (
    <li>
      <div className="flex items-center">
        <div className="flex flex-col">
          <span>
            {new Date(entry.createdAt).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
            })}
          </span>
          <span>
            {new Date(entry.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
        <h4 className="text-sm pl-3">
          {entry.missionType == "field" ? "Field Mission" : "Contact Mission"}
        </h4>
      </div>

      <p className="pl-3 py-2 border-l-2 border-dashed border-(--c-violet-void) ml-3">
        {entry.noteText}
      </p>
    </li>
  ));

  useEffect(() => {
    fetchMissionHistory(featuredContact._id);
  }, [featuredContact]);

  return (
    <div
      className="mt-8 rounded-lg lg:h-[663px] min-w-[1000px] w-[100%] p-2"
      style={{ backgroundColor: `var(${contactTheme})` }}
    >
      <div className="bg-(--c-violet-void) rounded">
        {/*Top Section*/}
        <div className="flex gap-4 p-3">
          <img
            src={featuredContact.image || "imgs/mission-friend.png"}
            alt={`${featuredContact.firstName} ${featuredContact.lastName}`}
            className="size-24"
            id="featured-image"
          />
          <div className="w-[100%]">
            <div className="flex justify-between">
              <div>
                <p className="text-l">{`${featuredContact.firstName} ${featuredContact.lastName}`}</p>
                <h3 className="text-3xl">
                  {`${featuredContact.nickname ? featuredContact.nickname : featuredContact.firstName}`}
                </h3>
                <h3 className="text-3xl flex">
                  {featuredContact.friendshipRole && (
                    <RoleTag
                      text={roleLabels[featuredContact.friendshipRole]}
                      img="/imgs/icons/star.png"
                    />
                  )}
                </h3>
              </div>
              <div className="text-sm self-end">
                <p>
                  <img
                    src="/imgs/icons/coral-clock.png"
                    alt="clock-icon"
                    className="inline"
                  />{" "}
                  Contact Frequency: {featuredContact.contactFrequency}
                </p>
                <p>Preferred Time: {featuredContact.preferredDay || "None"}</p>
                <p>
                  Previous Contact:{" "}
                  {featuredContact.lastContact
                    ? new Date(featuredContact.lastContact).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  Next Mission:{" "}
                  {featuredContact.nextMission
                    ? new Date(
                        featuredContact.nextMission.scheduledFor,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <PrimaryButton innerText="edit" />
                <h4 className="text-2xl self-start">
                  Eval Score: {featuredContact.evalScore}
                </h4>
                <p className="self-start">Questions Answered: 0/125</p>
              </div>
            </div>
          </div>
        </div>
        {/*Main Area*/}
        <div className="flex p-3 gap-6">
          {/*History */}
          <div className="w-[60%]">
            <h4>Mission History</h4>
            <ul
              className="text-xs lg:max-h-[480px] overflow-auto"
              style={{ width: "100%" }}
            >
              {isMissionHistoryLoading && <CircularProgress color="#7D4C9F" />}
              {!isMissionHistoryLoading &&
                (missionHistoryList.length > 0 ? (
                  missionHistoryList
                ) : (
                  <li style={{ minWidth: "100%" }}>
                    <h4 className="text-sm pl-3">No Mission History</h4>
                  </li>
                ))}
            </ul>
          </div>
          {/*Contact details */}
          <div className="w-[40%] " style={{ color: `var(${contactTheme})` }}>
            <h4 className="border-b-4 text-base">Details</h4>
            <div className="border rounded-b p-2 text-sm lg:max-h-[478px] overflow-auto">
              <p className="border-b-1 py-2">
                Preferred Contact Method:{" "}
                <span className="text-(--c-purple-tech-40)">
                  {featuredContact.preferredMethod}
                </span>
              </p>
              <h5 className="text-xs py-2">Phone Number</h5>
              <ul className="border-b-1 py-2">
                <li>
                  Mobile:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    ###-###-####
                  </span>
                </li>
                <li>
                  Home:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    ###-###-####
                  </span>
                </li>
                <li>
                  Work:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    ###-###-####
                  </span>
                </li>
              </ul>
              <h5 className="text-xs py-2">Email</h5>
              <ul className="border-b-1 py-2">
                <li>
                  Primary:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    contact@contactemail.com
                  </span>
                </li>
                <li>
                  Backup:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    contact@contactemail.com
                  </span>
                </li>
              </ul>
              <h5 className="text-xs py-2">Socials</h5>
              <ul className="border-b-1 py-2">
                <li>
                  Facebook:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    facebook.com/something
                  </span>
                </li>
                <li>
                  Instagram:{" "}
                  <span className="text-(--c-purple-tech-40)">@something</span>
                </li>
                <li>
                  BlueSky:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    handle@bsky.social
                  </span>
                </li>
                <li>
                  Whatsapp:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    handle@bsky.social
                  </span>
                </li>
                <li>
                  Snapchat:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    handle@bsky.social
                  </span>
                </li>
              </ul>

              <h5 className="text-xs py-2">Tags</h5>
              <div className="flex gap-1">
                <CategoryTag text="family" />
                <CategoryTag text="basketball" />
                <CategoryTag text="high school" />
                <CategoryTag text="work" />
              </div>
              <h5 className="text-xs py-2">Important Notes</h5>
              <p>
                Birthday:{" "}
                <span className="text-(--c-purple-tech-40)">--/--</span>
              </p>
              <p>
                Sign: <span className="text-(--c-purple-tech-40)">Aries</span>
              </p>
              <p>
                Myers-Briggs Type:{" "}
                <span className="text-(--c-purple-tech-40)">ENFJ</span>
              </p>
              <p>
                Love Languages:{" "}
                <span className="text-(--c-purple-tech-40)">
                  Gifts, acts of service
                </span>
              </p>
              <p className="min-h-[50px] border-1 rounded-sm mt-2 p-2">
                No more notes to show.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

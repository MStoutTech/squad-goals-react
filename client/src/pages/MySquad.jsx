import { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import { WalkthroughContext } from "../context/WalkthroughContext";
import { AnimatedCallToAction, PrimaryButton } from "../components/Buttons";
import CircularProgress from "@mui/material/CircularProgress";
import { CategoryTag, RoleTag } from "../components/Tags";
import ContactSearch from "../components/Search";
import { roleLabels } from "../utils/roleHelpers";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactAvatar from "../components/ContactAvatar";
import { apiFetch } from "../utils/apiUrl";

function FilterAndSearch({
  fetchSquad,
  activeFilter,
  setActiveFilter,
  searchValue,
  setSearchValue,
  friendshipRolesStart,
  tags,
  evalTags,
  tagFilter,
  setTagFilter,
  squadTotal,
}) {
  const [isAddContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [showTagsList, setShowTagsList] = useState(false);

  const userTagsList = [...tags, ...evalTags].map((tag) => (
    <li
      key={tag}
      onClick={() => selectTag(tag)}
      className="p-2 hover:bg-purple-400 cursor-pointer"
    >
      {tag}
    </li>
  ));

  function selectTag(tag) {
    setTagFilter(tag);
    setShowTagsList(false);
  }

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

  function toggleShowTags() {
    setShowTagsList((showTagsList) => !showTagsList);
  }

  return (
    <div className="w-full mb-2 md:mb-6">
      <ul className="flex flex-wrap gap-2">
        <li className={`${squadTotal === 0 ? "opacity-50" : ""}`}>
          <PrimaryButton
            innerText="score"
            onClick={() => setActiveFilter("score")}
            isActive={"score" == activeFilter}
          />
        </li>
        <li className={`${squadTotal === 0 ? "opacity-50" : ""}`}>
          <PrimaryButton
            innerText="first"
            onClick={() => setActiveFilter("first")}
            isActive={"first" == activeFilter}
          />
        </li>
        <li className={`${squadTotal === 0 ? "opacity-50" : ""}`}>
          <PrimaryButton
            innerText="last"
            onClick={() => setActiveFilter("last")}
            isActive={"last" == activeFilter}
          />
        </li>
        <li className={`${squadTotal === 0 ? "opacity-50" : ""}`}>
          <PrimaryButton
            innerText="date"
            onClick={() => setActiveFilter("date")}
            isActive={"date" == activeFilter}
          />
        </li>
        <li className={`${squadTotal === 0 ? "opacity-50" : ""}`}>
          <PrimaryButton
            innerText={tagFilter !== "" ? `tag: ${tagFilter}` : "tag"}
            onClick={() => {
              setActiveFilter("tag");
              toggleShowTags();
            }}
            isActive={"tag" == activeFilter}
          />
          {showTagsList && (
            <ul className="absolute z-50 bg-(--c-violet-void) border border-purple-300 rounded-md mt-1 text-white max-h-40 overflow-y-auto text-sm">
              {userTagsList}
            </ul>
          )}
        </li>
        <li className={`${squadTotal === 0 ? "opacity-50" : ""}`}>
          <input
            type="search"
            className="text-sm border border-inherit rounded-md px-3 py-2 -mr-3"
            placeholder="SEARCH CONTACTS"
            onChange={handleChange}
            value={searchValue}
          />
        </li>

        <div className="flex gap-2 min-w-[146px] self-end ml-auto">
          <li className={`${squadTotal === 0 ? "opacity-50" : ""}`}>
            <PrimaryButton innerText="set roles" onClick={openRolesModal} />
          </li>
          <li>
            <PrimaryButton
              innerText="add"
              onClick={openAddContactModal}
              isGlowing={squadTotal === 0 && true}
            />
          </li>
          {isAddContactModalOpen && (
            <AddContactModal
              closeModal={closeModal}
              fetchSquad={fetchSquad}
              squadTotal={squadTotal}
            />
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

function AddContactModal({ closeModal, fetchSquad, squadTotal }) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useContext(ToastContext);
  const { hasContacts, setHasContacts } = useContext(AuthContext);

  async function createContact(event) {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    const fullName = `${formData.get("firstName")} ${formData.get("lastName")}`;

    try {
      const response = await apiFetch("/api/contact/createContact", {
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
        if (!hasContacts) {
          setHasContacts(true);
        }
        fetchSquad();
        closeModal();
        showToast(`Contact  ${fullName} added!`, "success");
      }
      if (response.status === 409) {
        const messageResponse = await response.json();
        showToast(`${messageResponse.message}`, "error");
        closeModal();
      }
      if (response.status === 400) {
        const messageResponse = await response.json();
        showToast(`${messageResponse.message}`, "error");
      }
      if (response.status === 500) {
        showToast(`Could not add contact. Refresh and try again.`, "error");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      showToast(
        `Could not add contact. Check your connection and try again.`,
        "error",
      );
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
        tabIndex="0"
        className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center p-0"
      >
        <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 mt-16 mb-20 data-closed:sm:scale-95">
          <div className="bg-(--c-purple-tech-40)/40 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-0 sm:ml-4 text-left">
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
                    {squadTotal < 150 ? (
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
                    ) : (
                      <p>Squad Limit Reached</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/*Window buttons*/}
          <div className="bg-(--c-violet-void-40) px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            {squadTotal < 150 && (
              <button
                form="add-contact-form"
                type="submit"
                className="inline-flex w-full justify-center rounded-md action-button sm:ml-3 sm:w-auto px-3 py-2 text-sm shadow-xs hover:bg-(--c-violet-void)"
              >
                ADD CONTACT
              </button>
            )}
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
  const { showToast } = useContext(ToastContext);
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
          <ContactAvatar
            className="inline size-6 border-2 rounded-full"
            contact={selectedRoles[role]}
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

    try {
      const response = await apiFetch("/api/contact/setFriendshipRoles", {
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
        closeModal();
        showToast("Friendship Roles Saved!", "success");
      }
      if (response.status === 500) {
        showToast(`Roles not saved. Refresh and try again.`, "error");
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      showToast(
        `Roles not saved. Check your connection and try again.`,
        "error",
      );
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
        tabIndex="0"
        className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center p-0"
      >
        <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 mt-16 mb-20 data-closed:sm:scale-95">
          <div className="bg-(--c-purple-tech-40)/40 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-0 sm:ml-4 text-left ">
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
  tabValue,
  title,
  img,
  setFeaturedContact,
  setMobileActiveTab,
  mobileActiveTab,
  featuredContact,
  searchTerm,
  searchList,
  activeFilter,
  fetchSquad,
  tags,
  evalTags,
  evalTotal,
}) {
  function toggleSelect(contact) {
    if (featuredContact == contact) {
      setFeaturedContact({});
    } else {
      setFeaturedContact(contact);
      setMobileActiveTab(contact.friendList || contact.connectionInstinct);
    }
  }

  const activeList =
    searchTerm == "" && activeFilter != "tag" ? contactList : searchList;
  const styledContacts = activeList.map((contact) => (
    <li
      key={contact._id}
      className={`${contact._id == featuredContact._id ? "bg-(--c-violet-void-60)" : "bg-(--c-violet-void)"}  rounded-lg hover:bg-(--c-violet-void-60) `}
    >
      <div
        className={`${contact._id == featuredContact._id ? "text-white" : ""} flex gap-2 cursor-pointer px-3 py-2 hover:text-white`}
        onClick={() => toggleSelect(contact)}
      >
        <ContactAvatar className="size-6 mt-3 mx-3" contact={contact} />

        <div className="w-[150px]">
          <h4 className="text-sm">
            {contact.nickname ? contact.nickname : contact.firstName}
          </h4>
          <p>
            {contact.firstName} {contact.lastName}
          </p>
          <p className="text-sm">Score: {contact.evalScore}</p>
        </div>
        <div className="w-[150px] hidden xl:block">
          <p>
            <svg
              width="20"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 inline"
            >
              <path d="M12 2a10 10 0 0 1 7.38 16.75" />
              <path d="M12 6v6l4 2" />
              <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
              <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
              <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
              <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
            </svg>
            Contact: {contact.contactFrequency}
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
      </div>
      <div className="block md:hidden">
        {featuredContact._id == contact._id && (
          <FeaturedContact
            featuredContact={featuredContact}
            fetchSquad={fetchSquad}
            tags={tags}
            evalTags={evalTags}
            evalTotal={evalTotal}
          />
        )}
      </div>
    </li>
  ));
  return (
    <>
      <section
        className="hidden md:block mb-22 lg:mb-0"
        style={{ color: `var(${themeColor})` }}
      >
        <h2 className="text-2xl text-center ">{title}</h2>
        <ul
          className={` rounded-lg p-3  text-xs justify-center`}
          style={{ backgroundColor: `var(${themeColor})` }}
        >
          <div className="flex flex-col gap-2 lg:max-h-[calc(100vh-14rem)] lg:min-h-[393px] lg:overflow-auto">
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
      {tabValue == mobileActiveTab && (
        <section
          className="mb-22 md:hidden w-[100%] max-w-[400px] mt-2"
          style={{ color: `var(${themeColor})` }}
        >
          <ul
            className={` rounded-lg p-3  text-xs justify-center `}
            style={{ backgroundColor: `var(${themeColor})` }}
          >
            <div className="flex flex-col gap-2">
              {activeList.length > 0 ? (
                styledContacts
              ) : (
                <li className="bg-(--c-violet-void) px-3 py-2 rounded-lg w-[100%] h-[156px] flex-column justify-center">
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
      )}
    </>
  );
}

export default function MySquad() {
  const { user, setAuthIssue } = useContext(AuthContext);
  const { dismissedIntros, dismissIntro } = useContext(WalkthroughContext);
  const [heartCoreList, setHeartCoreList] = useState([]);
  const [rayLiablesList, setRayLiablesList] = useState([]);
  const [buddiesList, setBuddiesList] = useState([]);
  const [mobileActiveTab, setMobileActiveTab] = useState("heartCore");
  const [featuredContact, setFeaturedContact] = useState({});
  const [activeFilter, setActiveFilter] = useState("score");
  const [searchValue, setSearchValue] = useState("");
  const [searchHeartCoreList, setSearchHeartCoreList] = useState([]);
  const [searchRayLiablesList, setSearchRayLiablesList] = useState([]);
  const [searchBuddiesList, setSearchBuddiesList] = useState([]);
  const [friendshipRoles, setFriendshipRoles] = useState({});
  const [tags, setTags] = useState([]);
  const [evalTags, setEvalTags] = useState([]);
  const [tagFilter, setTagFilter] = useState("");
  const [evalTotal, setEvalTotal] = useState(0);

  const squadTotal =
    heartCoreList.length + rayLiablesList.length + buddiesList.length;
  const query = searchValue.trim();
  const searchTimeout = useRef(null);

  const fetchSquad = async () => {
    const response = await apiFetch("/api/contact/getSquad");
    if (response.status === 401) {
      setAuthIssue(true);
      return;
    }
    const data = await response.json();
    setHeartCoreList(data.heartCoreList);
    setRayLiablesList(data.rayLiablesList);
    setBuddiesList(data.buddiesList);
    setFriendshipRoles(data.friendshipRoles);
    setTags(data.tags);
    setEvalTags(data.evalTags);
    setEvalTotal(data.evalQuestionCount);
    filterContacts(data.heartCoreList, data.rayLiablesList, data.buddiesList);
    if (featuredContact._id) {
      const updatedFeaturedContact = [
        ...data.heartCoreList,
        ...data.rayLiablesList,
        ...data.buddiesList,
      ].find((obj) => obj._id === featuredContact._id);

      setFeaturedContact(updatedFeaturedContact);
    }
  };
  function filterContacts(heartCore, rayLiables, buddies) {
    if (activeFilter !== "tag") {
      setTagFilter("");
    }
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
    if (activeFilter == "tag" && tagFilter != "") {
      setSearchHeartCoreList(
        heartCoreList.filter(
          (contact) =>
            contact.tags.includes(tagFilter) ||
            contact.evaluation
              .filter(
                (q) =>
                  (q.questionScore === null ||
                    !Object.keys(q).includes("questionScore")) &&
                  q.questionOption?.length > 0,
              )
              .flatMap((q) => q.questionOption)
              .includes(tagFilter),
        ),
      );
      setSearchRayLiablesList(
        rayLiablesList.filter(
          (contact) =>
            contact.tags.includes(tagFilter) ||
            contact.evaluation
              .filter(
                (q) =>
                  (q.questionScore === null ||
                    !Object.keys(q).includes("questionScore")) &&
                  q.questionOption?.length > 0,
              )
              .flatMap((q) => q.questionOption)
              .includes(tagFilter),
        ),
      );
      setSearchBuddiesList(
        buddiesList.filter(
          (contact) =>
            contact.tags.includes(tagFilter) ||
            contact.evaluation
              .filter(
                (q) =>
                  (q.questionScore === null ||
                    !Object.keys(q).includes("questionScore")) &&
                  q.questionOption?.length > 0,
              )
              .flatMap((q) => q.questionOption)
              .includes(tagFilter),
        ),
      );
      return;
    }
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
  }, [searchValue, activeFilter, tagFilter]);

  return (
    <div className="text-purple-300 lg:px-8 lg:pt-12 flex flex-col">
      {user.stats.totalCompleted === 0 &&
        squadTotal === 0 &&
        !dismissedIntros.mySquad && (
          <SquadIntroModal
            userName={user.userName}
            closeModal={() => dismissIntro("mySquad")}
          />
        )}
      <FilterAndSearch
        fetchSquad={fetchSquad}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        friendshipRolesStart={friendshipRoles}
        tags={tags}
        evalTags={evalTags}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        squadTotal={squadTotal}
      />
      <Tabs
        value={mobileActiveTab}
        onChange={(event, tabValue) => {
          setMobileActiveTab(tabValue);
          setFeaturedContact({});
        }}
        aria-label="friend list tabs"
        className={`${squadTotal === 0 ? "opacity-50" : ""} md:hidden`}
        centered
        sx={{
          "& .MuiTab-root": {
            color: "var(--c-purple-tech-60)",
            fontFamily: "Georama",
            fontSize: 17,
          },
          "& .MuiTabs-indicator": { backgroundColor: "white" },
        }}
      >
        <Tab
          value="heartCore"
          label="Heart Core"
          sx={{
            "&.Mui-selected": {
              color: "var(--c-deep-cerise)",
            },
          }}
        />
        <Tab
          value="rayLiables"
          label="Ray-Liables"
          sx={{
            "&.Mui-selected": {
              color: "var(--c-light-coral)",
            },
          }}
        />
        <Tab
          value="buddies"
          label="Buddies"
          sx={{
            "&.Mui-selected": {
              color: "var(--c-green-sheen)",
            },
          }}
        />
      </Tabs>

      <main
        className={`${squadTotal === 0 ? "opacity-50" : ""} flex gap-4 justify-center xl:justify-start w-full md:overflow-x-auto`}
      >
        {/*Inner Circle or "Heart" core freiends*/}
        {(!featuredContact._id ||
          featuredContact.friendList === "heartCore" ||
          (!featuredContact.friendList &&
            featuredContact.connectionInstinct === "heartCore")) && (
          <ContactList
            title="Heart-Core Friends"
            themeColor="--c-deep-cerise"
            tabValue="heartCore"
            contactList={heartCoreList}
            searchList={searchHeartCoreList}
            searchTerm={query}
            img="/imgs/icons/pink-clock.png"
            setFeaturedContact={setFeaturedContact}
            featuredContact={featuredContact}
            setMobileActiveTab={setMobileActiveTab}
            mobileActiveTab={mobileActiveTab}
            activeFilter={activeFilter}
            fetchSquad={fetchSquad}
            tags={tags}
            evalTags={evalTags}
            evalTotal={evalTotal}
          />
        )}

        {/*Close Friends or "Ray"liables*/}
        {(!featuredContact._id ||
          featuredContact.friendList === "rayLiables" ||
          (!featuredContact.friendList &&
            featuredContact.connectionInstinct === "rayLiables")) && (
          <ContactList
            title="Ray-liables"
            themeColor="--c-light-coral"
            tabValue="rayLiables"
            contactList={rayLiablesList}
            searchList={searchRayLiablesList}
            searchTerm={query}
            img="/imgs/icons/coral-clock.png"
            setFeaturedContact={setFeaturedContact}
            setMobileActiveTab={setMobileActiveTab}
            mobileActiveTab={mobileActiveTab}
            featuredContact={featuredContact}
            activeFilter={activeFilter}
            fetchSquad={fetchSquad}
            tags={tags}
            evalTags={evalTags}
            evalTotal={evalTotal}
          />
        )}

        {/*Casual Friends or "Bud"dies*/}
        {(!featuredContact._id ||
          featuredContact.friendList === "buddies" ||
          (!featuredContact.friendList &&
            featuredContact.connectionInstinct === "buddies")) && (
          <ContactList
            title="Bud-dies"
            themeColor="--c-green-sheen"
            tabValue="buddies"
            contactList={buddiesList}
            searchList={searchBuddiesList}
            searchTerm={query}
            img="/imgs/icons/green-clock.png"
            setFeaturedContact={setFeaturedContact}
            setMobileActiveTab={setMobileActiveTab}
            mobileActiveTab={mobileActiveTab}
            featuredContact={featuredContact}
            activeFilter={activeFilter}
            fetchSquad={fetchSquad}
            tags={tags}
            evalTags={evalTags}
            evalTotal={evalTotal}
          />
        )}

        {featuredContact._id && (
          <div className="hidden md:block">
            <FeaturedContact
              featuredContact={featuredContact}
              fetchSquad={fetchSquad}
              tags={tags}
              evalTags={evalTags}
              evalTotal={evalTotal}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function FeaturedContact({
  featuredContact,
  fetchSquad,
  tags,
  evalTags,
  evalTotal,
}) {
  const [contactHistory, setContactHistory] = useState([]);
  const [isMissionHistoryLoading, setIsMissionHistoryLoading] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const fetchMissionHistory = async (contactId) => {
    setIsMissionHistoryLoading(true);
    const response = await apiFetch(`/api/contact/${contactId}/history`);
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

  const daysAbbrev = {
    monday: "M",
    tuesday: "T",
    wednesday: "W",
    thursday: "Th",
    friday: "F",
    saturday: "Sat",
    sunday: "Sun",
  };

  const loveLangFormat = {
    wordsOfAffirmation: "Words of Affirmation",
    qualityTime: "Quality Time",
    receivingGifts: "Receiving Gifts",
    actsOfService: "Acts of Service",
    physicalTouch: "Physical Touch",
  };
  const socialsList =
    featuredContact.details &&
    featuredContact.details.socials &&
    featuredContact.details.socials.filter((entry) => entry.handle !== "")
      .length >= 1 ? (
      featuredContact.details.socials
        .filter((entry) => entry.handle !== "")
        .map((entry) => (
          <li>
            {entry.platform}:{" "}
            <span className="text-(--c-purple-tech-40)">{entry.handle}</span>
          </li>
        ))
    ) : (
      <li>Edit contact to add socials</li>
    );

  const featuredEvalTags = featuredContact.evaluation
    .filter(
      (q) =>
        (q.questionScore === null ||
          !Object.keys(q).includes("questionScore")) &&
        q.questionOption?.length > 0,
    )
    .flatMap((q) => q.questionOption);
  const tagsList = [...featuredEvalTags, ...featuredContact.tags].map((tag) => (
    <CategoryTag text={tag} key={tag} />
  ));

  const missionHistoryList = contactHistory.map((entry, index) => (
    <li key={index}>
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

  function closeEditModal() {
    setIsEditContactOpen(false);
  }
  function getZodiacSign(birthDate) {
    const zodiacSigns = [
      { sign: "Capricorn", start: [12, 22], end: [1, 19] },
      { sign: "Aquarius", start: [1, 20], end: [2, 18] },
      { sign: "Pisces", start: [2, 19], end: [3, 20] },
      { sign: "Aries", start: [3, 21], end: [4, 19] },
      { sign: "Taurus", start: [4, 20], end: [5, 20] },
      { sign: "Gemini", start: [5, 21], end: [6, 20] },
      { sign: "Cancer", start: [6, 21], end: [7, 22] },
      { sign: "Leo", start: [7, 23], end: [8, 22] },
      { sign: "Virgo", start: [8, 23], end: [9, 22] },
      { sign: "Libra", start: [9, 23], end: [10, 22] },
      { sign: "Scorpio", start: [10, 23], end: [11, 21] },
      { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
    ];

    const month = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
    const day = birthDate.getDate();

    for (let zodiac of zodiacSigns) {
      const [startMonth, startDay] = zodiac.start;
      const [endMonth, endDay] = zodiac.end;

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return zodiac.sign;
      }
    }
  }
  return (
    <div
      className="mt-2 md:mt-8 rounded-lg md:p-2 text-purple-300"
      style={{ backgroundColor: `var(${contactTheme})` }}
    >
      <div className="p-2 md:p-0 bg-(--c-violet-void) rounded md:min-w-[450px] w-[100%] lg:min-h-[400px] lg:max-h-[calc(100vh-13.5rem)] lg:overflow-auto">
        {/*Top Basic Info Section*/}
        <div className="md:flex md:flex-wrap gap-4 p-3">
          {/*ID and scheduling */}
          <div className="md:flex md:flex-wrap justify-between gap-x-10 gap-y-2 md:min-w-[450px]">
            {/*Img and name*/}
            <div className="flex gap-3">
              {/*Img wrapper */}
              <ContactAvatar
                className="size-24 border-3 rounded-sm hidden md:block"
                contact={featuredContact}
              />

              {/*Name */}
              <div>
                <p className="hidden md:block text-l">{`${featuredContact.firstName} ${featuredContact.lastName}`}</p>
                <h3 className="hidden md:block text-3xl">
                  {`${featuredContact.nickname ? featuredContact.nickname : featuredContact.firstName}`}
                </h3>
                <div className="flex flex-row-reverse md:flex-row justify-between mb-2 md:mb-0">
                  <div className="block md:hidden">
                    <PrimaryButton
                      innerText="edit"
                      onClick={() => setIsEditContactOpen(true)}
                    />
                  </div>
                  {featuredContact.friendshipRole && (
                    <h3 className="text-3xl">
                      <RoleTag
                        text={roleLabels[featuredContact.friendshipRole]}
                        img="/imgs/icons/star.png"
                      />
                    </h3>
                  )}
                </div>
              </div>
            </div>
            {/*Mission scheduling */}
            <div className="text-sm self-end">
              <p>
                {/*TODO: Make this image a pseudo element and give it a class once the svg is ready */}
                <svg
                  width="20"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 inline"
                >
                  <path d="M12 2a10 10 0 0 1 7.38 16.75" />
                  <path d="M12 6v6l4 2" />
                  <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
                  <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
                  <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
                  <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
                </svg>{" "}
                Contact Frequency: {featuredContact.contactFrequency}
              </p>
              <p>
                Preferred Days:{" "}
                {(featuredContact.preferredDay &&
                  featuredContact.preferredDay
                    .map((day) => daysAbbrev[day])
                    .join(" ")) ||
                  "None"}
              </p>
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
          </div>
          {/*Edit and eval strip */}
          <div className="flex flex-wrap gap-x-15 gap-y-2 items-start min-w-[240px]">
            <div className="hidden md:block">
              <PrimaryButton
                innerText="edit"
                onClick={() => setIsEditContactOpen(true)}
              />
            </div>
            <h4 className="text-2xl self-start w-[210px] hidden md:block">
              Eval Score: {featuredContact.evalScore}
            </h4>
            <p className="self-start w-[240px]">
              Questions Answered: {featuredContact.evaluation?.length || "0"}/
              {evalTotal}
            </p>
          </div>
          {isEditContactOpen && (
            <EditContactModal
              featuredContact={featuredContact}
              closeModal={closeEditModal}
              fetchSquad={fetchSquad}
              tags={tags}
            />
          )}
        </div>
        {/*Main Area*/}
        <div className="flex flex-col md:flex-row md:flex-wrap-reverse p-4 gap-x-4 md:gap-y-2 ">
          {/*History */}
          <div className="basis-8 min-w-[300px] grow-1 hidden md:block">
            <h4>Mission History</h4>
            <ul className="text-xs " style={{ width: "100%" }}>
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
          <div
            className="basis-7 grow-1 min-w-[300px]"
            style={{ color: `var(${contactTheme})` }}
          >
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
                {!featuredContact.details ||
                !featuredContact.details.phone ||
                Object.keys(featuredContact.details.phone).length < 1 ||
                (featuredContact.details.phone.mobile === "" &&
                  featuredContact.details.phone.home === "" &&
                  featuredContact.details.phone.work === "") ? (
                  <li>Edit contact to add phone number</li>
                ) : (
                  <>
                    {featuredContact.details.phone.mobile !== "" && (
                      <li>
                        Mobile:{" "}
                        <span className="text-(--c-purple-tech-40)">
                          {featuredContact.details?.phone?.mobile}
                        </span>
                      </li>
                    )}
                    {featuredContact.details.phone.home !== "" && (
                      <li>
                        Home:{" "}
                        <span className="text-(--c-purple-tech-40)">
                          {featuredContact.details?.phone?.home}
                        </span>
                      </li>
                    )}
                    {featuredContact.details.phone.work !== "" && (
                      <li>
                        Work:{" "}
                        <span className="text-(--c-purple-tech-40)">
                          {featuredContact.details?.phone?.work}
                        </span>
                      </li>
                    )}
                  </>
                )}
              </ul>
              <h5 className="text-xs py-2">Email</h5>
              <ul className="border-b-1 py-2">
                {!featuredContact.details ||
                !featuredContact.details.email ||
                Object.keys(featuredContact.details.email).length < 1 ||
                (featuredContact.details.email.primary === "" &&
                  featuredContact.details.email.backup === "") ? (
                  <li>Edit contact to add email</li>
                ) : (
                  <>
                    {featuredContact.details.email.primary !== "" && (
                      <li>
                        Primary:{" "}
                        <span className="text-(--c-purple-tech-40)">
                          {featuredContact.details?.email?.primary}
                        </span>
                      </li>
                    )}
                    {featuredContact.details.email.backup !== "" && (
                      <li>
                        Backup:{" "}
                        <span className="text-(--c-purple-tech-40)">
                          {featuredContact.details?.email?.backup}
                        </span>
                      </li>
                    )}
                  </>
                )}
              </ul>
              <h5 className="text-xs py-2">Socials</h5>
              <ul className="border-b-1 py-2">{socialsList}</ul>

              <h5 className="text-xs py-2">Tags</h5>
              <div className="flex flex-wrap gap-1">
                {tagsList.length > 0 ? (
                  tagsList
                ) : (
                  <p>Edit contact to add tags</p>
                )}
              </div>
              <h5 className="text-xs py-2">Important Notes</h5>
              <p>
                Birthday:{" "}
                <span className="text-(--c-purple-tech-40)">
                  {featuredContact.birthday
                    ? new Date(featuredContact.birthday).toLocaleDateString()
                    : "N/A"}
                </span>
              </p>
              {featuredContact.birthday && (
                <p>
                  Sign:{" "}
                  <span className="text-(--c-purple-tech-40)">
                    {getZodiacSign(new Date(featuredContact.birthday))}
                  </span>
                </p>
              )}
              {featuredContact.details &&
                featuredContact.details.myersBriggsType !== "" && (
                  <p>
                    Myers-Briggs Type:{" "}
                    <span className="text-(--c-purple-tech-40)">
                      {featuredContact.details.myersBriggsType?.toUpperCase()}
                    </span>
                  </p>
                )}
              {featuredContact.details &&
                featuredContact.details.loveLanguages.length > 0 && (
                  <p>
                    Love Languages:{" "}
                    <span className="text-(--c-purple-tech-40)">
                      {featuredContact.details.loveLanguages
                        .map((lang) => loveLangFormat[lang])
                        .join(", ")}
                    </span>
                  </p>
                )}
              <p className="min-h-[50px] border-1 rounded-sm mt-2 p-2">
                {featuredContact.details &&
                featuredContact.details.additionalNotes !== ""
                  ? featuredContact.details.additionalNotes
                  : "No more notes to show."}
              </p>
            </div>
          </div>
          {/*History for mobile*/}
          <div className="block md:hidden text-lg">
            <Accordion
              expanded={isHistoryOpen == true}
              onChange={() => {
                setIsHistoryOpen((prev) => !prev);
              }}
              slotProps={{
                heading: { component: "h4" },
                transition: { unmountOnExit: true },
              }}
              className="text-(--c-violet-void)"
              style={{
                "background-color": `var(${contactTheme})`,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                Mission History
              </AccordionSummary>
              <AccordionDetails>
                <ul className="text-xs" style={{ width: "100%" }}>
                  {isMissionHistoryLoading && (
                    <CircularProgress color="#7D4C9F" />
                  )}
                  {!isMissionHistoryLoading &&
                    (missionHistoryList.length > 0 ? (
                      missionHistoryList
                    ) : (
                      <li style={{ minWidth: "100%" }}>
                        <h4 className="text-sm pl-3">No Mission History</h4>
                      </li>
                    ))}
                </ul>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditContactModal({ featuredContact, tags, closeModal, fetchSquad }) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useContext(ToastContext);
  const [contactDetails, setContactDetails] = useState({
    firstName: featuredContact.firstName,
    lastName: featuredContact.lastName,
    nickname: featuredContact.nickname || "",
    preferredDay: featuredContact.preferredDay || [],
    preferredMethod: featuredContact.preferredMethod,
    mobilePhone: featuredContact.details?.phone?.mobile || "",
    homePhone: featuredContact.details?.phone?.home || "",
    workPhone: featuredContact.details?.phone?.work || "",
    primaryEmail: featuredContact.details?.email?.primary || "",
    backupEmail: featuredContact.details?.email?.backup || "",
    socials: featuredContact.details?.socials || [
      { platform: "facebook", handle: "" },
      { platform: "bluesky", handle: "" },
      { platform: "instagram", handle: "" },
      { platform: "snapchat", handle: "" },
    ],
    myersBriggsType: featuredContact.details?.myersBriggsType || "",
    loveLanguages: featuredContact.details?.loveLanguages || [],
    additionalNotes: featuredContact.details?.additionalNotes || "",
    tags: featuredContact.tags || [],
    birthday: featuredContact.birthday?.slice(0, 10) || "",
  });
  const [userTags, setUserTags] = useState(tags || []);
  const [tagSelector, setTagSelector] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInputValue, setTagInputValue] = useState("");

  const tagList =
    userTags && userTags.length > 0 ? (
      userTags.map((tag) => <option value={tag}>{tag}</option>)
    ) : (
      <option value="none" disabled>
        no tags
      </option>
    );

  const contactTags = contactDetails.tags.map((tag, i) => (
    <li
      key={tag}
      className="text-xs font-bold rounded m-1 py-1 px-2 text-(--c-violet-void-80) bg-(--c-purple-tech-80)"
    >
      {tag}
      <button
        type="button"
        className="cursor-pointer pl-2"
        onClick={() => removeTag(i)}
      >
        x
      </button>
    </li>
  ));

  const socialsList = contactDetails.socials.map((entry, index) => (
    <li className="flex" key={index}>
      <label
        htmlFor={`edit${entry.platform}platform`}
        className="text-xs text-white"
      >
        Platform
        <input
          name={`edit${entry.platform}platform`}
          type="text"
          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
          value={entry.platform}
          onChange={(e) =>
            setContactDetails((prev) => {
              const updatedSocials = prev.socials.map((old, i) =>
                i === index
                  ? { ...old, platform: e.target.value.toLowerCase() }
                  : old,
              );
              return { ...prev, socials: updatedSocials };
            })
          }
        />
      </label>
      <label
        htmlFor={`edit${entry.platform}handle`}
        className="text-xs text-white"
      >
        Handle
        <input
          name={`edit${entry.platform}handle`}
          type="text"
          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
          value={entry.handle}
          onChange={(e) =>
            setContactDetails((prev) => {
              const updatedSocials = prev.socials.map((old, i) =>
                i === index ? { ...old, handle: e.target.value } : old,
              );
              return { ...prev, socials: updatedSocials };
            })
          }
        />
      </label>
    </li>
  ));

  function addSocials() {
    const lastSocial =
      contactDetails.socials[contactDetails.socials.length - 1];
    if (lastSocial && lastSocial.platform === "") return;
    setContactDetails((prev) => ({
      ...prev,
      socials: [...prev.socials, { platform: "", handle: "" }],
    }));
  }

  async function addTag() {
    if (
      !userTags.includes(tagInputValue.toLowerCase()) &&
      tagInputValue.trim() !== ""
    ) {
      const response = await apiFetch("/api/user/addTag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag: tagInputValue.toLowerCase() }),
      });
      if (response.status === 200) {
        setTagInputValue("");
        setShowTagInput(false);
        setContactDetails((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInputValue.toLowerCase()],
        }));
        setUserTags((prev) => [...prev, tagInputValue.toLowerCase()]);
      }
    }
  }

  function removeTag(i) {
    const updatedTags = contactDetails.tags.filter(
      (item, index) => index !== i,
    );

    setContactDetails((prev) => ({ ...prev, tags: updatedTags }));
  }

  async function saveUserDetails(event) {
    setIsLoading(true);
    event.preventDefault();

    const trimmedSocials = contactDetails.socials.filter(
      (entry) => entry.platform.trim() !== "" || entry.handle.trim() !== "",
    );

    const cleanedBirthday =
      contactDetails.birthday === "" ? null : contactDetails.birthday;
    const cleanedContact = {
      ...contactDetails,
      socials: trimmedSocials,
      birthday: cleanedBirthday,
    };

    try {
      const response = await apiFetch(
        `/api/contact/${featuredContact._id}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanedContact),
        },
      );

      if (response.status === 200) {
        fetchSquad();
        closeModal();
        showToast("User details saved!", "success");
      }
      if (response.status === 400) {
        const messageResponse = await response.json();
        showToast(`${messageResponse.message}`, "error");
      }
      if (response.status === 500) {
        showToast(
          `Details could not be saved. Refresh and try again.`,
          "error",
        );
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      showToast(
        `Details could not be saved. Check your connection and try again.`,
        "error",
      );
    }
  }

  return (
    <div
      id="edit-contact"
      aria-labelledby="edit-contact"
      className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent z-20"
    >
      <div className="fixed inset-0 bg-black/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

      <div
        tabIndex="0"
        className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center p-0"
      >
        <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 mt-16 mb-20 data-closed:sm:scale-95">
          <div className="bg-(--c-purple-tech-40)/40 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-0 sm:ml-4 text-left">
                {/*Window title*/}
                <h3
                  id="dialog-title"
                  className="text-base font-semibold text-gray-900"
                >
                  Edit Contact Details
                </h3>
                {isLoading ? (
                  <CircularProgress color="#7D4C9F" />
                ) : (
                  <div className="mt-2 text-purple-300 text-sm max-h-[500px] overflow-auto">
                    {/*form*/}
                    <form id="edit-contact-form">
                      <div className="flex flex-col">
                        <label
                          htmlFor="contactFirstName"
                          className="text-xs text-white"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="contactFirstName"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.firstName}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
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
                          name="contactLastName"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.lastName}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
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
                          name="contactNickname"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.nickname}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              nickname: e.target.value,
                            }))
                          }
                        />
                        <fieldset className="flex flex-wrap max-w-[400px] mb-6">
                          <legend className="text-xs text-white">
                            Preferred Contact Days
                          </legend>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="preferredMonday"
                              name="preferredDays"
                              value="monday"
                              checked={contactDetails.preferredDay?.includes(
                                "monday",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: [
                                      ...prev.preferredDay,
                                      "monday",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: prev.preferredDay.filter(
                                      (day) => day !== "monday",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="preferredMonday">Monday</label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="preferredTuesday"
                              name="preferredDays"
                              value="tuesday"
                              checked={contactDetails.preferredDay?.includes(
                                "tuesday",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: [
                                      ...prev.preferredDay,
                                      "tuesday",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: prev.preferredDay.filter(
                                      (day) => day !== "tuesday",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="preferredTuesday">Tuesday</label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="preferredWednesday"
                              name="preferredDays"
                              value="wednesday"
                              checked={contactDetails.preferredDay?.includes(
                                "wednesday",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: [
                                      ...prev.preferredDay,
                                      "wednesday",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: prev.preferredDay.filter(
                                      (day) => day !== "wednesday",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="preferredWednesday">
                              Wednesday
                            </label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="preferredThursday"
                              name="preferredDays"
                              value="thursday"
                              checked={contactDetails.preferredDay?.includes(
                                "thursday",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: [
                                      ...prev.preferredDay,
                                      "thursday",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: prev.preferredDay.filter(
                                      (day) => day !== "thursday",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="preferredThursday">Thursday</label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="preferredFriday"
                              name="preferredDays"
                              value="friday"
                              checked={contactDetails.preferredDay?.includes(
                                "friday",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: [
                                      ...prev.preferredDay,
                                      "friday",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: prev.preferredDay.filter(
                                      (day) => day !== "friday",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="preferredFriday">Friday</label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="preferredSaturday"
                              name="preferredDays"
                              value="saturday"
                              checked={contactDetails.preferredDay?.includes(
                                "saturday",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: [
                                      ...prev.preferredDay,
                                      "saturday",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: prev.preferredDay.filter(
                                      (day) => day !== "saturday",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="preferredSaturday">Saturday</label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="preferredSunday"
                              name="preferredDays"
                              value="sunday"
                              checked={contactDetails.preferredDay?.includes(
                                "sunday",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: [
                                      ...prev.preferredDay,
                                      "sunday",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    preferredDay: prev.preferredDay.filter(
                                      (day) => day !== "sunday",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="preferredSunday">Sunday</label>
                          </div>
                        </fieldset>
                        <label
                          htmlFor="editPreferredMethod"
                          className="text-xs text-white"
                        >
                          Preferred Contact Method
                        </label>
                        <select
                          name="preferredMethod"
                          id="editPreferredMethod"
                          className="bg-(--c-violet-void) rounded-md px-3 py-2 mb-6"
                          value={contactDetails.preferredMethod}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              preferredMethod: e.target.value,
                            }))
                          }
                          required
                        >
                          <option value="socialMedia">Social media</option>
                          <option value="textMessage">Text message</option>
                          <option value="phoneCall">Phone call</option>
                        </select>
                        <label
                          htmlFor="editMobile"
                          className="text-xs text-white"
                        >
                          Mobile Phone Number
                        </label>
                        <input
                          type="tel"
                          id="editMobile"
                          name="mobilePhone"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.mobilePhone}
                          onChange={(e) => {
                            setContactDetails((prev) => ({
                              ...prev,
                              mobilePhone: formatPhoneNumber(e.target.value),
                            }));
                          }}
                        />
                        <label
                          htmlFor="editHomePhone"
                          className="text-xs text-white"
                        >
                          Home Phone Number
                        </label>
                        <input
                          type="tel"
                          id="editHomePhone"
                          name="homePhone"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.homePhone}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              homePhone: formatPhoneNumber(e.target.value),
                            }))
                          }
                        />
                        <label
                          htmlFor="editWorkPhone"
                          className="text-xs text-white"
                        >
                          Work Phone Number
                        </label>
                        <input
                          type="tel"
                          id="editWorkPhone"
                          name="workPhone"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.workPhone}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              workPhone: formatPhoneNumber(e.target.value),
                            }))
                          }
                        />
                        <label
                          htmlFor="editPrimaryEmail"
                          className="text-xs text-white"
                        >
                          Primary Email
                        </label>
                        <input
                          type="email"
                          id="editPrimaryEmail"
                          pattern=".+@example\.com"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.primaryEmail}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              primaryEmail: e.target.value,
                            }))
                          }
                        />
                        <label
                          htmlFor="editBackupEmail"
                          className="text-xs text-white"
                        >
                          Backup Email
                        </label>
                        <input
                          type="email"
                          id="editBackupEmail"
                          pattern=".+@example\.com"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.backupEmail}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              backupEmail: e.target.value,
                            }))
                          }
                        />
                        <div className="flex flex-col">
                          <p className="text-base text-white">Socials</p>
                          <ul>{socialsList}</ul>
                          {contactDetails.socials.length < 8 && (
                            <button
                              type="button"
                              className="text-sm hover:text-white cursor-pointer"
                              onClick={addSocials}
                            >
                              Other +
                            </button>
                          )}
                        </div>
                        <label
                          htmlFor="editMyersBriggs"
                          className="text-xs text-white mt-6"
                        >
                          Myers Briggs Type
                        </label>
                        <select
                          name="myersBriggsType"
                          id="editMyersBriggs"
                          className="bg-(--c-violet-void) rounded-md px-3 py-2 mb-6"
                          value={contactDetails.myersBriggsType || ""}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              myersBriggsType: e.target.value,
                            }))
                          }
                        >
                          <option value="">-none-</option>
                          <option value="intja">INTJ-A Architect</option>
                          <option value="intjt">INTJ-T Architect</option>
                          <option value="intpa">INTP-A Logician</option>
                          <option value="intpt">INTP-T Logician</option>
                          <option value="entja">ENTJ-A Commander</option>
                          <option value="entjt">ENTJ-T Commander</option>
                          <option value="entpa">ENTP-A Debater</option>
                          <option value="entpt">ENTP-T Debater</option>
                          <option value="infja">INFJ-A Advocate</option>
                          <option value="infjt">INFJ-T Advocate</option>
                          <option value="infpa">INFP-A Mediator</option>
                          <option value="infpt">INFP-T Mediator</option>
                          <option value="enfja">ENFJ-A Protagonist</option>
                          <option value="enfjt">ENFJ-T Protagonist</option>
                          <option value="enfpa">ENFP-A Campaigner</option>
                          <option value="enfpt">ENFP-T Campaigner</option>
                          <option value="istja">ISTJ-A Logistician</option>
                          <option value="istjt">ISTJ-T Logistician</option>
                          <option value="isfja">ISFJ-A Defender</option>
                          <option value="isfjt">ISFJ-T Defender</option>
                          <option value="estja">ESTJ-A Executive</option>
                          <option value="estjt">ESTJ-T Executive</option>
                          <option value="esfja">ESFJ-A Consul</option>
                          <option value="esfjt">ESFJ-T Consul</option>
                          <option value="istpa">ISTP-A Virtuoso</option>
                          <option value="istpt">ISTP-T Virtuoso</option>
                          <option value="isfpa">ISFP-A Advanturer</option>
                          <option value="isfpt">ISFP-T Advanturer</option>
                          <option value="estpa">ESTP-A Entrepreneur</option>
                          <option value="estpt">ESTP-T Entrepreneur</option>
                          <option value="esfpa">ESFP-A Entertainer</option>
                          <option value="esfpt">ESFP-T Entertainer</option>
                        </select>
                        <fieldset className="flex flex-wrap max-w-[400px] mb-6">
                          <legend className="text-xs text-white">
                            Love Languages
                          </legend>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="wordsOfAffirmation"
                              name="wordsOfAffirmation"
                              value="wordsOfAffirmation"
                              checked={contactDetails.loveLanguages?.includes(
                                "wordsOfAffirmation",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: [
                                      ...prev.loveLanguages,
                                      "wordsOfAffirmation",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: prev.loveLanguages.filter(
                                      (ll) => ll !== "wordsOfAffirmation",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="wordsOfAffirmation">
                              Words of Affirmation
                            </label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="qualityTime"
                              name="qualityTime"
                              value="qualityTime"
                              checked={contactDetails.loveLanguages?.includes(
                                "qualityTime",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: [
                                      ...prev.loveLanguages,
                                      "qualityTime",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: prev.loveLanguages.filter(
                                      (ll) => ll !== "qualityTime",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="qualityTime">Quality Time</label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="receivingGifts"
                              name="receivingGifts"
                              value="receivingGifts"
                              checked={contactDetails.loveLanguages?.includes(
                                "receivingGifts",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: [
                                      ...prev.loveLanguages,
                                      "receivingGifts",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: prev.loveLanguages.filter(
                                      (ll) => ll !== "receivingGifts",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="receivingGifts">
                              Receiving Gifts
                            </label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="actsOfService"
                              name="actsOfService"
                              value="actsOfService"
                              checked={contactDetails.loveLanguages?.includes(
                                "actsOfService",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: [
                                      ...prev.loveLanguages,
                                      "actsOfService",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: prev.loveLanguages.filter(
                                      (ll) => ll !== "actsOfService",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="actsOfService">
                              Acts of Service
                            </label>
                          </div>
                          <div className="flex gap-1 px-2 items-center">
                            <input
                              type="checkbox"
                              id="physicalTouch"
                              name="physicalTouch"
                              value="physicalTouch"
                              checked={contactDetails.loveLanguages?.includes(
                                "physicalTouch",
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: [
                                      ...prev.loveLanguages,
                                      "physicalTouch",
                                    ],
                                  }));
                                } else {
                                  setContactDetails((prev) => ({
                                    ...prev,
                                    loveLanguages: prev.loveLanguages.filter(
                                      (ll) => ll !== "physicalTouch",
                                    ),
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="physicalTouch">
                              Physical Touch
                            </label>
                          </div>
                        </fieldset>
                        <label
                          htmlFor="editAdditionalNotes"
                          className="text-xs text-white"
                        >
                          Additional Notes
                        </label>
                        <textarea
                          name="editAdditionalNotes"
                          id="editAdditionalNotes"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.additionalNotes}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              additionalNotes: e.target.value,
                            }))
                          }
                        ></textarea>
                        <label
                          htmlFor="editTags"
                          className="text-xs text-white"
                        >
                          Tags
                        </label>
                        <ul className="flex">{contactTags}</ul>
                        <select
                          name="editTags"
                          id="editTags"
                          className="bg-(--c-violet-void) rounded-md px-3 py-2 mb-6"
                          value={tagSelector}
                          onChange={(e) => {
                            if (
                              !contactDetails.tags.includes(e.target.value) &&
                              e.target.value !== ""
                            ) {
                              setContactDetails((prev) => ({
                                ...prev,
                                tags: [...prev.tags, e.target.value],
                              }));
                            }
                          }}
                        >
                          <option value="">--Select a tag --</option>
                          {tagList}
                        </select>

                        {!showTagInput && (
                          <button
                            type="button"
                            className="text-sm hover:text-white cursor-pointer"
                            onClick={() => setShowTagInput(true)}
                          >
                            Add Tag +
                          </button>
                        )}
                        {showTagInput && (
                          <>
                            <label
                              htmlFor="addTagInput"
                              className="text-xs text-white"
                            >
                              Add tag
                            </label>
                            <div className="flex items-center mb-6">
                              <input
                                name="addTagInput"
                                className="border border-purple-300 rounded-md px-3 py-2 "
                                value={tagInputValue}
                                onChange={(e) =>
                                  setTagInputValue(e.target.value)
                                }
                              />
                              <button
                                className="border-inherit hover:bg-(--c-violet-void-60) hover:text-white text-sm ml-3 px-2 border rounded-lg h-[38px]"
                                type="button"
                                onClick={addTag}
                              >
                                ADD
                              </button>
                            </div>
                          </>
                        )}
                        <label
                          htmlFor="editBirthday"
                          className="text-xs text-white mt-6"
                        >
                          Birthday
                        </label>

                        <input
                          type="date"
                          name="editBirthday"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          value={contactDetails.birthday}
                          onChange={(e) =>
                            setContactDetails((prev) => ({
                              ...prev,
                              birthday: e.target.value,
                            }))
                          }
                        />
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
              type="button"
              onClick={saveUserDetails}
              className="inline-flex w-full justify-center rounded-md action-button sm:ml-3 sm:w-auto px-3 py-2 text-sm shadow-xs hover:bg-(--c-violet-void)"
            >
              SAVE DETAILS
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

function SquadIntroModal({ closeModal, userName }) {
  return (
    <div
      id="squad-intro"
      aria-labelledby="squad-intro"
      className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent z-20"
    >
      <div className="fixed inset-0 bg-black/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></div>

      <div
        tabIndex="0"
        className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center p-0"
      >
        <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 mt-16 mb-20 data-closed:sm:scale-95">
          <div className="bg-(--c-purple-tech-40)/40 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-0 sm:ml-4 text-left">
                {/*Window title*/}
                <h3
                  id="dialog-title"
                  className="text-base font-semibold text-gray-900"
                >
                  Welcome to Squad Goals
                </h3>

                <div className="mt-2 text-purple-300 text-sm">
                  Hi {userName}, thank goodness you are here! Human connection
                  levels are low all over earth. We are in desperate need of
                  people who can help us reinvigorate the ancient power of
                  "staying in touch"! If you are ready to jump in, go ahead and
                  start adding your friends and family as contacts.
                </div>
              </div>
            </div>
          </div>
          {/*Window buttons*/}
          <div className="bg-(--c-violet-void-40) px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={closeModal}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-(--c-violet-void-40) px-3 py-2 text-sm font-semibold text-purple-400 shadow-xs inset-ring inset-ring-purple-400 hover:bg-(--c-violet-void-20) sm:mt-0 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

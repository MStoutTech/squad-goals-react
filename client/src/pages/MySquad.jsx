import { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import { WalkthroughContext } from "../context/WalkthroughContext";
import { AnimatedCallToAction, PrimaryButton } from "../components/Buttons";
import { CategoryTag, RoleTag } from "../components/Tags";
import ContactSearch from "../components/Search";
import { roleLabels } from "../utils/roleHelpers";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import CircularProgress from "@mui/material/CircularProgress";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  ContactAvatar,
  SelectedContactChip,
} from "../components/ContactAvatar";
import { apiFetch } from "../utils/apiUrl";
import { PrimaryModal } from "../components/Modals";
import useFocusReturn from "../utils/useFocusReturn";
import {
  ModalTextInput,
  ModalSelectInput,
  ModalFieldset,
  ModalCheckbox,
  ModalTextarea,
  ModalDateInput,
  MultipleSelectChip,
} from "../components/Inputs";

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
  const { saveFocus, restoreFocus } = useFocusReturn();
  const [isAddContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [showTagsList, setShowTagsList] = useState(false);

  const userTagsList = [...tags, ...evalTags].map((tag) => (
    <li key={tag}>
      <button
        onClick={() => selectTag(tag)}
        className="p-2 hover:bg-purple-400 cursor-pointer w-[100%] text-left"
      >
        {tag}
      </button>
    </li>
  ));

  function selectTag(tag) {
    setTagFilter(tag);
    setShowTagsList(false);
  }

  function closeModal() {
    setIsContactModalOpen(false);
    setIsRolesModalOpen(false);
    restoreFocus();
  }
  function openAddContactModal() {
    setIsContactModalOpen(true);
    saveFocus();
  }
  function openRolesModal() {
    setIsRolesModalOpen(true);
    saveFocus();
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
            className="text-sm border border-inherit rounded-md px-3 py-2 -mr-3 mt-[3px]"
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
    <PrimaryModal
      windowTitle="Add New Contact"
      closeModal={closeModal}
      formId="add-contact-form"
      submitButtonText="ADD CONTACT"
      allowSubmit={squadTotal < 150}
      isLoading={isLoading}
    >
      {/*form*/}
      {squadTotal < 150 ? (
        <form id="add-contact-form" onSubmit={createContact}>
          <div className="flex flex-col">
            <ModalTextInput
              labelText="First Name"
              inputId="contactFirstName"
              inputName="firstName"
              required={true}
            />
            <ModalTextInput
              labelText="Last Name"
              inputId="contactLastName"
              inputName="lastName"
              required={true}
            />
            <ModalTextInput
              labelText="Nickname"
              inputId="contactNickname"
              inputName="nickname"
              required={false}
            />
            <ModalSelectInput
              labelText="How close are you?"
              inputId="connection-instinct"
              inputName="connectionInstinct"
              required={true}
            >
              <option key="heartCore" value="heartCore">
                Super close
              </option>
              <option key="rayLiables" value="rayLiables">
                Pretty close
              </option>
              <option key="buddies" value="buddies">
                Casual
              </option>
            </ModalSelectInput>
            <ModalSelectInput
              labelText="What is THEIR preferred contact method?"
              inputId="method-preference"
              inputName="preferredMethod"
              required={true}
            >
              <option key={"method-pref-socialMedia"} value="socialMedia">
                Social media
              </option>
              <option key={"method-pref-textMessage"} value="textMessage">
                Text message
              </option>
              <option key={"method-pref-phoneCall"} value="phoneCall">
                Phone call
              </option>
            </ModalSelectInput>
          </div>
        </form>
      ) : (
        <p>Squad Limit Reached</p>
      )}
    </PrimaryModal>
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
    careerMentor: `Who you can turn to for advice when it comes to job offers, career switches, education, or recommending you as a reference`,
    tirelessCheerleader: `This person is rooting for you to have the best results in life no matter your path`,
    inCaseOfEmergency: `Someone who lives close to you that will always show up in a crisis`,
    healthcareProfessional: `Someone who's opinion you trust when it comes to medical issues`,
    stylist: `Who can help you create your unique style and accentuate your beauty`,
  };

  const roleSelectors = Object.keys(selectedRoles).map((role) => (
    <div key={role}>
      <p className="text-xs">{roleDescription[role]}</p>
      <label htmlFor={role} className="text-xs text-white">
        {roleLabels[role]}
      </label>
      {selectedRoles[role] ? (
        <SelectedContactChip
          contactObject={selectedRoles[role]}
          removeFunction={() =>
            setSelectedRoles((prev) => ({ ...prev, [role]: null }))
          }
        />
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
    <PrimaryModal
      windowTitle="Set Friendship Roles"
      closeModal={closeModal}
      formId="friendship-roles-form"
      submitButtonText="SAVE ROLES"
      isLoading={isLoading}
      outsideClick={closeModal}
    >
      {/*form*/}
      <form id="friendship-roles-form" onSubmit={setFriendshipRoles}>
        <div className="flex flex-col">{roleSelectors}</div>
      </form>
    </PrimaryModal>
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
      className={`${contact._id == featuredContact._id ? "bg-(--c-violet-void-60)" : "bg-(--c-violet-void)"} rounded-lg`}
    >
      <button
        className={`${contact._id == featuredContact._id ? "text-white" : ""} block flex gap-2 focus:bg-(--c-violet-void-60) hover:bg-(--c-violet-void-60) cursor-pointer px-3 py-2 hover:text-white rounded-lg`}
        onClick={() => toggleSelect(contact)}
      >
        <ContactAvatar className="size-6 mt-3 mx-3" contact={contact} />

        <div className="flex flex-col items-start w-[150px]">
          <h4 className="text-sm">
            {contact.nickname ? contact.nickname : contact.firstName}
          </h4>
          <p>
            {contact.firstName} {contact.lastName}
          </p>
          <p className="text-sm">Score: {contact.evalScore}</p>
        </div>
        <div className=" flex-col items-start w-[150px] hidden xl:flex">
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
      </button>
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
  const { saveFocus, restoreFocus } = useFocusReturn();
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
    restoreFocus();
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
                      onClick={() => {
                        setIsEditContactOpen(true);
                        saveFocus();
                      }}
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
                backgroundColor: `var(${contactTheme})`,
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

  const socialsList = contactDetails.socials.map((entry, index) => (
    <li className="flex gap-2" key={`${index}${entry.platform}`}>
      <ModalTextInput
        divClassName="max-w-[50%]"
        labelText="Platform"
        inputId={`edit${entry.platform}platform`}
        inputName={`edit${entry.platform}platform`}
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
      <ModalTextInput
        divClassName="max-w-[50%]"
        labelText="Handle"
        inputId={`edit${entry.platform}handle`}
        inputName={`edit${entry.platform}handle`}
        value={entry.handle}
        onChange={(e) =>
          setContactDetails((prev) => {
            const updatedSocials = prev.socials.map((old, i) =>
              i === index
                ? { ...old, handle: e.target.value.toLowerCase() }
                : old,
            );
            return { ...prev, socials: updatedSocials };
          })
        }
      />
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

  function checkboxUpdater(e, label, arr) {
    if (e.target.checked) {
      setContactDetails((prev) => ({
        ...prev,
        [arr]: [...prev[arr], label],
      }));
    } else {
      setContactDetails((prev) => ({
        ...prev,
        [arr]: prev[arr].filter((el) => el !== label),
      }));
    }
  }

  return (
    <PrimaryModal
      windowTitle="Edit Contact Details"
      closeModal={closeModal}
      submitButtonText="SAVE DETAILS"
      confirmOnClick={saveUserDetails}
      isLoading={isLoading}
    >
      {/*form*/}
      <form id="edit-contact-form">
        <div className="flex flex-col">
          <ModalTextInput
            labelText="First Name"
            inputId="contactFirstName"
            inputName="contactFirstName"
            value={contactDetails.firstName}
            onChange={(e) =>
              setContactDetails((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
            required={true}
          />
          <ModalTextInput
            labelText="Last Name"
            inputId="contactLastName"
            inputName="contactLastName"
            value={contactDetails.lastName}
            onChange={(e) =>
              setContactDetails((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
            required={true}
          />
          <ModalTextInput
            labelText="Nickname"
            inputId="contactNickname"
            inputName="contactNickname"
            value={contactDetails.nickname}
            onChange={(e) =>
              setContactDetails((prev) => ({
                ...prev,
                nickname: e.target.value,
              }))
            }
            required={true}
          />
          <ModalFieldset label="Preferred Contact Days">
            <ModalCheckbox
              label="Monday"
              id="preferredMonday"
              name="preferredDays"
              value="monday"
              checked={contactDetails.preferredDay?.includes("monday")}
              onChange={(e) => checkboxUpdater(e, "monday", "preferredDay")}
            />
            <ModalCheckbox
              label="Tuesday"
              id="preferredTuesday"
              name="preferredDays"
              value="tuesday"
              checked={contactDetails.preferredDay?.includes("tuesday")}
              onChange={(e) => checkboxUpdater(e, "tuesday", "preferredDay")}
            />
            <ModalCheckbox
              label="Wednesday"
              id="preferredWednesday"
              name="preferredDays"
              value="wednesday"
              checked={contactDetails.preferredDay?.includes("wednesday")}
              onChange={(e) => checkboxUpdater(e, "wednesday", "preferredDay")}
            />
            <ModalCheckbox
              label="Thursday"
              id="preferredThursday"
              name="preferredDays"
              value="thursday"
              checked={contactDetails.preferredDay?.includes("thursday")}
              onChange={(e) => checkboxUpdater(e, "thursday", "preferredDay")}
            />
            <ModalCheckbox
              label="Friday"
              id="preferredFriday"
              name="preferredDays"
              value="friday"
              checked={contactDetails.preferredDay?.includes("friday")}
              onChange={(e) => checkboxUpdater(e, "friday", "preferredDay")}
            />
            <ModalCheckbox
              label="Saturday"
              id="preferredSaturday"
              name="preferredDays"
              value="saturday"
              checked={contactDetails.preferredDay?.includes("saturday")}
              onChange={(e) => checkboxUpdater(e, "saturday", "preferredDay")}
            />
            <ModalCheckbox
              label="Sunday"
              id="preferredSunday"
              name="preferredDays"
              value="sunday"
              checked={contactDetails.preferredDay?.includes("sunday")}
              onChange={(e) => checkboxUpdater(e, "sunday", "preferredDay")}
            />
          </ModalFieldset>
          <ModalSelectInput
            labelText="Preferred Contact Method"
            inputId="editPreferredMethod"
            inputName="preferredMethod"
            value={contactDetails.preferredMethod}
            onChange={(e) =>
              setContactDetails((prev) => ({
                ...prev,
                preferredMethod: e.target.value,
              }))
            }
            required={true}
          >
            <option key={"method-socialMedia"} value="socialMedia">
              Social media
            </option>
            <option key={"textMessage"} value="textMessage">
              Text message
            </option>
            <option key={"phoneCall"} value="phoneCall">
              Phone call
            </option>
          </ModalSelectInput>
          <ModalTextInput
            labelText="Mobile Phone Number"
            type="tel"
            inputId="editMobile"
            inputName="mobilePhone"
            value={contactDetails.mobilePhone}
            onChange={(e) => {
              setContactDetails((prev) => ({
                ...prev,
                mobilePhone: formatPhoneNumber(e.target.value),
              }));
            }}
          />
          <ModalTextInput
            labelText="Home Phone Number"
            type="tel"
            inputId="editHomePhone"
            inputName="homePhone"
            value={contactDetails.homePhone}
            onChange={(e) => {
              setContactDetails((prev) => ({
                ...prev,
                homePhone: formatPhoneNumber(e.target.value),
              }));
            }}
          />
          <ModalTextInput
            labelText="Work Phone Number"
            type="tel"
            inputId="editWorkPhone"
            inputName="workPhone"
            value={contactDetails.workPhone}
            onChange={(e) => {
              setContactDetails((prev) => ({
                ...prev,
                workPhone: formatPhoneNumber(e.target.value),
              }));
            }}
          />
          <ModalTextInput
            labelText="Primary Email"
            type="email"
            inputId="editPrimaryEmail"
            value={contactDetails.primaryEmail}
            onChange={(e) =>
              setContactDetails((prev) => ({
                ...prev,
                primaryEmail: e.target.value,
              }))
            }
          />
          <ModalTextInput
            labelText="Backup Email"
            type="email"
            inputId="editBackupEmail"
            value={contactDetails.backupEmail}
            onChange={(e) =>
              setContactDetails((prev) => ({
                ...prev,
                backupEmail: e.target.value,
              }))
            }
          />

          <div className="flex flex-col mb-10">
            <p className="text-base text-white">Socials</p>
            <ul>{socialsList}</ul>
            {contactDetails.socials.length < 8 && (
              <PrimaryButton innerText="+Other socials" onClick={addSocials} />
            )}
          </div>
          <ModalSelectInput
            labelText="Myers Briggs Type"
            inputId="editMyersBriggs"
            inputName="myersBriggsType"
            value={contactDetails.myersBriggsType || ""}
            onChange={(e) =>
              setContactDetails((prev) => ({
                ...prev,
                myersBriggsType: e.target.value,
              }))
            }
          >
            <option key={"myersbriggs-none"} value="">
              -none-
            </option>
            <option key={"myersbriggs-intja"} value="intja">
              INTJ-A Architect
            </option>
            <option key={"myersbriggs-intjt"} value="intjt">
              INTJ-T Architect
            </option>
            <option key={"myersbriggs-intpa"} value="intpa">
              INTP-A Logician
            </option>
            <option key={"myersbriggs-intpt"} value="intpt">
              INTP-T Logician
            </option>
            <option key={"myersbriggs-entja"} value="entja">
              ENTJ-A Commander
            </option>
            <option key={"myersbriggs-entjt"} value="entjt">
              ENTJ-T Commander
            </option>
            <option key={"myersbriggs-entpa"} value="entpa">
              ENTP-A Debater
            </option>
            <option key={"myersbriggs-entpt"} value="entpt">
              ENTP-T Debater
            </option>
            <option key={"myersbriggs-infja"} value="infja">
              INFJ-A Advocate
            </option>
            <option key={"myersbriggs-infjt"} value="infjt">
              INFJ-T Advocate
            </option>
            <option key={"myersbriggs-infpa"} value="infpa">
              INFP-A Mediator
            </option>
            <option key={"myersbriggs-infpt"} value="infpt">
              INFP-T Mediator
            </option>
            <option key={"myersbriggs-enfja"} value="enfja">
              ENFJ-A Protagonist
            </option>
            <option key={"myersbriggs-enfjt"} value="enfjt">
              ENFJ-T Protagonist
            </option>
            <option key={"myersbriggs-enfpa"} value="enfpa">
              ENFP-A Campaigner
            </option>
            <option key={"myersbriggs-enfpt"} value="enfpt">
              ENFP-T Campaigner
            </option>
            <option key={"myersbriggs-istja"} value="istja">
              ISTJ-A Logistician
            </option>
            <option key={"myersbriggs-istjt"} value="istjt">
              ISTJ-T Logistician
            </option>
            <option key={"myersbriggs-isfja"} value="isfja">
              ISFJ-A Defender
            </option>
            <option key={"myersbriggs-isfjt"} value="isfjt">
              ISFJ-T Defender
            </option>
            <option key={"myersbriggs-estja"} value="estja">
              ESTJ-A Executive
            </option>
            <option key={"myersbriggs-estjt"} value="estjt">
              ESTJ-T Executive
            </option>
            <option key={"myersbriggs-esfja"} value="esfja">
              ESFJ-A Consul
            </option>
            <option key={"myersbriggs-esfjt"} value="esfjt">
              ESFJ-T Consul
            </option>
            <option key={"myersbriggs-istpa"} value="istpa">
              ISTP-A Virtuoso
            </option>
            <option key={"myersbriggs-istpt"} value="istpt">
              ISTP-T Virtuoso
            </option>
            <option key={"myersbriggs-isfpa"} value="isfpa">
              ISFP-A Advanturer
            </option>
            <option key={"myersbriggs-isfpt"} value="isfpt">
              ISFP-T Advanturer
            </option>
            <option key={"myersbriggs-estpa"} value="estpa">
              ESTP-A Entrepreneur
            </option>
            <option key={"myersbriggs-estpt"} value="estpt">
              ESTP-T Entrepreneur
            </option>
            <option key={"myersbriggs-esfpa"} value="esfpa">
              ESFP-A Entertainer
            </option>
            <option key={"myersbriggs-esfpt"} value="esfpt">
              ESFP-T Entertainer
            </option>
          </ModalSelectInput>
          <ModalFieldset label="Love Languages">
            <ModalCheckbox
              label="Words of Affirmation"
              id="wordsOfAffirmation"
              name="wordsOfAffirmation"
              value="wordsOfAffirmation"
              checked={contactDetails.loveLanguages?.includes(
                "wordsOfAffirmation",
              )}
              onChange={(e) =>
                checkboxUpdater(e, "wordsOfAffirmation", "loveLanguages")
              }
            />
            <ModalCheckbox
              label="Quality Time"
              id="qualityTime"
              name="qualityTime"
              value="qualityTime"
              checked={contactDetails.loveLanguages?.includes("qualityTime")}
              onChange={(e) =>
                checkboxUpdater(e, "qualityTime", "loveLanguages")
              }
            />
            <ModalCheckbox
              label="Receiving Gifts"
              id="receivingGifts"
              name="receivingGifts"
              value="receivingGifts"
              checked={contactDetails.loveLanguages?.includes("receivingGifts")}
              onChange={(e) =>
                checkboxUpdater(e, "receivingGifts", "loveLanguages")
              }
            />
            <ModalCheckbox
              label="Acts of Service"
              id="actsOfService"
              name="actsOfService"
              value="actsOfService"
              checked={contactDetails.loveLanguages?.includes("actsOfService")}
              onChange={(e) =>
                checkboxUpdater(e, "actsOfService", "loveLanguages")
              }
            />
            <ModalCheckbox
              label="Physical Touch"
              id="physicalTouch"
              name="physicalTouch"
              value="physicalTouch"
              checked={contactDetails.loveLanguages?.includes("physicalTouch")}
              onChange={(e) =>
                checkboxUpdater(e, "physicalTouch", "loveLanguages")
              }
            />
          </ModalFieldset>
          <ModalTextarea
            labelText="Additional Notes"
            inputId="editAdditionalNotes"
            inputName="editAdditionalNotes"
            value={contactDetails.additionalNotes}
            onChange={(e) =>
              setContactDetails((prev) => ({
                ...prev,
                additionalNotes: e.target.value,
              }))
            }
          />

          <MultipleSelectChip
            tags={userTags}
            selectedTags={contactDetails.tags}
            updateTags={(value) =>
              setContactDetails((prev) => ({ ...prev, tags: value }))
            }
          />
          {!showTagInput && (
            <PrimaryButton
              innerText="+ Add Tag"
              onClick={() => setShowTagInput(true)}
            />
          )}
          {showTagInput && (
            <div className="flex items-center gap-2 mb-6">
              <ModalTextInput
                labelText="Add tag"
                inputName="addTagInput"
                inputId="addTagInput"
                value={tagInputValue}
                onChange={(e) => setTagInputValue(e.target.value)}
              />
              <PrimaryButton
                innerText="ADD"
                onClick={addTag}
                buttonClassName="-translate-y-1"
              />
            </div>
          )}

          <ModalDateInput
            labelText="Birthday"
            inputName="editBirthday"
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
    </PrimaryModal>
  );
}

function SquadIntroModal({ closeModal, userName }) {
  return (
    <PrimaryModal
      windowTitle="Welcome to Squad Goals"
      closeModal={closeModal}
      allowSubmit={false}
    >
      Hi {userName}, thank goodness you are here! Human connection levels are
      low all over earth. We are in desperate need of people who can help us
      reinvigorate the ancient power of "staying in touch"! If you are ready to
      jump in, go ahead and start adding your friends and family as contacts.
    </PrimaryModal>
  );
}

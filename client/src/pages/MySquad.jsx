import { useState, useEffect } from "react";
import { AnimatedCallToAction, PrimaryButton } from "../components/Buttons";

function FilterAndSearch({ fetchSquad }) {
  const [isAddContactModalOpen, setIsContactModalOpen] = useState(false);

  function closeModal() {
    setIsContactModalOpen(false);
  }
  function openModal() {
    setIsContactModalOpen(true);
  }
  return (
    <div className="w-full">
      <ul className="flex justify-between">
        <div className="flex gap-3">
          <li>
            <PrimaryButton innerText="score" />
          </li>
          <li>
            <PrimaryButton innerText="first" />
          </li>
          <li>
            <PrimaryButton innerText="last" />
          </li>
          <li>
            <PrimaryButton innerText="date" />
          </li>
          <li>
            <PrimaryButton innerText="tag" />
          </li>
          <li>
            <input
              type="search"
              className="text-sm border border-inherit rounded-md px-3 py-2"
              placeholder="SEARCH CONTACTS"
            />
          </li>
        </div>
        <div>
          <li>
            <PrimaryButton innerText="add" onClick={openModal} />
          </li>
          {isAddContactModalOpen && (
            <AddContactModal closeModal={closeModal} fetchSquad={fetchSquad} />
          )}
        </div>
      </ul>
      <input type="search" />
    </div>
  );
}

function AddContactModal({ closeModal, fetchSquad }) {
  async function createContact(event) {
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
      closeModal();
    }
  }
  return (
    <div
      id="add-contact"
      aria-labelledby="add-contact"
      className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
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

function ContactList({
  themeColor,
  contactList,
  title,
  img,
  setFeaturedContact,
  featuredContact,
}) {
  function toggleSelect(contact) {
    if (featuredContact == contact) {
      setFeaturedContact({});
    } else {
      setFeaturedContact(contact);
    }
  }

  const styledContacts = contactList.map((contact) => (
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
        <div className="flex flex-col gap-2 lg:max-h-[640px] lg: overflow-auto">
          {styledContacts}
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

  const fetchSquad = async () => {
    const response = await fetch("/api/contact/getSquad");
    const data = await response.json();
    setHeartCoreList(data.heartCoreList);
    setRayLiablesList(data.rayLiablesList);
    setBuddiesList(data.buddiesList);
  };

  useEffect(() => {
    fetchSquad();
  }, []);

  return (
    <div class="text-purple-300 lg:max-h-[calc(100vh-4rem)] lg:p-12 flex flex-col">
      <FilterAndSearch fetchSquad={fetchSquad} />
      {/*Inner Circle or "Heart" core friends*/}
      <main className="flex gap-6">
        <ContactList
          title="Heart-Core Friends"
          themeColor="--c-deep-cerise"
          contactList={heartCoreList}
          img="/imgs/icons/pink-clock.png"
          setFeaturedContact={setFeaturedContact}
          featuredContact={featuredContact}
        />
        {/*Close Friends or "Ray"liables*/}
        <ContactList
          title="Ray-liables"
          themeColor="--c-light-coral"
          contactList={rayLiablesList}
          img="/imgs/icons/coral-clock.png"
          setFeaturedContact={setFeaturedContact}
          featuredContact={featuredContact}
        />
        {/*Casual Friends or "Bud"dies*/}
        <ContactList
          title="Bud-dies"
          themeColor="--c-green-sheen"
          contactList={buddiesList}
          img="/imgs/icons/green-clock.png"
          setFeaturedContact={setFeaturedContact}
          featuredContact={featuredContact}
        />
      </main>
    </div>
  );
}

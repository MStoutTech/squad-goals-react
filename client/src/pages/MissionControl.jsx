import { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import ContactSearch from "../components/Search";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactAvatar from "../components/ContactAvatar";
import { apiFetch } from "../utils/apiUrl";

import {
  AnimatedCallToAction,
  PrimaryButton,
  SortMissions,
  IconButton,
} from "../components/Buttons";

function MissionStatistics({ statistics }) {
  const [today, setToday] = useState(new Date());

  const day = String(today.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[today.getMonth()];
  return (
    <section className="lg:col-span-6 border border-inherit rounded-lg px-6 py-3 max-h-[184px] ">
      <h3 className="text-lg mb-3">My stats</h3>
      <div className="flex justify-between text-sm">
        <section className="flex flex-col">
          <ul className="p-2">
            <li>
              <img
                src="/imgs/icons/star.png"
                alt="star icon"
                className="inline w-[10px] mr-2 -translate-y-[1px]"
              />
              Total: {statistics.total}
            </li>
            <li>
              <img
                src="/imgs/icons/star.png"
                alt="star icon"
                className="inline w-[10px] mr-2 -translate-y-[1px]"
              />
              Month: {statistics.month}
            </li>
            <li>
              <img
                src="/imgs/icons/star.png"
                alt="star icon"
                className="inline w-[10px] mr-2 -translate-y-[1px]"
              />
              Week: {statistics.week}
            </li>
          </ul>
          <p>
            Recent Badge:
            <span className="block">
              <img
                src="/imgs/icons/Badge.png"
                alt="100 missions badge"
                className="inline w-[10px] mx-1"
              />
              100 Missions
            </span>
          </p>
        </section>
        <section className="flex flex-col justify-between -translate-y-5">
          {/*Calendar*/}
          <section className="calendar-today rounded-md border border-inherit flex flex-col text-center w-[60px]">
            <span className="calendar-month text-(--c-violet-void) bg-purple-300 border border-purple-300 rounded-t-sm">
              {month}
            </span>
            <span className="calendar-day">{day}</span>
          </section>
          <span>
            <img
              src="/imgs/icons/star.png"
              alt="star icon"
              className="inline w-[15px] mr-2 -translate-y-[2px]"
            />
            Today: {statistics.today}
          </span>
          <span>Streak: {statistics.streak}</span>
          <span>Longest Streak: {statistics.longestStreak}</span>
        </section>
      </div>
    </section>
  );
}
function News() {
  return (
    <section className="hidden lg:block lg:col-span-6 bg-(--c-violet-void-80) rounded-lg px-6 py-3 max-h-[184px]">
      <h3 className="mb-3">News / Suggested Activities</h3>
      <ul className="flex flex-col gap-2 text-sm h-[124px] overflow-y-auto">
        <li className="bg-(--c-violet-void) px-3 py-2 rounded-lg">
          Try the new training activity on kindness
        </li>
        <li className="bg-(--c-violet-void) px-3 py-2 rounded-lg">
          You haven't completed any Evaluation questions yet! Try a quick sample
        </li>
        <li className="bg-(--c-violet-void) px-3 py-2 rounded-lg">
          Complete all missions 5 days in a row for a streak badge
        </li>
      </ul>
    </section>
  );
}

function CompletedMissions({ completedList }) {
  const completedMissions = completedList.map((mission) => (
    <li className="flex items-center" key={mission._id}>
      <ContactAvatar
        className="h-[30px] w-[30px] border-2 rounded-full mr-3"
        contact={mission.contact}
      />

      <p>
        {new Date(mission.completedAt).toLocaleString()} <br />
        {mission.contact.firstName} {mission.contact.lastName}
        <br />
        {mission.missionType == "field"
          ? "Field Mission"
          : "Contact Mission"}{" "}
        <br />
      </p>
    </li>
  ));
  return (
    <section className="col-span-6 min-[1420px]:col-span-2 min-w-[172px] mb-23 lg:mb-0">
      <h3 className="text-center mb-2">Completed</h3>
      <ul className="text-xs flex flex-col gap-2 lg:h-[450px] overflow-auto">
        {completedMissions.length > 0 ? (
          completedMissions
        ) : (
          <li key={"noMissions"}>No Completed Missions!</li>
        )}
      </ul>
    </section>
  );
}

export default function MissionControl() {
  const { showToast } = useContext(ToastContext);
  const [missionList, setMissionList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [featuredMission, setFeaturedMission] = useState({});
  const [featuredMissionHistory, setFeaturedMissionHistory] = useState([]);
  const [isMissionHistoryLoading, setIsMissionHistoryLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [missionStarted, setMissionStarted] = useState(false);
  const [missionTimer, setMissionTimer] = useState(0);
  const [isMissionPaused, setIsMissionPaused] = useState(true);
  const [isAddMissionModalOpen, setIsAddMissionModalOpen] = useState(false);
  const [isMissionDebriefModalOpen, setIsMissionDebriefModalOpen] =
    useState(false);

  const fetchMissions = async () => {
    const response = await apiFetch("/api/mission/missionList", {
      credentials: "include",
    });
    const data = await response.json();
    setMissionList(data.missionList);
    setCompletedList(data.completedList);
    setIsHistoryOpen(false);
    setMissionStarted(false);
    setStatistics(data.statistics);
    if (data.missionList.length > 0) {
      setFeaturedMission(data.missionList[0]);
    } else {
      setFeaturedMission({});
    }
  };

  const fetchMissionHistory = async (contactId) => {
    setIsMissionHistoryLoading(true);
    try {
      const response = await apiFetch(`/api/contact/${contactId}/history`);
      const data = await response.json();
      setIsMissionHistoryLoading(false);
      setFeaturedMissionHistory(data);
    } catch (err) {
      setIsMissionHistoryLoading(false);
      showToast(
        `Failed to load mission history. Check your connection and try again.`,
        "error",
      );
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  useEffect(() => {
    if (featuredMission?.contact?._id) {
      fetchMissionHistory(featuredMission.contact._id);
    } else setFeaturedMissionHistory([]);
  }, [featuredMission]);

  useEffect(() => {
    if (missionStarted && isMissionDebriefModalOpen) {
      setIsMissionPaused(true);
    }
  }, [isMissionDebriefModalOpen]);

  function handleMissionClick(mission) {
    setFeaturedMission(mission);
    setMissionStarted(false);
  }
  const missionHistoryList = featuredMissionHistory.map((entry, index) => (
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

  async function snooze(missionId) {
    try {
      const response = await apiFetch(`/api/mission/${missionId}/snooze`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        fetchMissions();
        showToast("Mission snoozed", "success");
      }
      if (response.status === 500) {
        showToast("Could not snooze mission", "error");
      }
    } catch (err) {
      showToast(
        `Could not snooze mission. Check your connection and try again.`,
        "error",
      );
    }
  }

  const themeColor = {
    heartCore: "--c-deep-cerise",
    rayLiables: "--c-light-coral",
    buddies: "--c-green-sheen",
  };
  const contactTheme =
    themeColor[
      featuredMission.contact?.friendList ||
        featuredMission.contact?.connectionInstinct
    ];

  const activeMissionsMobile = missionList.map((mission) => (
    <li
      key={mission._id}
      className="bg-(--c-light-coral-80)/25 border-(--c-light-coral) border rounded-lg p-3 featured-mission-section"
      style={{
        "--highlight-color": `var(${
          themeColor[
            mission.contact.friendList || mission.contact.connectionInstinct
          ]
        })`,
        color: `var(${
          themeColor[
            mission.contact.friendList || mission.contact.connectionInstinct
          ]
        })`,
      }}
    >
      {/*div for above the mission history*/}
      <div className="flex">
        {/*name, img, snooze */}
        <div className="items-center min-w-[100px] mr-3">
          <h4 id="featured-nickname">
            {mission.contact.nickname || mission.contact.firstName}
          </h4>

          <ContactAvatar
            className="size-24 border-3 rounded-sm"
            contact={mission.contact}
          />
          <span className="text-sm">
            {`${mission.contact.firstName} ${mission.contact.lastName}`}
          </span>
          <IconButton
            onClick={() => snooze(mission._id)}
            svg={
              <svg
                width="25"
                height="22"
                viewBox="0 0 37 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hover:drop-shadow-lg hover:drop-shadow-white mb-1 w-[100%]"
              >
                <path
                  d="M14.0219 22.593H22.1487V20.4855H16.9274L22.1487 14.5843V12.5189H14.0219V14.6265H19.3275L14.0219 20.6119V22.593ZM18.0643 33.0887C15.9869 33.0887 14.0289 32.6953 12.1902 31.9084C10.3515 31.1216 8.75141 30.0468 7.38993 28.6839C6.02844 27.321 4.94767 25.7192 4.14762 23.8786C3.34757 22.038 2.94755 20.064 2.94755 17.9564C2.94755 15.8769 3.34757 13.9169 4.14762 12.0763C4.94767 10.2357 6.02844 8.62694 7.38993 7.25C8.75141 5.87306 10.3515 4.79118 12.1902 4.00436C14.0289 3.21754 15.9869 2.82413 18.0643 2.82413C20.1416 2.82413 22.0996 3.21754 23.9383 4.00436C25.777 4.79118 27.3841 5.87306 28.7597 7.25C30.1352 8.62694 31.2159 10.2357 32.002 12.0763C32.788 13.9169 33.181 15.8769 33.181 17.9564C33.181 20.064 32.788 22.038 32.002 23.8786C31.2159 25.7192 30.1352 27.321 28.7597 28.6839C27.3841 30.0468 25.777 31.1216 23.9383 31.9084C22.0996 32.6953 20.1416 33.0887 18.0643 33.0887V33.0887ZM6.90569 0L8.67422 1.77035L1.76853 8.43023L0 6.65988L6.90569 0ZM29.2228 0L36.1285 6.65988L34.36 8.43023L27.4543 1.77035L29.2228 0ZM18.0643 30.5596C21.5733 30.5596 24.5489 29.3372 26.9911 26.8924C29.4334 24.4477 30.6545 21.469 30.6545 17.9564C30.6545 14.4438 29.4334 11.4651 26.9911 9.02035C24.5489 6.57558 21.5733 5.3532 18.0643 5.3532C14.5553 5.3532 11.5797 6.57558 9.1374 9.02035C6.69515 11.4651 5.47402 14.4438 5.47402 17.9564C5.47402 21.469 6.69515 24.4477 9.1374 26.8924C11.5797 29.3372 14.5553 30.5596 18.0643 30.5596Z"
                  fill="currentColor"
                />
              </svg>
            }
            text="Snooze"
          />
        </div>
        {/*mission actions*/}
        <section className="min-w-[260px]">
          <span className="text-sm text-white" id="featured-last-contact">
            Last Contact:{" "}
            {mission.contact.lastContact
              ? new Date(mission.contact.lastContact).toLocaleDateString()
              : "N/A"}
          </span>
          <h4 className="text-white mb-1" id="featured-mission-type">
            {mission.missionType === "field"
              ? "Field Mission"
              : "Contact Mission"}
          </h4>

          {mission.missionType == "field" ? (
            <MissionDebriefButton
              openMissionDebrief={(e) => {
                handleMissionClick(mission);
                openMissionDebrief(e);
              }}
              width="w-[100%]"
            />
          ) : missionStarted && featuredMission._id == mission._id ? (
            <TimerDisplay
              missionTimer={missionTimer}
              missionStartOver={missionStartOver}
              openMissionDebrief={openMissionDebrief}
              isMissionPaused={isMissionPaused}
            />
          ) : (
            <ContactMissionForm
              missionStart={(e) => {
                handleMissionClick(mission);
                missionStart(e);
              }}
              contact={mission.contact}
            />
          )}
        </section>
      </div>

      <Accordion
        expanded={isHistoryOpen == true && featuredMission._id == mission._id}
        onChange={() => {
          if (featuredMission._id != mission._id) {
            setFeaturedMission(mission);
            setIsHistoryOpen(true);
          } else {
            setIsHistoryOpen((prev) => !prev);
          }
        }}
        disabled={missionStarted == true && featuredMission._id != mission._id}
        slotProps={{
          heading: { component: "h4" },
          transition: { unmountOnExit: true },
        }}
        className="text-(--c-violet-void)"
        style={{
          backgroundColor: `var(${
            themeColor[
              mission.contact.friendList || mission.contact.connectionInstinct
            ]
          })`,
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
          <ul
            className="text-xs lg:max-h-[354px] overflow-y-auto"
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
        </AccordionDetails>
      </Accordion>
    </li>
  ));

  const activeMissions = missionList.map((mission) => (
    <li
      key={mission._id}
      className={`${mission._id == featuredMission._id ? "mission-list-active" : "border-purple-300 hover:bg-(--c-violet-void-80) hover:text-white"} mission-list-item px-3 py-2 border rounded-lg flex justify-between`}
      style={
        mission._id == featuredMission._id
          ? { "--highlight-color": `var(${contactTheme})` }
          : {}
      }
      onClick={() => handleMissionClick(mission)}
      data-friendlist={
        mission.contact.friendList || mission.contact.connectionInstinct
      }
    >
      {mission.contact.firstName} {mission.contact.lastName}
      <IconButton
        onClick={() => snooze(mission._id)}
        svg={
          <svg
            width="25"
            height="22"
            viewBox="0 0 37 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hover:drop-shadow-lg hover:drop-shadow-white"
          >
            <path
              d="M14.0219 22.593H22.1487V20.4855H16.9274L22.1487 14.5843V12.5189H14.0219V14.6265H19.3275L14.0219 20.6119V22.593ZM18.0643 33.0887C15.9869 33.0887 14.0289 32.6953 12.1902 31.9084C10.3515 31.1216 8.75141 30.0468 7.38993 28.6839C6.02844 27.321 4.94767 25.7192 4.14762 23.8786C3.34757 22.038 2.94755 20.064 2.94755 17.9564C2.94755 15.8769 3.34757 13.9169 4.14762 12.0763C4.94767 10.2357 6.02844 8.62694 7.38993 7.25C8.75141 5.87306 10.3515 4.79118 12.1902 4.00436C14.0289 3.21754 15.9869 2.82413 18.0643 2.82413C20.1416 2.82413 22.0996 3.21754 23.9383 4.00436C25.777 4.79118 27.3841 5.87306 28.7597 7.25C30.1352 8.62694 31.2159 10.2357 32.002 12.0763C32.788 13.9169 33.181 15.8769 33.181 17.9564C33.181 20.064 32.788 22.038 32.002 23.8786C31.2159 25.7192 30.1352 27.321 28.7597 28.6839C27.3841 30.0468 25.777 31.1216 23.9383 31.9084C22.0996 32.6953 20.1416 33.0887 18.0643 33.0887V33.0887ZM6.90569 0L8.67422 1.77035L1.76853 8.43023L0 6.65988L6.90569 0ZM29.2228 0L36.1285 6.65988L34.36 8.43023L27.4543 1.77035L29.2228 0ZM18.0643 30.5596C21.5733 30.5596 24.5489 29.3372 26.9911 26.8924C29.4334 24.4477 30.6545 21.469 30.6545 17.9564C30.6545 14.4438 29.4334 11.4651 26.9911 9.02035C24.5489 6.57558 21.5733 5.3532 18.0643 5.3532C14.5553 5.3532 11.5797 6.57558 9.1374 9.02035C6.69515 11.4651 5.47402 14.4438 5.47402 17.9564C5.47402 21.469 6.69515 24.4477 9.1374 26.8924C11.5797 29.3372 14.5553 30.5596 18.0643 30.5596Z"
              fill="currentColor"
            />
          </svg>
        }
      />
    </li>
  ));

  function missionStart(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const time = formData.get("missionTimeLimit");
    setMissionTimer(time);
    setMissionStarted(true);
    setIsMissionPaused(false);
  }

  function missionStartOver() {
    setMissionStarted(false);
  }
  function openMissionDebrief() {
    setIsMissionDebriefModalOpen(true);
  }
  function openAddMissionModal() {
    setIsAddMissionModalOpen(true);
  }
  function closeModal() {
    if (missionStarted) {
      setIsMissionPaused(false);
    }
    setIsAddMissionModalOpen(false);
    setIsMissionDebriefModalOpen(false);
  }
  return (
    <>
      <section className="text-purple-300 lg:max-h-[calc(100vh-4rem)] lg:py-12 lg:px-6 lg:grid lg:grid-cols-12 lg:gap-6 grow-1">
        <MissionStatistics statistics={statistics} />
        <News />
        <section className="my-6 lg:my-0 col-span-12 min-[1420px]:col-span-10 bg-(--c-violet-void-80) rounded-lg md:px-6 py-3">
          <div className="flex justify-between mb-3 mx-6 md:mx-0">
            <SortMissions
              missionList={missionList}
              setMissionList={setMissionList}
            />
            <h2 className="text-xl">Today's Missions</h2>
            {/*ADD Mission*/}
            <PrimaryButton innerText="add" onClick={openAddMissionModal} />
          </div>

          <div className="flex lg:min-h-[420px]" style={{ width: "100%" }}>
            {/*Mission List*/}
            <section className=" bg-(--c-violet-void) md:rounded-lg md:px-6 py-3 min-w-[300px]">
              <div className="hidden md:flex text-sm justify-between px-3">
                <span>Name</span>
                <span>Snooze</span>
              </div>

              <ul className="hidden md:flex flex-col gap-2 max-h-[376px] overflow-auto">
                {activeMissions}
              </ul>
              <ul className="flex items-start md:hidden gap-3 overflow-x-auto overflow-y-hidden ">
                {activeMissionsMobile}
              </ul>
            </section>
            {/*Featured Mission*/}
            {/*First div is just a decorative border! */}
            <div
              className={`${featuredMission._id ? "" : "border-(--c-light-coral) text-(--c-light-coral)"} bg-(--c-violet-void) border border-double rounded-lg p-2 hidden md:block lg:ml-6 featured-mission-div justify-stretch `}
              id="featured-div"
              style={
                featuredMission._id
                  ? { "--highlight-color": `var(${contactTheme})`, flex: 1 }
                  : { flex: 1 }
              }
            >
              {!featuredMission._id ? (
                <section className="bg-(--c-light-coral-80)/25 border-(--c-light-coral) flex min-h-[402px] border-dashed border-r-1 border-l-1 p-3 featured-mission-section">
                  <h5 className="text-base">All done for today!</h5>
                </section>
              ) : (
                <section
                  className={`${featuredMission._id ? "" : "bg-(--c-light-coral-80)/25 border-(--c-light-coral)"} flex min-h-[402px] border-dashed border-r-1 border-l-1 p-3 featured-mission-section flex-wrap-reverse`}
                  id="featured-section"
                  style={
                    featuredMission._id
                      ? {
                          "--highlight-color": `var(${contactTheme})`,
                          width: "100%",
                        }
                      : { width: "100%" }
                  }
                >
                  <section style={{ flex: 1 }}>
                    <h5 className="text-base">Mission History</h5>
                    <ul
                      className="text-xs lg:max-h-[354px] overflow-y-auto"
                      style={{ width: "100%" }}
                    >
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
                  </section>
                  <section className="min-w-[230px] ml-4">
                    <div className="flex items-center">
                      <ContactAvatar
                        className="size-24 border-3 rounded-sm"
                        contact={featuredMission.contact}
                      />
                      <div className="pl-2">
                        <h4 id="featured-nickname">
                          {featuredMission.contact?.nickname ||
                            featuredMission.contact?.firstName}
                        </h4>
                        <span className="text-sm" id="featured-full-name">
                          {`${featuredMission.contact?.firstName} ${featuredMission.contact?.lastName}`}
                        </span>
                      </div>
                    </div>
                    {/*mission actions*/}
                    <section>
                      <span
                        className="text-sm text-white"
                        id="featured-last-contact"
                      >
                        Last Contact:{" "}
                        {featuredMission.contact?.lastContact
                          ? new Date(
                              featuredMission.contact.lastContact,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                      <h4
                        className="text-white mb-1"
                        id="featured-mission-type"
                      >
                        {featuredMission.missionType === "field"
                          ? "Field Mission"
                          : "Contact Mission"}
                      </h4>
                      <IconButton
                        onClick={() => snooze(featuredMission._id)}
                        svg={
                          <svg
                            width="25"
                            height="22"
                            viewBox="0 0 37 35"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="hover:drop-shadow-lg hover:drop-shadow-white mb-1 w-[100%]"
                          >
                            <path
                              d="M14.0219 22.593H22.1487V20.4855H16.9274L22.1487 14.5843V12.5189H14.0219V14.6265H19.3275L14.0219 20.6119V22.593ZM18.0643 33.0887C15.9869 33.0887 14.0289 32.6953 12.1902 31.9084C10.3515 31.1216 8.75141 30.0468 7.38993 28.6839C6.02844 27.321 4.94767 25.7192 4.14762 23.8786C3.34757 22.038 2.94755 20.064 2.94755 17.9564C2.94755 15.8769 3.34757 13.9169 4.14762 12.0763C4.94767 10.2357 6.02844 8.62694 7.38993 7.25C8.75141 5.87306 10.3515 4.79118 12.1902 4.00436C14.0289 3.21754 15.9869 2.82413 18.0643 2.82413C20.1416 2.82413 22.0996 3.21754 23.9383 4.00436C25.777 4.79118 27.3841 5.87306 28.7597 7.25C30.1352 8.62694 31.2159 10.2357 32.002 12.0763C32.788 13.9169 33.181 15.8769 33.181 17.9564C33.181 20.064 32.788 22.038 32.002 23.8786C31.2159 25.7192 30.1352 27.321 28.7597 28.6839C27.3841 30.0468 25.777 31.1216 23.9383 31.9084C22.0996 32.6953 20.1416 33.0887 18.0643 33.0887V33.0887ZM6.90569 0L8.67422 1.77035L1.76853 8.43023L0 6.65988L6.90569 0ZM29.2228 0L36.1285 6.65988L34.36 8.43023L27.4543 1.77035L29.2228 0ZM18.0643 30.5596C21.5733 30.5596 24.5489 29.3372 26.9911 26.8924C29.4334 24.4477 30.6545 21.469 30.6545 17.9564C30.6545 14.4438 29.4334 11.4651 26.9911 9.02035C24.5489 6.57558 21.5733 5.3532 18.0643 5.3532C14.5553 5.3532 11.5797 6.57558 9.1374 9.02035C6.69515 11.4651 5.47402 14.4438 5.47402 17.9564C5.47402 21.469 6.69515 24.4477 9.1374 26.8924C11.5797 29.3372 14.5553 30.5596 18.0643 30.5596Z"
                              fill="currentColor"
                            />
                          </svg>
                        }
                        text="Snooze"
                      />
                      {featuredMission.missionType == "field" ? (
                        <MissionDebriefButton
                          openMissionDebrief={openMissionDebrief}
                          width="w-[100%]"
                        />
                      ) : !missionStarted ? (
                        <ContactMissionForm
                          missionStart={missionStart}
                          contact={featuredMission.contact}
                        />
                      ) : (
                        <TimerDisplay
                          missionTimer={missionTimer}
                          missionStartOver={missionStartOver}
                          openMissionDebrief={openMissionDebrief}
                          isMissionPaused={isMissionPaused}
                        />
                      )}
                    </section>
                  </section>
                </section>
              )}
            </div>
          </div>
        </section>
        <CompletedMissions completedList={completedList} />
      </section>
      {isAddMissionModalOpen ? (
        <AddMissionModal
          closeModal={closeModal}
          fetchMissions={fetchMissions}
        />
      ) : (
        ""
      )}
      {isMissionDebriefModalOpen ? (
        <MissionDebriefModal
          closeModal={closeModal}
          fetchMissions={fetchMissions}
          featuredMission={featuredMission}
        />
      ) : (
        ""
      )}
    </>
  );
}

function ContactMissionForm({ missionStart, contact }) {
  const socialOptions =
    contact.details?.socials && contact.details?.socials.length > 0 ? (
      contact.details.socials.map((social) => (
        <option key={social.platform} value={social.platform}>
          {social.platform}
        </option>
      ))
    ) : (
      <option key={"social media"} value="social media">
        social media
      </option>
    );

  return (
    <form
      onSubmit={missionStart}
      id="mission-form"
      className="text-sm flex flex-col gap-2"
    >
      <label htmlFor="time-select" className="text-xs text-white">
        Time
      </label>
      <select
        name="missionTimeLimit"
        id="time-select"
        className="bg-(--c-violet-void) rounded-md px-3 py-2"
      >
        <option key={5} value="5">
          5 min
        </option>
        <option key={10} value="10">
          10 min
        </option>
        <option key={15} value="15">
          15 min
        </option>
        <option key={20} value="20">
          20 min
        </option>
      </select>
      <label htmlFor="method-select" className="text-xs text-white">
        Method
      </label>
      <select
        name="methodOfContact"
        id="method-select"
        className="bg-(--c-violet-void) rounded-md px-3 py-2"
      >
        {socialOptions}
        <option value="phone">phone call</option>
      </select>
      <div className="flex justify-center my-3">
        <div className="particle-hover mx-auto text-center">
          <AnimatedCallToAction type="button" text="Start Mission" />
        </div>
      </div>
    </form>
  );
}

function TimerDisplay({
  missionTimer,
  missionStartOver,
  openMissionDebrief,
  isMissionPaused,
}) {
  const [timeRemaining, setTimeRemaining] = useState(missionTimer * 60);
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const countdownInterval = useRef(null);
  useEffect(() => {
    if (!isMissionPaused) {
      countdownInterval.current = setInterval(() => {
        setTimeRemaining((timeRemaining) => {
          if (timeRemaining <= 0) {
            clearInterval(countdownInterval.current);
            return 0;
          }
          return timeRemaining - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval.current);
  }, [isMissionPaused]);
  return (
    <div id="mission-timer" className="text-center mt-4">
      <h2 className="text-xl text-white mb-4" id="timer-header">
        Time Remaining:
      </h2>
      <div id="timer-display" className="text-4xl font-bold text-purple-300">
        {`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={missionStartOver}
          id="start-over"
          className="action-button px-4 py-2"
        >
          Start Over
        </button>
        <MissionDebriefButton openMissionDebrief={openMissionDebrief} />
      </div>
    </div>
  );
}
function MissionDebriefButton({ openMissionDebrief, width }) {
  return (
    <button
      id="mission-debrief"
      type="button"
      onClick={openMissionDebrief}
      className={`${width} action-button px-4 py-2`}
    >
      MISSION DEBRIEF
    </button>
  );
}
function AddMissionModal({ closeModal, fetchMissions }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const { showToast } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);
  const contactSearchRef = useRef(null);

  function clearSelectedContact() {
    setSelectedContact(null);
  }

  async function addNewMission(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const validContact = contactSearchRef.current.validate();
    if (!validContact) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await apiFetch("/api/mission/createMission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          missionContact: formData.get("missionContact"),
          scheduledFor: formData.get("scheduledFor"),
          missionType: formData.get("missionType"),
        }),
      });
      if (response.status === 201) {
        fetchMissions();
        closeModal();
        showToast(
          `Scheduled new mission for ${selectedContact.firstName}`,
          "success",
        );
      }
      if (response.status === 400) {
        const messageResponse = await response.json();
        showToast(`${messageResponse.message}`, "error");
      }
      if (response.status === 500) {
        showToast(
          `Mission could not be created. Refresh and try again.`,
          "error",
        );
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      showToast(
        `Mission could not be created. Check your connection and try again.`,
        "error",
      );
    }
  }
  return (
    <div
      id="add-mission-modal"
      aria-labelledby="add-mission-modal"
      className="fixed inset-0 z-50 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
    >
      <div
        className="fixed inset-0 bg-black/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        onClick={closeModal}
      ></div>

      <div
        tabIndex="0"
        className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center p-0"
      >
        <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 mt-16 mb-20 data-closed:sm:scale-95">
          <div className="bg-(--c-purple-tech-40)/40 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className=" mt-0 sm:ml-4 text-left ">
                {/*Window title*/}
                <h3
                  id="dialog-title"
                  className="text-base font-semibold text-gray-900"
                >
                  Add New Mission
                </h3>
                {isLoading ? (
                  <CircularProgress color="#7D4C9F" />
                ) : (
                  <div className="mt-2 text-purple-300 text-sm">
                    {/*form*/}
                    <form id="add-mission-form" onSubmit={addNewMission}>
                      <div className="flex flex-col">
                        <p className="text-xs text-white">Mission Target</p>
                        {selectedContact ? (
                          <div
                            id="selected-contact"
                            className="flex justify-between mb-6 items-center p-2 border border-purple-300 rounded-md"
                          >
                            <ContactAvatar
                              className="inline size-6 border-2 rounded-full"
                              contact={selectedContact}
                            />

                            <span id="selected-contact-name">
                              {selectedContact?.firstName}{" "}
                              {selectedContact?.lastName}
                            </span>
                            <button
                              type="button"
                              id="clear-selected-contact"
                              className="text-(--c-violet-void) font-bold"
                              onClick={clearSelectedContact}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <ContactSearch
                            onSelect={setSelectedContact}
                            ref={contactSearchRef}
                          />
                        )}

                        <input
                          type="hidden"
                          name="missionContact"
                          id="mission-contact-id"
                          value={selectedContact?._id || ""}
                        />

                        <label
                          htmlFor="scheduledFor"
                          className="text-xs text-white"
                        >
                          Schedule For
                        </label>
                        <input
                          type="date"
                          id="scheduledFor"
                          name="scheduledFor"
                          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                          required
                        />
                        <p className="text-xs text-white">Mission Type</p>
                        <div className="flex gap-2">
                          <label>
                            <input
                              type="radio"
                              name="missionType"
                              value="contact"
                            />
                            Contact Mission
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="missionType"
                              value="field"
                              required
                            />
                            Field Mission
                          </label>
                        </div>
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
              form="add-mission-form"
              type="submit"
              className="inline-flex w-full justify-center rounded-md action-button sm:ml-3 sm:w-auto px-3 py-2 text-sm shadow-xs hover:bg-(--c-violet-void)"
            >
              ADD MISSION
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
function MissionDebriefModal({ closeModal, fetchMissions, featuredMission }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  async function completeMission(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);

    try {
      const response = await apiFetch(
        `/api/mission/${featuredMission._id}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            debriefContactId: formData.get("debriefContactId"),
            debriefNotes: formData.get("debriefNotes"),
            debriefMissionType: formData.get("debriefMissionType"),
          }),
        },
      );
      if (response.status === 200) {
        await fetchMissions();

        setShowConfirmation(true);
        {
          /*closeModal();*/
        }
      }
      if (response.status === 400) {
        const messageResponse = await response.json();
        showToast(`${messageResponse.message}`, "error");
      }
      if (response.status === 500) {
        showToast(
          `Failed to submit mission debrief. Refresh and try again.`,
          "error",
        );
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      showToast(
        `Failed to submit mission debrief. Check your connection and try again.`,
        "error",
      );
    }
  }
  return (
    <div
      id="mission-debreif-modal"
      aria-labelledby="mission-debreif-modal"
      className="fixed inset-0 z-50 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
    >
      <div
        className="fixed inset-0 bg-black/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        onClick={isLoading ? "" : closeModal}
      ></div>

      <div
        tabIndex="0"
        className="flex min-h-full justify-center p-4 text-center focus:outline-none items-center sp-0"
      >
        {showConfirmation ? (
          <div
            className="z-50 bg-black/60 shadow-xl w-[100%]"
            onClick={closeModal}
          >
            <div className="bg-(--c-purple-tech-40) w-[100%] flex flex-col py-6 items-center">
              <h1 className="my-3 text-3xl">MISSION COMPLETE!</h1>
              <img
                src="/imgs/icons/star.png"
                alt="star icon"
                className="w-[40px] block"
              />
            </div>
          </div>
        ) : (
          <div className="relative transform overflow-hidden border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 mt-16 mb-20 data-closed:sm:scale-95">
            <div className="bg-(--c-purple-tech-40)/40  px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-0 sm:ml-4 text-left ">
                  {/*Window title*/}
                  <h3
                    id="dialog-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    Mission Debrief
                  </h3>
                  <div className="mt-2 text-purple-300 text-sm">
                    {isLoading ? (
                      <CircularProgress color="#7D4C9F" />
                    ) : (
                      <form
                        id="complete-mission-form"
                        onSubmit={completeMission}
                      >
                        <div className="flex flex-col">
                          <p
                            id="debrief-contact-name"
                            className="text-xs text-white"
                          >{`${featuredMission.contact.firstName} ${featuredMission.contact.lastName}`}</p>
                          <input
                            type="hidden"
                            name="debriefContactId"
                            id="debrief-contact-id"
                            value={featuredMission.contact._id}
                          />

                          <p
                            id="debrief-mission-type"
                            className="text-xs text-white"
                          >
                            {featuredMission.missionType === "field"
                              ? "Field Mission"
                              : "Contact Mission"}
                          </p>
                          <input
                            type="hidden"
                            name="debriefMissionType"
                            id="debrief-mission-type-input"
                            value={featuredMission.missionType}
                          />

                          <label
                            htmlFor="debriefNotes"
                            className="text-xs text-white"
                          >
                            Notes
                          </label>
                          <textarea
                            id="debrief-notes"
                            name="debriefNotes"
                            className="border border-purple-300 rounded-md px-3 py-2 mb-6 h-48 resize-none overflow-y-auto"
                            placeholder="Add some specifics about your mission experience"
                            required
                          ></textarea>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/*Window buttons*/}
            {!isLoading && (
              <div className="bg-(--c-violet-void-40) px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  form="complete-mission-form"
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md action-button sm:ml-3 sm:w-auto px-3 py-2 text-sm shadow-xs hover:bg-(--c-violet-void)"
                >
                  COMPLETE MISSION
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-(--c-violet-void-40) px-3 py-2 text-sm font-semibold text-purple-400 shadow-xs inset-ring inset-ring-purple-400 hover:bg-(--c-violet-void-20) sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

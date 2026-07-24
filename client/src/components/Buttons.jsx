import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export function AnimatedCallToAction(props) {
  const isButton = props.type === "button";
  const content = (
    <>
      <div className="particle-container absolute inset-0 z-0">
        {/*generate spans for animation*/}
        {Array.from({ length: 60 }, (_, index) => (
          <span className="particle-spot" key={index}></span>
        ))}
      </div>
      {isButton ? (
        <button
          type="submit"
          className="action-button text-lg py-2 px-15 shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 z-10 relative"
        >
          {props.text.toUpperCase()}
        </button>
      ) : (
        <span className="action-button text-lg py-2 px-15 shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 z-10 relative">
          {props.text.toUpperCase()}
        </span>
      )}
    </>
  );

  return (
    <>
      {isButton ? (
        <div className="particle-hover mx-auto text-center">{content}</div>
      ) : (
        <Link to={props.url} className="particle-hover">
          {content}
        </Link>
      )}
    </>
  );
}

export function IconButton({ svg, onClick, text }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className=" text-sm hover:text-white flex items-center justify-center gap-2 min-h-[44px] min-w-[44px]"
    >
      {svg} {""} {text}
    </button>
  );
}

export function PrimaryButton({
  innerText,
  onClick,
  isActive,
  isGlowing,
  buttonClassName,
  divClassName,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${buttonClassName} min-h-[44px] min-w-[44px] flex items-center`}
    >
      <div
        className={`${isActive == true ? "border-white text-white drop-shadow-white" : " hover:bg-(--c-violet-void-60) hover:text-white"} ${isGlowing && "glow-walkthrough"} ${divClassName} text-sm p-2 border rounded-lg`}
      >
        {innerText.toUpperCase()}
      </div>
    </button>
  );
}

export function SortMissions({ missionList, setMissionList }) {
  const [showList, setShowList] = useState(false);

  function toggleList() {
    setShowList((showList) => !showList);
  }

  function sortLastName() {
    setMissionList((missionList) =>
      missionList
        .slice()
        .sort((a, b) =>
          (a.contact?.lastName || "").localeCompare(b.contact?.lastName || ""),
        ),
    );
    toggleList();
  }

  function sortFirstName() {
    setMissionList((missionList) =>
      missionList
        .slice()
        .sort((a, b) =>
          (a.contact?.firstName || "").localeCompare(
            b.contact?.firstName || "",
          ),
        ),
    );
    toggleList();
  }

  function sortScore() {
    setMissionList((missionList) =>
      missionList
        .slice()
        .sort((a, b) => a.contact?.evalScore - b.contact?.evalScore),
    );
    toggleList();
  }
  return (
    <>
      <PrimaryButton innerText="sort" onClick={toggleList} />
      {showList && (
        <ul className="absolute z-50 bg-(--c-violet-void) border border-purple-300 rounded-md mt-45 text-white overflow-y-auto text-sm">
          <li
            key={"lastName"}
            onClick={sortLastName}
            className="p-2 hover:bg-purple-400 cursor-pointer h-[44px] flex items-center"
          >
            Last Name
          </li>
          <li
            key={"firstName"}
            onClick={sortFirstName}
            className="p-2 hover:bg-purple-400 cursor-pointer h-[44px] flex items-center"
          >
            First Name
          </li>
          <li
            key={"score"}
            onClick={sortScore}
            className="p-2 hover:bg-purple-400 cursor-pointer h-[44px] flex items-center"
          >
            Score
          </li>
        </ul>
      )}
    </>
  );
}

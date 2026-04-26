import { PrimaryButton } from "../components/Buttons";

function InfoSection({ children }) {
  return (
    <div className="border-2 border-double border-(--c-purple-tech-40) rounded-lg text-(--c-purple-tech-40) p-5">
      {children}
    </div>
  );
}
export default function Evaluation() {
  return (
    <main className="flex gap-5 p-4">
      {/*Side section */}
      <div className="max-w-[400px] flex flex-col gap-4">
        <InfoSection>
          <h3 className="text-center mb-2">What's This?</h3>
          <div className="flex items-center gap-1">
            <img src="imgs/thinker.png" className="" />
            <p className="text-xs">
              Want to know if your friends are fake or who your most reliable
              contacts are? Use the evaluation questions to rank your squad by
              score.
            </p>
          </div>
        </InfoSection>
        <div className="border-3 rounded-lg flex flex-col gap-4 p-3 text-(--c-purple-tech-40) text-xl">
          <h2>SETTINGS</h2>
          <PrimaryButton innerText="full evaluation" />
          <PrimaryButton innerText="one friend at a time" />
          <PrimaryButton innerText="topic specific" />
          <PrimaryButton innerText="custom friend group" />
        </div>
        <InfoSection>
          <h3 className="text-center mb-2">Notes</h3>
          <div className="flex items-center gap-1">
            <img src="imgs/takeevaluation.png" className="" />
            <ul className="text-xs">
              <li>To truly evaluate your squad may take an hour or two</li>
              <li>
                Save periodically. You can always come back to questions later
                or change them as you go.
              </li>
            </ul>
          </div>
        </InfoSection>
      </div>
      {/*Questionnaire */}
      <div className="rounded-xl bg-(--c-purple-tech-20) w-[1000px] py-7 px-15">
        <div className="flex">
          <h2>Question:</h2>
          <input type="select" />
        </div>
        <h1 className="text-2xl">
          Does this person show interest in your life?
        </h1>
        <div className="flex gap-2 text-lg items-center">
          <img src="/imgs/Small-Friend-Icon.png" alt="" />
          <h3>Contact Name</h3>
        </div>
        <input type="radio" />
      </div>
    </main>
  );
}

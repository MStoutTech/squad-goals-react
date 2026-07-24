import GuestHeader from "../components/GuestHeader";
import GuestFooter from "../components/GuestFooter";

export default function About() {
  return (
    <>
      <GuestHeader />

      <div className="flex flex-col  mx-6 md:mx-auto max-w-2xl py-10">
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-pretty text-shadow-sm text-shadow-purple-300 text-center my-10 ">
          Our Team
        </h1>
        <img
          src="/imgs/team.png"
          alt="astronaut team of two"
          className="mx-10"
        />
        <p>
          Code Atamai started as a brother sister duo working on projects
          remotely living on opposite coasts.
          <br />
          <br />
          Squad Goals is Molly’s passion project built from years of personal
          need and societal observation, finally getting a jump start as a final
          project for Google’s UX design Certificate. Now a full-fledged app as
          a result of being the subject of her 100Devs 100hrs Project.
        </p>
      </div>
      <GuestFooter />
    </>
  );
}

import GuestHeader from "../components/GuestHeader";
import GuestFooter from "../components/GuestFooter";
import { AnimatedCallToAction } from "../components/Buttons";

export default function Index() {
  return (
    <>
      <div className="bg-[#100830] text-purple-300">
        <GuestHeader />
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            ></div>
          </div>
          {/*Hero Section*/}
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-20">
            <div className="text-center relative">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-white text-shadow-lg sm:text-7xl absolute left-1/2 -translate-x-1/2 whitespace-nowrap top-100">
                Squad Goals
              </h1>
              <img
                src="/imgs/heroes.png"
                alt="Three mascots of Squad Goals posing with a city background"
              />
              <p className="mt-8 text-lg font-medium text-pretty sm:text-xl/8">
                Become the epic hero of your social circles and assemble your
                ultimate squad, saving the world one relationship at a time
              </p>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
            ></div>
          </div>
        </div>
      </div>
      {/*Features Section*/}
      <section className="bg-white p-6 lg:px-8">
        <h3 className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-balance">
          Features
        </h3>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16">
              <img
                src="imgs/phoneapp.png"
                alt="illustration of generic phone app and waving person"
              />
              <dd className="mt-2 text-base/7">
                Set and receive reminders to keep in touch with everyone
                important in your life
              </dd>
            </div>
            <div className="relative pl-16">
              <img
                src="imgs/socialize.png"
                alt="illustration of two friends talking"
              />
              <dd className="mt-2 text-base/7">
                Complete contact and field missions by hanging out with friends
                and using the social apps you already have
              </dd>
            </div>
            <div className="relative pl-16">
              <img
                src="imgs/training.png"
                alt="illustration of weight lifting and feeling accomplished"
              />
              <dd className="mt-2 text-base/7">
                Increase your social prowess with training activities and
                articles geared to make your interactions even better
              </dd>
            </div>
            <div className="relative pl-16">
              <img
                src="imgs/analytics.png"
                alt="illustration of ranked bar graph"
              />
              <dd className="mt-2 text-base/7">
                Use evaluation questions to discover relationships that need
                nurturing or boundaries
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/*Mobile App Section*/}
      <section className="bg-[#100830] text-purple-300">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-20">
          <div className="flex items-center justify-between px-6 lg:px-0">
            <a href="#">
              <img
                src="/imgs/appstore.png"
                alt="Download on the App Store"
                className="max-h-[40px]"
              />
            </a>
            <a href="#">
              <img
                src="/imgs/googleplay.png"
                alt="Get it on Google Play"
                className="max-h-[40px]"
              />
            </a>
          </div>
          <div className="bg-[url(/imgs/ui-background.png)] relative pt-30">
            <img
              src="/imgs/SGShield.svg"
              alt="Squad goals app logo"
              className="absolute left-1/2 -translate-x-1/2"
            />
            <img
              src="/imgs/HyperspaceHologram.svg"
              alt="illustration of hologram machine"
            />
            <h2 className="text-5xl font-semibold my-10 px-6 lg:px-0">
              Get the app
            </h2>
          </div>
          <p className="px-6 lg:px-0">
            Offline notifications and seamless integration with all your
            favorite social apps, this is the best way to keep up to date with
            your squad on the go.
          </p>
        </div>
      </section>

      {/*Sign Up Section*/}
      <section className="text-center">
        <div className="my-20 flex flex-col items-center justify-center mx-auto max-w-2xl">
          <AnimatedCallToAction url="/signup" text="Sign up" type="link" />
          <p className="pt-10 px-30">
            Get started transforming your social circles now! It’s free to sign
            up and all premium features are unlocked for your first 30 days!
          </p>
        </div>
      </section>
      <GuestFooter />
    </>
  );
}

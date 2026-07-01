import GuestHeader from "../components/GuestHeader";
import GuestFooter from "../components/GuestFooter";
import { AnimatedCallToAction } from "../components/Buttons";

export default function HumanConnection() {
  return (
    <>
      <GuestHeader />

      {/* Human Connection Section */}
      <section>
        <div className="bg-[#100830] text-purple-300 py-5 pl-6 md:pl-40">
          <h2 className=" text-4xl font-semibold tracking-normal text-pretty sm:text-5xl lg:text-balance">
            Human Connection
          </h2>
        </div>
        <div className="mx-auto max-w-2xl px-6 sm:my-18 lg:my-20">
          <ul className="flex flex-col md:flex-row gap-3">
            <li className="flex flex-col items-center md:block">
              <div className="max-w-32 max-h-32 p-2">
                <img
                  src="/imgs/lonely-user.png"
                  alt="illustration longingly looking at phone"
                  className=""
                />
              </div>

              <p className="py-5">3 out of 5 Americans report being lonely</p>
            </li>
            <li className="flex flex-col items-center md:block">
              <div className="max-w-32 max-h-32 p-2">
                <img
                  src="/imgs/unhappy-user.png"
                  alt="sad illustrated girl holding hands up shrugging"
                  className=""
                />
              </div>

              <p className="py-5">
                According to a Gallup Poll, happiness and optimism are falling
              </p>
            </li>
            <li className="flex flex-col items-center md:block">
              <div className="max-w-32 max-h-32 p-2">
                <img
                  src="/imgs/mental-health.png"
                  alt="illustration showing someone talking about mental health"
                  className=""
                />
              </div>

              <p className="py-5">
                21% of adults report experiencing mental illness
              </p>
            </li>
          </ul>
          <ul className="list-disc pl-6">
            <li className="my-6">
              The average American spends 7 hours looking at a screen every day
              and over 11 hours interacting with media.
            </li>
            <li className="my-6">
              The average person touches their phone 2,617 times a day.
            </li>
            <li className="my-6">
              50% of teens believe they are addicted to their phones
            </li>
          </ul>
          <p className="py-5">
            After all our media consumption, there is not much time left for
            genuine human interaction - the kind that leaves us smiling and
            feeling cared for - but the realistic answer likely will not be to
            have everyone quit technology cold turkey.
          </p>
        </div>
      </section>

      {/* Dunbar's Number Section */}
      <section>
        <div className="bg-[#100830] text-purple-300 py-5 pl-6 md:pl-40">
          <h2 className="text-4xl font-semibold tracking-normal text-pretty sm:text-5xl lg:text-balance">
            Dunbar's Number
          </h2>
        </div>

        <div className="mx-auto my-6 px-6 max-w-2xl sm:my-18 lg:my-20 lg:max-w-4xl">
          <div className="flex flex-col md:flex-row mb-10">
            <img
              src="imgs/interactions.png"
              alt="illustration of people walking by each other, wireframe connections in the background"
              className="md:w-1/3 self-center"
            />
            <p className="py-5 md:w-2/3">
              Based on averages of brain neocortex size and population group
              sizes, Dunbar suggested there is a limit to how many relationships
              our brains can keep track of. Using logic from regression studies
              of primates and natural social formations of hunter-gatherer
              societies, military units, and businesses, the sweet spot is said
              to be 150 people.
            </p>
          </div>

          <img
            src="/imgs/dunbars-number.png"
            alt="diagram showing sweet spot of strong bonds being about 150 people"
          />
          <div className="flex flex-col md:flex-row my-10">
            <p className="py-5 md:w-2/3">
              Still, like the connections in our brains, relationships need
              reinforcement and attention to remain strong and our time each day
              is limited. Being efficient and intentional will help us build our
              strongest and healthiest communities around us. <br />
              <br />
              This is why Squad Goals organizes your social circles, helps you
              evaluate your connections, and limits the number of contacts you
              can save in the app.
            </p>
            <img
              src="/imgs/online-friends.png"
              alt="illustration of girl kneeling by a large laptop showing users with star rankings"
              className="md:w-1/3 self-center"
            />
          </div>
        </div>
      </section>

      {/* Health Benefits Section */}
      <section>
        <div className="bg-[#100830] text-purple-300 py-5 pl-6 md:pl-40">
          <h2 className="text-4xl font-semibold tracking-normal text-pretty sm:text-5xl lg:text-balance">
            Health Benefits
          </h2>
        </div>

        <div className="mx-auto my-6 px-6 max-w-2xl sm:my-18 lg:my-20 lg:max-w-4xl flex flex-col justify-center">
          <img
            src="/imgs/community-group.png"
            alt="illustration of a group of 4 diverse people talking"
          />
          <h3 className="py-5 text-xl mx-auto">Stay socially connected to:</h3>
          <ul className="list-disc pl-6 mx-auto">
            <li className="my-3">Improve quality of life</li>
            <li className="my-3">Increase feeling of fulfillment</li>
            <li className="my-3">Gain a mental health boost</li>
            <li className="my-3">Elongate your life span</li>
            <li className="my-3">Reinforce your immune system</li>
            <li className="my-3">Maintain a support network</li>
            <li className="my-3">Develop a sense of purpose and belonging</li>
          </ul>
        </div>
      </section>
      {/* Sign Up Section */}
      <section className="text-center">
        <div className="my-20 flex flex-col items-center justify-center mx-auto max-w-2xl">
          <AnimatedCallToAction url="/signup" text="Sign up" type="link" />
          <p className="pt-10 px-30">
            Get started transforming your social circles now! It’s free to sign
            up and all premium features are available for your first 30 days!
          </p>
        </div>
      </section>

      <GuestFooter />
    </>
  );
}

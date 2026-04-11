export default function GuestFooter() {
  return (
    <footer className="bg-[#100830] text-purple-300 p-6">
      <div className="flex flex-col md:flex-row justify-between lg:px-20">
        <div className="flex gap-20 text-sm">
          <ul>
            <li className="py-1">
              <a href="/index">Home</a>
            </li>
            <li className="py-1">
              <a href="/human-connection">Human Connection</a>
            </li>
            <li className="py-1">
              <a href="/blog">Blog</a>
            </li>
          </ul>

          <ul>
            <li className="py-1">
              <a href="/about">About</a>
            </li>
            <li className="py-1">
              <a href="/about">Contact Us</a>
            </li>
            <li className="py-1">
              <a href="/careers">Careers</a>
            </li>
            <li className="py-1">
              <a href="/policies">Policies</a>
            </li>
          </ul>
        </div>

        <ul className="flex gap-4 self-center my-10 md:my-0 text-sm">
          <a href="#">
            <li className="rounded-full bg-purple-300 text-[#100830] size-14 text-center p-4">
              <span className="icon icon-facebook"></span>
            </li>
          </a>
          <a href="#">
            <li className="rounded-full bg-purple-300 text-[#100830] size-14 text-center p-4">
              <span className="icon icon-linkedin"></span>
            </li>
          </a>
          <a href="#">
            <li className="rounded-full bg-purple-300 text-[#100830] size-14 text-center p-4">
              <span className="icon icon-bluesky"></span>
            </li>
          </a>
        </ul>
      </div>

      <span className="block text-center text-xs md:mt-20 mx-auto">
        Copyright Squad Goals 2026
      </span>
    </footer>
  );
}

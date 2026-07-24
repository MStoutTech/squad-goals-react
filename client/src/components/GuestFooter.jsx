import { Link } from "react-router-dom";

function FooterLink({ linkText, linkTo }) {
  return (
    <li>
      <Link to={linkTo} className="h-[44px] flex items-center">
        {linkText}
      </Link>
    </li>
  );
}

function SocialMediaIcon({ link, iconClassName }) {
  return (
    <a href={link}>
      <li className="rounded-full bg-purple-300 text-[#100830] size-14 text-center p-4">
        <span className={`icon ${iconClassName}`}></span>
      </li>
    </a>
  );
}

export default function GuestFooter() {
  return (
    <footer className="bg-[#100830] text-purple-300 p-6">
      <div className="flex flex-col md:flex-row justify-between lg:px-20">
        <div className="flex gap-20 text-sm">
          <ul>
            <FooterLink linkText="Home" linkTo="/" />
            <FooterLink
              linkText="Human Connection"
              linkTo="/human-connection"
            />
            <FooterLink linkText="Blog" linkTo="/sg-blog" />
          </ul>

          <ul>
            <FooterLink linkText="About" linkTo="/about" />
            <FooterLink linkText="Contact Us" linkTo="/about" />
            <FooterLink linkText="Careers" linkTo="/careers" />
            <FooterLink linkText="Policies" linkTo="/policies" />
          </ul>
        </div>

        <ul className="flex gap-4 self-center my-10 md:my-0 text-sm">
          <SocialMediaIcon link="#" iconClassName="icon-facebook" />
          <SocialMediaIcon link="#" iconClassName="icon-linkedin" />
          <SocialMediaIcon link="#" iconClassName="icon-bluesky" />
        </ul>
      </div>

      <span className="block text-center text-xs md:mt-20 mx-auto">
        Copyright Squad Goals 2026
      </span>
    </footer>
  );
}

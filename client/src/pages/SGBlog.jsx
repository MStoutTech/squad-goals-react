import GuestHeader from "../components/GuestHeader";
import GuestFooter from "../components/GuestFooter";

function BlogArticle(props) {
  return (
    <li>
      <a href="#">
        <div className="bg-[#100830] p-2">
          <img src={props.img} alt="" />
        </div>
        <p className="px-2 py-1">{props.text}</p>
      </a>
    </li>
  );
}

export default function SGBlog() {
  return (
    <>
      <GuestHeader />
      {/*Search*/}
      <form className="text-sm gap-3 px-6 flex flex-wrap">
        <label htmlFor="blog-search-input" className="hidden">
          Search Blogs
        </label>
        <input
          id="blog-search-input"
          type="search"
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-auto"
          placeholder="SEARCH BLOG"
        />
        <input
          id="blog-search-date"
          type="date"
          className="border border-gray-300 rounded-md px-3 py-2 "
        />
        <label htmlFor="blog-topic-filter" className="hidden">
          Blog Topics
        </label>
        <select
          name="blog-topics"
          id="blog-topic-filter"
          type="select"
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">--Select Topic--</option>
          <option value="releases">Releases</option>
          <option value="partners">Partners</option>
          <option value="studies">Studies</option>
          <option value="success-stories">Success Stories</option>
        </select>
      </form>

      {/* Slide show */}
      <section>
        <div className="py-3 pl-6 md:pl-20">
          <h3 className="text-2xl font-semibold tracking-normal text-pretty sm:text-2xl lg:text-balance">
            Trending
          </h3>
        </div>
        <div className="bg-[#100830] text-purple-300 m-6 md:mx-auto p-10 max-w-2xl sm:my-18 lg:mb-20 lg:max-w-4xl flex flex-col justify-center rounded-lg max-h-[400px]">
          <img
            src="/imgs/blog-slide1.png"
            alt=""
            className="self-center shrink h-50"
          />
          <p className="md:p-10 lg:px-30 shrink">
            Squad Goals - New app launches with promise to make you a social
            super hero
          </p>
        </div>
      </section>

      {/* Latest Blogs */}
      <section>
        <div className="bg-[#100830] text-purple-300 py-3 pl-6 md:pl-20">
          <h3 className="text-2xl font-semibold tracking-normal text-pretty sm:text-2xl lg:text-balance">
            Latest
          </h3>
        </div>

        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 mx-6 my-10 md:my-20 md:mx-40 lg:mx-20">
          <BlogArticle
            img="/imgs/blog-1.png"
            text="Check out the latest social app integrations for Squad Goals"
          />
          <BlogArticle
            img="/imgs/blog-2.png"
            text="I tried contacting someone different every day, and after 4
                weeks I already feel happier"
          />
          <BlogArticle
            img="/imgs/blog-3.png"
            text="Is Squad Goals just another social media app?"
          />
          <BlogArticle
            img="/imgs/blog-1.png"
            text="Check out the latest social app integrations for Squad Goals"
          />
          <BlogArticle
            img="/imgs/blog-2.png"
            text="I tried contacting someone different every day, and after 4
                weeks I already feel happier"
          />
          <BlogArticle
            img="/imgs/blog-3.png"
            text="Is Squad Goals just another social media app?"
          />
        </ul>
      </section>

      <GuestFooter />
    </>
  );
}

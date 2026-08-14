export function RoleTag({ text, img }) {
  return (
    <span className="mr-5 md:mr-0 text-sm md:text-base inline border-2 rounded-xl py-1 px-3 text-white bg-(--c-violet-void-60) flex">
      <img
        src={img}
        alt=""
        className="inline h-[14px] w-[14px] md:h-[20px] md:w-[20px] mr-2 -translate-y-[1px]"
      />
      {text}
    </span>
  );
}
export function CategoryTag({ text }) {
  return (
    <span className="text-xs font-bold rounded  px-2 text-(--c-violet-void-80) bg-(--c-purple-tech-60)">
      {text}
    </span>
  );
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-30 static w-[100%] h-screen bg-(--c-violet-void)">
      <div className="relative mt-20 border-1 border-white rounded-md">
        <h2 className="text-[12rem] text-center text-(--c-violet-void-60)">
          404
        </h2>
        <div className="absolute top-35 left-10 w-[80%]">
          <img src="/imgs/my404.png" alt="three sad squad goals mascots" />
        </div>
      </div>
      <h1 className="text-white">Oops! Page not found</h1>
    </div>
  );
}

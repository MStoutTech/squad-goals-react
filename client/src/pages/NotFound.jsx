export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-10 static w-[100%] h-screen bg-(--c-violet-void)">
      <div className="mt-20 border-1 border-white size-80 rounded-md">
        <h2 className="text-[8rem] text-center text-(--c-violet-void-60)">
          404
        </h2>
      </div>
      <h1 className="text-white">Oops! Page not found</h1>
    </div>
  );
}

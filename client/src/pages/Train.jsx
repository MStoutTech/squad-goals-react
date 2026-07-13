function ArticleCard({ title, preview }) {
  return (
    <li className="flex flex-col cursor-pointer bg-(--c-violet-void-60) border-1 border-(--c-purple-tech-40) rounded-lg p-2 text-(--c-purple-tech-20) w-[200px] h-[250px] p-3 mr-8">
      <div className="border-2 border-(--c-purple-tech-40) rounded-lg w-[175px] h-[120px] self-center">
        <img
          src="../imgs/article.png"
          alt="article image"
          className="w-[100%] justify-self-center"
        />
      </div>

      <h4 className="font-light mt-2">{title}</h4>
      <p className="text-xs">{preview}</p>
    </li>
  );
}
function ArticleList({ children, title }) {
  return (
    <div className="mb-14">
      <h2 className="text-xl ml-10">{title}</h2>
      <ul className="flex mt-4 overflow-y-auto px-10">{children}</ul>
    </div>
  );
}

export default function Train() {
  return (
    <div className="text-(--c-purple-tech-40) w-[100%] py-2 lg:max-h-[calc(100vh-4rem)] lg:py-12 lg:px-6">
      <div className="flex flex-wrap-reverse gap-2 justify-between">
        <label className="flex flex-col md:block text-(--c-purple-tech-40) text-xs">
          Filter Articles
          <select className="border-1 border-(--c-purple-tech-40) rounded-lg p-2 text-(--c-purple-tech-40) text-base md:ml-2">
            <option>ALL TOPICS</option>
            <option value="selfImprovement">SELF IMPROVEMENT</option>
            <option value="healingRelationships">HEALING RELATIONSHIPS</option>
            <option value="healingRelationships">BUILDING RELATIONSHIPS</option>
            <option value="healingRelationships">MEET NEW PEOPLE</option>
          </select>
        </label>
        <input
          type="search"
          className="border-1 border-(--c-purple-tech-40) rounded-lg p-2 block ml-auto max-h-[42px]"
          placeholder="Search"
        />
      </div>
      <main className="mt-10 mb-22 lg:mb-0">
        <ArticleList title="Featured">
          <ArticleCard
            title="Kindness"
            preview="The world is in need of more nice words. Learn some strategies..."
          />
          <ArticleCard
            title="Setting Boundaries"
            preview="When you find it difficult to say 'no' you may need to..."
          />
          <ArticleCard
            title="Active Listening"
            preview="'Can you repeat that?' is not something you should be repeating..."
          />
          <ArticleCard
            title="Themed Parties"
            preview="Costumes, pool parties, baby showers and more..."
          />
          <ArticleCard
            title="Being Assertive"
            preview="Communicate your point of view effectively..."
          />
          <ArticleCard
            title="Letting Go"
            preview="A friendship is not working out. Parting ways amicably and speaking your piece..."
          />
        </ArticleList>
        <ArticleList title="Interpersonal Skills">
          <ArticleCard
            title="Kindness"
            preview="The world is in need of more nice words. Learn some strategies..."
          />
          <ArticleCard
            title="Setting Boundaries"
            preview="When you find it difficult to say 'no' you may need to..."
          />
          <ArticleCard
            title="Active Listening"
            preview="'Can you repeat that?' is not something you should be repeating..."
          />
          <ArticleCard
            title="Themed Parties"
            preview="Costumes, pool parties, baby showers and more..."
          />
          <ArticleCard
            title="Being Assertive"
            preview="Communicate your point of view effectively..."
          />
          <ArticleCard
            title="Letting Go"
            preview="A friendship is not working out. Parting ways amicably and speaking your piece..."
          />
        </ArticleList>
        <ArticleList title="Difficult Conversations">
          <ArticleCard
            title="Kindness"
            preview="The world is in need of more nice words. Learn some strategies..."
          />
          <ArticleCard
            title="Setting Boundaries"
            preview="When you find it difficult to say 'no' you may need to..."
          />
          <ArticleCard
            title="Active Listening"
            preview="'Can you repeat that?' is not something you should be repeating..."
          />
          <ArticleCard
            title="Themed Parties"
            preview="Costumes, pool parties, baby showers and more..."
          />
          <ArticleCard
            title="Being Assertive"
            preview="Communicate your point of view effectively..."
          />
          <ArticleCard
            title="Letting Go"
            preview="A friendship is not working out. Parting ways amicably and speaking your piece..."
          />
        </ArticleList>
      </main>
    </div>
  );
}

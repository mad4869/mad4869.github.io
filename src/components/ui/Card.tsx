import type { EngineeringPorto, WritingPorto } from "@/types/porto"

type CardProps = {
  porto: EngineeringPorto | WritingPorto
  isFirstItem: boolean
}

const Card = ({ porto, isFirstItem }: CardProps) => {
  return (
    <div
      className={`relative float-left -mr-[100%] w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none ${isFirstItem ? "" : "hidden"}`}
      {...(isFirstItem ? { 'data-twe-carousel-active': '' } : {})}
      data-twe-carousel-item
      style={{ backfaceVisibility: "hidden" }}
    >
      <div
        className="relative overflow-hidden bg-cover bg-[50%] bg-no-repeat">
        <img
          src={porto.data.image.src}
          className="block w-full"
          alt="..."
          loading={isFirstItem ? "eager" : "lazy"} />
        <div
          className="absolute top-0 bottom-0 left-0 right-0 w-full h-full overflow-hidden bg-gradient-to-b from-transparent to-slate-900 opacity-80" />
      </div>
      <div className="absolute inset-x-[15%] bottom-5 py-5 text-center text-white text-xs lg:text-base">
        <a href={`/software-engineering/${porto.slug}`} title={`View ${porto.data.title} in detail`}>
          <h5 className="text-xl transition-transform duration-200 hover:scale-110">{porto.data.title}</h5>
        </a>
        <p>
          {porto.data.description}
        </p>
      </div>
    </div>
  )
}

export default Card

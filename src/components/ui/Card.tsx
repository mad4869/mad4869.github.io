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
      <img
        src={porto.data.image.src}
        className="block w-full"
        alt="..."
        loading={isFirstItem ? "eager" : "lazy"}
      />
      <div className="absolute inset-x-[15%] bottom-5 hidden py-5 text-center text-white md:block">
        <a href={`/software-engineering/${porto.slug}`}><h5 className="text-xl">{porto.data.title}</h5></a>
        <p>
          {porto.data.description}
        </p>
      </div>
    </div>
  )
}

export default Card

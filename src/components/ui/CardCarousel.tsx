import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import type { EngineeringPorto, WritingPorto } from "@/types/porto"

type CardCarouselProps = {
    portos: EngineeringPorto[] | WritingPorto[]
}

const CardCarousel = ({ portos }: CardCarouselProps) => {
    return (
        <Carousel>
            <CarouselPrevious />
            <CarouselContent>
                {portos.map((porto, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{porto.data.title}</CardTitle>
                                    <CardDescription>{porto.data.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <img
                                        src={porto.data.image.src}
                                        alt={`Hero Image of ${porto.data.title}`}
                                        className="max-w-full"
                                        loading="lazy" />
                                </CardContent>
                                <CardFooter>
                                    <p>
                                        {(porto as EngineeringPorto).data.repo || (porto as WritingPorto).data.src}
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext />
        </Carousel>
    )
}

export default CardCarousel
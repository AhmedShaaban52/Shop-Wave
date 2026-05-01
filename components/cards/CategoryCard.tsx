import { Category } from "@/lib/types";
import Image from "next/image"

interface CategoryCardProps {
    categories: Category[];
}

const CategoryCard = ({ categories }: CategoryCardProps) => {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-sky-900 tracking-tight">Shop by Category</h2>
                <p className="text-sm text-gray-400 mt-1">Curated collections for every facet of your lifestyle.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Image */}
                        <div className="relative w-full aspect-[3/4]">
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* Text at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white text-lg font-bold leading-tight">
                                {cat.name}
                            </h3>
                            <span className="flex items-center gap-1 text-white/80 text-xs font-semibold mt-1 group-hover:text-white transition-colors">
                                Explore Now
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default CategoryCard
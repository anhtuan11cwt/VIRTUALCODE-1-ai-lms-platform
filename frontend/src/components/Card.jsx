import { BookOpen, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Card = ({ course }) => {
  const { _id, category, creator, price, rating, reviews, thumbnail, title } =
    course;

  const creatorName = creator?.name || "Giảng viên";
  const displayPrice = price > 0 ? `${price.toLocaleString()}₫` : "Miễn phí";

  return (
    <Link
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
      to={`/course/${_id}`}
    >
      <div className="aspect-video overflow-hidden bg-gray-100">
        {thumbnail ? (
          <img
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            src={thumbnail}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <BookOpen size={40} />
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="mb-1 font-medium text-blue-600 text-xs uppercase tracking-wide">
          {category}
        </p>

        <h3 className="line-clamp-2 font-semibold text-gray-900">{title}</h3>

        <p className="mt-1 text-gray-500 text-xs">{creatorName}</p>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-bold text-gray-900">{displayPrice}</p>

          {(rating > 0 || reviews > 0) && (
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Star className="text-amber-400" fill="currentColor" size={14} />
              <span className="font-medium text-gray-700">
                {rating?.toFixed(1) || "0.0"}
              </span>
              {reviews > 0 && <span>({reviews})</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Card;

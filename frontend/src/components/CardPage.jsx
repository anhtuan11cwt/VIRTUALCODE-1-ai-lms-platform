import Card from "./Card";

const CardPage = ({ courses, loading, error, title, subtitle }) => {
  if (loading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {title && (
            <div className="mb-10 text-center">
              <div className="mx-auto mb-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
              <div className="mx-auto h-4 w-80 animate-pulse rounded bg-gray-100" />
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                key={i}
              >
                <div className="aspect-video animate-pulse bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
                  <div className="flex justify-between">
                    <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">{error}</p>
      </section>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {title && (
            <div className="mb-10 text-center">
              <h2 className="font-bold text-3xl text-gray-900">{title}</h2>
              {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
            </div>
          )}
          <div className="py-12 text-center">
            <p className="text-gray-400">Chưa có khóa học nào được xuất bản</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-10 text-center">
            <h2 className="font-bold text-3xl text-gray-900">{title}</h2>
            {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <Card course={course} key={course._id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardPage;

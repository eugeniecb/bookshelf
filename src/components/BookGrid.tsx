type BookGridProps = {
  children: React.ReactNode;
};

export function BookGrid({ children }: BookGridProps) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
}

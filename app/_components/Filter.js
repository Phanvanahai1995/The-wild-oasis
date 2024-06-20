"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

function Filter() {
  // Tạo object searchParams
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy path name của page cabins
  const pathname = usePathname();

  // Check active button
  const activeFilter = searchParams.get("capacity");

  function handleFilter(filter) {
    // Tạo params URL search
    const params = new URLSearchParams(searchParams);

    // set params ?capacity=filter
    params.set("capacity", filter);

    // Replace URL hiện tại
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex">
      <Button
        activeFilter={activeFilter}
        handleFilter={handleFilter}
        filter="all"
      >
        All cabins
      </Button>
      <Button
        activeFilter={activeFilter}
        handleFilter={handleFilter}
        filter="small"
      >
        1&mdash;3 guests
      </Button>

      <Button
        activeFilter={activeFilter}
        handleFilter={handleFilter}
        filter="medium"
      >
        1&mdash;7 guests
      </Button>
      <Button
        activeFilter={activeFilter}
        handleFilter={handleFilter}
        filter="large"
      >
        1&mdash;12 guests
      </Button>
    </div>
  );
}

export default Filter;

function Button({ activeFilter, handleFilter, filter, children }) {
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`${
        activeFilter === filter ? "bg-primary-700" : ""
      } px-5 py-2 hover:bg-primary-700`}
    >
      {children}
    </button>
  );
}

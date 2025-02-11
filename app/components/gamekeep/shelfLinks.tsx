import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import clsx from "clsx"

const ShelfLinks = () => {
  const pathname = usePathname()
  const params = useSearchParams()
  const shelfParam = params.get("shelf")?.toLowerCase()

  return (
    <nav>
      <ul className='menu bg-base-200 rounded-box w-36 md:w-56'>
        <li className='menu-title'>Game Keep</li>
        <li>
          <Link
            href={{
              pathname: "/gamekeep",
            }}
            className={clsx("", { active: pathname === "/gamekeep" && !shelfParam })}
          >
            All
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname: "/gamekeep",
              query: { shelf: "Owned" },
            }}
            className={clsx("", { active: pathname === "/gamekeep" && shelfParam === "owned" })}
          >
            Owned
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname: "/gamekeep",
              query: { shelf: "Want" },
            }}
            className={clsx("", { active: pathname === "/gamekeep" && shelfParam === "want" })}
          >
            Want
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname: "/gamekeep",
              query: { shelf: "Not Interested" },
            }}
            className={clsx("", { active: pathname === "/gamekeep" && shelfParam === "not interested" })}
          >
            Not Interested
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname: "/gamekeep/tracker",
            }}
            className={clsx("", { active: pathname === "/gamekeep/tracker" })}
          >
            Game Tracker
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default ShelfLinks

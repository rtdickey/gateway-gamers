import Link from "next/link"

const ShelfLinks = () => {
  return (
    <nav>
      <ul className='menu bg-base-200 rounded-box w-36 md:w-56'>
        <li className='menu-title'>Game Keep</li>
        <li>
          <Link
            href={{
              pathname: "/gamekeep",
            }}
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
          >
            Not Interested
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname: "/gamekeep/tracker",
            }}
          >
            Game Tracker
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default ShelfLinks

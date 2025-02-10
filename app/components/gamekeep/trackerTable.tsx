import Image from "next/image"

import { LoanedGame } from "@/app/lib/types/LoanedGame"

interface TrackerTableProps {
  loanedGames: LoanedGame[]
}

const TrackerTable: React.FC<TrackerTableProps> = ({ loanedGames }) => {
  const daysSinceLoan = (loanedDate: string) => {
    const date = new Date(loanedDate)
    const now = new Date()
    const timeDifference = now.getTime() - date.getTime()
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference
  }

  return (
    <div className='overflow-x-auto'>
      <table className='table'>
        {/* head */}
        <thead>
          <tr>
            <th>
              {/* <label>
                <input type='checkbox' className='checkbox' />
              </label> */}
            </th>
            <th>Name</th>
            <th>Date Given</th>
            <th>Total Days</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loanedGames.map(loanedGame => (
            <tr key={loanedGame.borrowerId + "-" + loanedGame.game.title}>
              <th>
                <label>
                  <input type='checkbox' className='checkbox' />
                </label>
              </th>
              <td>
                <div className='flex items-center gap-3'>
                  <div className='avatar'>
                    <div className='mask mask-squircle h-12 w-12'>
                      <Image
                        src={loanedGame.game.thumbnail}
                        alt={loanedGame.game.title}
                        width={200}
                        height={150}
                        className='w-full'
                      />
                    </div>
                  </div>
                  <div>
                    <div className='font-bold'>{loanedGame.borrower}</div>
                  </div>
                </div>
              </td>
              <td>{loanedGame.loanedDate}</td>
              <td>{daysSinceLoan(loanedGame.loanedDate)} days</td>
              <td>
                <button className='btn btn-ghost btn-xs'>details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TrackerTable

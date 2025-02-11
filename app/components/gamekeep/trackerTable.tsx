"use client"

import Image from "next/image"

import { LoanedGame } from "@/app/lib/types/LoanedGame"
import { useCallback, useRef, useState } from "react"

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

  const [selectedLoanedGame, setSelectedLoanedGame] = useState<LoanedGame | null>(null)
  const ref = useRef<HTMLDialogElement>(null)

  const handleShowModal = useCallback(
    (loanedGame: LoanedGame) => {
      setSelectedLoanedGame(loanedGame)
      ref.current?.showModal()
    },
    [ref, setSelectedLoanedGame],
  )

  const handleCloseModal = useCallback(() => {
    setSelectedLoanedGame(null)
    ref.current?.close()
  }, [ref, setSelectedLoanedGame])

  const handleReturnGame = useCallback(() => {
    console.log("Game Returned: ", selectedLoanedGame?.title, selectedLoanedGame?.borrower, selectedLoanedGame?.loanId)
    handleCloseModal()
  }, [handleCloseModal, selectedLoanedGame])

  return (
    <div className='overflow-x-auto'>
      <table className='table table-xs sm:table-sm'>
        {/* head */}
        <thead>
          <tr>
            <th>Game</th>
            <th>Borrower</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loanedGames.map(loanedGame => (
            <tr key={loanedGame.borrowerId + "-" + loanedGame.title}>
              <td>
                <div className='flex items-center gap-3'>
                  <div className='avatar hidden sm:block'>
                    <div className='mask mask-squircle h-12 w-12'>
                      <Image
                        src={loanedGame.thumbnail}
                        alt={loanedGame.title}
                        width={200}
                        height={150}
                        className='w-full'
                      />
                    </div>
                  </div>
                  <div>
                    <div className='font-bold'>{loanedGame.title}</div>
                  </div>
                </div>
              </td>
              <td>{loanedGame.borrower}</td>
              <td>
                <div>{loanedGame.loanedDate}</div>
                <div>({daysSinceLoan(loanedGame.loanedDate)} days)</div>
              </td>
              <td></td>
              <td>
                <button className='btn btn-link' onClick={() => handleShowModal(loanedGame)}>
                  Returned?
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <dialog ref={ref} id='loaned_game_modal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>
            {selectedLoanedGame ? (
              <span>It's been {daysSinceLoan(selectedLoanedGame.loanedDate)} days since you loaned this game.</span>
            ) : (
              <span>Uh Oh!</span>
            )}
          </h3>
          <p className='py-4'>
            {selectedLoanedGame ? (
              <span>
                Has {selectedLoanedGame?.borrower} returned {selectedLoanedGame?.title}?
              </span>
            ) : (
              <span>No loaned game information found...</span>
            )}
          </p>
          <div className='modal-action'>
            {selectedLoanedGame && (
              <button className='btn btn-primary' onClick={handleReturnGame}>
                Yes, it's back in my collection
              </button>
            )}
            <button className='btn' onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default TrackerTable

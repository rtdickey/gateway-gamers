"use client"

import Image from "next/image"

import { returnGame } from "@/app/lib/actions/user-game-actions"
import { LoanedGame } from "@/app/lib/types/loaned-game"
import { daysSinceLoan } from "@/app/lib/utils/date"
import { useCallback, useRef, useState } from "react"

interface TrackerTableProps {
  loanedGames: LoanedGame[]
}

const TrackerTable: React.FC<TrackerTableProps> = ({ loanedGames }) => {
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

  const handleReturnGame = useCallback(async () => {
    if (selectedLoanedGame) {
      await returnGame(selectedLoanedGame.id)
    }
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
            <tr key={loanedGame.id}>
              <td>
                <div className='flex items-center gap-3'>
                  <div className='avatar hidden sm:block'>
                    <div className='mask mask-squircle h-12 w-12'>
                      {loanedGame.user_game?.game?.thumbnail && (
                        <Image
                          src={loanedGame.user_game.game.thumbnail}
                          alt={loanedGame.user_game.game.title ?? "Board Game Thumbnail"}
                          width={200}
                          height={150}
                          className='w-full'
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className='font-bold'>{loanedGame.user_game?.game?.title}</div>
                  </div>
                </div>
              </td>
              <td>{loanedGame.borrower}</td>
              <td>
                <div>{loanedGame.loaned_at.split("T")[0]}</div>
                <div>({daysSinceLoan(loanedGame.loaned_at)} days)</div>
              </td>
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
              <span>It&apos;s been {daysSinceLoan(selectedLoanedGame.loaned_at)} days since you loaned this game.</span>
            ) : (
              <span>Uh Oh!</span>
            )}
          </h3>
          <p className='py-4'>
            {selectedLoanedGame ? (
              <span>
                Has {selectedLoanedGame?.borrower} returned {selectedLoanedGame?.user_game?.game?.title}?
              </span>
            ) : (
              <span>No loaned game information found...</span>
            )}
          </p>
          <div className='modal-action'>
            {selectedLoanedGame && (
              <button className='btn btn-primary' onClick={handleReturnGame}>
                Yes, it&apos;s back in my collection
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

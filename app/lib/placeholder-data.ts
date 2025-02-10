import { Game } from "@/app/lib/types/Game"
import { LoanedGame } from "@/app/lib/types/LoanedGame"

export const gameData: Game[] = [
  {
    title: "Space Base",
    shelf: "Owned",
    playingTime: 60,
    playerCount: "2-5",
    age: "14+",
    thumbnail:
      "https://cf.geekdo-images.com/MHhQxXVjiaa6C-04nGiIWw__thumb/img/rgETRyeuYs_wiZ5y-9Zj5H8kyFo=/fit-in/200x150/filters:strip_icc()/pic6640638.jpg",
    isLoaned: true,
  },
  {
    title: "Wingspan",
    shelf: "Owned",
    playingTime: 70,
    playerCount: "1-5",
    age: "10+",
    thumbnail:
      "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__thumb/img/VNToqgS2-pOGU6MuvIkMPKn_y-s=/fit-in/200x150/filters:strip_icc()/pic4458123.jpg",
    isLoaned: true,
  },
  {
    title: "Everdell",
    shelf: "Not Interested",
    playingTime: 80,
    playerCount: "1-4",
    age: "13+",
    thumbnail:
      "https://cf.geekdo-images.com/fjE7V5LNq31yVEW_yuqI-Q__thumb/img/Cf_mYxR_VvdjTEPXseSurni2JNI=/fit-in/200x150/filters:strip_icc()/pic3918905.png",
  },
  {
    title: "Terraforming Mars",
    shelf: "Want",
    playingTime: 120,
    playerCount: "1-5",
    age: "12+",
    thumbnail:
      "https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__thumb/img/BTxqxgYay5tHJfVoJ2NF5g43_gA=/fit-in/200x150/filters:strip_icc()/pic3536616.jpg",
  },
  {
    title: "Gloomhaven",
    shelf: "Not Interested",
    playingTime: 120,
    playerCount: "1-4",
    age: "12+",
    thumbnail:
      "https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__thumb/img/veqFeP4d_3zNhFc3GNBkV95rBEQ=/fit-in/200x150/filters:strip_icc()/pic2437871.jpg",
  },
  {
    title: "Scythe",
    shelf: "Owned",
    playingTime: 90,
    playerCount: "1-5",
    age: "14+",
    thumbnail:
      "https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BUZdA__thumb/img/eQ69OEDdjYjfKg6q5Navee87skU=/fit-in/200x150/filters:strip_icc()/pic3163924.jpg",
    isLoaned: false,
  },
  {
    title: "Root",
    shelf: "Owned",
    playingTime: 90,
    playerCount: "2-4",
    age: "10+",
    thumbnail:
      "https://cf.geekdo-images.com/JUAUWaVUzeBgzirhZNmHHw__thumb/img/ACovMZzGGIsBRyEQXFnsT8282NM=/fit-in/200x150/filters:strip_icc()/pic4254509.jpg",
    isLoaned: false,
  },
]

export const loanedGameData: LoanedGame[] = [
  {
    borrower: "Ryan Dickey",
    owner: "Charles Reed",
    loanedDate: "2025-01-01",
    game: {
      title: "Space Base",
      shelf: "Owned",
      playingTime: 60,
      playerCount: "2-5",
      age: "14+",
      thumbnail:
        "https://cf.geekdo-images.com/MHhQxXVjiaa6C-04nGiIWw__thumb/img/rgETRyeuYs_wiZ5y-9Zj5H8kyFo=/fit-in/200x150/filters:strip_icc()/pic6640638.jpg",
      isLoaned: true,
    },
  },
  {
    borrower: "Ryan Dickey",
    owner: "Charles Reed",
    loanedDate: "2024-08-25",
    game: {
      title: "Gloomhaven",
      shelf: "Not Interested",
      playingTime: 120,
      playerCount: "1-4",
      age: "12+",
      thumbnail:
        "https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__thumb/img/veqFeP4d_3zNhFc3GNBkV95rBEQ=/fit-in/200x150/filters:strip_icc()/pic2437871.jpg",
    },
  },
  {
    borrower: "Charles Reed",
    owner: "Ryan Dickey",
    loanedDate: "2024-08-25",
    game: {
      title: "Azul",
      shelf: null,
      playingTime: 30,
      playerCount: "2-4",
      age: "8+",
      thumbnail:
        "https://cf.geekdo-images.com/aPSHJO0d0XOpQR5X-wJonw__thumb/img/ccsXKrdGJw-YSClWwzVUwk5Nh9Y=/fit-in/200x150/filters:strip_icc()/pic6973671.png",
    },
  },
]

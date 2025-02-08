import Image from "next/image"

interface LogoProps {
  className?: string
}

const GatewayGamersLogo = ({ className }: LogoProps) => {
  return (
    <Image
      src='/gateway-gamers-logo.png'
      alt='Gateway Gamers logo'
      width={603}
      height={657}
      priority
      className={className}
    />
  )
}

export default GatewayGamersLogo

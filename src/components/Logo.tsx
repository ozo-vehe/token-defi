import { FC } from "react";

const Logo: FC = () => {
  return (
    <a
      href="/"
      className={`robotoSerif navbar-logo min-w-[100px] flex items-center`}
    >
      <span className="text-green-800 font-[800] text-2xl">Token</span><span className="text-[#dda432] font-[800] text-2xl tracking-[1px]">Defi</span>
    </a>
  );
};

export default Logo;
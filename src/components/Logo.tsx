import { FC } from "react";

const Logo: FC = () => {
  return (
    <a
      href="/"
      className={`montserrat navbar-logo min-w-[100px] flex items-center`}
    >
      <span className="text-green-800 font-[900] text-2xl tracking-[1px]">Token</span><span className="text-[#dda432] font-[900] text-2xl tracking-[2px]">Defi</span>
    </a>
  );
};

export default Logo;
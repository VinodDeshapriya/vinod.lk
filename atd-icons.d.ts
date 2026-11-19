declare module "atd-icons/dist/*" {
  import { FC, SVGAttributes } from "react";
  const Icon: FC<{ size?: number; className?: string } & SVGAttributes<SVGElement>>;
  export default Icon;
}

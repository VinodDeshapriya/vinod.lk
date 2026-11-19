import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFoundPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="grow text-center flex-col flex items-center justify-center px-[20px] py-[60px] lg:py-[80px] max-w-[625px] mx-auto relative">
        <h1 className="leading-[100%] text-primary-light mb-[18px] md:mb-[24px] text-[90px] md:text-[150px]">
          404
        </h1>
        <p className="pointer-events-none text-[200px] text-[#f7f7f7] lg:text-[300px] absolute -z-10 font-bold top-[20px]">
          404
        </p>
        <h3 className="text-title-2x-large mb-[12px]">Something’s missing.</h3>
        <div className="text-body-base mb-[18px] md:mb-[24px]">
          Something is wrong here. It seems like what you are looking for
          cannot be found.
        </div>
        <Link href="/" className="text-primary-light flex gap-[8px] items-center">
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
}

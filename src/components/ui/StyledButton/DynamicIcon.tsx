import dynamic from "next/dynamic";

const DynamicIcon = ({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) => {
  const Icon = dynamic(
    () => import(`atd-icons/dist/${name}`).catch(() => null),
    {
      ssr: true,
      loading: () => null,
    },
  );

  if (!Icon) return null;

  // @ts-expect-error — dynamic() with .catch(null) loses prop types at compile time
  // eslint-disable-next-line react-hooks/static-components
  return <Icon size={size} className={className} />;
};

export default DynamicIcon;

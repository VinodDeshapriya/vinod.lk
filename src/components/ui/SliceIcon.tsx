import Checkmark from "atd-icons/dist/Checkmark";
import Eye from "atd-icons/dist/Eye";
import TrendingUp from "atd-icons/dist/TrendingUp";
import Layers from "atd-icons/dist/Layers";
import ShieldCheckmark from "atd-icons/dist/ShieldCheckmark";
import Time from "atd-icons/dist/Time";
import HeartCircle from "atd-icons/dist/HeartCircle";
import Radio from "atd-icons/dist/Radio";
import Heart from "atd-icons/dist/Heart";
import DocumentText from "atd-icons/dist/DocumentText";
import Code from "atd-icons/dist/Code";
import Chatbubbles from "atd-icons/dist/Chatbubbles";
import Headset from "atd-icons/dist/Headset";
import AlertCircle from "atd-icons/dist/AlertCircle";
import Calendar from "atd-icons/dist/Calendar";
import People from "atd-icons/dist/People";
import Key from "atd-icons/dist/Key";
import Grid from "atd-icons/dist/Grid";
import Server from "atd-icons/dist/Server";
import Bulb from "atd-icons/dist/Bulb";
import Reader from "atd-icons/dist/Reader";
import SwapHorizontal from "atd-icons/dist/SwapHorizontal";
import Pencil from "atd-icons/dist/Pencil";
import PriceTag from "atd-icons/dist/PriceTag";
import Rocket from "atd-icons/dist/Rocket";
import Refresh from "atd-icons/dist/Refresh";
import PhonePortrait from "atd-icons/dist/PhonePortrait";
import Cart from "atd-icons/dist/Cart";
import Desktop from "atd-icons/dist/Desktop";
import Link from "atd-icons/dist/Link";
import Location from "atd-icons/dist/Location";
import School from "atd-icons/dist/School";
import Briefcase from "atd-icons/dist/Briefcase";

/** The icon set editors can pick from in Prismic ("Icon" select fields). */
export const sliceIcons = {
  check: Checkmark,
  eye: Eye,
  trend: TrendingUp,
  layers: Layers,
  shield: ShieldCheckmark,
  clock: Time,
  smile: HeartCircle,
  target: Radio,
  heart: Heart,
  document: DocumentText,
  code: Code,
  chat: Chatbubbles,
  support: Headset,
  alert: AlertCircle,
  calendar: Calendar,
  users: People,
  key: Key,
  grid: Grid,
  database: Server,
  sparkles: Bulb,
  form: Reader,
  flow: SwapHorizontal,
  pen: Pencil,
  tag: PriceTag,
  rocket: Rocket,
  refresh: Refresh,
  phone: PhonePortrait,
  cart: Cart,
  desktop: Desktop,
  link: Link,
  pin: Location,
  school: School,
  briefcase: Briefcase,
} as const;

export type SliceIconName = keyof typeof sliceIcons;

export default function SliceIcon({
  name,
  size = 22,
  className,
}: {
  name: string | null | undefined;
  size?: number;
  className?: string;
}) {
  const Icon = sliceIcons[(name ?? "check") as SliceIconName] ?? Checkmark;
  return <Icon size={size} className={className} aria-hidden />;
}

import {
  CreditCard,
  Currency,
  DollarSign,
  LucideIcon,
  Pickaxe,
  Shapes,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ArchiveRestore,
  BookCheck,
  BugOff,
  Building,
  Clipboard,
  Clock,
  Compass,
  Database,
  Flower,
  Flower2,
  Folder,
  FolderLock,
  Goal,
  Grid2X2,
  Hammer,
  House,
  Leaf,
  MessageCircle,
  MountainSnow,
  ScrollText,
  Section,
  SquareUserRound,
  Store,
  Trash,
  User,
  Users,
  Vegan,
} from "lucide-react";
export type SideBarItem = {
  title: string;
  icon: LucideIcon;
  href?: string;
};
export type SidebarWithChildren = SideBarItem & {
  items: SideBarItem[];
};

export const useSidebarItem = () => {
  const t = useTranslations("sidebar");

  const adminSidebar: SidebarWithChildren[] = [
    {
      icon: Vegan,
      items: [],
      title: t("crops"),
      href: "/admin/crops",
    },
    {
      icon: Goal,
      items: [],
      title: t("activities"),
      href: "/admin/activities",
    },
    {
      icon: DollarSign,
      items: [
        {
          icon: CreditCard,
          title: t("salaries"),
          href: "/admin/salaries",
        },
        {
          icon: Currency,
          title: t("material-cost"),
          href: "/admin/material-cost",
        },
        {
          icon: Pickaxe,
          title: t("equipment-cost"),
          href: "/admin/equipment-cost",
        },
        {
          icon: Shapes,
          title: t("sales"),
          href: "/admin/sales",
        },
      ],
      title: t("cost"),
    },
    {
      icon: Users,
      title: t("account"),
      items: [
        {
          icon: User,
          title: t("users"),
          href: "/admin/users",
        },
        {
          icon: SquareUserRound,
          title: t("staffs"),
          href: "/admin/staffs",
        },
        {
          icon: Building,
          title: t("organizations"),
          href: "/admin/organizations",
        },
        {
          icon: MessageCircle,
          title: t("messages"),
          href: "/admin/messages",
        },
      ],
    },
    {
      icon: House,
      title: t("farm"),
      items: [
        {
          icon: Grid2X2,
          title: t("fields"),
          href: "/admin/fields",
        },
        {
          icon: Flower2,
          title: t("plants"),
          href: "/admin/plants",
        },
        {
          icon: Leaf,
          title: t("fertilizers"),
          href: "/admin/fertilizers",
        },
        {
          icon: BugOff,
          title: t("pesticides"),
          href: "/admin/pesticides",
        },
      ],
    },
    {
      icon: Store,
      title: t("inventory"),
      items: [
        { icon: Database, title: t("materials"), href: "/admin/materials" },
        { icon: Hammer, title: t("equipments"), href: "/admin/equipments" },
      ],
    },
    {
      icon: Flower,
      title: t("catalogue"),
      items: [
        { icon: Section, title: t("categories"), href: "/admin/categories" },
        { icon: MountainSnow, title: t("units"), href: "/admin/units" },
      ],
    },
    {
      icon: Clipboard,
      title: t("recruit"),
      items: [
        { icon: Compass, title: t("jobs"), href: "/admin/jobs" },
        { icon: User, title: t("applicants"), href: "/admin/applicants" },
      ],
    },
    {
      icon: ScrollText,
      title: t("cron-job"),
      items: [
        { icon: BookCheck, title: t("tasks"), href: "/admin/tasks" },
        { icon: Clock, title: t("schedules"), href: "/admin/schedules" },
      ],
    },
    {
      icon: ArchiveRestore,
      title: t("storage"),
      items: [
        {
          icon: FolderLock,
          title: t("my-files"),
          href: "/admin/my-files",
        },
        {
          icon: Folder,
          title: t("public-files"),
          href: "/admin/public-files",
        },
        {
          icon: Trash,
          title: t("my-trash"),
          href: "/admin/my-trash",
        },
      ],
    },
  ];
  const farmerSidebar: SidebarWithChildren[] = [
    {
      icon: Goal,
      items: [],
      title: t("activities"),
      href: "/farmer/activities",
    },

    {
      icon: Building,
      title: t("organizations"),
      href: "/farmer/organizations",
      items: [],
    },
    {
      icon: DollarSign,
      title: t("salaries"),
      href: "/farmer/salaries",
      items: [],
    },
    {
      icon: MessageCircle,
      title: t("messages"),
      href: "/farmer/messages",
      items: [],
    },
    {
      icon: House,
      title: t("farm"),
      items: [
        {
          icon: Grid2X2,
          title: t("fields"),
          href: "/farmer/fields",
        },
        {
          icon: Flower2,
          title: t("plants"),
          href: "/farmer/plants",
        },
        {
          icon: Leaf,
          title: t("fertilizers"),
          href: "/farmer/fertilizers",
        },
        {
          icon: BugOff,
          title: t("pesticides"),
          href: "/farmer/pesticides",
        },
      ],
    },
    {
      icon: Store,
      title: t("inventory"),
      items: [
        { icon: Database, title: t("materials"), href: "/farmer/materials" },
        { icon: Hammer, title: t("equipments"), href: "/farmer/equipments" },
      ],
    },

    {
      icon: ArchiveRestore,
      title: t("storage"),
      items: [
        {
          icon: FolderLock,
          title: t("my-files"),
          href: "/farmer/my-files",
        },
        {
          icon: Folder,
          title: t("public-files"),
          href: "/farmer/public-files",
        },
        {
          icon: Trash,
          title: t("my-trash"),
          href: "/farmer/my-trash",
        },
      ],
    },
  ];

  return {
    adminSidebar,
    farmerSidebar,
  };
};

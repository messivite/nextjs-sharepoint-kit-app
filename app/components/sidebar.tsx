"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Flex, Text, ScrollArea } from "@radix-ui/themes";
import {
  ListBulletIcon,
  FileTextIcon,
  DashboardIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <DashboardIcon width={16} height={16} />,
  },
  {
    label: "Listeler",
    href: "#",
    icon: <ListBulletIcon width={16} height={16} />,
    children: [
      {
        label: "Faturalar",
        href: "/listeler/faturalar",
        icon: <FileTextIcon width={16} height={16} />,
      },
    ],
  },
];

function NavLink({
  item,
  depth = 0,
}: {
  item: NavItem;
  depth?: number;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <>
      <Box>
        {item.href === "#" ? (
          <Flex
            align="center"
            gap="2"
            py="1"
            px="3"
            style={{
              paddingLeft: `calc(12px + ${depth * 16}px)`,
              color: "var(--gray-11)",
              fontSize: "var(--font-size-1)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginTop: depth === 0 ? 16 : 0,
            }}
          >
            {item.icon}
            <Text size="1" weight="bold">
              {item.label}
            </Text>
            {hasChildren && (
              <ChevronRightIcon
                width={12}
                height={12}
                style={{
                  marginLeft: "auto",
                  transform: "rotate(90deg)",
                }}
              />
            )}
          </Flex>
        ) : (
          <Link href={item.href} style={{ textDecoration: "none" }}>
            <Flex
              align="center"
              gap="2"
              py="2"
              px="3"
              style={{
                paddingLeft: `calc(12px + ${depth * 16}px)`,
                borderRadius: "var(--radius-2)",
                margin: "0 8px",
                cursor: "pointer",
                background: isActive ? "var(--accent-3)" : "transparent",
                color: isActive ? "var(--accent-11)" : "var(--gray-12)",
                fontWeight: isActive ? 600 : 400,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--gray-3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {item.icon}
              <Text size="2">{item.label}</Text>
            </Flex>
          </Link>
        )}
      </Box>
      {hasChildren &&
        item.children!.map((child) => (
          <NavLink key={child.href} item={child} depth={depth + 1} />
        ))}
    </>
  );
}

export function Sidebar() {
  return (
    <Box
      asChild
      style={{
        width: 240,
        minWidth: 240,
        height: "100%",
        borderRight: "1px solid var(--gray-a4)",
        background: "var(--color-background)",
      }}
    >
      <nav>
        <ScrollArea style={{ height: "100%" }}>
          <Flex direction="column" gap="1" py="3">
            {navItems.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </Flex>
        </ScrollArea>
      </nav>
    </Box>
  );
}

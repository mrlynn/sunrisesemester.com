"use client";

import * as React from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import { usePathname } from "next/navigation";

export default function MemberAccountButton({ mobile = false, onNavigate }) {
  const pathname = usePathname();
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/member/session")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSession(data);
      })
      .catch(() => {
        if (!cancelled) setSession({ authenticated: false });
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const href = session?.authenticated ? "/member/settings" : "/member";
  const label = session?.authenticated ? "My profile" : "Member account";

  function handleClick() {
    onNavigate?.();
  }

  if (mobile) {
    return (
      <Button
        component={Link}
        href={href}
        fullWidth
        variant={session?.authenticated ? "contained" : "outlined"}
        onClick={handleClick}
        sx={{
          mx: 2,
          mb: 1,
          fontWeight: 700,
          ...(session?.authenticated
            ? {}
            : { borderColor: "#ff6b35", color: "#ff6b35" }),
        }}
      >
        {label}
      </Button>
    );
  }

  return (
    <Button
      component={Link}
      href={href}
      variant={session?.authenticated ? "contained" : "outlined"}
      size="small"
      sx={{
        fontWeight: 700,
        whiteSpace: "nowrap",
        borderColor: session?.authenticated ? undefined : "#ff6b35",
        color: session?.authenticated ? undefined : "#ff6b35",
        "&:hover": session?.authenticated
          ? undefined
          : { borderColor: "#ff5a1f", color: "#ff5a1f", bgcolor: "rgba(255,107,53,0.06)" },
      }}
    >
      {label}
    </Button>
  );
}

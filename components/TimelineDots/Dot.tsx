import { Box, Popover } from "@mantine/core";
import { ReactNode } from "react";

type DotProps = {
  dotSize: number;
  color: string;
  opacity?: number;
  tooltip?: ReactNode;
};

export const Dot = ({ dotSize, color, opacity = 1, tooltip }: DotProps) => {
  return (
    <Popover width={300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Box
          w={`${dotSize}px`}
          h={`${dotSize}px`}
          sx={{
            backgroundColor: color,
            borderRadius: `${dotSize}px`,
            opacity,
            cursor: "pointer",
          }}
        />
      </Popover.Target>
      <Popover.Dropdown>{tooltip ?? "Tooltip area"}</Popover.Dropdown>
    </Popover>
  );
};

import { Box, Popover } from "@mantine/core";

type DotProps = {
  dotSize: number;
  color: string;
  opacity?: number;
};

export const Dot = ({ dotSize, color, opacity = 1 }: DotProps) => {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
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
      <Popover.Dropdown>
        This is uncontrolled popover, it is opened when button is clicked
      </Popover.Dropdown>
    </Popover>
  );
};

import { Box } from "@mantine/core";

type DotProps = {
  dotSize: number;
  color: string;
  opacity?: number;
};

export const Dot = ({ dotSize, color, opacity = 1 }: DotProps) => {
  return (
    <Box
      w={`${dotSize}px`}
      h={`${dotSize}px`}
      sx={{ backgroundColor: color, borderRadius: `${dotSize}px`, opacity }}
    />
  );
};

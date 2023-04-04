import { Box } from "@mantine/core";

type DotProps = {
  dotSize: number;
  color: string;
};

export const Dot = ({ dotSize, color }: DotProps) => {
  return (
    <Box
      w={`${dotSize}px`}
      h={`${dotSize}px`}
      sx={{ backgroundColor: color, borderRadius: `${dotSize}px` }}
    />
  );
};

import { Box } from "@mantine/core";

type LineProps = {
  width: string | number;
  color: string;
  opacity?: number;
};

export const Line = ({ width, color, opacity = 1 }: LineProps) => {
  return (
    <Box
      h="4px"
      w={width}
      sx={{
        backgroundColor: color,
        opacity,
      }}
    />
  );
};

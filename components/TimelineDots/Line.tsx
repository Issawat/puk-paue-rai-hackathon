import { Box } from "@mantine/core";

type LineProps = {
  width: string | number;
  color: string;
};

export const Line = ({ width, color }: LineProps) => {
  return (
    <Box
      h="4px"
      w={width}
      sx={{
        backgroundColor: color,
      }}
    />
  );
};

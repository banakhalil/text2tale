import { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";

interface Props {
  text: string;
  lines?: number;
}

const ExpandableText = ({ text, lines = 3 }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <Text
        fontSize="sm"
        whiteSpace="pre-wrap"
        overflow="hidden"
        display={expanded ? "block" : "-webkit-box"}
        style={
          expanded
            ? undefined
            : { WebkitLineClamp: lines, WebkitBoxOrient: "vertical" }
        }
      >
        {text}
      </Text>
      <Button
        size="2xs"
        variant="ghost"
        px={0}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Show less" : "Show more"}
      </Button>
    </Box>
  );
};

export default ExpandableText;

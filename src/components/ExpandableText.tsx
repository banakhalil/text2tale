import { useLayoutEffect, useRef, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";

interface Props {
  text: string;
  lines?: number;
}

const ExpandableText = ({ text, lines = 3 }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    }
  }, [text, lines]);

  return (
    <Box>
      <Text
        ref={textRef}
        dir="rtl"
        textAlign="right"
        fontSize="md"
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
      {isOverflowing && (
        <Button
          size="sm"
          fontSize="sm"
          variant="ghost"
          px={0}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </Box>
  );
};

export default ExpandableText;

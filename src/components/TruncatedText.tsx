import { Text } from "@chakra-ui/react";

interface Props {
  text: string;
  lines?: number;
  fontSize?: string;
}

const TruncatedText = ({ text, lines = 3, fontSize = "md" }: Props) => (
  <Text
    dir="rtl"
    textAlign="right"
    fontSize={fontSize}
    whiteSpace="pre-wrap"
    overflow="hidden"
    display="-webkit-box"
    style={{ WebkitLineClamp: lines, WebkitBoxOrient: "vertical" }}
  >
    {text}
  </Text>
);

export default TruncatedText;

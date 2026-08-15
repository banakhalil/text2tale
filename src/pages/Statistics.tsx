import {
  Box,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { BarSegment, Chart, useChart } from "@chakra-ui/charts";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import {
  useRatingsStats,
  useStoriesStats,
  useTopUsersStats,
  type SubjectRating,
} from "@/hooks/useStatistics";

const SUBJECT_COLORS = ["#164b9a", "#a5c1e3", "#113d7f", "#5a9ade", "#68affa"];
const USER_COLORS = ["#009688", "#a0c5c2", "#00585a", "#b2dfdb", "#034041"];
const RATING_COLORS: Record<string, string> = {
  "1": "#c0392b",
  "2": "#e67e22",
  "3": "#f1c40f",
  "4": "#7fb069",
  "5": "#009688",
};
const RATING_STARS = ["1", "2", "3", "4", "5"] as const;

const DONUT_CARD_HEIGHT = "300px";
const RATINGS_ROW_COUNT_WHILE_LOADING = 3;
const RATINGS_CARD_MIN_HEIGHT = "320px";

const DonutCard = ({
  title,
  data,
  totalLabel,
}: {
  title: string;
  data: { name: string; value: number; color: string }[];
  totalLabel: string;
}) => {
  const chart = useChart({ data });
  const total = chart.data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box
      className="card"
      p={4}
      pb={8}
      borderRadius="2xl"
      height={DONUT_CARD_HEIGHT}
    >
      <Text fontWeight="semibold" fontSize="xl" mb={6}>
        {title}
      </Text>
      <HStack gap={12} align="flex-start">
        <Box position="relative" width="150px" height="150px" flexShrink={0}>
          <Chart.Root boxSize="150px" chart={chart} bg="transparent">
            <PieChart style={{ backgroundColor: "transparent" }}>
              <Tooltip
                cursor={false}
                animationDuration={100}
                content={<Chart.Tooltip hideLabel />}
              />
              <Pie
                innerRadius={55}
                outerRadius={70}
                isAnimationActive
                data={chart.data}
                dataKey={chart.key("value")}
                paddingAngle={8}
                cornerRadius={4}
                label={false}
                stroke="none"
              >
                {chart.data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </Chart.Root>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
          >
            <Text fontSize="xl" fontWeight="bold">
              {total}
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              {totalLabel}
            </Text>
          </Box>
        </Box>
        <Box flex="1">
          {chart.data.map((item) => (
            <HStack key={item.name} mb={2} gap={3}>
              <Box
                w="12px"
                h="12px"
                borderRadius="sm"
                bg={item.color}
                flexShrink={0}
              />
              <Text
                fontSize="sm"
                fontWeight="medium"
                textTransform="capitalize"
              >
                {item.name}
              </Text>
              <Text fontSize="sm" fontWeight="bold" ml="auto">
                {item.value}
              </Text>
            </HStack>
          ))}
        </Box>
      </HStack>
    </Box>
  );
};

const DonutCardSkeleton = ({ title }: { title: string }) => (
  <Box
    className="card"
    p={4}
    pb={8}
    borderRadius="2xl"
    height={DONUT_CARD_HEIGHT}
  >
    <Text fontWeight="semibold" fontSize="xl" mb={6}>
      {title}
    </Text>
    <HStack gap={20} align="flex-start" marginLeft="6">
      <SkeletonCircle size="180px" flexShrink={0} />
      <Box flex="1" marginTop="12">
        {Array.from({ length: 3 }).map((_, i) => (
          <HStack key={i} mb={3} gap={3}>
            <Skeleton w="12px" h="12px" borderRadius="sm" flexShrink={0} />
            <SkeletonText noOfLines={1} width="60%" />
          </HStack>
        ))}
      </Box>
    </HStack>
  </Box>
);

const SubjectRatingBar = ({ subject }: { subject: SubjectRating }) => {
  const data = RATING_STARS.map((star) => ({
    name: `${star} star`,
    value: subject.ratings[star] ?? 0,
    color: RATING_COLORS[star],
  }));
  const chart = useChart({ data });

  return (
    <Box mb={5}>
      <Text fontWeight="medium" mb={2} textTransform="capitalize">
        {subject.name} ({subject.total_stories} stories)
      </Text>
      <BarSegment.Root chart={chart}>
        <BarSegment.Content>
          <BarSegment.Bar tooltip animation="ease-in" animationDuration="1s" />
        </BarSegment.Content>
      </BarSegment.Root>
    </Box>
  );
};

const SubjectRatingBarSkeleton = () => (
  <Box mb={5}>
    <SkeletonText noOfLines={1} width="30%" mb={2} />
    <Skeleton height="24px" width="100%" borderRadius="md" />
  </Box>
);

const Statistics = () => {
  const { data: storiesStats, isLoading: storiesLoading } = useStoriesStats();
  const { data: topUsers, isLoading: usersLoading } = useTopUsersStats();
  const { data: subjectRatings, isLoading: ratingsLoading } = useRatingsStats();

  const storiesPieData = Object.entries(
    storiesStats?.stories_by_subject ?? {},
  ).map(([name, value], index) => ({
    name,
    value,
    color: SUBJECT_COLORS[index % SUBJECT_COLORS.length],
  }));

  const usersPieData = (topUsers ?? []).map((user, index) => ({
    name: `${user.first_name} ${user.last_name}`,
    value: user.total_first_stories,
    color: USER_COLORS[index % USER_COLORS.length],
  }));

  return (
    <>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap={4}
        mb={4}
      >
        <GridItem>
          {storiesLoading ? (
            <DonutCardSkeleton title="Stories by Subject" />
          ) : (
            <DonutCard
              title="Stories by Subject"
              data={storiesPieData}
              totalLabel="Total Stories"
            />
          )}
        </GridItem>
        <GridItem>
          {usersLoading ? (
            <DonutCardSkeleton title="Top Users" />
          ) : (
            <DonutCard
              title="Top Users"
              data={usersPieData}
              totalLabel="First Stories"
            />
          )}
        </GridItem>
      </Grid>

      <Box
        className="card"
        p={4}
        borderRadius="2xl"
        minH={RATINGS_CARD_MIN_HEIGHT}
        display="flex"
        flexDirection="column"
      >
        <Text fontWeight="semibold" fontSize="xl" mb={6}>
          Ratings by Subject
        </Text>
        <Box flex="1">
          {ratingsLoading
            ? Array.from({ length: RATINGS_ROW_COUNT_WHILE_LOADING }).map(
                (_, i) => <SubjectRatingBarSkeleton key={i} />,
              )
            : (subjectRatings ?? []).map((subject) => (
                <SubjectRatingBar key={subject.name} subject={subject} />
              ))}
        </Box>
        <HStack gap={4} mt="auto" pt={4}>
          {RATING_STARS.map((star) => (
            <HStack key={star} gap={2}>
              <Box
                w="12px"
                h="12px"
                borderRadius="sm"
                bg={RATING_COLORS[star]}
              />
              <Text fontSize="sm">{star} star</Text>
            </HStack>
          ))}
        </HStack>
      </Box>
    </>
  );
};

export default Statistics;

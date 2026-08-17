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
import { Pie, PieChart, Sector, Tooltip } from "recharts";
import {
  useRatingsStats,
  useStoriesStats,
  useTopUsersStats,
  type SubjectRating,
} from "@/hooks/useStatistics";
import { STAR_GRADIENT } from "@/lib/starColors";

const SUBJECT_COLORS = ["#1944a0", "#c3b8f8", "#2cbbaa", "#7ea0e0", "#7fdccd"];
const USER_COLORS = ["#2cbbaa", "#c3b8f8", "#1944a0", "#7fdccd", "#aea2e2"];
const RATING_STARS = ["1", "2", "3", "4", "5"] as const;
const RATING_COLORS: Record<string, string> = {
  "1": STAR_GRADIENT[0],
  "2": STAR_GRADIENT[1],
  "3": STAR_GRADIENT[2],
  "4": STAR_GRADIENT[3],
  "5": STAR_GRADIENT[4],
};

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
      <Text
        fontWeight="medium"
        fontSize="xl"
        color="gray.700"
        _dark={{ color: "gray.300" }}
        mb={6}
      >
        {title}
      </Text>
      <Grid templateColumns="150px 1fr" gap={36} alignItems="flex-start">
        <Box
          position="relative"
          width="150px"
          height="150px"
          marginLeft={10}
          marginTop={4}
        >
          <Chart.Root boxSize="150px" chart={chart} bg="transparent">
            <PieChart responsive style={{ backgroundColor: "transparent" }}>
              <Tooltip
                cursor={false}
                animationDuration={100}
                content={<Chart.Tooltip hideLabel />}
                wrapperStyle={{ zIndex: 20 }}
              />
              <Pie
                innerRadius={75}
                outerRadius={90}
                isAnimationActive
                data={chart.data}
                dataKey={chart.key("value")}
                paddingAngle={8}
                cornerRadius={4}
                label={false}
                stroke="none"
                shape={(props: any) => (
                  <Sector {...props} fill={chart.color(props.payload!.color)} />
                )}
              />
            </PieChart>
          </Chart.Root>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
            zIndex={1}
            pointerEvents="none"
          >
            <Text fontSize="xl" fontWeight="bold">
              {total}
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              {totalLabel}
            </Text>
          </Box>
        </Box>
        <Box marginTop={6}>
          {chart.data.map((item, index) => (
            <HStack key={`${item.name}-${index}`} mb={2} gap={2}>
              <Box
                w="12px"
                h="12px"
                borderRadius="sm"
                bg={item.color}
                flexShrink={0}
              />
              <Text
                fontSize="md"
                fontWeight="normal"
                color="gray.700"
                _dark={{ color: "gray.300" }}
                textTransform="capitalize"
              >
                {item.name}
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                {item.value}
              </Text>
            </HStack>
          ))}
        </Box>
      </Grid>
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
    name: "★".repeat(Number(star)),
    value: subject.ratings[star] ?? 0,
    color: RATING_COLORS[star],
  }));
  const chart = useChart({ data });

  return (
    <Box>
      <Text fontWeight="medium" mb={2} textTransform="capitalize">
        {subject.name} ({subject.total_stories} stories)
      </Text>
      <BarSegment.Root chart={chart}>
        <BarSegment.Content>
          <BarSegment.Bar
            animation="ease-in"
            animationDuration="1s"
            tooltip={({ payload }: { payload: { name: string; value: number; color: string } }) => {
              if (chart.highlightedSeries !== payload.name) return null;
              return (
                <HStack
                  position="absolute"
                  top="-4"
                  right="4"
                  bg="bg.panel"
                  textStyle="xs"
                  zIndex={1}
                  px="2.5"
                  py="1"
                  gap="1.5"
                  rounded="l2"
                  shadow="md"
                >
                  <Text color={payload.color} fontWeight="bold">
                    {payload.name}
                  </Text>
                  <Text fontFamily="mono" fontWeight="medium">
                    {payload.value}
                  </Text>
                </HStack>
              );
            }}
          />
        </BarSegment.Content>
      </BarSegment.Root>
    </Box>
  );
};

const SubjectRatingBarSkeleton = () => (
  <Box>
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
        <Text
          fontWeight="medium"
          fontSize="xl"
          color="gray.700"
          _dark={{ color: "gray.300" }}
          mb={4}
        >
          Ratings by Subject
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5} flex="1">
          {ratingsLoading
            ? Array.from({ length: RATINGS_ROW_COUNT_WHILE_LOADING }).map(
                (_, i) => <SubjectRatingBarSkeleton key={i} />,
              )
            : (subjectRatings ?? []).map((subject) => (
                <SubjectRatingBar key={subject.name} subject={subject} />
              ))}
        </Grid>
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

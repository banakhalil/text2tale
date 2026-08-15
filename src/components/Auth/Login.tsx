import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
// TEMP: real request bypassed until backend CORS is deployed — see authService.ts
// import { login } from "@/services/authService";
import { mockLogin as login } from "@/services/authService";
import { toaster } from "@/components/ui/toaster";
import studyBg from "@/assets/study1.jpg";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { accessToken, refreshToken, user } = await login({
        email,
        password,
      });
      setAuthData(accessToken, refreshToken, user);

      toaster.create({
        title: "Logged in",
        description: `Welcome back, ${user.email}`,
        type: "success",
        duration: 3000,
        closable: true,
      });

      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? (err.response?.data?.message ?? "Login failed")
          : err instanceof Error
            ? err.message
            : "Login failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      justifyContent="center"
      alignItems="end"
      maxW="full"
      centerContent
      minH="100vh"
      position="relative"
      overflow="hidden"
      p={0}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${studyBg})`}
        bgSize="cover"
        backgroundPosition="center"
        filter="brightness(0.75)"
        _dark={{ filter: "brightness(0.5)" }}
        zIndex={0}
      />

      <Box
        position="absolute"
        top="32%"
        left="8%"
        right={0}
        bottom={0}
        zIndex={1}
      >
        <Text
          fontSize="6xl"
          fontWeight="bold"
          mb={4}
          color="rgb(245, 244, 244)"
          className="font-bebas-neue"
          letterSpacing="wide"
        >
          text2tale
        </Text>
        <Text
          fontSize="4xl"
          fontWeight="medium"
          color="rgb(245, 244, 244)"
          className="font-bebas-neue"
          letterSpacing="wide"
        >
          Turn any lesson into a story
        </Text>
      </Box>

      <Flex
        mr={{ base: 0, lg: 20 }}
        w="full"
        maxW="md"
        minH="455px"
        bg="whiteAlpha.400"
        position="relative"
        zIndex={1}
        _dark={{ bg: "blackAlpha.500" }}
        backdropFilter="blur(15px)"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="xl"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Box p={8} flex="1" minW="min(100%, 28rem)" mx="auto">
          <Text
            fontSize="2xl"
            my={6}
            textAlign="center"
            className="font-oswald"
            letterSpacing="wide"
            color="whiteAlpha.900"
          >
            Admin Dashboard Login
          </Text>

          {error && (
            <Box mb={4} p={3} bg="red.50" color="red.600" borderRadius="md">
              <Text fontSize="sm">{error}</Text>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap={6}>
              <Box>
                <Text mb={4} className="font-oswald" color="whiteAlpha.800">
                  Email
                </Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@admin.com"
                  color="whiteAlpha.900"
                  borderColor="whiteAlpha.700"
                  _placeholder={{ color: "whiteAlpha.700" }}
                  required
                />
              </Box>

              <Box>
                <Text mb={4} className="font-oswald" color="whiteAlpha.800">
                  Password
                </Text>
                <Box position="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    color="whiteAlpha.900"
                    borderColor="whiteAlpha.700"
                    _placeholder={{ color: "whiteAlpha.700" }}
                    pr="10"
                    required
                  />
                  <IconButton
                    position="absolute"
                    right="1"
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    size="sm"
                    color="whiteAlpha.800"
                    _hover={{ bg: "transparent" }}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </Box>
              </Box>

              <Button
                type="submit"
                className="font-oswald"
                w="full"
                loading={isLoading}
                my={4}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Flex>
    </Container>
  );
};

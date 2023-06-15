import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";

//@mui
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Grid,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
// import PlaceIcon from "@mui/icons-material/Place";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

import { Carousel, Spin, message } from "antd";

import Header from "../../components/Header/header";

const StyledBox1 = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("lg")]: {
    width: "80%",
    //borderRight: "1px solid #bbb",
  },
}));

const StyledBox2 = styled(Box)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("lg")]: {
    width: "20%",
    display: "block",
  },
}));

//types
interface box {
  id: string;
  boxCricketName: string;
  boxCricketCity: string;
  boxCricketArea: string;
  boxCricketImages: any[];
  minSlotPrice: number;
  maxSlotPrice: number;
}

export default function Home() {
  const [boxCrickets, setBoxCrickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  //get all box crickets
  useEffect(() => {
    const fetchBoxCrickets = async () => {
      try {
        //setLoading(true);
        const response = await fetch("/api/BoxCricket/getAllBoxCrickets");
        const result = await response.json();
        if (result.status === 200) {
          setBoxCrickets(result.boxCrickets);
        } else {
          message.info("Please try again");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        message.error("something went wrong");
      }
    };
    fetchBoxCrickets();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>All Box Crickets</title>
      </Head>

      <Header />

      <Stack
        sx={{
          minHeight: `calc(100vh - 64px)`,
          marginTop: "64px",
          width: "100%",
          minWidth: "450px",
          overflowX: "auto",
          padding: { xs: ".5rem", md: "2rem" },
          backgroundColor: "rgb(249, 250, 251)",
        }}
      >
        <Grid
          container
          sx={{ padding: "1rem", mb: "1rem", borderBottom: "1px solid #bbb" }}
        >
          <Grid item xs={12}>
            <Card>
              <Stack alignItems="end">
                <TextField
                  placeholder="search box cricket near you"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <Stack direction="row" gap={2}>
          <StyledBox1>
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xs={12}>
                <Typography variant="h5">Box Crickets</Typography>
              </Grid>

              {boxCrickets.map((box: box) => (
                <Grid item xs={12} key={box.id}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{ border: "1px solid #bbb", height: "200px" }}
                          >
                            <Carousel autoplay style={{ position: "relative" }}>
                              {box.boxCricketImages.map(
                                (image: string, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      position: "relative",
                                      width: "100%",
                                      height: "200px",
                                    }}
                                  >
                                    <Image
                                      src={image}
                                      alt="boxCricket Image"
                                      width={200}
                                      height={200}
                                      style={{
                                        width: "100%",
                                        height: "200px",
                                      }}
                                    />
                                  </div>
                                )
                              )}
                            </Carousel>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Stack
                            sx={{ border: "1px solid #bbb", height: "200px" }}
                            gap={2}
                          >
                            <Typography
                              sx={{
                                borderBottom: "1px solid #bbb",
                                paddingX: "1rem",
                                paddingY: ".5rem",
                              }}
                              variant="h6"
                            >
                              {box.boxCricketName}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }}>
                              <Stack
                                direction={{ xs: "row" }}
                                sx={{
                                  paddingX: "1rem",
                                  paddingY: ".5rem",
                                  flexGrow: 1,
                                }}
                              >
                                <Typography>
                                  <b>Address</b>
                                </Typography>
                                <Typography sx={{ ml: 1 }}>
                                  {box.boxCricketArea}({box.boxCricketCity})
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                alignItems="center"
                                sx={{ paddingX: "1rem" }}
                              >
                                <Typography>
                                  <b>Price range</b>
                                </Typography>

                                <Typography sx={{ ml: 1 }}>
                                  {box.minSlotPrice} - {box.maxSlotPrice}/hr
                                </Typography>
                              </Stack>
                            </Box>

                            <Stack
                              direction={{ xs: "row" }}
                              justifyContent="flex-end"
                              sx={{
                                //border: "1px solid",
                                padding: ".5rem 1rem",
                              }}
                            >
                              <Button
                                onClick={() =>
                                  router.push(`/boxCricket/${box.id}`)
                                }
                                variant="outlined"
                              >
                                Book Now
                              </Button>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </StyledBox1>

          {/* <StyledBox2>
            <Grid container sx={{ padding: "1rem" }}>
              <Grid item>
                <Card>Hi</Card>
              </Grid>
            </Grid>
          </StyledBox2> */}
        </Stack>
      </Stack>
    </>
  );
}

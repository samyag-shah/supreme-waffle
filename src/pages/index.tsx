import React, { useEffect, useState } from "react";
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
  Container,
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
          minWidth: "350px",
          overflowX: "auto",
          // border: "1px solid",
          padding: { xs: "0rem", sm: "1.5rem" },
          backgroundColor: "rgb(249, 250, 251)",
          //backgroundImage: "url(`${/public/header_image.jpeg}`)",
        }}
      >
        <Box
          sx={{
            //border: "1px solid",
            padding: "1rem",
            mb: "1rem",
            borderBottom: "1px solid #bbb",
          }}
        >
          <Card>
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
          </Card>
        </Box>

        <Stack direction="row" gap={2} sx={{ border: "1px solid" }}>
          <StyledBox1>
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xs={12}>
                <Typography variant="h5">All Box Crickets</Typography>
              </Grid>

              {boxCrickets.map((box: box) => (
                <Grid item xs={12} key={box.id}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={5} md={4}>
                          <Box
                            sx={{
                              border: "1px solid #bbb",
                              height: { md: "220px", xs: "250px" },
                            }}
                          >
                            <Carousel autoplay style={{ position: "relative" }}>
                              {box.boxCricketImages.map(
                                (image: string, index) => (
                                  <React.Fragment key={index}>
                                    {/* <Image
                                      src={image}
                                      alt="boxCricket Image"
                                      width={200}
                                      height={200}
                                      style={{
                                        width: "100%",
                                        height: "220px",
                                      }}
                                    /> */}
                                  </React.Fragment>
                                )
                              )}
                            </Carousel>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={7} md={8}>
                          <Stack
                            sx={{
                              border: "1px solid #bbb",
                              height: { md: "220px", xs: "250px" },
                            }}
                            //gap={1}
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
                                //direction={{ xs: "row" }}
                                sx={{
                                  paddingX: "1rem",
                                  paddingY: ".5rem",
                                  flexGrow: 1,
                                }}
                              >
                                <Typography fontWeight={600}>
                                  Address
                                </Typography>
                                <Typography>
                                  {box.boxCricketArea}({box.boxCricketCity})
                                  {/* 64 kamal duplex opp. neel sagar tenaments
                                  kathawada road naroda ahemdabad */}
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                alignItems="center"
                                sx={{ paddingX: "1rem" }}
                              >
                                <Typography>
                                  <b>Price range:</b>
                                </Typography>

                                <Typography sx={{ ml: 1 }}>
                                  {box.minSlotPrice}-{box.maxSlotPrice}/hr
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
                                sx={{
                                  width: { xs: "100%", sm: "50%", md: "25%" },
                                }}
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

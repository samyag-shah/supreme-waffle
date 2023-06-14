import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Divider,
  Button,
  Typography,
  Box,
  Grid,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Carousel, Spin, message } from "antd";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
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

export default function Home() {
  const [boxCrickets, setBoxCrickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchBoxCrickets = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/boxCricket/getAllBoxCrickets");
        const result = await response.json();
        setLoading(false);
        //console.log({ result });
        if (result.status === 200) {
          setBoxCrickets(result.boxCrickets);
        } else {
          message.info("Please try again");
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        message.error("something went wrong");
      }
    };
    fetchBoxCrickets();
  }, []);

  if (loading) {
    return <Spin tip="Loading" size="small" />;
  }

  console.log({ boxCrickets });
  return (
    <>
      <Header />

      <Stack
        sx={{
          //border: "1px solid",
          minHeight: `calc(100vh - 64px)`,
          marginTop: "64px",
          width: "100%",
          minWidth: "450px",
          overflowX: "auto",
          padding: "2rem",
          backgroundColor: "rgb(249, 250, 251)",
        }}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Grid
          container
          sx={{ padding: "1rem", mb: "1rem", borderBottom: "1px solid #bbb" }}
        >
          <Grid item xs={12}>
            <Card>
              <Stack alignItems="end">
                <TextField
                  //variant="standard"
                  placeholder="search box cricket near you"
                  sx={{ width: "300px" }}
                  //fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
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

              {boxCrickets.map(
                (box: {
                  id: string;
                  boxCricketName: string;
                  boxCricketCity: string;
                  boxCricketArea: string;
                  boxCricketImages: any[];
                  minSlotPrice: number;
                  maxSlotPrice: number;
                }) => (
                  <Grid item xs={12} key={box.id}>
                    <Card>
                      <CardContent>
                        <Grid
                          container
                          spacing={2}
                          //sx={{ border: "1px solid" }}
                        >
                          <Grid item xs={12} sm={4}>
                            <Box
                              sx={{ border: "1px solid #bbb", height: "200px" }}
                            >
                              {/* <Carousel autoplay>
                                {box.boxCricketImages.map(
                                  (image: string, index) => (
                                    <div
                                      key={index}
                                      style={{ width: "100%", height: "200px" }}
                                    >
                                      <img
                                        width={"100%"}
                                        height={"200px"}
                                        //height={"225px"}
                                        alt="image"
                                        src={image}
                                      />
                                    </div>
                                  )
                                )}
                              </Carousel> */}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={8}>
                            <Stack
                              sx={{ border: "1px solid #bbb", height: "200px" }}
                              justifyContent="space-between"
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

                              <Stack
                                direction={{ xs: "row" }}
                                sx={{
                                  //borderBottom: "1px solid",
                                  padding: "0 .5rem",
                                }}
                              >
                                <PlaceIcon />
                                <Typography
                                // sx={{ textAlign: "right", border: "1px solid" }}
                                >
                                  {box.boxCricketCity}({box.boxCricketArea})
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ padding: ".5rem" }}
                              >
                                <Stack direction={{ xs: "row" }}>
                                  <CurrencyRupeeIcon />{" "}
                                  <Typography>
                                    {box.minSlotPrice} - {box.maxSlotPrice}/hr
                                  </Typography>
                                </Stack>

                                <Stack
                                  direction={{ xs: "row" }}
                                  justifyContent="flex-end"
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
                            </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              )}
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

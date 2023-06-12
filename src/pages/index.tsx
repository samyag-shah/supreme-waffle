import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Grid,
  CardMedia,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PlaceIcon from "@mui/icons-material/Place";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { Carousel } from "antd";
import { useRouter } from "next/router";

const navItems = ["Signup", "Signin"];

const contentStyle: React.CSSProperties = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export default function Home() {
  const [boxCrickets, setBoxCrickets] = useState([]);
  const [boxCricketImage, setBoxCricketImage] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBoxCrickets = async () => {
      const response = await fetch("/api/BoxCricket/getAllBoxCrickets");
      const result = await response.json();
      console.log({ result });
      if (result.boxCrickets.length) {
        setBoxCrickets(result.boxCrickets);
        setBoxCricketImage(result.boxCrickets[0].boxCricketImages);
      } else {
        setBoxCrickets([]);
      }
    };
    fetchBoxCrickets();
  }, []);

  console.log({ boxCrickets });
  return (
    <>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            //onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Box Cricket
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          border: "1px solid",
          minHeight: `calc(100vh - 64px)`,
          marginTop: "84px",
        }}
      >
        <Container maxWidth="lg" sx={{ padding: "2rem 0" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ margin: "auto" }}>
              <Typography variant={"h5"}>All BoxCrickets</Typography>
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
                <Grid item xs={6} key={box.id}>
                  <Card sx={{ minWidth: 275 }}>
                    {/* <CardMedia
                      sx={{ height: 250 }}
                      image={`/api/images/${boxCricketImage}`}
                      title="green iguana"
                    /> */}
                    <Carousel autoplay>
                      {box.boxCricketImages.map((image: string, index) => (
                        <div
                          key={index}
                          style={{ width: "100%", height: "400px" }}
                        >
                          {/* <h3 style={contentStyle}>1</h3> */}
                          <img
                            //style={contentStyle}
                            width="100%"
                            height="250px"
                            //src={`/api/images/${image}`}
                            src={image}
                          />
                        </div>
                      ))}
                    </Carousel>

                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="h5">
                            {box.boxCricketName}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Stack direction={{ xs: "row" }}>
                            <CurrencyRupeeIcon />{" "}
                            <Typography>
                              {box.minSlotPrice} - {box.maxSlotPrice}/hr
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={6} sx={{ justifyContent: "flex-end" }}>
                          <Stack
                            direction={{ xs: "row" }}
                            // sx={{ textAlign: "right", border: "1px solid" }}
                          >
                            <PlaceIcon />
                            <Typography
                            // sx={{ textAlign: "right", border: "1px solid" }}
                            >
                              {box.boxCricketCity}({box.boxCricketArea})
                            </Typography>
                          </Stack>
                        </Grid>
                        {/* <Grid item xs={4} sx={{ textAlign: "right" }}>
                          <Typography>
                            Facilities: {box.boxCricketAddress}
                          </Typography>
                        </Grid> */}
                        <Grid item xs={12}>
                          <Button
                            sx={{ padding: ".5rem" }}
                            fullWidth
                            variant="contained"
                            size="small"
                            onClick={() => router.push(`/boxCricket/${box.id}`)}
                          >
                            Book now
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {/* <CardActions> */}

                    {/* </CardActions> */}
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box>

      {/* <Box>
        <Container
          maxWidth="xs"
          sx={{
            position: "absolute",
            marginTop: "84px",
            top: "0",
            right: 0,
            padding: "2rem 0",
            border: "1px solid",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Search your Box cricket Near You</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box> */}
    </>
  );
}

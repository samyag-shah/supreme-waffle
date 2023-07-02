import { useEffect, useState, Fragment } from "react";
import Header from "../../../../components/Header/header";
import {
  Typography,
  Box,
  Grid,
  Stack,
  Divider,
  Container,
  TextField,
  Tabs,
  Tab,
  Link,
  InputAdornment,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../../../../components/common/Input/Input";
import CommonButton from "../../../../components/common/Button/CommonButton";

import { Modal, Spin, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";

import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import utc from "dayjs/plugin/utc";
import OwnerInfo from "../../../../components/owner/ownerData/ownerInfo";
dayjs.extend(objectSupport);
dayjs.extend(utc);

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const schema = yup
  .object({
    boxCricketName: yup
      .string()
      .trim()
      .required("box cricket name is required")
      .min(3, "must be atleast 3 characters long")
      .max(50, "at max it can be 50 characters long"),
    boxCricketAddress: yup
      .string()
      .trim()
      .required("box cricket address is required"),
    boxCricketState: yup
      .string()
      .trim()
      .required("box cricket state is required"),
    boxCricketCity: yup
      .string()
      .trim()
      .required("box cricket city is required"),
    boxCricketArea: yup
      .string()
      .trim()
      .required("box cricket area is required"),
    boxCricketLandmark: yup
      .string()
      .trim()
      .required("box cricket landmark is required"),
    boxCricketFreeFacilities: yup
      .string()
      .trim()
      .required("Facilities is required"),
    boxCricketPaidFacilities: yup
      .string()
      .trim()
      .required("Facilities is required"),
    boxCricketImages: yup.array().required().min(1, "at least add one image"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const schema1 = yup
  .object({
    night: yup
      .string()
      .required("slot price is required")
      .matches(/^[0-9]+$/, "Must be only digits"),
    lateNight: yup
      .string()
      .required("slot price is required")
      .matches(/^[0-9]+$/, "Must be only digits"),
    morning: yup
      .string()
      .required("slot price is required")
      .matches(/^[0-9]+$/, "Must be only digits"),
    afternoon: yup
      .string()
      .required("slot price is required")
      .matches(/^[0-9]+$/, "Must be only digits"),
  })
  .required();
type FormData1 = yup.InferType<typeof schema1>;

const schema2 = yup
  .object({
    ownerName: yup
      .string()
      .trim()
      .required("ownername is required")
      .min(3, "must be atleast 3 characters long"),
    ownerEmail: yup.string().required("email is required").email(),
    ownerPhone: yup
      .string()
      .required("phone number is required")
      .matches(/^[0-9]+$/, "must be only digits")
      .min(10, "must be exactly 10 digits")
      .max(10, "must be exactly 10 digits"),
    otp: yup.string(),
  })
  .required();
type FormData2 = yup.InferType<typeof schema2>;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface slot {
  id: number;
  startTime: string;
  endTime: string;
  selected: boolean;
  period: string;
}

interface Owner {
  Boxcrickets: any[];
}

interface FormData3 {
  bookingSlots: any[];
}
const Profile = () => {
  const [owner, setOwner] = useState<Owner>();
  const [loading, setLoading] = useState(true);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    setError,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      boxCricketName: "",
      boxCricketState: "",
      boxCricketCity: "",
      boxCricketArea: "",
      boxCricketLandmark: "",
      boxCricketAddress: "",
      boxCricketFreeFacilities: "",
      boxCricketPaidFacilities: "",
      boxCricketImages: [],
    },
  });

  const router = useRouter();

  //get Owner Detail
  useEffect(() => {
    const getOwnerDetail = async () => {
      const response = await fetch("/api/owner/getOwnerDetails", {
        method: "POST",
        body: "",
      });
      const result = await response.json();
      //console.log({ result });
      if (result.status === 200) {
        setOwner(result.owner);
      } else if (result.status === 401) {
        message.info("token expired, Please sign in again");
        Cookies.remove("token");
        Cookies.remove("currentUser");
        router.push("/owner/signin");
      } else {
        message.info("something went wrong");
      }
    };

    try {
      getOwnerDetail();
    } catch (err) {
      console.error(err);
      message.info("something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  //set Box Cricket value
  useEffect(() => {
    console.log({ owner });
    if (owner) {
      let boxCricket: FormData = owner?.Boxcrickets?.[0];
      const images = boxCricket.boxCricketImages.map((box, index) => ({
        uid: index,
        name: "image.png",
        status: "done",
        url: box,
      }));

      console.log({ images });
      setValue("boxCricketName", boxCricket.boxCricketName);
      setValue("boxCricketState", boxCricket.boxCricketState);
      setValue("boxCricketCity", boxCricket.boxCricketCity);
      setValue("boxCricketArea", boxCricket.boxCricketArea);
      setValue("boxCricketLandmark", boxCricket.boxCricketLandmark);
      setValue("boxCricketAddress", boxCricket.boxCricketAddress);
      setValue("boxCricketFreeFacilities", boxCricket.boxCricketFreeFacilities);
      setValue("boxCricketPaidFacilities", boxCricket.boxCricketPaidFacilities);
      setValue("boxCricketImages", images);
      //reset({ boxCricketName: boxCricket.boxCricketName });
      //reset({ ...boxCricket });
    }
  }, [owner]);

  const onSubmit = (data: FormData) => {
    console.log({ data });
  };

  // antd file Upload
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange: UploadProps["onChange"] = ({
    file,
    fileList: newFileList,
  }) => {
    console.log({ file, newFileList });
    let newFileList1 = newFileList.map((file1) => {
      if (file.uid === file1.uid) {
        return {
          ...file1,
          status: "done",
        };
      } else {
        return file1;
      }
    });
    console.log({ newFileList1 });
    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      if (file.size && file.size < 2 * 1024 * 1024) {
        clearErrors("boxCricketImages");
        setValue("boxCricketImages", newFileList1);
      } else {
        setError("boxCricketImages", {
          type: "custom",
          message: "File Size should be less than 2MB",
        });
      }
    } else if (newFileList1.length === 0) {
      setValue("boxCricketImages", newFileList1);
    } else {
      setError("boxCricketImages", {
        type: "custom",
        message: "You can only upload file with jpg, jpeg or png extention",
      });
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  //console.log({ boxCricketName: getValues() });
  //console.log({ boxCricketName: getValues("boxCricketName") });

  const [value1, setValue1] = useState(0);

  const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
    setValue1(newValue);
  };

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const BoxCricketDetail = () => {
    return (
      <Box>
        <Typography variant="h5" mb={1}>
          Update Box Cricket Detail
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* <Input
                  label="Your Box Cricket Name"
                  fullWidth
                  type="text"
                  //value={getValues("boxCricketName")}
                  {...register("boxCricketName")}
                  helperText={errors?.boxCricketName?.message}
                  error={errors?.boxCricketName?.message ? true : false}
                /> */}
              <Controller
                name="boxCricketName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  console.log({ field });
                  return (
                    <TextField
                      label="Your Box Cricket Name"
                      fullWidth
                      type="text"
                      {...field}
                      helperText={errors?.boxCricketName?.message}
                      error={errors?.boxCricketName?.message ? true : false}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={6}>
              {/* <Input
                  label="State"
                  fullWidth
                  type="text"
                  multiline={true}
                  {...register("boxCricketState")}
                  helperText={errors?.boxCricketState?.message}
                  error={errors?.boxCricketState?.message ? true : false}
                /> */}
              <Controller
                name="boxCricketState"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  console.log({ field });
                  return (
                    <TextField
                      label="State"
                      fullWidth
                      type="text"
                      {...field}
                      helperText={errors?.boxCricketState?.message}
                      error={errors?.boxCricketState?.message ? true : false}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={6}>
              {/* <Input
                  label="City"
                  fullWidth
                  type="text"
                  multiline={true}
                  {...register("boxCricketCity")}
                  helperText={errors?.boxCricketCity?.message}
                  error={errors?.boxCricketCity?.message ? true : false}
                /> */}
              <Controller
                name="boxCricketCity"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  console.log({ field });
                  return (
                    <TextField
                      label="city"
                      fullWidth
                      type="text"
                      {...field}
                      helperText={errors?.boxCricketCity?.message}
                      error={errors?.boxCricketCity?.message ? true : false}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={6}>
              {/* <Input
                  label="Area"
                  fullWidth
                  type="text"
                  multiline={true}
                  {...register("boxCricketArea")}
                  helperText={errors?.boxCricketArea?.message}
                  error={errors?.boxCricketArea?.message ? true : false}
                /> */}
              <Controller
                name="boxCricketArea"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  console.log({ field });
                  return (
                    <TextField
                      label="Area"
                      fullWidth
                      type="text"
                      {...field}
                      helperText={errors?.boxCricketArea?.message}
                      error={errors?.boxCricketArea?.message ? true : false}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={6}>
              {/* <Input
                  label="Landmark"
                  fullWidth
                  type="text"
                  multiline={true}
                  {...register("boxCricketLandmark")}
                  helperText={errors?.boxCricketLandmark?.message}
                  error={errors?.boxCricketLandmark?.message ? true : false}
                /> */}
              <Controller
                name="boxCricketLandmark"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  console.log({ field });
                  return (
                    <TextField
                      label="Landmark"
                      fullWidth
                      type="text"
                      {...field}
                      helperText={errors?.boxCricketLandmark?.message}
                      error={errors?.boxCricketLandmark?.message ? true : false}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {/* <Input
                  label="Box Cricket Address"
                  fullWidth
                  type="text"
                  multiline={true}
                  {...register("boxCricketAddress")}
                  helperText={errors?.boxCricketAddress?.message}
                  error={errors?.boxCricketAddress?.message ? true : false}
                /> */}
              <Controller
                name="boxCricketAddress"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  console.log({ field });
                  return (
                    <TextField
                      label="Box Cricket Address"
                      fullWidth
                      type="text"
                      {...field}
                      helperText={errors?.boxCricketAddress?.message}
                      error={errors?.boxCricketAddress?.message ? true : false}
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {/* <Input
                  placeholder="bat, ball, stumps etc or say NA"
                  label="Free Facilities"
                  fullWidth
                  type="text"
                  {...register("boxCricketFreeFacilities")}
                  helperText={errors?.boxCricketFreeFacilities?.message}
                  error={
                    errors?.boxCricketFreeFacilities?.message ? true : false
                  }
                /> */}
              <Controller
                name="boxCricketFreeFacilities"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  console.log({ field });
                  return (
                    <TextField
                      placeholder="bat, ball, stumps etc or say NA"
                      label="Free Facilities"
                      fullWidth
                      type="text"
                      {...field}
                      helperText={errors?.boxCricketFreeFacilities?.message}
                      error={
                        errors?.boxCricketFreeFacilities?.message ? true : false
                      }
                    />
                  );
                }}
              />
            </Grid>

            <Grid item xs={12}>
              {/* <Input
                  placeholder="water, colddrinks etc or say NA"
                  label="Paid Facilities"
                  fullWidth
                  type="text"
                  {...register("boxCricketPaidFacilities")}
                  helperText={errors?.boxCricketPaidFacilities?.message}
                  error={
                    errors?.boxCricketPaidFacilities?.message ? true : false
                  }
                /> */}
              <Controller
                name="boxCricketPaidFacilities"
                control={control}
                rules={{ required: true }}
                render={({ field }) => {
                  console.log({ field });
                  return (
                    <TextField
                      placeholder="water, colddrinks etc or say NA"
                      label="Paid Facilities"
                      fullWidth
                      type="text"
                      {...field}
                      helperText={errors?.boxCricketPaidFacilities?.message}
                      error={
                        errors?.boxCricketPaidFacilities?.message ? true : false
                      }
                    />
                  );
                }}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <Typography mb={1}>Add Your Box Cricket Photos</Typography>
              <Divider sx={{ mb: 2 }} />
              <Controller
                name="boxCricketImages"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Upload
                    listType="picture-card"
                    fileList={field?.value}
                    //beforeUpload={() => false}
                    name={field.name}
                    //onBlur={field.onBlur}
                    onPreview={handlePreview}
                    // ref={(ref) => {
                    //   console.log({ ref });
                    // }}
                    onChange={handleChange}
                  >
                    {field?.value?.length >= 3 ? null : uploadButton}
                  </Upload>
                )}
              />
              <Typography sx={{ color: "#d32f2f" }}>
                {errors?.boxCricketImages?.message
                  ? errors.boxCricketImages.message
                  : ""}
              </Typography>
            </Grid> */}
          </Grid>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>

          <Box sx={{ my: "2rem", display: "flex", justifyContent: "flex-end" }}>
            <CommonButton
              variant="contained"
              sx={{ px: 5, py: 1 }}
              type="submit"
            >
              Update
            </CommonButton>
          </Box>
        </form>
      </Box>
    );
  };

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue2,
    formState: { errors: errors1 },
  } = useForm<FormData1>({
    resolver: yupResolver(schema),
    defaultValues: {
      lateNight: "",
      night: "",
      morning: "",
      afternoon: "",
    },
  });
  const [slots, setSlots] = useState<slot[]>();

  useEffect(() => {
    //console.log({ owner });
    if (owner) {
      let boxCricket: FormData3 = owner?.Boxcrickets?.[0];
      setSlots(boxCricket.bookingSlots);
      let obj = {
        night: "",
        lateNight: "",
        morning: "",
        afternoon: "",
      };
      boxCricket.bookingSlots.map((data: any) => {
        if (data.period === "night") {
          obj[data.period as keyof typeof obj] = data.pricing;
        } else if (data.period === "lateNight") {
          obj[data.period as keyof typeof obj] = data.pricing;
        } else if (data.period === "morning") {
          obj[data.period as keyof typeof obj] = data.pricing;
        } else if (data.period === "afternoon") {
          obj[data.period as keyof typeof obj] = data.pricing;
        }
      });
      setValue2("night", obj.night);
      setValue2("lateNight", obj.lateNight);
      setValue2("morning", obj.morning);
      setValue2("afternoon", obj.afternoon);
    }
  }, [owner]);

  //handle Slots
  const handleSlotClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    let newSlots = slots?.map((slot: slot) => {
      if (slot.id === id) {
        return { ...slot, selected: !slot.selected };
      } else {
        return slot;
      }
    });
    setSlots(newSlots);
  };

  const showAllSlots = (startIndex: number, endIndex: number) => {
    let arr = slots?.slice(startIndex, endIndex).map((slot: slot, index) => (
      <Fragment key={index}>
        <Grid item xs={6} sm={4}>
          <Card
            onClick={(e) => handleSlotClick(e, slot.id)}
            //sx={slot.selected ? styles.selectedCard : styles.card}
          >
            <CardActionArea>
              <CardContent sx={{ px: 1, py: 2 }}>
                <Typography align="center" variant="body2" component="p">
                  {dayjs(slot.startTime).local().format("hh:mm")} -{" "}
                  {dayjs(slot.endTime).local().format("hh:mm A")}
                </Typography>
                <Typography align="center" variant="body2" component="p">
                  {slot.selected ? "Available" : "Not Available"}
                </Typography>
                {slot.selected ? (
                  <CheckSharpIcon
                    sx={{
                      width: "18px",
                      height: "18px",
                      position: "absolute",
                      top: 2,
                      border: "1px solid",
                      borderRadius: "100%",
                      right: 2,
                      color: "white",
                      backgroundColor: "green",
                    }}
                  />
                ) : (
                  ""
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Fragment>
    ));
    return arr;
  };

  const BoxCricketSlot = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Select working hours</Typography>
            <Typography>
              {`"Please uncheck slots during which you do not wish to recieve
          bookings"`}
            </Typography>
            <Divider />
          </Grid>

          {/* night     */}
          <Grid item xs={12} sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: "1rem",
                pb: ".2rem",
                minWidth: "450px",
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                Night (6:00 to 12:00PM)
              </Typography>

              <Input
                type="tel"
                {...register1("night")}
                helperText={errors1?.night?.message}
                error={errors1?.night?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(36, 48)}

          {/* latenight     */}
          <Grid item xs={12} sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: "1rem",
                pb: ".2rem",
                minWidth: "450px",
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                Late Night (12:00 to 6:00AM)
              </Typography>
              <Input
                //fullWidth
                type="tel"
                {...register1("lateNight")}
                helperText={errors1?.lateNight?.message}
                error={errors1?.lateNight?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(0, 12)}

          {/* morning     */}
          <Grid item xs={12} sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: "1rem",
                pb: ".2rem",
                minWidth: "450px",
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                Morning (6:00 to 12:00AM)
              </Typography>
              <Input
                type="tel"
                {...register1("morning")}
                helperText={errors1?.morning?.message}
                error={errors1?.morning?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(12, 24)}

          {/* afternoon     */}
          <Grid item xs={12} sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: "1rem",
                pb: ".2rem",
                minWidth: "450px",
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                Afternoon (12:00 to 6:00PM)
              </Typography>
              <Input
                type="tel"
                //disabled={otpMessage === "" ? true : false}
                {...register1("afternoon")}
                helperText={errors1?.afternoon?.message}
                error={errors1?.afternoon?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(24, 36)}
        </Grid>

        <Box sx={{ my: "2rem", display: "flex", justifyContent: "flex-end" }}>
          <CommonButton
            sx={{ px: 5, py: 1 }}
            variant="contained"
            type="submit"
            disabled={loading}
            //endIcon={<SendIcon />}
          >
            {loading ? <Spin /> : "Update"}
          </CommonButton>
        </Box>
      </form>
    );
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (owner) {
      setMounted(true);
    }
  }, [owner]);

  return (
    <>
      <Header />
      <Stack
        sx={{
          mt: "5rem",
          border: "1px solid",
          minHeight: "100vh",
          p: { xs: "1rem .5rem", sm: "2rem" },
          minWidth: "330px",
          overflowX: "auto",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              component="div"
              value={value1}
              onChange={handleChange1}
              aria-label="basic tabs example"
            >
              <Tab label="Profile" />
              <Tab label="Box cricket Detail" />
              <Tab label="Slots" />
            </Tabs>
          </Box>
          {/* <TabPanel value={value1} index={0}>
            {mounted && <OwnerInfo owner={owner} />}
          </TabPanel> */}
          <TabPanel value={value1} index={1}>
            <BoxCricketDetail />
          </TabPanel>
          <TabPanel value={value1} index={2}>
            <BoxCricketSlot />
          </TabPanel>
        </Container>
      </Stack>
    </>
  );
};

export default Profile;

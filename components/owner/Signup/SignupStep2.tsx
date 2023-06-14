//react-nextjs
import React, { Dispatch, SetStateAction } from "react";

//mui
import { Typography, Grid, Divider, Box } from "@mui/material";
import Input from "../../common/Input/Input";
import CommonButton from "../../common/Button/CommonButton";

//antd
import { Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload";

//react-hooks-form
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { SignupState } from "@/pages/owner/signup";

import { styles } from "./styles";

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
    boxCricketFacilities: yup
      .string()
      .trim()
      .required("Facilities is required"),
    boxCricketImages: yup.array().required().min(1, "at least add one image"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface props {
  setStep: Dispatch<SetStateAction<number>>;
  signupState: SignupState | undefined;
  setSignupState: Dispatch<SetStateAction<SignupState | undefined>>;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const SignupStep2 = ({ setSignupState, setStep, signupState }: props) => {
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");

  console.log({ signupState });
  //submit
  const onSubmit = async (data: FormData) => {
    if (signupState) {
      setSignupState({ ...signupState, ...data });
    }
    setStep(2);
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
    //console.log({ file });
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Input
              label="Your Box Cricket Name"
              fullWidth
              type="text"
              {...register("boxCricketName")}
              helperText={errors?.boxCricketName?.message}
              error={errors?.boxCricketName?.message ? true : false}
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              label="State"
              fullWidth
              type="text"
              multiline={true}
              {...register("boxCricketState")}
              helperText={errors?.boxCricketState?.message}
              error={errors?.boxCricketState?.message ? true : false}
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              label="City"
              fullWidth
              type="text"
              multiline={true}
              {...register("boxCricketCity")}
              helperText={errors?.boxCricketCity?.message}
              error={errors?.boxCricketCity?.message ? true : false}
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              label="Area"
              fullWidth
              type="text"
              multiline={true}
              {...register("boxCricketArea")}
              helperText={errors?.boxCricketArea?.message}
              error={errors?.boxCricketArea?.message ? true : false}
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              label="Landmark"
              fullWidth
              type="text"
              multiline={true}
              {...register("boxCricketLandmark")}
              helperText={errors?.boxCricketLandmark?.message}
              error={errors?.boxCricketLandmark?.message ? true : false}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              label="Box Cricket Address"
              fullWidth
              type="text"
              multiline={true}
              {...register("boxCricketAddress")}
              helperText={errors?.boxCricketAddress?.message}
              error={errors?.boxCricketAddress?.message ? true : false}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              placeholder="Please add what do you provide to your players like bat, ball or stumps"
              //label="Facilities"
              fullWidth
              type="text"
              {...register("boxCricketFacilities")}
              helperText={errors?.boxCricketFacilities?.message}
              error={errors?.boxCricketFacilities?.message ? true : false}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography sx={styles.photosTitle}>
              Add Your Box Cricket Photos
            </Typography>
            <Divider sx={styles.divider2} />
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
                  ref={field.ref}
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
          </Grid>
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
            sx={{ px: 8, py: 1.5 }}
            type="submit"
          >
            Next
          </CommonButton>
        </Box>
      </form>
    </>
  );
};

export default SignupStep2;

import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { useRouter } from "next/router";
import instance from "../../axios.default";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import Cookie from "js-cookie";

const AuthLogin = () => {
  const toast = useToast();
  const Router = useRouter();
  const [hidden, setHidden] = useState(true);
  const Schema = Yup.object().shape({
    username: Yup.string().required("Username tidak boleh kosong"),
    password: Yup.string().required("Password tidak boleh kosong"),
  });

  const login = async (values) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(values);
    try {
      const result = await instance.post("/user/login", body, config);

      Cookie.set("token", `Bearer ${result.data.token}`);

      instance.defaults.headers.common[
        "x-auth-token"
      ] = `Bearer ${result.data.token}`;
      toast({
        title: "Berhasil login",
        status: "success",
        duration: 2000,
        position: "top",
      });
      Router.push("/dashboard/home");
    } catch (error) {
      toast({
        title: !error.response ? "Server Error" : error.response.data.msg,
        description: "Gagal login!",
        status: "error",
        duration: 2000,
        position: "top",
      });
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Schema,
    onSubmit: async (values, { resetForm, error, setSubmitting }) => {
      await login(values);
      setSubmitting(false);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    handleBlur,
    values,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <FormControl
          id="username"
          isInvalid={Boolean(touched.username && errors.username)}
        >
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            name="username"
            {...getFieldProps("username")}
            onBlur={handleBlur}
          />
          <FormErrorMessage>
            {touched.username && errors.username}
          </FormErrorMessage>
        </FormControl>
        <FormControl
          id="password"
          pt="5"
          isInvalid={Boolean(touched.password && errors.password)}
        >
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={hidden ? "password" : "text"}
              name="password"
              {...getFieldProps("password")}
              onBlur={handleBlur}
            />
            <InputRightElement
              mx="3"
              cursor="pointer"
              onClick={() => setHidden(!hidden)}
            >
              {hidden ? <ViewIcon w={6} h={6} /> : <ViewOffIcon w={6} h={6} />}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {touched.password && errors.password}
          </FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          w="100%"
          isLoading={isSubmitting}
          mt="5"
        >
          Login
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default AuthLogin;

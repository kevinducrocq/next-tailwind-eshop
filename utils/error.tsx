import { toast } from "react-toastify";

const getError = (err) => {
  if (err.body) {
    err.json().then(({ message }) => {
      toast.error(message);
    });
  }

  return err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;
};

export { getError };

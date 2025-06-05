import axios from "axios";

export const loginUser = async (email: string, contrasena: string) => {
  return await axios.post("http://localhost:4000/api/login", {
    email,
    contrasena,
  });
};
export const registerUser = (data: {
  nombre: string;
  paterno: string;
  materno: string;
  email: string;
  contrasena: string;
  fecNac: Date | null;
  especialidad: string;
}) => {
  return axios.post("http://localhost:4000/api/registro", {
    ...data,
    fecNac: data.fecNac?.toISOString().split("T")[0],
  });
};
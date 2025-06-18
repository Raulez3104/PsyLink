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

export const getUsuario = async () => {
  const token = localStorage.getItem("token");
  return await axios.get("http://localhost:4000/api/usuario", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateUsuario = async (data: {
  nombre: string;
  paterno: string;
  materno: string;
  especialidad: string;
  fecNac: string;
}) => {
  const token = localStorage.getItem("token");
  // Convierte fecNac a YYYY-MM-DD si viene en formato ISO
  const fecNac = data.fecNac ? data.fecNac.split('T')[0] : null;
  return await axios.put("http://localhost:4000/api/usuario", { ...data, fecNac }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
import api from "./api";

type ExtensionsFilter = {};
const listExtensions = async (filters: ExtensionsFilter) => {
  const res = await api.get("/extension/list");
  return res.data;
};

export default {
  listExtensions,
};

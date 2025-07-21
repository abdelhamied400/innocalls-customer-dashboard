import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <InfoOutlinedIcon color="action" fontSize="large" />
      <span className="mt-2 text-gray-500 text-lg font-medium">
        No data available
      </span>
    </div>
  );
};

export default NoData;

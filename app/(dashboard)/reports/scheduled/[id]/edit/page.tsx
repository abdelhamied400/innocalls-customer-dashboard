import EditReportForm from "./form";

type EditReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditReportPage = async ({ params }: EditReportPageProps) => {
  const { id } = await params;

  return (
    <div className="page h-full" id="edit-scheduled-report">
      <EditReportForm reportId={id} />
    </div>
  );
};

export default EditReportPage;

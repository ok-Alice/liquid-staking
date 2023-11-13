import Spinner from "@/ui-kit/Spinner";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center">
      <Spinner size="h-24 w-24" />
    </div>
  );
};

export default Loading;

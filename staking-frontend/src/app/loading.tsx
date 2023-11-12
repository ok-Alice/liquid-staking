import Spinner from "@/ui-kit/Spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-1 items-center justify-center">
      <Spinner className="h-24 w-24" />
    </div>
  );
}
